import { useState } from 'react';
import {
  Trash2,
  Shield,
  Globe,
  ChevronLeft,
} from 'lucide-react';
import { SettingsSidebar } from './SettingsSidebar';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

// Services & Hooks
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from '../api/services/auth.service';
import { mailService } from "../api/services/mail.service";
import { EmailAccountsResponse } from "../types";

export function SettingsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("home");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userLoginPassword, setUserLoginPassword] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const queryClient = useQueryClient();

  const { data: emailAccountsData, isLoading: isLoadingAccounts, isFetching: isFetchingAccounts } = useQuery<EmailAccountsResponse>({
    queryKey: ["connectedAccounts"],
    queryFn: () => mailService.getConnectedAccounts(),
    enabled: activeTab === "services",
  });

  const connectedAccounts = emailAccountsData?.data?.accounts || [];

  const handleConnect = async () => {
    if (!email || !password || !selectedService || !userLoginPassword) {
      toast.error(t('settings.fill_all_fields'));
      return;
    }

    setIsConnecting(true);
    try {
      const payload = {
        accountEmail: email,
        accountPassword: password,
        provider: selectedService.toUpperCase(), // 'gmail' -> 'GMAIL'
        userLoginPassword: userLoginPassword,
      };

      const response = await mailService.connectAccount(payload);

      console.log("Account connected successfully:", response.data);
      toast.success(t('settings.connect_success'));

      setSelectedService(null);
      setEmail("");
      setPassword("");
      setUserLoginPassword("");

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["connectedAccounts"] }),
        queryClient.invalidateQueries({ queryKey: ["emails"] }),
      ]);
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error("Connection error:", error);

      let errorMessage = t('settings.connect_error');
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const msg = error.response?.data?.message || error.message;
        if (status && status >= 400) {
          errorMessage = `Error ${status}: ${msg}`;
          console.log(errorMessage);
        } else {
          errorMessage = msg || errorMessage;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (accountId: number) => {
    if (!confirm(t('settings.disconnect_confirm'))) {
      return;
    }

    try {
      await mailService.disconnectAccount(accountId);
      toast.success(t('settings.disconnect_success'));

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["connectedAccounts"] }),
        queryClient.invalidateQueries({ queryKey: ["emails"] }),
      ]);

      setSelectedService(null);
    } catch (error: any) {
      console.error("Disconnect error:", error);
      let errorMessage = t('settings.disconnect_error');
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      }
      toast.error(errorMessage);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('settings.profile_title')}
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-sm">
                  <img
                    src="/images/ig_default.svg"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Alex Rivera
                  </h3>
                  <p className="text-gray-500">
                    {t('settings.pro_plan')} • {t('settings.member_since', { date: '2024년 1월' })}
                  </p>
                  <button className="mt-2 text-sm font-bold text-blue-600 hover:text-blue-700">
                    {t('settings.change_avatar')}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    {t('settings.display_name')}
                  </label>
                  <input
                    type="text"
                    defaultValue="Alex Rivera"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    {t('settings.email_address')}
                  </label>
                  <input
                    type="email"
                    defaultValue="alex.rivera@proton.me"
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

          </div>
        );
      case "security":
        return (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('settings.security_title')}
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {t('settings.two_factor_auth')}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {t('settings.two_factor_desc')}
                    </p>
                  </div>
                  <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
                <button className="px-6 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors">
                  {t('settings.enable_2fa')}
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {t('settings.browsing_sessions')}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-bold">Chrome on macOS</p>
                        <p className="text-xs text-green-500">
                          {t('settings.current_session')}
                        </p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-red-600">
                      {t('settings.revoke_session')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone: Account Withdrawal */}
              <div className="mt-12 border-t border-red-100 pt-12">
                <div className="bg-red-50/30 rounded-2xl border border-red-100 p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 text-red-600">
                    <Shield className="w-6 h-6" />
                    <h3 className="text-lg font-bold">{t('settings.danger_zone')}</h3>
                  </div>
                  <div className="mb-6">
                    <h4 className="text-gray-900 font-bold mb-1">{t('settings.delete_account')}</h4>
                    <p className="text-sm text-gray-500">
                      {t('settings.delete_account_desc')}
                    </p>
                  </div>

                  <div className="max-w-md space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">{t('settings.confirm_password')}</label>
                      <input
                        type="password"
                        value={userLoginPassword} // 기존 선언된 state 활용
                        onChange={(e) => setUserLoginPassword(e.target.value)}
                        placeholder={t('settings.confirm_password_placeholder')}
                        className="w-full p-3.5 bg-white border border-red-100 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                      />
                    </div>
                    <button
                      onClick={async () => {
                        if (!userLoginPassword) {
                          toast.error(t('settings.password_verification_required'));
                          return;
                        }
                        if (confirm(t('settings.delete_confirm'))) {
                          try {
                            await authService.withdraw(userLoginPassword); // 추가된 withdraw API 호출

                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            window.location.href = '/login';
                          } catch (error: any) {
                            toast.error(error.response?.data?.message || t('settings.delete_error'));
                          }
                        }
                      }}
                      className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      {t('settings.delete_my_account')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "services":
        const services = [
          {
            id: "gmail",
            name: "Gmail",
            icon: "G",
            color: "text-red-500",
            bg: "hover:bg-red-50",
            border: "hover:border-red-200",
            logo: (
              <img src="/images/gmail.svg" alt="Gmail" className="w-8 h-8 object-contain" />
            ),
          },
          {
            id: "outlook",
            name: "Outlook",
            icon: "O",
            color: "text-blue-600",
            bg: "hover:bg-blue-50",
            border: "hover:border-blue-200",
            logo: (
              <img src="/images/outlook.svg" alt="Outlook" className="w-8 h-8 object-contain" />
            ),
          },
          {
            id: "icloud",
            name: "iCloud",
            icon: "i",
            color: "text-gray-900",
            bg: "hover:bg-gray-50",
            border: "hover:border-gray-300",
            logo: (
              <img src="/images/icloud.png" alt="iCloud" className="w-8 h-8 object-contain" />
            ),
          },
          {
            id: "naver",
            name: "Naver",
            icon: "N",
            color: "text-[#03C75A]",
            bg: "hover:bg-[#03C75A]/5",
            border: "hover:border-[#03C75A]/20",
            logo: (
              <img src="/images/naver.svg" alt="Naver" className="w-8 h-8 object-contain" />
            ),
          },
          {
            id: "daum",
            name: "Daum",
            icon: "D",
            color: "text-[#3E7FFF]",
            bg: "hover:bg-[#3E7FFF]/5",
            border: "hover:border-[#3E7FFF]/20",
            logo: (
              <img src="/images/daum.svg" alt="Daum" className="w-8 h-8 object-contain" />
            ),
          },
          {
            id: "yahoo",
            name: "Yahoo",
            icon: "Y",
            color: "text-[#6001D2]",
            bg: "hover:bg-[#6001D2]/5",
            border: "hover:border-[#6001D2]/20",
            logo: (
              <img src="/images/yahoo.png" alt="Yahoo" className="w-8 h-8 object-contain" />
            ),
          },
        ];

        if (selectedService) {
          const service = services.find((s) => s.id === selectedService);
          const connectedAccount = connectedAccounts.find(
            (acc) => acc.provider.toLowerCase() === selectedService.toLowerCase()
          );

          if (connectedAccount) {
            return (
              <div className="max-w-xl">
                <button
                  onClick={() => setSelectedService(null)}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-bold">{t('settings.back_to_accounts')}</span>
                </button>

                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    {service?.logo}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {t('settings.connected_with', { service: service?.name })}
                    </h2>
                    <p className="text-gray-500">{connectedAccount.accountEmail}</p>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-700">
                    <Shield className="w-5 h-5" />
                    <p className="text-sm font-medium">
                      {t('settings.sync_desc')}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDisconnect(connectedAccount.accountId)}
                    className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 border border-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    {t('settings.disconnect_account')}
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div className="max-w-xl">
              <button
                onClick={() => setSelectedService(null)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold">{t('settings.back_to_accounts')}</span>
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  {service?.logo}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t('settings.sign_in_with', { service: service?.name })}
                  </h2>
                  <p className="text-gray-500">
                    {t('settings.connect_app_password')}
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">
                    {t('settings.email_address_label')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={`yourname@${selectedService}.com`}
                    disabled={isConnecting}
                    tabIndex={1}
                    className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-bold text-gray-700">
                      {t('settings.app_password_label')}
                    </label>
                    <div className="flex gap-3">
                      <button
                        className="text-[12px] text-blue-600 hover:underline font-medium"
                        onClick={() => {
                          let envPassword = "";
                          switch (selectedService) {
                            case "gmail":
                              envPassword = import.meta.env
                                .VITE_TEST_GMAIL_PASSWORD;
                              break;
                            case "naver":
                              envPassword = import.meta.env
                                .VITE_TEST_NAVER_PASSWORD;
                              break;
                            case "daum":
                              envPassword = import.meta.env
                                .VITE_TEST_DAUM_PASSWORD;
                              break;
                            case "yahoo":
                              envPassword = import.meta.env
                                .VITE_TEST_YAHOO_PASSWORD;
                              break;
                            case "outlook":
                              envPassword = import.meta.env
                                .VITE_TEST_OUTLOOK_PASSWORD;
                              break;
                            case "icloud":
                              envPassword = import.meta.env
                                .VITE_TEST_ICLOUD_PASSWORD;
                              break;
                          }
                          if (envPassword) {
                            setPassword(envPassword);
                            toast.success(
                              t('settings.filled_password_for', { service: services.find((s) => s.id === selectedService)?.name })
                            );
                          } else {
                            toast.error(
                              t('settings.no_test_password', { service: selectedService })
                            );
                          }
                        }}
                        tabIndex={-1}
                      >
                        {t('settings.fill_password_env')}
                      </button>
                      <button
                        className="text-[12px] text-blue-600 hover:underline font-medium"
                        tabIndex={-1}
                      >
                        {t('settings.how_to_generate')}
                      </button>
                    </div>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('settings.app_password_label')}
                    disabled={isConnecting}
                    tabIndex={2}
                    className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">
                    {t('settings.current_password_label')}
                  </label>
                  <input
                    type="password"
                    value={userLoginPassword}
                    onChange={(e) => setUserLoginPassword(e.target.value)}
                    placeholder={t('settings.confirm_password_placeholder')}
                    disabled={isConnecting}
                    tabIndex={3}
                    className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  tabIndex={3}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('settings.connecting')}
                    </>
                  ) : (
                    t('settings.connect_account_button')
                  )}
                </button>
              </div>


            </div>
          );
        }

        return (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('settings.connected_accounts')}
            </h2>
            <p className="text-gray-500 mb-8">
              {t('settings.link_mailbox_desc')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(isLoadingAccounts || (isFetchingAccounts && !emailAccountsData)) ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                services.map((service) => {
                  const account = connectedAccounts.find(
                    (acc) => acc.provider.toLowerCase() === service.id.toLowerCase()
                  );
                  const isConnected = !!account;
                  const inboxFolder = account?.folders?.find(f => f.type === 'INBOX');
                  const unreadCount = inboxFolder?.unreadCount || 0;

                  return (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`flex flex-col items-center justify-center p-8 rounded-2xl bg-white border transition-all group ${service.bg} ${isConnected
                        ? "border-green-200 ring-2 ring-green-100"
                        : "border-gray-100 " + service.border
                        } hover:shadow-lg active:scale-[0.98] relative`}
                    >
                      {isConnected && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] shadow-sm">
                              {unreadCount}
                            </span>
                          )}
                          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-sm ring-2 ring-white"></div>
                        </div>
                      )}
                      <div className="mb-4 transform group-hover:scale-110 transition-transform">
                        {service.logo}
                      </div>
                      <span className="text-sm font-bold text-gray-900 truncate w-full px-2 text-center">
                        {isConnected
                          ? account.accountEmail
                          : t('settings.connect_to_service', { service: service.name })}
                      </span>
                      {isConnected}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <Globe className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {t('settings.under_construction_title')}
            </h3>
            <p className="text-gray-500 max-w-sm">
              {t('settings.under_construction_desc')}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-1 bg-gray-50 overflow-hidden">
      <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto p-12">{renderContent()}</div>
    </div>
  );
}
