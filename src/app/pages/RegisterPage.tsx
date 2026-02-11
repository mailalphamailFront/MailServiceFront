import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, Lock, User, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { authService } from '../api/services/auth.service';
import { toast } from 'sonner';

export default function RegisterPage() {
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
      toast.error('이메일을 먼저 입력해주세요.');
      return;
    }
    setIsSendingCode(true);
    try {
      await authService.sendVerificationCode(email);
      setIsCodeSent(true);
      toast.success('인증번호가 발송되었습니다. 메일을 확인해주세요.');
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
      toast.error('인증번호를 입력해주세요.');
      return;
    }
    setIsVerifyingCode(true);
    try {
      await authService.confirmVerificationCode(email, verificationCode);
      setIsVerified(true);
      toast.success('이메일 인증이 완료되었습니다.');
    } catch (error: any) {
      toast.error(error.response?.data?.error || '인증번호가 올바르지 않습니다.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !isVerified) {
      toast.error('모든 필드를 입력하고 이메일 인증을 완료해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({ username: name, email, password });
      toast.success('회원가입이 완료되었습니다! 로그인해주세요.');
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
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
            <Mail className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">MailCloud 가입하기</h1>
          <p className="text-gray-500 text-sm mt-2">간편하게 가입하고 혁신적인 메일 서비스를 이용해보세요.</p>
        </div>

        {/* Register Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-100/50">
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일 주소</Label>
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
                    {isSendingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : '번호 전송'}
                  </Button>
                )}
              </div>
            </div>

            {isCodeSent && !isVerified && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="code">인증번호</Label>
                <div className="flex gap-2">
                  <div className="relative group flex-1">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id="code"
                      type="text"
                      placeholder="6자리 숫자"
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
                    {isVerifyingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : '인증 확인'}
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
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
                  가입 완료하기
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
            로그인 하기
          </Link>
        </p>
      </div>
    </div>
  );
}
