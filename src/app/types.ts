export interface Receiver {
  name: string;
  email: string;
}

export interface Email {
  id: string;
  messageNumber?: number;
  provider?: string;
  sender: string;
  senderEmail: string;
  subject: string;
  content: string;
  contentType?: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  folder: string;
  folderId?: string;
  avatar?: string;
  attachments?: any[];
  receivers?: Receiver[];
  to?: string;
  accountId?: number;
}

export const MOCK_EMAILS: Email[] = [
  {
    id: '1',
    sender: 'Figma Team',
    senderEmail: 'hello@figma.com',
    subject: 'Welcome to Figma Make!',
    content: 'Hi there! We are excited to have you on board. Start building amazing web applications today with Figma Make. If you have any questions, feel free to reach out.',
    timestamp: '2026-02-04T10:30:00Z',
    read: false,
    starred: true,
    folder: 'inbox',
    avatar: 'https://images.unsplash.com/photo-1701463387028-3947648f1337?q=80&w=100'
  },
  {
    id: '2',
    sender: 'Sarah Johnson',
    senderEmail: 'sarah.j@design.co',
    subject: 'Project Update: New Mail Service UI',
    content: 'Hey! I just finished the initial sketches for the new mail service dashboard. I think the minimalist approach we discussed will work perfectly. Let me know what you think of the attachment.',
    timestamp: '2026-02-04T09:15:00Z',
    read: true,
    starred: false,
    folder: 'inbox',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100'
  },
  {
    id: '3',
    sender: 'Support',
    senderEmail: 'support@cloudservice.io',
    subject: 'Your account security alert',
    content: 'We noticed a new login to your account from a Chrome browser on Windows. If this was you, you can ignore this email. If not, please change your password immediately.',
    timestamp: '2026-02-03T22:45:00Z',
    read: true,
    starred: false,
    folder: 'inbox',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100'
  },
  {
    id: '4',
    sender: 'Newsletter',
    senderEmail: 'daily@techinsights.com',
    subject: 'The Future of Web Development in 2026',
    content: 'Today we are exploring how AI and edge computing are transforming the way we build and deploy web applications. Read more about the latest trends and tools.',
    timestamp: '2026-02-03T08:00:00Z',
    read: false,
    starred: true,
    folder: 'inbox',
    avatar: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=100'
  },
  {
    id: '5',
    sender: 'Marketing Team',
    senderEmail: 'growth@startup.io',
    subject: 'Your Weekly Analytics Report',
    content: 'Great news! Your workspace engagement has increased by 15% this week. Check out the detailed breakdown in your dashboard.',
    timestamp: '2026-02-02T14:20:00Z',
    read: true,
    starred: false,
    folder: 'sent'
  },
  {
    id: '6',
    sender: 'GitHub',
    senderEmail: 'noreply@github.com',
    subject: '[GitHub] A first-party GitHub Action has been updated',
    content: 'Action "actions/checkout" has been updated to v4. This update includes security fixes and performance improvements.',
    timestamp: '2026-02-04T11:00:00Z',
    read: false,
    starred: false,
    folder: 'inbox',
    avatar: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=100'
  },
  {
    id: '7',
    sender: 'Slack Notifications',
    senderEmail: 'notifications@slack.com',
    subject: 'New message from David in #development',
    content: 'David: @Alex, did you get a chance to review the PR for the mail client router implementation?',
    timestamp: '2026-02-04T11:45:00Z',
    read: false,
    starred: true,
    folder: 'inbox',
    avatar: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=100'
  }
];

export interface EmailFolder {
  folderId: string;
  name: string;
  displayName?: string;
  type: string;
  unreadCount: number;
}

export interface EmailAccount {
  accountId: number;
  provider: string;
  accountEmail: string;
  folders: EmailFolder[];
}

export interface EmailAccountsResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    allInboxes: {
      name: string;
      type: string;
      unreadCount: number;
    } | null;
    accounts: EmailAccount[];
  } | null;
}

export interface MailData {
  subject: string;
  sender: string;
  receivedAt: string;
  provider: string;
  messageNumber: number;
  read: boolean;
}

export interface LoadMailResponse {
  success: boolean;
  code: string;
  message: string;
  data: MailData[];
}

export interface MailDetailData {
  accountId: number;
  folderId: string;
  messageNumber: number;
  subject: string;
  from: {
    name: string;
    email: string;
  };
  to: {
    name: string;
    email: string;
  }[];
  receivedAt: string;
  read: boolean;
  body: {
    contentType: string;
    content: string;
  };
  attachments: any[];
}

export interface MailDetailResponse {
  success: boolean;
  code: string;
  message: string;
  data: MailDetailData;
}
