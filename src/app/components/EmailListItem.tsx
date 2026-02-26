import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { Star } from 'lucide-react';
import { format, isToday, getYear } from 'date-fns';
import { Email } from '../types';
import { clsx } from 'clsx';
import '../styles.css';

interface EmailListItemProps {
  email: Email;
  onToggleStar: (id: string) => void;
  onMarkRead: (id: string) => void;
}

export function EmailListItem({ email, onToggleStar, onMarkRead }: EmailListItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isActive = id === email.messageNumber?.toString();

  const handleClick = () => {
    // Navigate to email detail relative to current list view
    if (!email.messageNumber) return;
    if (id === email.messageNumber.toString()) return;

    // If we're already in a detail view of another email, go up one level first
    const basePath = id ? location.pathname.split('/').slice(0, -1).join('/') : location.pathname;
    navigate(`${basePath}/${email.messageNumber}${location.search}`);

    if (!email.read) {
      onMarkRead(email.id);
    }
  };

  const handleToggleStar = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleStar(email.id);
  };

  const date = new Date(email.timestamp);
  const now = new Date();

  let dateDisplay;
  if (isToday(date)) {
    dateDisplay = format(date, 'h:mm a');
  } else if (getYear(date) !== getYear(now)) {
    dateDisplay = format(date, 'MMM d, yyyy');
  } else {
    dateDisplay = format(date, 'MMM d');
  }

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "email-list-item-base",
        isActive && "email-list-item-active",
        !email.read ? "bg-blue-50/40" : "bg-white"
      )}
    >
      <div className="flex items-start gap-3 w-full">
        <button
          onClick={handleToggleStar}
          className="shrink-0 mt-0.5 outline-none focus:ring-2 focus:ring-yellow-400 rounded-sm"
        >
          <Star className={clsx(
            "w-4 h-4 transition-colors",
            email.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-gray-400"
          )} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className={clsx(
              "text-sm truncate transition-all",
              !email.read ? "font-bold text-gray-900" : "font-normal text-gray-500",
              isActive ? "text-blue-700" : ""
            )}>
              {email.sender}
            </span>
            <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">
              {dateDisplay}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mb-1">
            {!email.read && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0"></div>}
            <h4 className={clsx(
              "text-sm truncate transition-all",
              !email.read ? "font-bold text-gray-900" : "font-normal text-gray-600"
            )}>
              {email.subject}
            </h4>
          </div>

          <p className={clsx(
            "text-xs line-clamp-2 leading-relaxed transition-all",
            !email.read ? "text-gray-600 font-medium" : "text-gray-400 font-normal"
          )}>
            {email.content}
          </p>
        </div>
      </div>
    </div>
  );
}
