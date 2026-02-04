import React, { useState, useEffect, useRef } from 'react';
import { X, Maximize2, Minimize2, Send, Paperclip, Image, Smile, MoreHorizontal, Trash2, GripHorizontal } from 'lucide-react';
import { Email } from '../types';
import { Tooltip } from './Tooltip';
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
  } | null;
}

export function ComposeModal({ isOpen, onClose, onSend, initialData }: ComposeModalProps) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  
  // nodeRef must be attached to the direct child of Draggable to avoid findDOMNode warning
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) {
      setTo(initialData.to || '');
      setSubject(initialData.subject || '');
      setContent(initialData.content || '');
    } else if (isOpen) {
      setTo('');
      setSubject('');
      setContent('');
      setIsMaximized(false);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!to || !subject) {
      toast.error('Please fill in the recipient and subject');
      return;
    }

    onSend({
      sender: 'Alex Rivera',
      senderEmail: 'alex@mailcloud.io',
      subject,
      content,
      folder: 'sent',
      read: true,
      starred: false,
      timestamp: new Date().toISOString(),
      avatar: 'https://images.unsplash.com/photo-1701463387028-3947648f1337?q=80&w=100'
    });

    setTo('');
    setSubject('');
    setContent('');
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
            {subject || 'New Message'}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Tooltip text={isMaximized ? "Restore to normal size" : "Full screen"}>
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
          </Tooltip>
          
          <Tooltip text="Close">
            <button 
              onClick={onClose} 
              className="p-1 hover:bg-gray-800 rounded transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Inputs */}
      <div className="flex flex-col shrink-0">
        <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-4">
          <span className="text-sm text-gray-500 w-12">To</span>
          <input 
            type="text" 
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="flex-1 text-sm outline-none" 
            placeholder="recipients" 
          />
        </div>
        <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-4">
          <span className="text-sm text-gray-500 w-12">Subject</span>
          <input 
            type="text" 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 text-sm outline-none" 
            placeholder="Enter subject" 
          />
        </div>
      </div>

      {/* Message Body */}
      <div className="flex-1 p-4 flex flex-col min-h-0">
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full resize-none text-sm outline-none placeholder:text-gray-300 bg-transparent"
          placeholder="Write your message here..."
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-md shadow-blue-100"
          >
            Send
            <Send className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1 border-l border-gray-200 ml-2 pl-2">
            <Tooltip text="Attach files">
              <button onClick={() => handleAction('File explorer opened')} className="p-2 hover:bg-white rounded-lg text-gray-500 transition-all">
                <Paperclip className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip text="Insert image">
              <button onClick={() => handleAction('Image library opened')} className="p-2 hover:bg-white rounded-lg text-gray-500 transition-all">
                <Image className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip text="Insert emoji">
              <button onClick={() => handleAction('Emoji picker opened')} className="p-2 hover:bg-white rounded-lg text-gray-500 transition-all">
                <Smile className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip text="More tools">
              <button onClick={() => handleAction('Additional tools opened')} className="p-2 hover:bg-white rounded-lg text-gray-500 transition-all">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
        </div>
        <Tooltip text="Discard draft">
          <button onClick={onClose} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </Tooltip>
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
