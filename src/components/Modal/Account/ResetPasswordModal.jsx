import { useState } from "react";
import { Modal, Button, Alert } from "antd";
import { SyncOutlined } from "@ant-design/icons";

const ResetPasswordModal = ({ open, onCancel, onConfirm, username }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Reset password error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <span style={{ color: '#52c41a' }}>
          <SyncOutlined style={{ marginRight: 8 }} />
          Reset Password
        </span>
      }
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          Hủy
        </Button>,
        <Button 
          key="confirm" 
          type="primary" 
          onClick={handleConfirm}
          loading={loading}
          style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
        >
          Reset Password
        </Button>
      ]}
      width={450}
    >
      <p style={{ marginBottom: 16 }}>
        Bạn có chắc chắn muốn reset password cho tài khoản <strong>{username}</strong>?
      </p>

      <Alert
        message="Password sẽ được reset về mặc định. User cần đổi password khi đăng nhập lần tiếp theo."
        type="warning"
        showIcon
        style={{ marginBottom: 0 }}
      />
    </Modal>
  );
};

export default ResetPasswordModal;