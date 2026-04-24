# User Management System (Frontend)

## Overview
A production-style React web application for managing users and departments with a role-based system (Admin, Manager, Employee).

### Demo
- **Frontend**: https://quan-ly-nguoi-dung-frontend-v1.vercel.app
- **Backend (local)**: http://localhost:8080/api

### Technical Highlights
- **Multi-role RBAC** with role-based permissions and page access.
- **AuthContext architecture** for centralized authentication state and token management.
- **Protected Routes** for secure route-level authorization.
- **Silent token refresh** to maintain stable user sessions.
- **Reusable UI and API patterns** for scalable CRUD workflows.

## Screenshots
### Login & Authentication
![Login](src/assets/images/login.png)
![Forgot Password](src/assets/images/quenmatkhau.png)
![Verification](src/assets/images/xacthucvadoimatkhau.png)

### Dashboard & Core Management
![Home](src/assets/images/home.png)
![Account Management](src/assets/images/account.png)
![Department Management](src/assets/images/department.png)

### UX Details & Edge Cases
![Update Profile](src/assets/images/capnhatthongtin.png)
![Change Password](src/assets/images/capnhatmatkhau.png)
![404 Page](src/assets/images/404.png)

## Tech Stack
- ReactJS (Hooks, Context API)
- React Router
- Axios
- Ant Design / Bootstrap
- JWT Authentication

## Key Features
- Authentication & Authorization (JWT)
- Protected Routes for private pages
- User Management CRUD (with pagination and filtering by role/department)
- Department Management CRUD
- Dynamic rendering from REST API
- Reusable component system
- Silent token refresh for session continuity

## My Contributions
- Designed and implemented reusable layout system (Header, Sidebar).
- Built authentication architecture with Context API (`AuthContext`).
- Implemented role-based route protection.
- Integrated RESTful APIs using Axios.
- Developed session persistence via automatic token refresh.

## Quick Setup
1. Clone repository and move into project folder.
2. Run `npm install`.
3. Run `npm run dev` (default: http://localhost:5173).
4. Start backend service at `http://localhost:8080/api`.

## Structure Code
src/
 ├── components/
 ├── pages/
 ├── services/   // API call
 ├── hooks/      // custom hooks
 ├── contexts/
 ├── utils/
 ├── layouts/
