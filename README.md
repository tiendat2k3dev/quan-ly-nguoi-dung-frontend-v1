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

# Clone repository
git clone https://github.com/tiendat2k3dev/quan-ly-nguoi-dung-frontend-v1.git

# Enter project folder
cd quan-ly-nguoi-dung-frontend-v1

# Install dependencies
npm install

# Start development server
npm run dev

### Environment Variables

Create a `.env` file in the project root:
VITE_API_BASE_URL=http://localhost:8080/api
### Build for Production

npm run build

## Project Structure

quan-ly-nguoi-dung-frontend-v1/

├── .env                     # Environment variables

├── package.json

├── README.md

├── public/

└── src/
    
    ├── assets/             # Images, icons, static files
    ├── components/         # Reusable UI components
    ├── pages/              # Main application pages
    ├── services/           # API calls (auth, account, department)
    ├── hooks/              # Custom hooks (useAuth)
    ├── contexts/           # Global state / AuthContext
    ├── utils/              # Helper functions
    ├── layouts/            # Header / Sidebar layouts
    ├── App.jsx
    └── main.jsx
