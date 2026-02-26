import api from '../axiosInstance';
import { Email, LoadMailResponse, MailData, MailDetailResponse, EmailAccountsResponse } from '../../types';

export const mailService = {
  // Get all mails for a user
  getMails: async (userEmail: string): Promise<Email[]> => {
    const response = await api.get(`/api/emails/${userEmail}`);
    return response.data.map((m: any) => ({
      id: m.id.toString(),
      sender: m.sender_email.split('@')[0], // Mocking a sender name from email
      senderEmail: m.sender_email,
      subject: m.subject,
      content: m.content,
      timestamp: m.created_at,
      read: true, // DB doesn't have read status yet
      starred: false,
      folder: m.sender_email === userEmail ? 'sent' : 'inbox',
      avatar: `/images/ig_default.svg`
    }));
  },

  // Load emails by folder and page (New implementation)
  loadEmails: async (folderId: string, accountId: number | null, page: number = 0, keyword?: string): Promise<Email[]> => {
    try {
      const response = await api.get<LoadMailResponse>('/api/emails', {
        params: { folderId, accountId, page, keyword }
      });

      if (response.data.success && response.data.data) {
        return response.data.data.map((m: MailData) => ({
          id: `${accountId || 'all'}-${folderId}-${m.messageNumber}`,
          messageNumber: m.messageNumber,
          provider: m.provider,
          sender: m.sender,
          senderEmail: '', // API does not provide senderEmail in this list endpoint
          subject: m.subject,
          content: '', // API does not provide content in list endpoint
          timestamp: m.receivedAt,
          read: m.read,
          starred: false,
          folder: folderId,
          folderId: folderId,
          accountId: accountId || undefined,
          avatar: `/images/ig_default.svg`
        }));
      }
      return [];
    } catch (error) {
      console.error("Error loading mails:", error);
      throw error;
    }
  },

  // Get single mail detail
  getMailDetail: async (messageNumber: number, accountId: number, folderId: string): Promise<Email> => {
    try {
      const response = await api.get<MailDetailResponse>(`/api/emails/${messageNumber}`, {
        params: { accountId, folderId }
      });

      if (response.data.success && response.data.data) {
        const detail = response.data.data;
        return {
          id: `${detail.accountId}-${detail.messageNumber}`, // Unique ID for detail
          messageNumber: detail.messageNumber,
          sender: detail.from.name || detail.from.email,
          senderEmail: detail.from.email,
          subject: detail.subject,
          content: detail.body.content,
          contentType: detail.body.contentType,
          timestamp: detail.receivedAt,
          read: detail.read,
          starred: false,
          folder: (detail.folderId === 'INBOX' ? 'inbox' : detail.folderId.toLowerCase()) as any,
          avatar: `/images/ig_default.svg`,
          attachments: detail.attachments,
          receivers: detail.to.map(r => ({ name: r.name, email: r.email }))
        };
      }
      throw new Error("Failed to load mail detail");
    } catch (error) {
      console.error("Error fetching mail detail:", error);
      throw error;
    }
  },

  // Mark mail as read
  markAsRead: async (messageNumber: number, accountId: number, folderId: string): Promise<any> => {
    try {
      const response = await api.patch(`/api/emails/${messageNumber}/read`, null, {
        params: { accountId, folderId }
      });
      return response.data;
    } catch (error) {
      console.error("Error marking mail as read:", error);
      throw error;
    }
  },

  // Send a new mail
  sendMail: async (emailData: any): Promise<any> => {
    try {
      const formData = new FormData();

      const requestPayload = {
        accountId: emailData.accountId,
        receiver: emailData.to,
        email: {
          title: emailData.subject,
          body: emailData.content,
          important: emailData.important || false
        }
      };

      formData.append('request', JSON.stringify(requestPayload));

      if (emailData.attachments && emailData.attachments.length > 0) {
        emailData.attachments.forEach((file: File) => {
          formData.append('files', file);
        });
      }

      const response = await api.post('/api/emails', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error("Mail Send Error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a mail
  deleteMail: async (id: string): Promise<void> => {
    await api.delete(`/api/emails/${id}`);
  },

  // Star/Unstar a mail (Backend doesn't seem to have this yet, so we'll keep the mock/structure)
  toggleStar: async (id: string, starred: boolean): Promise<Email> => {
    const response = await api.patch(`/api/emails/${id}/star`, { starred });
    return response.data;
  },

  // Get connected email accounts
  getConnectedAccounts: async (): Promise<EmailAccountsResponse> => {
    const response = await api.get<EmailAccountsResponse>('/api/email-accounts');
    return response.data;
  },

  // Connect a new email account
  connectAccount: async (payload: any): Promise<any> => {
    const response = await api.post('/api/accounts', payload);
    return response.data;
  },

  // Disconnect an email account
  disconnectAccount: async (accountId: number): Promise<any> => {
    const response = await api.delete(`/api/accounts/${accountId}`);
    return response.data;
  }
};
