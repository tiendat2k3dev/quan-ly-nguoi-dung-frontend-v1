import { useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { forgotPassword } from "../../../services/auth";

const QuenmatkhauModal = ({ open, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await forgotPassword(values.email);
      
      // Nếu API thành công (email tồn tại)
      toast.success("Đã gửi mã OTP đến email của bạn thành công");
      
      // Đóng modal quên mật khẩu và mở modal xác thực
      onSubmit(values.email); // Truyền email sang modal xác thực
      form.resetFields(); // Clear email input
      
    } catch (error) {
      console.log("FORGOT PASSWORD ERROR:", error);
      
      // Xử lý lỗi - email không tồn tại
      let message = "Email không tồn tại";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data) {
        message = typeof error.response.data === 'string' 
          ? error.response.data 
          : "Email không tồn tại";
      }
      
      toast.error(message);
      // KHÔNG gọi onSubmit() - không mở modal Xacthuc
      
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields(); // Clear email khi đóng modal
    onClose();
  };

  return (
    <Modal
      title="QUÊN MẬT KHẨU"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={400}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
      >
        <Form.Item
          label="Nhập email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" }
          ]}
        >
          <Input 
            prefix={<MailOutlined />}
            placeholder="Nhập email của bạn"
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
            Gửi
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QuenmatkhauModal;
