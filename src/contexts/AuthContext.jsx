// Context quản lý authentication, auto-refresh token và activity tracking
import { createContext, useState, useEffect, useRef } from 'react';
import { getMe, logout as logoutAPI, refreshToken } from '../services/auth';
import { isAuthenticated, clearAuth } from '../utils/auth';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Refs for auto-refresh functionality
  const refreshIntervalRef = useRef(null);
  const isRefreshingRef = useRef(false);

  // Auto refresh token every 50 minutes (before 1h expiry)
  const startAutoRefresh = () => {
    // Clear existing interval
    stopAutoRefresh();
    
    // Set interval to refresh every 50 minutes (3000000ms)
    refreshIntervalRef.current = setInterval(async () => {
      await silentRefresh();
    }, 50 * 60 * 1000); // 50 minutes
    
    console.log('🔄 Auto refresh token started (every 50 minutes)');
  };

  // Stop auto refresh
  const stopAutoRefresh = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
      console.log('⏹️ Auto refresh token stopped');
    }
  };

  // Silent refresh token (không làm gián đoạn user)
  const silentRefresh = async () => {
    if (isRefreshingRef.current) {
      console.log('🔄 Refresh already in progress, skipping...');
      return;
    }

    try {
      isRefreshingRef.current = true;
      console.log('🔄 Silent refresh token...');
      
      const response = await refreshToken();
      const accessToken = response.data?.accessToken || response.accessToken;
      
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        console.log('✅ Silent refresh successful');
      } else {
        console.warn('⚠️ No access token in silent refresh response');
      }
    } catch (error) {
      console.error('❌ Silent refresh failed:', error);
      // Không logout ngay, để user tiếp tục sử dụng với token hiện tại
      // Chỉ logout khi user thực hiện action và token thực sự hết hạn
    } finally {
      isRefreshingRef.current = false;
    }
  };

  // Gọi API /auth/me để lấy thông tin user
  const fetchUserInfo = async () => {
    if (!isAuthenticated()) {
      setLoading(false);
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await getMe(); // API /auth/me
      const userData = response.data;
      
      // Tạo fullname từ lastName + firstName (Họ + Tên)
      const fullname = `${userData.lastName} ${userData.firstName}`.trim();
      
      setUser({
        ...userData,
        fullname
      });
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      setUser(null);
      setIsLoggedIn(false);
      // Nếu API lỗi, có thể token hết hạn - clearAuth sẽ xóa access token
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  // Login - gọi sau khi login thành công
  const login = async () => {
    await fetchUserInfo();
    
    // Start auto refresh sau khi login
    startAutoRefresh();
  };

  // Logout - clear tất cả thông tin và gọi API logout
  const logout = async () => {
    try {
      // Stop auto refresh
      stopAutoRefresh();
      
      // Gọi API logout để server clear refresh token cookie
      await logoutAPI();
    } catch (error) {
      console.error('Logout API error:', error);
      // Vẫn tiếp tục logout ở client dù API lỗi
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      clearAuth(); // Xóa access token
      
      // Kiểm tra Remember Me - chỉ xóa credentials nếu user không check "Ghi nhớ"
      const shouldRemember = localStorage.getItem('remember_me') === 'true';
      if (!shouldRemember) {
        // User không check "Ghi nhớ" → Xóa hết thông tin đăng nhập
        localStorage.removeItem('saved_username');
        localStorage.removeItem('saved_password');
      }
      // Nếu shouldRemember = true → Giữ nguyên saved_username và saved_password
    }
  };

  // Refresh user info
  const refreshUser = async () => {
    setLoading(true);
    await fetchUserInfo();
  };

  useEffect(() => {
    fetchUserInfo();
    
    // Nếu đã login thì start auto refresh
    if (isAuthenticated()) {
      startAutoRefresh();
    }

    // Cleanup function
    return () => {
      stopAutoRefresh();
    };
  }, []);

  const value = {
    user,
    loading,
    isLoggedIn,
    login,
    logout,
    refreshUser,
    fetchUserInfo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};