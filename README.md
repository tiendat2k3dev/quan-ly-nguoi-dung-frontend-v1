# User Management System

[![Demo](https://img.shields.io/badge/-Live%20Demo-brightgreen)](https://quan-ly-nguoi-dung-frontend-v1.vercel.app/)

## Overview
User Management System - A frontend application for managing user accounts, departments, authentication, and updating user information
## Demo
- **Frontend**: [Live Demo](https://quan-ly-nguoi-dung-frontend-v1.vercel.app)
- **Backend**: http://localhost:8080/api (local development)
## Screenshots
### Login & Authentication

![Login](src/assets/images/login.png)
### Forgot Password  
![Forgot Password](src/assets/images/quenmatkhau.png)
### Verification & Password Reset
![Verification](src/assets/images/xacthucvadoimatkhau.png)

### Dashboard & Management

![Home](src/assets/images/home.png)
### Account Management
![Account Management](src/assets/images/account.png)
### Department Management
![Department Management](src/assets/images/department.png)

### Modals & Features
**Update Profile Modal**  
![Update Profile](src/assets/images/capnhatthongtin.png)
 **Change Password Modal**  

![Change Password](src/assets/images/capnhatmatkhau.png)
**404 Not Found Page** 
![404 Page](src/assets/images/404.png)

## Tech Stack
- ReactJS (Hooks, Context API)
- React Router
- Axios
- Ant Design / Bootstrap
- JWT Authentication

### Core Libraries
- **State Management**: React Context API
- **UI Components**: Ant Design, Bootstrap 5
- **Routing**: React Router DOM
- **API Client**: Axios
- **Notifications**: React Toastify
- **Icons**: FontAwesome, React Icons
- **Build Tool**: Vite

## Tính năng
- Quản lý tài khoản người dùng (CRUD, phân trang, lọc theo role/phòng ban).
- Quản lý phòng ban (CRUD).
- Xác thực (Đăng nhập, quên mật khẩu, xác minh).
- Cập nhật thông tin cá nhân & đổi mật khẩu.
- Protected routes (chặn truy cập khi chưa đăng nhập).
- Tự động refresh token (duy trì phiên đăng nhập).

## Vai trò của tôi
- Xây dựng giao diện responsive bằng React & Ant Design.
- Xây dựng hệ thống authentication bằng Context API.
- Implement auto refresh token (silent refresh).
- Tích hợp REST API bằng Axios cho user/department.
- Thiết kế modal cho các chức năng thêm/sửa/xoá/reset.
- Triển khai dự án lên Vercel (CI/CD)
