import React from 'react';
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
  const { id, folder } = useParams();
  const navigate = useNavigate();
  const email = emails.find(e => e.id === id);

  if (!email) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white">
        <Mail className="w-16 h-16 mb-4 opacity-20" />
        <p>Select an email to read</p>
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
                <p className="text-sm text-gray-500">to me</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{format(new Date(email.timestamp), 'MMM d, yyyy')}</p>
              <p className="text-xs text-gray-400">{format(new Date(email.timestamp), 'h:mm a')}</p>
            </div>
          </div>
          <div className="prose prose-blue max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
            {email.content}
          </div>
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
