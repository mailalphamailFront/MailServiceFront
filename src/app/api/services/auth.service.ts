import api from '../axiosInstance';

export const authService = {
  // Login an existing user

  login: async (credentials: any) => {
    const params = new URLSearchParams();
    // params.append('username', credentials.username);
    // params.append('password', credentials.password);

    const response = await api.post('/api/login', credentials, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  },

  // Register a new user
  register: async (userData: any) => {
    // server.js only expects email and password
    const response = await api.post('/api/users/register', {
      username: userData.email,
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
