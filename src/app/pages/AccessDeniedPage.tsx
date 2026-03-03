import { useNavigate } from 'react-router';
import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export default function AccessDeniedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success(t('profile.sign_out'));
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-[440px] text-center px-4">

        <div className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-2xl shadow-gray-200/50 flex flex-col items-center relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/5 blur-[80px] -z-10 rounded-full"></div>

          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 ring-8 ring-red-50/50">
            <Shield className="w-10 h-10 text-red-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('auth.no_admin_access')}
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            {t('auth.no_admin_access_desc')}
          </p>

          <div className="grid grid-cols-2 gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => navigate('/inbox')}
              className="h-12 rounded-2xl border-gray-100 hover:bg-gray-50 font-semibold"
            >
              {t('error_page.back_to_main')}
            </Button>
            <Button
              onClick={handleLogout}
              className="h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-100"
            >
              {t('profile.sign_out')}
            </Button>
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-400">
          © 2026 MailAlphaMail
        </p>
      </div>
    </div>
  );
}
