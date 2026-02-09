import React from 'react';
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  HelpCircle,
  CreditCard,
  Key,
  Mail,
  Folder,
  Filter,
  Forward,
  Lock,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router';

interface NavItem {
  id: string;
  label: string;
  icon: any;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

const navGroups: NavGroup[] = [
  {
    title: 'Account',
    items: [
      { id: 'profile', label: 'Home', icon: User },
      { id: 'subscription', label: 'Subscription', icon: CreditCard },
      { id: 'security', label: 'Account and password', icon: Key },
      { id: 'language', label: 'Language and time', icon: Globe },
      { id: 'appearance', label: 'Appearance', icon: Palette },
      { id: 'privacy', label: 'Security and privacy', icon: Shield },
    ]
  },
  {
    title: 'Mail Service',
    items: [
      { id: 'messages', label: 'Messages and composing', icon: MessageSquare },
      { id: 'folders', label: 'Folders and labels', icon: Folder },
      { id: 'filters', label: 'Filters', icon: Filter },
      { id: 'forwarding', label: 'Forward and auto-reply', icon: Forward },
      { id: 'encryption', label: 'Encryption and keys', icon: Lock },
      { id: 'services', label: 'Services', icon: Mail },
    ]
  },
  {
    title: 'Support',
    items: [
      { id: 'help', label: 'Help & Support', icon: HelpCircle },
    ]
  }
];

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  const navigate = useNavigate();

  return (
    <div className="w-72 bg-white flex flex-col h-full border-r border-gray-200">
      <div className="p-4">
        <button
          onClick={() => navigate('/inbox')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-900 hover:bg-black text-white rounded-xl transition-all shadow-lg shadow-gray-200 mb-8 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Inbox</span>
        </button>

        <div className="space-y-8">
          {navGroups.map((group) => (
            <div key={group.title}>
              <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`nav-link-base group w-full ${activeTab === item.id
                      ? 'nav-link-active'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}`} />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
