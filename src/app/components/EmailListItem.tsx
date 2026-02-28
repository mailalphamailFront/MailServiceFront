import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { Check } from 'lucide-react';
import { format, isToday, getYear } from 'date-fns';
import { Email } from '../types';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import '../styles.css';

interface EmailListItemProps {
  email: Email;
  onMarkRead: (id: string) => void;
  isSelected?: boolean;
  onToggleSelection?: () => void;
}

export function EmailListItem({ email, onMarkRead, isSelected, onToggleSelection }: EmailListItemProps) {
  const { t } = useTranslation();
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

  const handleToggleSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelection?.();
  };

  const date = new Date(email.timestamp);
  const now = new Date();

  let dateDisplay;
  if (isToday(date)) {
    dateDisplay = format(date, t('date.today_format', 'a h:mm'));
  } else if (getYear(date) !== getYear(now)) {
    dateDisplay = format(date, t('date.year_format', 'yyyy년 M월 d일'));
  } else {
    dateDisplay = format(date, t('date.default_format', 'M월 d일'));
  }

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "email-list-item-base border-l-4 transition-all duration-200",
        isSelected ? "bg-blue-50 border-l-blue-600 shadow-sm" : "border-l-transparent",
        isActive && !isSelected && "email-list-item-active",
        !email.read && !isSelected ? "bg-blue-50/40" : (isSelected ? "" : "bg-white")
      )}
    >
      <div className="flex items-start gap-3 w-full">
        <button
          onClick={handleToggleSelection}
          className={clsx(
            "shrink-0 mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all outline-none focus:ring-2 focus:ring-blue-400",
            isSelected
              ? "bg-blue-600 border-blue-600 text-white"
              : "bg-white border-gray-300 text-transparent hover:border-blue-400"
          )}
        >
          <Check className={clsx(
            "w-3.5 h-3.5 transition-transform",
            isSelected ? "scale-100" : "scale-0"
          )} strokeWidth={3} />
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
