import {
  ArrowLeft,
  User,
  Key,
  Mail,
  Folder,
  Filter,
  Forward,
  Lock,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

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

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const navGroups: NavGroup[] = [
    {
      title: t('nav.account_group'),
      items: [
        { id: 'profile', label: t('nav.home'), icon: User },
        { id: 'services', label: t('nav.accounts_mgmt'), icon: Mail },
        { id: 'security', label: t('nav.security_mgmt'), icon: Key },
      ]
    },
    {
      title: t('nav.mail_service_group'),
      items: [
        { id: 'messages', label: t('nav.messages_mgmt'), icon: MessageSquare },
        { id: 'folders', label: t('nav.folders_mgmt'), icon: Folder },
        { id: 'filters', label: t('nav.filters'), icon: Filter },
        { id: 'forwarding', label: t('nav.forwarding'), icon: Forward },
        { id: 'encryption', label: t('nav.encryption'), icon: Lock },
      ]
    }
  ];

  return (
    <div className="w-72 bg-white flex flex-col h-full border-r border-gray-200">
      <div className="p-4">
        <button
          onClick={() => navigate('/inbox')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-900 hover:bg-black text-white rounded-xl transition-all shadow-lg shadow-gray-200 mb-8 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('nav.back_to_inbox')}</span>
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
