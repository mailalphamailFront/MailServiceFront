import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Trash2,
  Archive,
  Mail,
  MoreVertical,
  Reply,
  Forward,
  Star,
  MailOpen
} from 'lucide-react';
import { format } from 'date-fns';
import { Email } from '../types';
import { clsx } from 'clsx';
import { Tooltip } from './Tooltip';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { mailService } from '../api/services/mail.service';
import { Loader2 } from 'lucide-react';
import '../styles.css';

interface EmailViewProps {
  emails: Email[];
  onToggleStar: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onToggleRead: (id: string) => void;
  onReply: (email: Email) => void;
  onForward: (email: Email) => void;
}

export function EmailView({ emails, onToggleStar, onDelete, onArchive, onToggleRead, onReply, onForward }: EmailViewProps) {
  const { id, folder = 'inbox' } = useParams();
  const navigate = useNavigate();

  // Get email from passed list to get messageNumber and provider
  const emailFromList = emails.find(e => e.id === id);

  // Fetch Accounts to get accountId
  const { data: accountsResponse } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => mailService.getConnectedAccounts(),
  });

  // Fetch full mail detail
  const { data: emailDetail, isLoading: isDetailLoading } = useQuery({
    queryKey: ['email', id],
    queryFn: async () => {
      if (!emailFromList || !accountsResponse?.data?.accounts) return null;

      const account = accountsResponse.data.accounts.find(
        a => a.provider === emailFromList.provider
      );

      if (!account || !emailFromList.messageNumber) return null;

      const folderId = folder.toUpperCase() === 'INBOX' ? 'INBOX' : folder.toUpperCase();
      return mailService.getMailDetail(emailFromList.messageNumber, account.accountId, folderId);
    },
    enabled: !!id && !!emailFromList && !!accountsResponse,
  });

  const email = emailDetail || emailFromList;

  const transformedContent = useMemo(() => {
    if (!email?.content) return '';
    let content = email.content;

    // Handle inline images (cid: references to attachments)
    if (email.attachments && email.attachments.length > 0) {
      email.attachments.forEach((attachment: any) => {
        if (attachment.contentId) {
          // Some APIs wrap CID in <>, remove them
          const cid = attachment.contentId.replace(/[<>]/g, '');
          const cidRegex = new RegExp(`cid:${cid}`, 'g');

          if (attachment.content) {
            // If attachment has base64 content, create a data URL
            const dataUrl = `data:${attachment.contentType || 'image/png'};base64,${attachment.content}`;
            content = content.replace(cidRegex, dataUrl);
          }
        }
      });
    }

    // Fix relative image paths and improve security/privacy
    if (email.contentType !== 'text/plain') {
      // Promote http to https to avoid mixed content issues
      content = content.replace(/src=["']http:/g, 'src="https:');

      content = content.replace(
        /src=["'](?!\/\/|http|data)([^"']+)["']/g,
        (_match, path) => `src="https://mailalphamail.com${path.startsWith('/') ? '' : '/'}${path}"`
      );

      // Ensure images don't leak referrer info and links open in new tabs
      content = content.replace(/<img /g, '<img referrerpolicy="no-referrer" ');
      content = content.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
    }

    return content;
  }, [email]);

  if (!id) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white">
        <Mail className="w-16 h-16 mb-4 opacity-20" />
        <p>Select an email to read</p>
      </div>
    );
  }

  if (isDetailLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
        <p>Loading email content...</p>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white">
        <p>Email not found</p>
      </div>
    );
  }

  const handleDelete = () => {
    onDelete(email.id);
    navigate(`/${folder}`);
  };

  const handleArchive = () => {
    onArchive(email.id);
    navigate(`/${folder}`);
  };

  const handleAction = (action: string) => {
    toast.info(`${action} menu opened`);
  };

  return (
    <div className="email-view-container">
      <div className="email-toolbar">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/${folder}`)}
            className="p-2 hover:bg-gray-100 rounded-full lg:hidden"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-1">
            <Tooltip text="Archive conversation">
              <button onClick={handleArchive} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><Archive className="w-5 h-5" /></button>
            </Tooltip>

            <Tooltip text="Delete message">
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </Tooltip>

            <Tooltip text={email.read ? "Mark as unread" : "Mark as read"}>
              <button onClick={() => onToggleRead(email.id)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                {email.read ? <Mail className="w-5 h-5" /> : <MailOpen className="w-5 h-5" />}
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip text={email.starred ? "Remove from starred" : "Add to starred"}>
            <button
              onClick={() => onToggleStar(email.id)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-yellow-400 transition-colors"
            >
              <Star className={clsx("w-5 h-5", email.starred && "fill-yellow-400 text-yellow-400")} />
            </button>
          </Tooltip>

          <Tooltip text="More message options">
            <button onClick={() => handleAction('Extended options')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><MoreVertical className="w-5 h-5" /></button>
          </Tooltip>
        </div>
      </div>

      <div className="email-content-wrapper">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">{email.subject}</h1>
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              {email.avatar ? (
                <img src={email.avatar} alt={email.sender} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                  {email.sender.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-gray-900">{email.sender}</h2>
                  <span className="text-sm text-gray-400">&lt;{email.senderEmail}&gt;</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <span>to</span>
                  {email.receivers && email.receivers.length > 0 ? (
                    email.receivers.map((r, i) => (
                      <span key={i} className="font-medium text-gray-600">
                        {r.name || r.email} {`<${r.email}>`}{i < email.receivers!.length - 1 ? ',' : ''}
                      </span>
                    ))
                  ) : (
                    <span className="font-medium text-gray-600">me</span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{format(new Date(email.timestamp), 'MMM d, yyyy')}</p>
              <p className="text-xs text-gray-400">{format(new Date(email.timestamp), 'h:mm a')}</p>
            </div>
          </div>
          <div
            className={clsx(
              "prose prose-blue max-w-none text-gray-800 leading-relaxed",
              email.contentType === 'text/plain' && "whitespace-pre-wrap"
            )}
            dangerouslySetInnerHTML={{ __html: transformedContent }}
          />
          <div className="mt-12 pt-8 border-t border-gray-100 flex gap-4">
            <Tooltip text="Reply to sender">
              <button
                onClick={() => onReply(email)}
                className="flex items-center gap-2 px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium"
              >
                <Reply className="w-4 h-4" /> Reply
              </button>
            </Tooltip>
            <Tooltip text="Forward this message">
              <button
                onClick={() => onForward(email)}
                className="flex items-center gap-2 px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium"
              >
                <Forward className="w-4 h-4" /> Forward
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
