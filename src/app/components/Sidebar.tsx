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
  Folder
} from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { Tooltip } from './Tooltip';
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

const getUnifiedFolderName = (type: string, fallback: string, t: any) => {
  if (type === 'CUSTOM') return fallback;
  switch (type.toUpperCase()) {
    case 'INBOX': return t('nav.inbox');
    case 'SENT': return t('nav.sent');
    case 'DRAFTS': return t('nav.drafts');
    case 'TRASH': return t('nav.trash');
    case 'JUNK':
    case 'SPAM': return t('nav.spam');
    case 'STARRED': return t('nav.starred');
    default: return fallback;
  }
};

export function Sidebar({ onCompose, user }: { onCompose: () => void, user: any }) {
  const { t } = useTranslation();
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
        <span className="text-xl font-bold text-gray-900 tracking-tight">MailAlphaMail</span>
      </div>

      <div className="px-4 mb-6">
        <button onClick={onCompose} className="compose-button w-full">
          <Plus className="w-5 h-5" />
          <span>{t('nav.compose')}</span>
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-4 overflow-y-auto custom-scrollbar">
        {/* All Inboxes */}
        {allInboxes && (
          <div className="space-y-1">
            <NavLink
              to="/mail/all/INBOX"
              className={({ isActive }) => clsx(
                "nav-link-base group",
                (isActive || location.pathname.startsWith('/mail/all/INBOX') || location.pathname === '/inbox') && "nav-link-active"
              )}
            >
              <Inbox className={clsx("w-5 h-5 text-blue-600")} />
              <div className="flex-1 flex items-center justify-between">
                <span>{t('nav.inbox')}</span>
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

              const folderParam = folder.type !== 'CUSTOM' ? folder.type : folder.folderId;
              const path = `/mail/${account.accountId}/${encodeURIComponent(folderParam)}`;

              return (
                <NavLink
                  key={`${account.accountId}-${folder.folderId}`}
                  to={path}
                  className={({ isActive }) => {
                    return clsx(
                      "nav-link-base group py-2",
                      isActive && "nav-link-active"
                    );
                  }}
                >
                  <Icon className={clsx("w-4 h-4", colorClass)} />
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate text-sm">
                      {getUnifiedFolderName(folder.type, folder.displayName || folder.name, t)}
                    </span>
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

    </aside>
  );
}
