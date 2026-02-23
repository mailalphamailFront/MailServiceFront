import React, { useState, useMemo } from 'react';
import { Routes, Route, Navigate, useParams, useSearchParams, useNavigate, useLocation } from 'react-router';
import { Search, Bell, Settings, HelpCircle, Menu, LayoutGrid, Loader2 } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { EmailListItem } from './components/EmailListItem';
import { EmailView } from './components/EmailView';
import { ComposeModal } from './components/ComposeModal';
import { ProfileDropdown } from './components/ProfileDropdown';
import { Tooltip } from './components/Tooltip';
import { SettingsPage } from './components/SettingsPage';
import { Email } from './types';
import { toast, Toaster } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  user
}: {
  children: React.ReactNode,
  onSend: (email: Partial<Email>) => void,
  isComposeOpen: boolean,
  setIsComposeOpen: (open: boolean) => void,
  composeData: any,
  setComposeData: (data: any) => void,
  user: any
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

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
          <div className="flex-1 max-w-2xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search messages, people, or files..."
                value={query}
                onChange={(e) => setSearchParams({ q: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Tooltip text="Notifications">
              <button
                onClick={() => handleAction('Notifications: You have 3 new alerts')}
                className="hidden md:flex p-2 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </Tooltip>

            <Tooltip text="Settings">
              <button
                onClick={() => navigate('/settings')}
                className="hidden md:flex p-2 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </Tooltip>

            <Tooltip text="Help">
              <button
                onClick={() => handleAction('Help: Support center documentation')}
                className="hidden md:flex p-2 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </Tooltip>

            <div className="w-px h-6 bg-gray-200 mx-2 hidden md:block"></div>

            {/* Profile Trigger */}
            <div className="relative">
              <Tooltip text="Account Settings">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pr-3 hover:bg-gray-50 rounded-full transition-all border border-transparent hover:border-gray-100"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                    <img
                      src="https://images.unsplash.com/photo-1701463387028-3947648f1337?q=80&w=100"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-gray-900 leading-none">{user?.email?.split('@')[0] || 'User'}</p>
                    <p className="text-[10px] text-gray-500 leading-tight">{user?.email || 'Not logged in'}</p>
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
              onClick={() => handleAction('Navigation menu toggled')}
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
      </div>

      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSend={onSend}
        initialData={composeData}
      />
    </div >
  );
}

interface EmailListPageProps {
  emails: Email[];
  isLoading: boolean;
  onToggleStar: (id: string, starred: boolean) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onToggleRead: (id: string) => void;
  onMarkRead: (id: string) => void;
  onReply: (email: Email) => void;
  onForward: (email: Email) => void;
}

function EmailListPage({ emails, isLoading, onToggleStar, onDelete, onArchive, onToggleRead, onMarkRead, onReply, onForward }: EmailListPageProps) {
  const { folder = 'inbox' } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';

  const filteredEmails = useMemo(() => {
    return emails.filter(email => {
      const matchesFolder = folder === 'starred' ? email.starred : email.folder === folder;
      const matchesSearch = !query ||
        email.sender.toLowerCase().includes(query) ||
        email.subject.toLowerCase().includes(query) ||
        email.content.toLowerCase().includes(query);
      return matchesFolder && matchesSearch;
    });
  }, [emails, folder, query]);

  const folderTitle = folder.charAt(0).toUpperCase() + folder.slice(1);

  return (
    <>
      {/* List Column */}
      <div className={`w-full lg:w-[400px] border-r border-gray-200 bg-white flex flex-col shrink-0 ${useParams().id ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{folderTitle}</h2>
          <div className="flex items-center gap-1 text-gray-400">
            <Tooltip text="Toggle layout view">
              <button onClick={() => toast.info('Layout view updated')} className="p-1 hover:bg-gray-50 rounded"><LayoutGrid className="w-4 h-4" /></button>
            </Tooltip>
            <span className="text-xs">{filteredEmails.length} messages</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-sm">Loading messages...</p>
            </div>
          ) : filteredEmails.length > 0 ? (
            filteredEmails.map(email => (
              <EmailListItem
                key={email.id}
                email={email}
                folder={folder}
                onToggleStar={() => onToggleStar(email.id, !email.starred)}
                onMarkRead={onMarkRead}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
              <Search className="w-12 h-12 mb-4 opacity-10" />
              <p className="text-sm">No emails found in this folder</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Column */}
      <div className={`flex-1 ${!useParams().id ? 'hidden lg:flex' : 'flex'}`}>
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
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeData, setComposeData] = useState<any>(null);
  const queryClient = useQueryClient();

  const location = useLocation();

  // Fetch Emails
  const user = useMemo(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }, [location.pathname]);

  const userEmail = user?.email || '';

  const { data: emails = [], isLoading } = useQuery({
    queryKey: ['emails', userEmail],
    queryFn: () => mailService.getMails(userEmail),
    enabled: !!userEmail,
    retry: false, // 불러오는데 실패하면 재시도 하지 않도록 설정
  });

  // Mutations
  const starMutation = useMutation({
    mutationFn: ({ id, starred }: { id: string, starred: boolean }) => mailService.toggleStar(id, starred),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['emails'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => mailService.deleteMail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast.error('Email moved to trash');
    },
  });

  const sendMutation = useMutation({
    mutationFn: (emailData: Partial<Email>) => mailService.sendMail({
      ...emailData,
      userId: user?.id
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast.success('Message sent successfully!');
    },
  });

  const toggleStar = (id: string, starred: boolean) => {
    starMutation.mutate({ id, starred });
  };

  const deleteEmail = (id: string) => {
    deleteMutation.mutate(id);
  };

  const archiveEmail = (id: string) => {
    // In many systems, archive is just moving to a specific folder or 'trash'
    // For now, let's treat it as a delete (move to trash)
    deleteMutation.mutate(id);
    toast.success('Conversation archived');
  };

  const toggleRead = (_id: string) => {
    // Implement read toggle mutation if available in API
    toast.info('Read status updated');
  };

  const markRead = (_id: string) => {
    // Implement mark read mutation if available in API
    toast.info('Marked as read');
  };

  const sendEmail = (newEmail: Partial<Email>) => {
    sendMutation.mutate(newEmail);
  };

  const handleReply = (email: Email) => {
    setComposeData({
      to: email.senderEmail,
      subject: `Re: ${email.subject}`,
      content: `\n\n--- On ${new Date(email.timestamp).toLocaleString()}, ${email.sender} wrote: ---\n> ${email.content}`
    });
    setIsComposeOpen(true);
  };

  const handleForward = (email: Email) => {
    setComposeData({
      to: '',
      subject: `Fwd: ${email.subject}`,
      content: `\n\n--- Forwarded message ---\nFrom: ${email.sender} <${email.senderEmail}>\nDate: ${new Date(email.timestamp).toLocaleString()}\nSubject: ${email.subject}\n\n${email.content}`
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
            >
              <Routes>
                <Route path="/" element={<Navigate to="/inbox" replace />} />
                <Route
                  path="/:folder"
                  element={
                    <EmailListPage
                      emails={emails}
                      isLoading={isLoading}
                      onToggleStar={toggleStar}
                      onDelete={deleteEmail}
                      onArchive={archiveEmail}
                      onToggleRead={toggleRead}
                      onMarkRead={markRead}
                      onReply={handleReply}
                      onForward={handleForward}
                    />
                  }
                />
                <Route path="/settings" element={<SettingsPage />} />
                <Route
                  path="/:folder/:id"
                  element={
                    <EmailListPage
                      emails={emails}
                      isLoading={isLoading}
                      onToggleStar={toggleStar}
                      onDelete={deleteEmail}
                      onArchive={archiveEmail}
                      onToggleRead={toggleRead}
                      onMarkRead={markRead}
                      onReply={handleReply}
                      onForward={handleForward}
                    />
                  }
                />
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
