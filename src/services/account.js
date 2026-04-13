// API calls cho quản lý tài khoản: CRUD operations và reset password
// src/api/account.js
import api from "./api";

// Lấy danh sách tài khoản
export const getAccounts = (params = {}) => {
  // Đảm bảo luôn có page và size nếu chưa có
  const finalParams = {
    page: 0,
    size: 10,
    ...(params || {})
  };

  return api.get("/account", { params: finalParams });
};

// Tạo tài khoản mới
export const createAccount = (data) => {
  return api.post("/account", data);
};

// Cập nhật tài khoản
export const updateAccount = (id, data) => {
  return api.put(`/account/${id}`, data);
};

// Xóa tài khoản
export const deleteAccount = (id) => {
  return api.delete(`/account/${id}`);
};

// Lấy chi tiết tài khoản
export const getAccountById = (id) => {
  return api.get(`/account/${id}`);
};

// Đổi mật khẩu
export const changePassword = (data) => {
  return api.post("/account/change-password", data);
};

// Cập nhật profile
export const updateProfile = (data) => {
  return api.put("/account/profile", data);
};

// Reset password by ID
export const resetPasswordById = (id) => {
  return api.post(`/auth/${id}`);
};