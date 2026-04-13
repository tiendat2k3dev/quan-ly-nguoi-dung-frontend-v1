import { useState } from "react";
import { Modal, Form, Input, Button, Typography } from "antd";
import { LockOutlined, SafetyOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { resetPassword } from "../../../services/auth";

const { Text } = Typography;

const Xacthuc = ({ open, onClose, email }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await resetPassword(email, values.otp, values.newPassword);
      toast.success("Đổi mật khẩu thành công");

      form.resetFields();
      onClose();
    } catch (error) {
      let message = "Có lỗi xảy ra, vui lòng thử lại";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="XÁC THỰC & ĐỔI MẬT KHẨU"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={450}
      destroyOnClose
    >
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Nhập mã OTP đã gửi đến email: <Text strong>{email}</Text>
      </Text>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
      >
        <Form.Item
          label="Mã OTP (6 ký tự)"
          name="otp"
          rules={[
            { required: true, message: "Vui lòng nhập mã OTP!" },
            { len: 6, message: "Mã OTP phải có 6 ký tự!" },
            { pattern: /^\d+$/, message: "Mã OTP chỉ được chứa số!" }
          ]}
        >
          <Input 
            prefix={<SafetyOutlined />}
            placeholder="Nhập mã OTP"
            maxLength={6}
            size="large"
            style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '4px' }}
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu mới"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Nhập lại mật khẩu mới"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: "Vui lòng nhập lại mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Hai mật khẩu không trùng khớp!'));
              },
            }),
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />}
            placeholder="Nhập lại mật khẩu mới"
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
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Xacthuc;
