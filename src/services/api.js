// Axios config với interceptors để auto-refresh token và handle 401 errors
import axios from 'axios';
import { refreshToken } from './auth';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Quan trọng: để gửi cookies (refresh token)
});
// Flag để tránh multiple refresh token calls
let isRefreshing = false;
let failedQueue = [];

// Function để handle auto logout
const handleAutoLogout = async () => {
  try {
    // Clear access token
    localStorage.removeItem('access_token');
    
    // Thử gọi logout API để clear refresh token cookie (optional)
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {}, {
        withCredentials: true
      });
    } catch (logoutError) {
      // Ignore logout API error, vẫn tiếp tục logout
      console.warn('Logout API failed during auto logout:', logoutError);
    }
    
    // Show notification (nếu có toast)
    if (typeof window !== 'undefined' && window.toast) {
      window.toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
    
    // Redirect về login
    window.location.href = '/';
  } catch (error) {
    console.error('Auto logout error:', error);
    // Fallback: vẫn redirect về login
    window.location.href = '/';
  }
};

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor để thêm token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để handle lỗi và refresh token
api.interceptors.response.use(
  (response) => {
    return response.data; // Trả về data thay vì response object
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Tránh infinite loop với refresh token endpoint
      if (originalRequest.url?.includes('/auth/refresh-token')) {
        console.error('❌ Refresh token endpoint returned 401 - refresh token expired');
        await handleAutoLogout();
        return Promise.reject(error);
      }
      
      if (isRefreshing) {
        // Nếu đang refresh, đợi trong queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API refresh token (refresh token sẽ được gửi tự động qua cookie)
        const response = await refreshToken();
        
        // Kiểm tra response format
        const accessToken = response.data?.accessToken || response.accessToken;
        
        if (!accessToken) {
          console.error('❌ No access token in refresh response:', response);
          throw new Error('No access token received from refresh endpoint');
        }
        
        // Lưu access token mới
        localStorage.setItem('access_token', accessToken);
        
        // Update header cho request gốc
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Process queue với token mới
        processQueue(null, accessToken);
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token cũng hết hạn hoặc invalid
        console.error('❌ Refresh token failed:', refreshError.response?.data || refreshError.message);
        
        processQueue(refreshError, null);
        
        // Auto logout khi refresh token thất bại
        await handleAutoLogout();
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
