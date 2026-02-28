import { useState, useEffect, useRef } from 'react';
import { X, Maximize2, Minimize2, Send, Paperclip, Image, Smile, MoreHorizontal, Trash2, GripHorizontal } from 'lucide-react';
import { Email, EmailAccount } from '../types';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { toast } from 'sonner';
import Draggable from 'react-draggable';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: Partial<Email>) => void;
  initialData?: {
    to: string;
    subject: string;
    content: string;
    accountId?: number;
  } | null;
  accounts: EmailAccount[];
}

export function ComposeModal({ isOpen, onClose, onSend, initialData, accounts }: ComposeModalProps) {
  const { t } = useTranslation();
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [currentAccount, setCurrentAccount] = useState<EmailAccount | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isMaximized, setIsMaximized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) {
      setTo(initialData.to || '');
      setSubject(initialData.subject || '');
      setContent(initialData.content || '');

      const acc = accounts.find(a => a.accountId === initialData.accountId) || accounts[0] || null;
      setCurrentAccount(acc);
    } else if (isOpen) {
      setTo('');
      setSubject('');
      setContent('');
      setAttachments([]);
      setCurrentAccount(accounts[0] || null);
      setIsMaximized(false);
    }
  }, [initialData, isOpen, accounts]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!to || !subject) {
      toast.error(t('compose.fill_required'));
      return;
    }

    onSend({
      sender: currentAccount?.accountEmail?.split('@')[0] || 'User',
      senderEmail: currentAccount?.accountEmail || '',
      to,
      subject,
      content,
      folder: 'sent',
      read: true,
      starred: false,
      timestamp: new Date().toISOString(),
      avatar: '/images/ig_default.svg',
      accountId: currentAccount?.accountId,
      attachments: attachments
    });

    setTo('');
    setSubject('');
    setContent('');
    setAttachments([]);
    setIsMaximized(false);
    onClose();
  };

  const handleAction = (msg: string) => toast.info(msg);

  const modalBody = (
    <div className={clsx(
      "bg-white shadow-2xl border border-gray-200 flex flex-col overflow-hidden",
      isMaximized
        ? "w-full h-full rounded-none"
        : "w-[540px] h-[600px] rounded-xl"
    )}>
      {/* Header / Handle */}
      <div className={clsx(
        "bg-gray-900 text-white px-4 py-3 flex items-center justify-between shrink-0 select-none",
        !isMaximized && "cursor-move drag-handle"
      )}>
        <div className="flex items-center gap-2 overflow-hidden">
          {!isMaximized && <GripHorizontal className="w-4 h-4 text-gray-500 shrink-0" />}
          <span className="text-sm font-semibold truncate">
            {subject || t('compose.new_message')}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 hover:bg-gray-800 rounded transition-colors"
          >
            {isMaximized ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div className="flex flex-col shrink-0">
        <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-4">
          <span className="text-sm text-gray-500 w-12">{t('compose.from')}</span>
          <select
            value={currentAccount?.accountId || ''}
            onChange={(e) => {
              const acc = accounts.find(a => a.accountId === parseInt(e.target.value));
              if (acc) setCurrentAccount(acc);
            }}
            className="flex-1 text-sm outline-none bg-transparent appearance-none cursor-pointer font-medium text-gray-700"
          >
            {accounts.map(acc => (
              <option key={acc.accountId} value={acc.accountId}>
                {acc.accountEmail} ({acc.provider})
              </option>
            ))}
          </select>
        </div>
        <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-4">
          <span className="text-sm text-gray-500 w-12">{t('compose.to')}</span>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="flex-1 text-sm outline-none"
            placeholder={t('compose.recipients_placeholder')}
          />
        </div>
        <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-4">
          <span className="text-sm text-gray-500 w-12">{t('compose.subject')}</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 text-sm outline-none"
            placeholder={t('compose.subject_placeholder')}
          />
        </div>
      </div>

      {/* Message Body */}
      <div className="flex-1 p-4 flex flex-col min-h-0">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
          className="w-full h-full resize-none text-sm outline-none placeholder:text-gray-300 bg-transparent"
          placeholder={t('compose.body_placeholder')}
        />
      </div>

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100 flex flex-wrap gap-2 bg-gray-50/30">
          {attachments.map((file, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-600">
              <Paperclip className="w-3 h-3" />
              <span className="truncate max-w-[150px]">{file.name}</span>
              <button
                onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                className="hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-md shadow-blue-100"
          >
            {t('compose.send')}
            <Send className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1 border-l border-gray-200 ml-2 pl-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setAttachments(prev => [...prev, ...files]);
              }}
            />
            <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-white rounded-lg text-gray-500 transition-all">
              <Paperclip className="w-4 h-4" />
            </button>
            <button onClick={() => handleAction('Image library opened')} className="p-2 hover:bg-white rounded-lg text-gray-500 transition-all">
              <Image className="w-4 h-4" />
            </button>
            <button onClick={() => handleAction('Emoji picker opened')} className="p-2 hover:bg-white rounded-lg text-gray-500 transition-all">
              <Smile className="w-4 h-4" />
            </button>
            <button onClick={() => handleAction('Additional tools opened')} className="p-2 hover:bg-white rounded-lg text-gray-500 transition-all">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (isMaximized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
        {modalBody}
      </div>
    );
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      bounds="body"
    >
      <div
        ref={nodeRef}
        className="fixed bottom-8 right-8 z-50 flex flex-col"
        style={{ touchAction: 'none' }}
      >
        {modalBody}
      </div>
    </Draggable>
  );
}
