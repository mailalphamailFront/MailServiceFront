import { useNavigate } from 'react-router';
import { Home, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4 w-full">
      <div className="w-full max-w-[480px] text-center">
        {/* Icon Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center shadow-sm mb-6">
            <AlertCircle className="text-red-500 w-10 h-10" />
          </div>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-2">404</h1>
          <h2 className="text-2xl font-bold text-gray-800">페이지를 찾을 수 없습니다</h2>
          <p className="text-gray-500 text-sm mt-4 max-w-[320px]">
            요청하신 페이지가 사라졌거나 잘못된 경로입니다.
            주소를 다시 확인해 주세요.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-100/50 mb-8">
          <div className="space-y-4">
            <Button
              onClick={() => navigate('/inbox')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl shadow-md shadow-blue-100 flex items-center justify-center gap-2 group transition-all"
            >
              <Home className="w-4 h-4" />
              메인으로 돌아가기
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full h-12 rounded-xl bg-white border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              이전 페이지로
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-gray-400 text-xs">
          도움이 필요하신가요? <button className="text-blue-600 font-semibold hover:underline">고객 센터</button>에 문의하세요.
        </p>
      </div>
    </div>
  );
}
