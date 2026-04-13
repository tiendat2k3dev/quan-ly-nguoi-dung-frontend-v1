// Main routing và layout chính của ứng dụng với protected routes
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Home from "./pages/Home/Home";
import Account from "./pages/Home/Account";
import Department from "./pages/Home/Department";
import MainLayout from "./layouts/MainLayout";
import NotFoundPage from "./pages/NotFoundPage";
import { AuthProvider, ProtectedRoute } from "./contexts";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Trang login - public */}
          <Route path="/" element={<Login />} />

          {/* Protected routes - cần đăng nhập */}
          <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/home" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/department" element={<Department />} />
          </Route>

          {/* 404 page - cho tất cả URL không hợp lệ */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;