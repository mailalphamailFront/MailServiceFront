import { NavLink, useLocation } from 'react-router';
import {
  Inbox,
  Send,
  File,
  Trash2,
  AlertOctagon,
  Star,
  Plus,
  Mail,
  MoreVertical,
  Folder
} from 'lucide-react';
import { clsx } from 'clsx';
import { Tooltip } from './Tooltip';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { mailService } from '../api/services/mail.service';
import '../styles.css';

const getFolderIcon = (type: string) => {
  switch (type.toUpperCase()) {
    case 'INBOX':
    case 'ALL_INBOX':
      return Inbox;
    case 'SENT':
      return Send;
    case 'DRAFTS':
      return File;
    case 'TRASH':
      return Trash2;
    case 'JUNK':
    case 'SPAM':
      return AlertOctagon;
    case 'STARRED':
      return Star;
    default:
      return Folder;
  }
};

const getFolderColor = (type: string) => {
  switch (type.toUpperCase()) {
    case 'INBOX':
    case 'ALL_INBOX':
      return 'text-blue-600';
    case 'SENT':
      return 'text-green-600';
    case 'DRAFTS':
      return 'text-orange-500';
    case 'TRASH':
      return 'text-gray-500';
    case 'JUNK':
    case 'SPAM':
      return 'text-red-500';
    case 'STARRED':
      return 'text-yellow-500';
    default:
      return 'text-gray-400';
  }
};

export function Sidebar({ onCompose, user }: { onCompose: () => void, user: any }) {
  const handleAction = (msg: string) => toast.info(msg);
  const location = useLocation();

  const { data: accountsResponse } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => mailService.getConnectedAccounts(),
    enabled: !!user,
  });

  const allInboxes = accountsResponse?.data?.allInboxes;
  const accounts = accountsResponse?.data?.accounts || [];

  return (
    <aside className="sidebar-container w-72">
      <div className="sidebar-logo-container">
        <div className="sidebar-logo-icon">
          <Mail className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">MailCloud</span>
      </div>

      <div className="px-4 mb-6">
        <Tooltip text="Create new message">
          <button onClick={onCompose} className="compose-button w-full">
            <Plus className="w-5 h-5" />
            <span>Compose</span>
          </button>
        </Tooltip>
      </div>

      <nav className="flex-1 px-3 space-y-4 overflow-y-auto custom-scrollbar">
        {/* All Inboxes */}
        {allInboxes && (
          <div className="space-y-1">
            <NavLink
              to="/mail/all"
              className={({ isActive }) => clsx(
                "nav-link-base group",
                (isActive || location.pathname.startsWith('/mail/all') || location.pathname === '/inbox') && "nav-link-active"
              )}
            >
              <Inbox className={clsx("w-5 h-5 text-blue-600")} />
              <div className="flex-1 flex items-center justify-between">
                <span>Inbox</span>
                {allInboxes.unreadCount > 0 && (
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {allInboxes.unreadCount}
                  </span>
                )}
              </div>
            </NavLink>
          </div>
        )}

        {/* Accounts and Folders */}
        {accounts.map((account) => (
          <div key={account.accountId} className="space-y-1">
            <div className="px-4 py-2 flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{account.provider}</span>
              <div className="h-px bg-gray-100 flex-1"></div>
            </div>

            {account.folders.map((folder) => {
              const Icon = getFolderIcon(folder.type);
              const colorClass = getFolderColor(folder.type);

              const path = `/mail/${account.accountId}`;
              const search = `?folder=${encodeURIComponent(folder.folderId)}`;

              return (
                <NavLink
                  key={`${account.accountId}-${folder.folderId}`}
                  to={`${path}${search}`}
                  className={() => {
                    // Custom active check for query params
                    const isFolderActive = location.pathname === path &&
                      new URLSearchParams(location.search).get('folder') === folder.folderId;

                    return clsx(
                      "nav-link-base group py-2",
                      isFolderActive && "nav-link-active"
                    );
                  }}
                >
                  <Icon className={clsx("w-4 h-4", colorClass)} />
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate text-sm">{folder.displayName || folder.name}</span>
                    {folder.unreadCount > 0 && (
                      <span className="text-[10px] font-medium text-gray-500">
                        {folder.unreadCount}
                      </span>
                    )}
                  </div>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 group cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors" onClick={() => handleAction('User settings: Profile & Account preferences')}>
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
            <img
              src="https://images.unsplash.com/photo-1701463387028-3947648f1337?q=80&w=100"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.email?.split('@')[0] || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || 'alex@mailcloud.io'}</p>
          </div>
          <Tooltip text="More options">
            <button className="p-1 hover:bg-gray-200 rounded text-gray-400">
              <MoreVertical className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>
    </aside>
  );
}
