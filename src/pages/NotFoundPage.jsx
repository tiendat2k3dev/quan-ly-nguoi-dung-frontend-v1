import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import "./notfound.css";

const LOTTIE_SRC =
  "https://lottie.host/73aa09e1-107a-4c02-97e0-4a1363ee2617/6kY83LrVEy.lottie";

const NotFoundPage = () => {
  const isLoggedIn = isAuthenticated();
  const location = useLocation();
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Nếu đã có thì khỏi load lại
    if (customElements.get("dotlottie-wc")) {
      // Sử dụng setTimeout để tránh setState đồng bộ trong effect
      setTimeout(() => setScriptLoaded(true), 0);
      return;
    }

    // Load script
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.11/dist/dotlottie-wc.js";
    script.type = "module";
    script.onload = () => setScriptLoaded(true);

    document.body.appendChild(script);
  }, []);

  return (
    <div className="notfound-wrapper">
      <div className="notfound-card">
        {/* 🎬 Lottie */}
        <div className="animation-box">
          {scriptLoaded ? (
            <dotlottie-wc
              src={LOTTIE_SRC}
              autoplay
              loop
              style={{ width: "260px", height: "260px" }}
            />
          ) : (
            <div className="fallback-text">404</div>
          )}
        </div>

        {/* 📝 Text */}
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Trang không tồn tại</h2>
        <p className="error-desc">
          Đường dẫn <code>{location.pathname}</code> không tồn tại hoặc đã bị xóa.
        </p>

        {/* 🔗 Buttons */}
        <div className="button-group">
          {isLoggedIn ? (
            <>
              <Link to="/home" className="btn primary">🏠 Trang chủ</Link>
              <Link to="/account" className="btn success">👤 Tài khoản</Link>
              <Link to="/department" className="btn purple">🏢 Phòng ban</Link>
            </>
          ) : (
            <Link to="/" className="btn primary">🔐 Quay về đăng nhập</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
