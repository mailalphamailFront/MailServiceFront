import React from 'react';
import { NavLink } from 'react-router';
import { 
  Inbox, 
  Send, 
  File, 
  Trash2, 
  AlertOctagon, 
  Star, 
  Plus,
  Mail,
  Settings,
  MoreVertical
} from 'lucide-react';
import { clsx } from 'clsx';
import { Tooltip } from './Tooltip';
import { toast } from 'sonner';
import '../styles.css';

const navItems = [
  { icon: Inbox, label: 'Inbox', path: '/inbox', color: 'text-blue-600' },
  { icon: Star, label: 'Starred', path: '/starred', color: 'text-yellow-500' },
  { icon: Send, label: 'Sent', path: '/sent', color: 'text-green-600' },
  { icon: File, label: 'Drafts', path: '/drafts', color: 'text-orange-500' },
  { icon: AlertOctagon, label: 'Spam', path: '/spam', color: 'text-red-500' },
  { icon: Trash2, label: 'Trash', path: '/trash', color: 'text-gray-500' },
];

export function Sidebar({ onCompose }: { onCompose: () => void }) {
  const handleAction = (msg: string) => toast.info(msg);

  return (
    <aside className="sidebar-container">
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

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx("nav-link-base group", isActive && "nav-link-active")}
          >
            <item.icon className={clsx("w-5 h-5", item.color)} />
            <span>{item.label}</span>
          </NavLink>
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
            <p className="text-sm font-medium text-gray-900 truncate">Alex Rivera</p>
            <p className="text-xs text-gray-500 truncate">alex@mailcloud.io</p>
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
