// Header component với user menu, profile dropdown và logout functionality
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import UpdateProfileModal from "../components/Modal/Herader/UpdateProfileModal";
import ChangePasswordModal from "../components/Modal/Herader/ChangePasswordModal";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [updateProfileOpen, setUpdateProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const handleLogout = () => {
    // Logout từ AuthContext (sẽ clear token và user info)
    logout();
    setOpen(false);
    navigate("/"); 
  };

  const handleUpdateProfile = () => {
    setOpen(false);
    setUpdateProfileOpen(true);
  };

  const handleChangePassword = () => {
    setOpen(false);
    setChangePasswordOpen(true);
  };

  return (
    <header
      style={{
        margin: 0,
        padding: "0 20px",
        height: 60,
        background: "#1976d2",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <h3 style={{ margin: 0 }}>My Admin</h3>

      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10 }}>
        {loading ? (
          <span>Loading...</span>
        ) : (
          <span>Hello {user?.fullname || 'User'} 👋</span>
        )}

        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="user"
          onClick={() => setOpen(!open)}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            cursor: "pointer",
            border: "2px solid #fff",
          }}
        />

        {open && (
          <div
            style={{
              position: "absolute",
              top: 50,
              right: 0,
              width: 180,
              background: "#fff",
              color: "#333",
              borderRadius: 6,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              overflow: "hidden",
              zIndex: 1000,
            }}
          >
            <div style={itemStyle} onClick={handleUpdateProfile}>Cập nhật thông tin</div>
            <div style={itemStyle} onClick={handleChangePassword}>Đổi mật khẩu</div>
            <div style={{ height: 1, background: "#eee" }} />
            <div
              style={{ ...itemStyle, color: "red" }}
              onClick={handleLogout}
            >
              Đăng xuất
            </div>
          </div>
        )}
      </div>

      <UpdateProfileModal
        open={updateProfileOpen}
        onClose={() => setUpdateProfileOpen(false)}
      />

      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </header>
  );
};

const itemStyle = {
  padding: "10px 14px",
  cursor: "pointer",
};

export default Header;
