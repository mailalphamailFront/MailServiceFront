import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, HelpCircle, CreditCard, Key, MessageSquare, Folder, Filter, Forward, Lock, ChevronLeft, Mail } from 'lucide-react';
import { SettingsSidebar } from './SettingsSidebar';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleConnect = () => {
    alert(`Connecting to ${selectedService}\nEmail: ${email}\nPassword: ${password}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Alex Rivera</h3>
                  <p className="text-gray-500">Pro Plan • Member since Jan 2024</p>
                  <button className="mt-2 text-sm font-bold text-blue-600 hover:text-blue-700">Change Avatar</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Display Name</label>
                  <input type="text" defaultValue="Alex Rivera" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                  <input type="email" defaultValue="alex.rivera@proton.me" disabled className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" />
                </div>
              </div>
            </div>

            <div className="mt-8 p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Pro Plan</h2>
                <p className="text-blue-100 mb-6 max-w-md">You're currently taking advantage of our premium features. High security, unlimited storage.</p>
                <button className="px-6 py-2.5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
                  Check Invoices
                </button>
              </div>
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        );
      case 'appearance':
        return (
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Appearance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Light', bg: 'bg-white', border: 'border-gray-200' },
                { name: 'Dark', bg: 'bg-gray-900', border: 'border-gray-800' },
                { name: 'Contrast', bg: 'bg-black', border: 'border-gray-900' },
                { name: 'System', bg: 'bg-gradient-to-r from-white to-gray-900', border: 'border-gray-200' },
              ].map((theme) => (
                <button key={theme.name} className="p-6 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all text-left group">
                  <div className={`w-full h-32 rounded-xl mb-4 ${theme.bg} ${theme.border} border shadow-inner transition-transform group-hover:scale-[1.02]`}></div>
                  <span className="font-bold text-gray-900">{theme.name} Theme</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Security & Privacy</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Two-factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                  </div>
                  <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
                <button className="px-6 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors">
                  Enable 2FA
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Browsing Sessions</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-bold">Chrome on macOS</p>
                        <p className="text-xs text-green-500">Current Session</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-red-600">Revoke</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'language':
        return (
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Language & Region</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Interface Language</label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none appearance-none">
                  <option>English (United States)</option>
                  <option>French (France)</option>
                  <option>Spanish (Spain)</option>
                  <option>Japanese (Japan)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Time Zone</label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none appearance-none">
                  <option>(GMT-08:00) Pacific Time</option>
                  <option>(GMT+00:00) London</option>
                  <option>(GMT+09:00) Tokyo</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'services':
        const services = [
          {
            id: 'gmail', name: 'Gmail', icon: 'G', color: 'text-red-500', bg: 'hover:bg-red-50', border: 'hover:border-red-200', logo: (
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path d="M22.5 12c0-.83-.07-1.63-.2-2.4H12v4.54h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.22-4.74 3.22-8.22z" fill="#4285F4" />
                <path d="M12 22.5c2.84 0 5.22-.94 6.96-2.54l-3.57-2.77c-.99.66-2.23 1.06-3.39 1.06-2.61 0-4.83-1.77-5.61-4.15H2.76v2.85A10.5 10.5 0 0 0 12 22.5z" fill="#34A853" />
                <path d="M6.39 14.1c-.2-.6-.31-1.24-.31-1.9s.11-1.3.31-1.9V7.45H2.76A10.47 10.47 0 0 0 1.5 12.2c0 1.74.43 3.39 1.26 4.75l3.63-2.85z" fill="#FBBC05" />
                <path d="M12 5.91c1.55 0 2.94.53 4.03 1.58l3.02-3.02C17.22 2.76 14.84 1.8 12 1.8 7.37 1.8 3.42 4.46 1.5 8.35l3.63 2.85c.78-2.38 3-4.15 5.61-4.15z" fill="#EA4335" />
              </svg>
            )
          },
          {
            id: 'outlook', name: 'Outlook', icon: 'O', color: 'text-blue-600', bg: 'hover:bg-blue-50', border: 'hover:border-blue-200', logo: (
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path d="M21 4.5V19.5C21 20.3284 20.3284 21 19.5 21H7.5C6.67157 21 6 20.3284 6 19.5V4.5C6 3.67157 6.67157 3 7.5 3H19.5C20.3284 3 21 3.67157 21 4.5Z" fill="#0072C6" />
                <path d="M1.5 7.5V16.5C1.5 17.3284 2.17157 18 3 18H10.5C11.3284 18 12 17.3284 12 16.5V7.5C12 6.67157 11.3284 6 10.5 6H3C2.17157 6 1.5 6.67157 1.5 7.5Z" fill="#0072C6" />
                <path d="M4.5 9H9V15H4.5V9Z" fill="white" />
              </svg>
            )
          },
          {
            id: 'icloud', name: 'iCloud', icon: 'i', color: 'text-gray-900', bg: 'hover:bg-gray-50', border: 'hover:border-gray-300', logo: (
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.5 19c-1.5 0-2.8-.7-3.7-1.8-1 .8-2.2 1.3-3.6 1.3-3 0-5.5-2.5-5.5-5.5 0-2.3 1.5-4.3 3.6-5.1-.1-.3-.1-.6-.1-.9 0-3 2.5-5.5 5.5-5.5 1.8 0 3.4.9 4.4 2.3.8-.4 1.7-.6 2.6-.6 2.8 0 5 2.2 5 5 0 .2 0 .4-.1.6 1.2.9 2 2.4 2 4.1 0 2.9-2.2 5.3-5.1 5.4v0z" />
              </svg>
            )
          },
          {
            id: 'naver', name: 'Naver', icon: 'N', color: 'text-[#03C75A]', bg: 'hover:bg-[#03C75A]/5', border: 'hover:border-[#03C75A]/20', logo: (
              <div className="w-8 h-8 bg-[#03C75A] rounded-md flex items-center justify-center text-white text-[14px] font-black italic shadow-inner">N</div>
            )
          },
          {
            id: 'daum', name: 'Daum', icon: 'D', color: 'text-[#3E7FFF]', bg: 'hover:bg-[#3E7FFF]/5', border: 'hover:border-[#3E7FFF]/20', logo: (
              <div className="w-8 h-8 bg-[#3E7FFF] rounded-md flex items-center justify-center text-white text-[14px] font-black shadow-inner">D</div>
            )
          },
          {
            id: 'yahoo', name: 'Yahoo', icon: 'Y', color: 'text-[#6001D2]', bg: 'hover:bg-[#6001D2]/5', border: 'hover:border-[#6001D2]/20', logo: (
              <div className="w-8 h-8 bg-[#6001D2] rounded-md flex items-center justify-center text-white text-[14px] font-black italic shadow-inner">Y!</div>
            )
          },
        ];

        if (selectedService) {
          const service = services.find(s => s.id === selectedService);
          return (
            <div className="max-w-xl">
              <button
                onClick={() => setSelectedService(null)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold">Back to Services</span>
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  {service?.logo}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Sign in with {service?.name}</h2>
                  <p className="text-gray-500">Connect your account using an App Password.</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={`yourname@${selectedService}.com`}
                    className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-bold text-gray-700">App Password</label>
                    <button className="text-[12px] text-blue-600 hover:underline font-medium">How to generate?</button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your app password"
                    className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <button
                  onClick={handleConnect}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  Connect Account
                </button>
              </div>

              <div className="mt-8 flex gap-4 p-6 rounded-2xl bg-amber-50 border border-amber-100 text-amber-900">
                <div className="mt-0.5"><Shield className="w-5 h-5 text-amber-600" /></div>
                <p className="text-sm"><b>Security Note:</b> Never enter your primary account password here. Use a unique <b>App Password</b> generated from your {service?.name} account settings for enhanced security.</p>
              </div>
            </div>
          );
        }

        return (
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connected Services</h2>
            <p className="text-gray-500 mb-8">Link your existing mailboxes to view all your messages in one place.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`flex flex-col items-center justify-center p-8 rounded-2xl bg-white border border-gray-100 transition-all group ${service.bg} ${service.border} hover:shadow-lg active:scale-[0.98]`}
                >
                  <div className="mb-4 transform group-hover:scale-110 transition-transform">
                    {service.logo}
                  </div>
                  <span className="text-sm font-bold text-gray-900">Sign in with {service.name}</span>
                </button>
              ))}
            </div>

            <div className="mt-12 p-8 rounded-3xl bg-gray-50 border border-gray-100 flex items-center gap-6">
              <div className="p-4 bg-white rounded-2xl shadow-sm">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Privacy & Security</h3>
                <p className="text-sm text-gray-500 max-w-lg">Your login credentials never leave your browser. We securely connect to your external mail accounts without storing your primary passwords.</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <Globe className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Settings Section Under Construction</h3>
            <p className="text-gray-500 max-w-sm">We are currently migrating this settings module to the new tabbed view.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-1 bg-gray-50 overflow-hidden">
      <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto p-12">
        {renderContent()}
      </div>
    </div>
  );
}
