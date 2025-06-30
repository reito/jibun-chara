import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// デバッグ用ログ
console.log('Auth API_BASE_URL:', API_BASE_URL);
console.log('Auth Environment:', import.meta.env.MODE);

interface RegistrationData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const createInvitation = async (tenantData: { name: string; slug: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/invitations`, { tenant: tenantData });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessages = error.response?.data?.errors || [];
      throw new Error(errorMessages.join('\n') || '招待リンクの生成に失敗しました');
    }
    throw error;
  }
};

export const registerUser = async (token: string, data: RegistrationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/registration`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || '登録に失敗しました');
    }
    throw error;
  }
};

export const loginUser = async (data: LoginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'ログインに失敗しました');
    }
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await axios.delete(`${API_BASE_URL}/auth/logout`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'ログアウトに失敗しました');
    }
    throw error;
  }
}; 