// src/api/department.js
import api from "./api";

// Lấy danh sách phòng ban
export const getDepartments = (params = {}) => {
  return api.get("/department", { params });
};

// Tạo phòng ban mới
export const createDepartment = (data) => {
  return api.post("/department", data);
};

// Cập nhật phòng ban
export const updateDepartment = (id, data) => {
  return api.put(`/department/${id}`, data);
};

// Xóa phòng ban
export const deleteDepartment = (id) => {
  return api.delete(`/department/${id}`);
};

// Lấy chi tiết phòng ban
export const getDepartmentById = (id) => {
  return api.get(`/department/${id}`);
};