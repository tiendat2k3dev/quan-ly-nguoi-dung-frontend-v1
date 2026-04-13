import { useState, useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useAuth } from "../../../hooks/useAuth";
import api from "../../../services/api";

const UpdateProfileModal = ({ open, onClose }) => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Populate form với thông tin user hiện tại khi modal mở
  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || ""
      });
    }
  }, [open, user, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await api.put("/auth/profile", values);
      
      // Refresh user info từ AuthContext
      await refreshUser();
      
      toast.success("Cập nhật thông tin thành công!");
      onClose();
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);
      
      let message = "Có lỗi xảy ra, vui lòng thử lại";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data) {
        message = typeof error.response.data === 'string' 
          ? error.response.data 
          : "Cập nhật thất bại";
      }
      
      // Xử lý lỗi email trùng từ server
      if (message.toLowerCase().includes("email") && (message.toLowerCase().includes("tồn tại") || message.toLowerCase().includes("exist") || message.toLowerCase().includes("duplicate"))) {
        form.setFields([
          {
            name: 'email',
            errors: ['Email đã được sử dụng bởi tài khoản khác']
          }
        ]);
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      form.resetFields();
      onClose();
    }
  };

  return (
    <Modal
      title="Cập nhật thông tin cá nhân"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={450}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
      >
        <Form.Item
          label="Họ"
          name="firstName"
          rules={[
            { required: true, message: "Vui lòng nhập họ!" },
            { whitespace: true, message: "Họ không được để trống!" }
          ]}
        >
          <Input 
            prefix={<UserOutlined />}
            placeholder="Nhập họ"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Tên"
          name="lastName"
          rules={[
            { required: true, message: "Vui lòng nhập tên!" },
            { whitespace: true, message: "Tên không được để trống!" }
          ]}
        >
          <Input 
            prefix={<UserOutlined />}
            placeholder="Nhập tên"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" }
          ]}
        >
          <Input 
            prefix={<MailOutlined />}
            placeholder="example@email.com"
            size="large"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button 
            onClick={handleClose}
            disabled={loading}
            style={{ marginRight: 8 }}
          >
            Hủy
          </Button>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={loading}
          >
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateProfileModal;
