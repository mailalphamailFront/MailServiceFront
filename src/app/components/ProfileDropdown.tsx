import { useRef, useEffect } from 'react';
import { LogOut, UserPlus, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export function ProfileDropdown({ isOpen, onClose, user }: ProfileDropdownProps) {
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleAction = (msg: string) => {
    toast.info(msg);
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success(t('auth.logout_success', '로그아웃 되었습니다.'));
    navigate('/login');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
        >
          {/* Profile Header */}
          <div className="p-6 bg-gray-50/50 border-b border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <img
                  src="/images/ig_default.svg"
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm"
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{user?.email?.split('@')[0] || t('profile.user_placeholder')}</h3>
              <p className="text-sm text-gray-500">{user?.email || t('profile.not_logged_in')}</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button
              onClick={() => handleAction(t('profile.view_profile_requested', '프로필 보기 요청됨'))}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <User className="w-4 h-4" />
              </div>
              <span className="font-medium text-left flex-1">{t('profile.view_profile')}</span>
            </button>
            <button
              onClick={() => handleAction(t('profile.account_switch_requested', '계정 전환 요청됨'))}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                <UserPlus className="w-4 h-4" />
              </div>
              <span className="font-medium text-left flex-1">{t('profile.change_account')}</span>
            </button>
          </div>

          {/* Footer Actions */}
          <div className="p-2 border-t border-gray-100 bg-gray-50/30">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-bold text-left flex-1">{t('profile.sign_out')}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
