import api from '../axiosInstance';

export const authService = {
  // Login an existing user
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Register a new user
  register: async (userData: any) => {
    // server.js only expects email and password
    const response = await api.post('/auth/signup', {
      email: userData.email,
      password: userData.password
    });
    return response.data;
  },

  // Check if email is already in use
  checkEmail: async (email: string) => {
    const response = await api.post('/api/users/checkEmail', { email });
    return response.data;
  },

  // Send verification code
  sendVerificationCode: async (email: string) => {
    const response = await api.post('/api/users/verification/send', { email });
    return response.data;
  },

  // Confirm verification code
  confirmVerificationCode: async (email: string, code: string) => {
    const response = await api.post('/api/users/verification/confirm', { email, code });
    return response.data;
  }
};
