// Utility functions for authentication
export const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  return !!token;
};

export const clearAuth = () => {
  localStorage.removeItem("access_token");
  // Không cần xóa refresh token vì nó được lưu trong cookie
  // Cookie sẽ tự động expire hoặc được clear bởi server
};

export const getToken = () => {
  return localStorage.getItem("access_token");
};

export const setTokens = (accessToken) => {
  localStorage.setItem("access_token", accessToken);
  // Refresh token được lưu trong cookie bởi server, không cần handle ở client
};

// 🆕 Helper functions cho Remember Me
export const saveCredentials = (username, password) => {
  localStorage.setItem('saved_username', username);
  localStorage.setItem('saved_password', password);
  localStorage.setItem('remember_me', 'true');
};

export const clearCredentials = () => {
  localStorage.removeItem('saved_username');
  localStorage.removeItem('saved_password');
  localStorage.removeItem('remember_me');
};

export const getSavedCredentials = () => {
  const savedUsername = localStorage.getItem('saved_username');
  const savedPassword = localStorage.getItem('saved_password');
  const shouldRemember = localStorage.getItem('remember_me') === 'true';
  
  return {
    username: savedUsername || '',
    password: savedPassword || '',
    shouldRemember
  };
};