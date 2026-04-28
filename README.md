# User Management System (Frontend)

## Overview
A production-style React web application for managing users and departments with a role-based system (Admin, Manager, Employee).

### Live Demo
https://quan-ly-nguoi-dung-frontend-v1.vercel.app


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
ReactJS (Hooks, Context API)
React Router (Protected Routes)
Axios (REST API Integration)
Ant Design / Bootstrap
JWT Authentication
Vercel (Deployment & CI/CD)

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

## Challenges & Solutions

- Managing authentication state across pages  
  → Solved using Context API (`AuthContext`) for global state management  

- Handling protected routes by role  
  → Implemented route guards for RBAC access control  

- Avoiding duplicated UI logic  
  → Built reusable components (`Table`, `Modal`, `Form`)

## Installation

```bash
# Clone repository
git clone https://github.com/tiendat2k3dev/quan-ly-nguoi-dung-frontend-v1.git

# Enter project folder
cd quan-ly-nguoi-dung-frontend-v1

# Install dependencies
npm install
### Environment Variables

Create a `.env` file in the project root:

``` .env
VITE_API_BASE_URL=http://localhost:8080/api

npm run dev
```

## Project Structure
```text
exam-prep-frontend/
├── .env                     # Environment variables
├── package.json
├── README.md
├── public/
└── src/
    ├── assets/             # Images, icons, static files
    ├── components/         # Reusable UI components
    ├── pages/              # Main application pages
    ├── services/           # API calls
    ├── hooks/              # Custom hooks
    ├── context/            # Global state / AuthContext
    ├── route/              # Route-level guards and navigation flow
    ├── layouts/            # Header / Sidebar layouts
    ├── App.jsx
    └── main.jsx
```
## Notes

- This project is a personal project.  
- My main responsibility: Frontend development & integration

## Related Repositories

- Backend: https://github.com/tiendat2k3dev/quan-ly-nguoi-dung-backend-v1  
- Frontend (this repo): https://github.com/tiendat2k3dev/quan-ly-nguoi-dung-frontend-v1
