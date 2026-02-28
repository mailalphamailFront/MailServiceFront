import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, Lock, User, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { authService } from '../api/services/auth.service';
import { toast } from 'sonner';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async () => {
    if (!email) {
      toast.error(t('auth.send_code_first'));
      return;
    }
    setIsSendingCode(true);
    try {
      await authService.sendVerificationCode(email);
      setIsCodeSent(true);
      toast.success(t('auth.code_sent'));
    } catch (error: any) {
      console.error('Full Error Object:', error);
      if (error.code === 'ERR_NETWORK') {
        toast.error('서버에 연결할 수 없습니다. (CORS 또는 네트워크 문제)');
        return;
      }
      const status = error.response?.status;
      const data = error.response?.data;
      const msg = data?.message || data?.error || error.message || '인증번호 발송 실패';
      toast.error(`오류 (${status}): ${msg}`);
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error(t('auth.fill_code', '인증번호를 입력해주세요.'));
      return;
    }
    setIsVerifyingCode(true);
    try {
      await authService.confirmVerificationCode(email, verificationCode);
      setIsVerified(true);
      toast.success(t('auth.verification_complete'));
    } catch (error: any) {
      toast.error(error.response?.data?.error || t('auth.invalid_code', '인증번호가 올바르지 않습니다.'));
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !isVerified) {
      toast.error(t('auth.fill_and_verify'));
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({ username: name, email, password });
      toast.success(t('auth.register_complete'));
      navigate('/login');
    } catch (error: any) {
      console.error('Registration full error:', error);
      if (error.code === 'ERR_NETWORK') {
        toast.error('서버에 연결할 수 없습니다. (CORS 또는 네트워크 문제)');
        return;
      }
      const status = error.response?.status;
      const data = error.response?.data;
      const msg = data?.message || data?.error || error.message || '회원가입 중 오류가 발생했습니다.';
      toast.error(`가입 실패 (${status}): ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-[400px]">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <img src="/images/MailAlphaMail.png" alt="MailAlphaMail" className="w-48 h-32 object-contain mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t('auth.register_title')}</h1>
          {/* <p className="text-gray-500 text-sm mt-2">{t('auth.register_desc')}</p> */}
        </div>

        {/* Register Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-100/50">
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">{t('auth.name_label')}</Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  id="name"
                  type="text"
                  placeholder={t('auth.name_placeholder')}
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email_label')}</Label>
              <div className="flex gap-2">
                <div className="relative group flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || isVerified || isSendingCode}
                  />
                </div>
                {!isVerified && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendCode}
                    disabled={isSendingCode || !email}
                    className="shrink-0"
                  >
                    {isSendingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : t('auth.send_code')}
                  </Button>
                )}
              </div>
            </div>

            {isCodeSent && !isVerified && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="code">{t('auth.verification_code')}</Label>
                <div className="flex gap-2">
                  <div className="relative group flex-1">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id="code"
                      type="text"
                      placeholder={t('auth.code_placeholder')}
                      className="pl-10"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      disabled={isVerifyingCode}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={isVerifyingCode || !verificationCode}
                    className="shrink-0 bg-blue-600 text-white"
                  >
                    {isVerifyingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : t('auth.verify_code')}
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password_label')}</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl shadow-md shadow-blue-100 group transition-all"
              disabled={isLoading || !isVerified}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {t('auth.complete_register')}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          {t('auth.already_have_account')}{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
            {t('auth.login_link')}
          </Link>
        </p>
      </div>
    </div>
  );
}
