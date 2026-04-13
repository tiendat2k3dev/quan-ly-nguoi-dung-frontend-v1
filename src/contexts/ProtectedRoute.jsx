// Component bảo vệ routes yêu cầu authentication, redirect về login nếu chưa đăng nhập
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  // Đang loading thì hiển thị loading
  if (loading) {
    return <div>Loading...</div>;
  }
  // Chưa đăng nhập thì redirect về login
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }  
  return children;
};
export default ProtectedRoute;