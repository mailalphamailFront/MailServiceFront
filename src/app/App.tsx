import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Routes, Route, Navigate, useParams, useSearchParams, useNavigate, useLocation } from 'react-router';
import { Search, Settings, Menu, LayoutGrid, Loader2, X, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Sidebar } from './components/Sidebar';
import { EmailListItem } from './components/EmailListItem';
import { EmailView } from './components/EmailView';
import { ComposeModal } from './components/ComposeModal';
import { ProfileDropdown } from './components/ProfileDropdown';
import { Tooltip } from './components/Tooltip';
import { SettingsPage } from './components/SettingsPage';
import { Email } from './types';
import { toast, Toaster } from 'sonner';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { mailService } from './api/services/mail.service';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/inbox" replace />;
  }
  return <>{children}</>;
}

function Layout({
  children,
  onSend,
  isComposeOpen,
  setIsComposeOpen,
  composeData,
  setComposeData,
  user,
  accounts
}: {
  children: React.ReactNode,
  onSend: (email: Partial<Email>) => void,
  isComposeOpen: boolean,
  setIsComposeOpen: (open: boolean) => void,
  composeData: any,
  setComposeData: (data: any) => void,
  user: any,
  accounts: any[]
}) {
  const { t } = useTranslation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [localQuery, setLocalQuery] = useState(query);

  // Sync local query if search params change externally (e.g. navigation)
  React.useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const handleSearch = () => {
    if (localQuery.trim()) {
      setSearchParams({ q: localQuery });
    } else {
      setSearchParams({});
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchParams({});
  };

  const handleAction = (msg: string) => toast.info(msg);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        onCompose={() => {
          setComposeData(null);
          setIsComposeOpen(true);
        }}
        user={user}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex-1 max-w-2xl flex items-center">
            <div className="relative group flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder={t('common.search_placeholder')}
                value={localQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onChange={(e) => setLocalQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-gray-50 border-none rounded-xl py-2 pl-10 pr-20 text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
              />
              {(isSearchFocused || localQuery) && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 animate-in fade-in zoom-in duration-200">
                  {localQuery && (
                    <button
                      onClick={handleClear}
                      className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
                      title={t('common.clear_search')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={handleSearch}
                    className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    title={t('common.run_search')}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Tooltip text={t('common.settings')}>
              <button
                onClick={() => navigate('/settings')}
                className="hidden md:flex p-2 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </Tooltip>

            <div className="w-px h-6 bg-gray-200 mx-2 hidden md:block"></div>

            {/* Profile Trigger */}
            <div className="relative">
              <Tooltip text={t('common.account_settings')}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center p-1 hover:bg-gray-50 rounded-full transition-all border border-transparent hover:border-gray-100"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-gray-100">
                    <img
                      src="/images/ig_default.svg"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
              </Tooltip>

              <ProfileDropdown
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={user}
              />
            </div>

            <button
              onClick={() => handleAction(t('common.nav_toggle_demo', '탐색 메뉴 토글됨'))}
              className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex overflow-hidden">
          {children}
        </main>
      </div >

      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSend={onSend}
        initialData={composeData}
        accounts={accounts}
      />
    </div >
  );
}

interface EmailListPageProps {
  emails: Email[];
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  onToggleStar: (id: string, starred: boolean) => void;
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onArchive: (id: string) => void;
  onToggleRead: (id: string) => void;
  onMarkRead: (id: string) => void;
  onReply: (email: Email) => void;
  onForward: (email: Email) => void;
}

function EmailListPage({
  emails,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  onToggleStar,
  onDelete,
  onBulkDelete,
  onArchive,
  onToggleRead,
  onMarkRead,
  onReply,
  onForward
}: EmailListPageProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { folderName, accountId: pathAccountId, id } = useParams();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const folder = folderName || 'INBOX';
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedIds([]);
  }, [folderName, pathAccountId]);

  const handleToggleSelection = (emailId: string) => {
    setSelectedIds(prev =>
      prev.includes(emailId)
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const handleBulkDelete = () => {
    onBulkDelete(selectedIds);
    setSelectedIds([]);
  };

  const isAllSelected = emails.length > 0 && selectedIds.length === emails.length;
  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(emails.map(e => e.id));
    }
  };

  let folderTitle = t('email.messages_title', '메시지');
  if (location.pathname.startsWith('/mail/all')) {
    folderTitle = t('nav.all_inboxes');
  } else if (folder) {
    const accountId = pathAccountId ? parseInt(pathAccountId, 10) : null;
    const accounts = (queryClient.getQueryData(['accounts']) as any)?.data?.accounts || [];
    const account = accounts.find((a: any) => a.accountId === accountId);
    const folderData = account?.folders?.find((f: any) => f.type === folder || f.folderId === folder);

    if (folderData && folderData.type !== 'CUSTOM') {
      switch (folderData.type.toUpperCase()) {
        case 'INBOX': folderTitle = t('nav.inbox'); break;
        case 'SENT': folderTitle = t('nav.sent'); break;
        case 'DRAFTS': folderTitle = t('nav.drafts'); break;
        case 'TRASH': folderTitle = t('nav.trash'); break;
        case 'JUNK':
        case 'SPAM': folderTitle = t('nav.spam'); break;
        case 'STARRED': folderTitle = t('nav.starred'); break;
        default: folderTitle = folderData.displayName || folderData.name;
      }
    } else {
      folderTitle = folder.split('/').pop() || folder;
      folderTitle = folderTitle.charAt(0).toUpperCase() + folderTitle.slice(1);
    }
  }

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      {/* List Column */}
      <div className={`w-full lg:w-[400px] border-r border-gray-200 bg-white flex flex-col shrink-0 ${id ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between min-h-[65px]">
          {selectedIds.length > 0 ? (
            <div className="flex items-center gap-3 w-full">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleToggleAll}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-blue-600 flex-1">
                {selectedIds.length}{t('email.selected_count', '개 선택됨')}
              </span>
              <button
                onClick={handleBulkDelete}
                className="p-1 px-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors border border-red-100"
              >
                {t('common.delete', '삭제')}
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold text-gray-900">{folderTitle}</h2>
              <div className="flex items-center gap-1 text-gray-400">
                <Tooltip text={t('email.toggle_layout', '레이아웃 보기 전환')}>
                  <button onClick={() => toast.info(t('email.layout_updated', '레이아웃 보기가 업데이트되었습니다'))} className="p-1 hover:bg-gray-50 rounded"><LayoutGrid className="w-4 h-4" /></button>
                </Tooltip>
                <span className="text-xs">{emails.length}{t('email.messages_count', '개의 메시지')}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading && emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-sm">{t('email.loading_messages')}</p>
            </div>
          ) : emails.length > 0 ? (
            <>
              {emails.map(email => (
                <EmailListItem
                  key={email.id}
                  email={email}
                  onMarkRead={onMarkRead}
                  isSelected={selectedIds.includes(email.id)}
                  onToggleSelection={() => handleToggleSelection(email.id)}
                />
              ))}

              {/* Infinite Scroll Trigger */}
              <div ref={observerRef} className="h-10 flex items-center justify-center p-4">
                {isFetchingNextPage && (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
              <Search className="w-12 h-12 mb-4 opacity-10" />
              <p className="text-sm">{t('email.no_emails')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Column */}
      <div className={`flex-1 ${!id ? 'hidden lg:flex' : 'flex'}`}>
        <EmailView
          onToggleStar={(id) => {
            const email = emails.find(e => e.id === id);
            if (email) onToggleStar(id, !email.starred);
          }}
          onDelete={onDelete}
          onArchive={onArchive}
          onToggleRead={onToggleRead}
          onReply={onReply}
          onForward={onForward}
          emails={emails}
        />
      </div>
    </>
  );
}

export default function App() {
  const { t } = useTranslation();
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeData, setComposeData] = useState<any>(null);
  const queryClient = useQueryClient();
  const pendingSendRef = useRef<{ timeoutId: any, emailData: any } | null>(null);

  const location = useLocation();

  // Fetch Emails
  const user = useMemo(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }, [location.pathname]);

  const userEmail = user?.email || '';

  // Parse location to get folderId and accountId
  const [searchParams] = useSearchParams();
  const pathParts = location.pathname.split('/');
  let currentAccountId: number | undefined | null;
  let currentFolderId: string | undefined = 'INBOX';

  if (pathParts[1] === 'mail') {
    if (pathParts[2]) {
      if (pathParts[2] === 'all') {
        currentAccountId = null;
      } else {
        currentAccountId = parseInt(pathParts[2], 10);
      }
    }

    if (pathParts[3]) {
      currentFolderId = decodeURIComponent(pathParts[3]);
    }
  }

  const searchQuery = searchParams.get('q') || '';

  // Fetch Accounts
  const { data: accountsResponse } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => mailService.getConnectedAccounts(),
    enabled: !!userEmail,
  });

  // Resolve currentFolderId (URL param) to actual API folderId if it's a type symbol
  const resolvedFolderId = useMemo(() => {
    if (!currentFolderId || !accountsResponse?.data?.accounts) return currentFolderId;
    if (currentAccountId === null) return currentFolderId;

    const account = accountsResponse.data.accounts.find(a => a.accountId === currentAccountId);
    if (!account) return currentFolderId;

    // Check if the current ID matches any folder's type
    const folderByType = account.folders.find(f => f.type === currentFolderId);
    if (folderByType && folderByType.type !== 'CUSTOM') {
      return folderByType.folderId;
    }
    return currentFolderId;
  }, [currentFolderId, currentAccountId, accountsResponse]);

  const {
    data: infiniteEmails,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['emails', resolvedFolderId, currentAccountId, searchQuery],
    queryFn: ({ pageParam = 0 }) =>
      mailService.loadEmails(resolvedFolderId!, currentAccountId!, pageParam as number, searchQuery),
    getNextPageParam: (lastPage, allPages) => {
      // If the last page returned data, try fetching the next page
      return lastPage.length > 0 ? allPages.length : undefined;
    },
    initialPageParam: 0,
    enabled: !!userEmail && !!resolvedFolderId,
    retry: false,
  });

  const emails = useMemo(() => {
    return infiniteEmails?.pages.flat() || [];
  }, [infiniteEmails]);

  // Mutations
  const starMutation = useMutation({
    mutationFn: ({ id, starred }: { id: string, starred: boolean }) => mailService.toggleStar(id, starred),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['emails'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ messageNumber, accountId, folderId }: { messageNumber: number, accountId: number, folderId: string }) =>
      mailService.deleteMail(messageNumber, accountId, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast.error(t('email.moved_to_trash', '메일을 휴지통으로 이동했습니다'));
    },
  });

  const sendMutation = useMutation({
    mutationFn: (emailData: Partial<Email>) => mailService.sendMail({
      ...emailData,
      userId: user?.id
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: ({ messageNumber, accountId, folderId }: { messageNumber: number, accountId: number, folderId: string }) =>
      mailService.markAsRead(messageNumber, accountId, folderId),
    onMutate: async ({ messageNumber }) => {
      const queryKey = ['emails', resolvedFolderId, currentAccountId, searchQuery];
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<any>(queryKey);

      queryClient.setQueryData<any>(queryKey, (old: any) => ({
        ...old,
        pages: old?.pages.map((page: Email[]) =>
          page.map((email) =>
            email.messageNumber === messageNumber ? { ...email, read: true } : email
          )
        )
      }));
      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['emails', resolvedFolderId, currentAccountId, searchQuery], context.previousData);
      }
    },
  });

  const toggleStar = (id: string, starred: boolean) => {
    starMutation.mutate({ id, starred });
  };

  const deleteEmail = (id: string) => {
    const email = emails.find(e => e.id === id);
    if (email && email.messageNumber) {
      const accountId = email.accountId || currentAccountId;
      const folderId = email.folderId || resolvedFolderId || 'INBOX';
      if (accountId) {
        deleteMutation.mutate({
          messageNumber: email.messageNumber,
          accountId: accountId,
          folderId: folderId
        });
      }
    }
  };

  const handleBulkDelete = (ids: string[]) => {
    ids.forEach(id => {
      const email = emails.find(e => e.id === id);
      if (email && email.messageNumber) {
        const accountId = email.accountId || currentAccountId;
        const folderId = email.folderId || resolvedFolderId || 'INBOX';
        if (accountId) {
          deleteMutation.mutate({
            messageNumber: email.messageNumber,
            accountId: accountId,
            folderId: folderId
          });
        }
      }
    });
    toast.error(t('email.bulk_moved_to_trash', '선택한 메일들을 휴지통으로 이동했습니다'));
  };

  const archiveEmail = (id: string) => {
    const email = emails.find(e => e.id === id);
    if (email && email.messageNumber) {
      const accountId = email.accountId || currentAccountId;
      const folderId = email.folderId || resolvedFolderId || 'INBOX';
      if (accountId) {
        deleteMutation.mutate({
          messageNumber: email.messageNumber,
          accountId: accountId,
          folderId: folderId
        });
        toast.success(t('email.archived', '대화가 보관되었습니다'));
      }
    }
  };

  const toggleRead = (_id: string) => {
    toast.info(t('email.read_status_updated', '읽음 상태가 업데이트되었습니다'));
  };

  const markRead = (id: string) => {
    const email = emails.find(e => e.id === id);
    if (email && email.messageNumber) {
      // Use email's accountId or fallback to currentAccountId
      const accountId = email.accountId || currentAccountId;
      const folderId = resolvedFolderId || 'INBOX';

      if (accountId) {
        markReadMutation.mutate({
          messageNumber: email.messageNumber,
          accountId: accountId,
          folderId: folderId
        });
      }
    }
  };

  const sendEmail = (newEmail: Partial<Email>) => {
    // Show "Sending..." toast
    const toastId = toast.loading(t('compose.sending', '보내는 중...'));

    // Schedule actual send after 5 seconds
    const timeoutId = setTimeout(() => {
      sendMutation.mutate(newEmail);
      toast.dismiss(toastId);
      pendingSendRef.current = null;
    }, 5000);

    // Store in ref for possible undo
    pendingSendRef.current = { timeoutId, emailData: newEmail };

    // Update toast to "Message sent | Undo"
    toast.success(t('email.message_sent', '메시지가 전송되었습니다'), {
      id: toastId,
      duration: 5000,
      action: {
        label: t('common.undo', '되돌리기'),
        onClick: () => {
          if (pendingSendRef.current) {
            clearTimeout(pendingSendRef.current.timeoutId);
            setComposeData(pendingSendRef.current.emailData);
            setIsComposeOpen(true);
            pendingSendRef.current = null;
            toast.dismiss(toastId);
            toast.info(t('compose.send_cancelled', '전송이 취소되었습니다'));
          }
        },
      },
    });
  };

  const handleReply = (email: Email) => {
    setComposeData({
      to: email.senderEmail,
      subject: `Re: ${email.subject}`,
      content: `\n\n--- On ${new Date(email.timestamp).toLocaleString()}, ${email.sender} wrote: ---\n> ${email.content}`,
      accountId: email.accountId || currentAccountId
    });
    setIsComposeOpen(true);
  };

  const handleForward = (email: Email) => {
    setComposeData({
      to: '',
      subject: `Fwd: ${email.subject}`,
      content: `\n\n--- Forwarded message ---\nFrom: ${email.sender} <${email.senderEmail}>\nDate: ${new Date(email.timestamp).toLocaleString()}\nSubject: ${email.subject}\n\n${email.content}`,
      accountId: email.accountId || currentAccountId
    });
    setIsComposeOpen(true);
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        <Route path="/*" element={
          <ProtectedRoute>
            <Layout
              onSend={sendEmail}
              isComposeOpen={isComposeOpen}
              setIsComposeOpen={setIsComposeOpen}
              composeData={composeData}
              setComposeData={setComposeData}
              user={user}
              accounts={accountsResponse?.data?.accounts || []}
            >
              <Routes>
                <Route path="/" element={<Navigate to="/mail/all/INBOX" replace />} />
                <Route path="/inbox" element={<Navigate to="/mail/all/INBOX" replace />} />
                <Route
                  path="/mail/:accountId/:folderName"
                  element={
                    <EmailListPage
                      emails={emails}
                      isLoading={isLoading}
                      hasNextPage={!!hasNextPage}
                      isFetchingNextPage={isFetchingNextPage}
                      fetchNextPage={fetchNextPage}
                      onToggleStar={toggleStar}
                      onDelete={deleteEmail}
                      onBulkDelete={handleBulkDelete}
                      onArchive={archiveEmail}
                      onToggleRead={toggleRead}
                      onMarkRead={markRead}
                      onReply={handleReply}
                      onForward={handleForward}
                    />
                  }
                />
                <Route
                  path="/mail/:accountId/:folderName/:id"
                  element={
                    <EmailListPage
                      emails={emails}
                      isLoading={isLoading}
                      hasNextPage={!!hasNextPage}
                      isFetchingNextPage={isFetchingNextPage}
                      fetchNextPage={fetchNextPage}
                      onToggleStar={toggleStar}
                      onDelete={deleteEmail}
                      onBulkDelete={handleBulkDelete}
                      onArchive={archiveEmail}
                      onToggleRead={toggleRead}
                      onMarkRead={markRead}
                      onReply={handleReply}
                      onForward={handleForward}
                    />
                  }
                />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
      <Toaster position="bottom-left" richColors />
    </>
  );
}
