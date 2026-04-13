// Trang đăng nhập với form validation và remember me functionality
import { useState, useEffect } from "react";                    // Hook quản lý state và side effect
import { useNavigate } from "react-router-dom";                 // Hook điều hướng trang
import "./login.css";                                           // CSS styling cho trang login
import { toast } from "react-toastify";                         // Thông báo thành công hay thất bại
import { Form, Input, Button, Checkbox } from "antd";           // Ant Design components
import { login as loginAPI } from "../../services/auth";        // API gọi server để đăng nhập
import { isAuthenticated, setTokens, saveCredentials, clearCredentials, getSavedCredentials } from "../../utils/auth";  // Auth utilities
import { useAuth } from "../../hooks/useAuth";                  // Context quản lý state user
import QuenmatkhauModal from "../../components/Modal/login/QuenmatkhauModal"; // Modal nhập email quên mật khẩu
import Xacthuc from "../../components/Modal/login/Xacthuc";     // Modal xác thực OTP + đổi mật khẩu
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'; // Ant Design icons

function Login() {
  const navigate = useNavigate();                               // Hook để chuyển hướng trang
  const { login } = useAuth();                                  // Function từ context để update state sau khi login
  const [form] = Form.useForm();                                // Ant Design form instance - quản lý state form tự động

  // 🔐 State quản lý Form đăng nhập
  const [rememberMe, setRememberMe] = useState(false);          // Checkbox "Ghi nhớ đăng nhập" - lưu username/password để tự động điền lần sau
  
  // ⚡ State quản lý UI và Validation
  const [loading, setLoading] = useState(false);                // Hiển thị loading khi đang submit form

  // 🪟 State quản lý Modal quên mật khẩu
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false); // Điều khiển modal nhập email
  const [verificationOpen, setVerificationOpen] = useState(false);     // Điều khiển modal xác thực OTP
  const [resetEmail, setResetEmail] = useState("");                    // Lưu email để reset password

  // 🔄 useEffect - Chạy khi component mount (load lần đầu)
  useEffect(() => {
    // Kiểm tra nếu đã đăng nhập thì chuyển về trang chính
    if (isAuthenticated()) {                                    // Kiểm tra có token trong localStorage
      navigate("/home");                                        // Redirect về trang home
    }
    
    // 📖 Load saved credentials nếu có
    const { username, password, shouldRemember } = getSavedCredentials(); // Helper function lấy thông tin đã lưu
    
    if (shouldRemember) {
      // Nếu user đã check "Ghi nhớ" lần trước → Khôi phục thông tin đã lưu
      form.setFieldsValue({ username, password });             // Điền thông tin vào form
      setRememberMe(true);                                      // Check lại checkbox "Ghi nhớ"
    }
  }, [navigate, form]);                                         // Dependencies: chạy lại khi navigate hoặc form thay đổi

  // 📝 Xử lý submit form đăng nhập
  const handleSubmit = async (values) => {                     // values = {username: "...", password: "..."} từ Ant Design Form
    setLoading(true);                                           // Bật loading state
    try {
      // 1️⃣ Gọi API đăng nhập với username/password
      const res = await loginAPI(values.username, values.password); // Gọi API POST /auth/login
      // 2️⃣ Lấy access token từ response (refresh token tự động lưu trong cookie)
      const accessToken = res.data?.accessToken || res.accessToken || res.access_token; // Lấy token từ nhiều format khác nhau

      if (accessToken) {
        // 3️⃣ Lưu access token vào localStorage
        setTokens(accessToken);                                 // Lưu token để dùng cho các API call sau

        // 4️⃣ Xử lý Remember Me - lưu hoặc xóa credentials
        rememberMe ? saveCredentials(values.username, values.password) : clearCredentials(); // Helper functions xử lý Remember Me

        // 5️⃣ Update context state + bắt đầu auto-refresh + theo dõi hoạt động
        await login();                                          // Gọi function từ AuthContext để update user state
        
        toast.success("Đăng nhập thành công 🎉");               // Hiển thị thông báo thành công
        navigate("/home");                                      // Chuyển hướng về trang chính
      } else {
        toast.error("Không nhận được token từ server");         // Lỗi: server không trả token
      }
    } catch (err) {
      // 🚨 Xử lý lỗi đăng nhập
      let message = "Không thể đăng nhập, vui lòng thử lại";    // Message mặc định

      if (err.response) {
        // Lỗi từ server (400, 401, 500...)
        const errorData = err.response.data;
        message =
          typeof errorData === "string"
            ? errorData                                         // Server trả string
            : errorData?.message || `Lỗi ${err.response.status}`; // Server trả object
      } else if (err.request) {
        // Lỗi network (không kết nối được server)
        message = "Không thể kết nối tới server";
      }

      toast.error(message);                                     // Hiển thị thông báo lỗi
    } finally {
      setLoading(false);                                        // Tắt loading state (dù thành công hay thất bại)
    }
  };

  return (
    <div className="login-container">
      {/* Form đăng nhập chính với Ant Design */}
      <div className="login-box">
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Đăng nhập</h2>
        
        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
        >
          {/* Input Username */}
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: 'Vui lòng nhập username!' },
              { whitespace: true, message: 'Username không được để trống!' }
            ]}
          >
            <Input 
              placeholder="Nhập username"
            />
          </Form.Item>

          {/* Input Password với toggle hiện/ẩn */}
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' }
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          {/* Row chứa checkbox và link quên mật khẩu */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            {/* Checkbox Remember Me - bên trái */}
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            >
              Ghi nhớ đăng nhập
            </Checkbox>

            {/* Link quên mật khẩu - bên phải */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setForgotPasswordOpen(true);  // Mở modal quên mật khẩu
              }}
              style={{
                fontSize: '14px',
                color: '#1890ff'
              }}
            >
              Quên mật khẩu?
            </a>
          </div>

          {/* Button submit */}
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </Form.Item>
        </Form>
      </div>
      {/* 🪟 Modal quên mật khẩu - Bước 1: Nhập email */}
      <QuenmatkhauModal
        open={forgotPasswordOpen}                    // Props điều khiển hiện/ẩn modal (true/false)
        onClose={() => setForgotPasswordOpen(false)} // Function đóng modal khi user click X hoặc outside
        onSubmit={(email) => {                       // Function xử lý khi user nhập email và submit
          setResetEmail(email);                      // Lưu email vào state để truyền sang modal tiếp theo
          setForgotPasswordOpen(false);              // Đóng modal hiện tại (bước 1)
          setVerificationOpen(true);                 // Mở modal xác thực OTP (bước 2)
        }}
      />

      {/* 🔐 Modal xác thực OTP - Bước 2: Nhập OTP + đổi mật khẩu mới */}
      <Xacthuc
        open={verificationOpen}                      // Props điều khiển hiện/ẩn modal (true/false)
        onClose={() => {                             // Function đóng modal và reset state
          setVerificationOpen(false);                // Đóng modal xác thực
          setResetEmail("");                         // Xóa email đã lưu (reset state)
        }}
        email={resetEmail}                           // Truyền email từ bước 1 để hiển thị trong modal
      />
    </div>
  );
}

export default Login;