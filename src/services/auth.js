// API calls cho authentication: login, logout, refresh token, change password
import api from "./api";
import axios from 'axios';

export const login = (username, password) => {
  return api.post("/auth/login", { username, password });
};
export const getMe = () => {
  return api.get("/auth/me");
};
export const updateUserProfile = (data) => {
  return api.put("/auth/profile", data);
};

export const changePassword = (oldPassword, newPassword) => {
  return api.post("/auth/change-password", { oldPassword, newPassword });
};

export const forgotPassword = (email) => {
  return api.post("/auth/forgot-password", { email });
};

export const resetPassword = (email, otp, newPassword) => {
  return api.post("/auth/reset-password", { email, otp, newPassword });
};

export const refreshToken = () => {
  // Tạo một axios instance riêng cho refresh token để tránh interceptor loop
  const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Để gửi cookies
  });
  
  // Không cần gửi refresh token trong body vì nó đã có trong cookie
  return refreshApi.post("/auth/refresh-token")
    .then(response => {
      return response.data; // Trả về data để consistent với api.js interceptor
    })
    .catch(error => {
      console.error('❌ Refresh API error:', error.response?.data || error.message);
      throw error;
    });
};

export const logout = () => {
  // Gọi API logout để server clear refresh token cookie
  return api.post("/auth/logout");
};
