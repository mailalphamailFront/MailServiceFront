import api from '../axiosInstance';
import { Email } from '../../types';

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
      avatar: `https://ui-avatars.com/api/?name=${m.sender_email}&background=random`
    }));
  },

  // Send a new mail
  sendMail: async (emailData: any): Promise<any> => {
    // Map frontend Email type to backend field names
    try {
      const payload = {
        sender_email: emailData.senderEmail,
        receiver_email: emailData.to,
        subject: emailData.subject,
        content: emailData.content,
        user_id: emailData.userId // this should be provided
      };
      const response = await api.post('/api/emails', payload);
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
  getConnectedAccounts: async (): Promise<any> => {
    const response = await api.get('/api/email-accounts');
    return response.data;
  },

  // Connect a new email account
  connectAccount: async (payload: any): Promise<any> => {
    const response = await api.post('/api/accounts', payload);
    return response.data;
  }
};
