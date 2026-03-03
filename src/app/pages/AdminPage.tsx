import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Users,
  Settings,
  Shield,
  LogOut,
  BarChart3,
  Mail,
  Search,
  CheckCircle2,
  AlertCircle,
  MoreVertical
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export default function AdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role !== 'ROLE_ADMIN') {
        navigate('/access-denied', { replace: true });
      } else {
        setAdminUser(user);
      }
    } else {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success(t('profile.sign_out'));
    navigate('/admin-login');
  };

  const stats = [
    { label: '전체 사용자', value: '1,284', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '오늘 가입자', value: '+48', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: '시스템 트래픽', value: 'High', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: '활성 세션', value: '312', icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg uppercase tracking-tight">Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3 text-blue-600 bg-blue-50 h-12 rounded-xl">
            <BarChart3 className="w-5 h-5" />
            <span className="font-semibold">대시보드</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-gray-500 hover:text-gray-900 hover:bg-gray-100 h-12 rounded-xl border-none">
            <Users className="w-5 h-5" />
            <span className="font-medium">사용자 관리</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-gray-500 hover:text-gray-900 hover:bg-gray-100 h-12 rounded-xl border-none">
            <Mail className="w-5 h-5" />
            <span className="font-medium">메일 시스템</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-gray-500 hover:text-gray-900 hover:bg-gray-100 h-12 rounded-xl border-none">
            <Settings className="w-5 h-5" />
            <span className="font-medium">설정</span>
          </Button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 h-12 rounded-xl border-none"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">로그아웃</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="관리자 메뉴 검색..."
              className="w-full bg-gray-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{adminUser?.username || 'Admin'}</p>
              <p className="text-xs text-blue-600 font-medium">{adminUser?.email || ''}</p>
            </div>
            <div className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
              <img src="/images/ig_default.svg" alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Welcome Section */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">시스템 개요</h1>
            <p className="text-gray-500">MailAlphaMail 관리자 대시보드입니다.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`${stat.bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Activity Section (Example) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">최근 시스템 로그</h3>
                <Button variant="ghost" size="sm" className="text-blue-600 font-bold hover:bg-blue-50">전체보기</Button>
              </div>
              <div className="p-0">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">사용자 권한 변경 감지</p>
                        <p className="text-xs text-gray-500">2분 전 • 시스템 알림</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-400">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm overflow-hidden">
              <h3 className="font-bold text-gray-900 mb-6">시스템 상태</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">CPU 사용률</span>
                    <span className="font-bold text-gray-900">24%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">메모리 사용률</span>
                    <span className="font-bold text-gray-900">42%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">디스크 공간</span>
                    <span className="font-bold text-gray-900">12%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
