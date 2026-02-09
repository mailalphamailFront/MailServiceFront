import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, Lock, Loader2, ArrowRight, Github } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { authService } from '../api/services/auth.service';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login({ username: email, password });

      if (response) {
        // 토큰이 없으면 임시 토큰이라도 저장하여 메인 페이지 진입 가능하게 함
        const token = response.token || response.accessToken || 'temp_access_token';
        localStorage.setItem('token', token);

        // 사용자 정보 저장 (없으면 이메일로 생성)
        const userData = response.user || { email, username: email.split('@')[0], id: 'temp_id' };
        localStorage.setItem('user', JSON.stringify(userData));

        toast.success('로그인에 성공했습니다!');
        navigate('/inbox');
      } else {
        toast.error('로그인 정보가 올바르지 않습니다.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || '로그인 중 오류가 발생했습니다.';
      toast.error(errorMsg);
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">MailCloud 로그인</h1>
          <p className="text-gray-500 text-sm mt-2">반가워요! 계정에 로그인하고 메일을 확인하세요.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-100/50">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">이메일 주소</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">비밀번호</Label>
                <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  비밀번호 찾기
                </button>
              </div>
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
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  로그인하기
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400">다른 방법으로 로그인</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-10 rounded-xl bg-white border-gray-100 hover:bg-gray-50 flex items-center gap-2">
              <Github className="w-4 h-4" />
              <span className="text-xs font-semibold">Github</span>
            </Button>
            <Button variant="outline" className="h-10 rounded-xl bg-white border-gray-100 hover:bg-gray-50 flex items-center gap-2">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              <span className="text-xs font-semibold">Google</span>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          계정이 없으신가요?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
            회원가입 하기
          </Link>
        </p>
      </div>
    </div>
  );
}
