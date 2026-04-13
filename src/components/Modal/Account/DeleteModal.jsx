import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const DeleteModal = ({ open, onCancel, onConfirm, username, loading }) => {
  return (
    <Modal
      title={
        <span style={{ color: '#ff4d4f' }}>
          <ExclamationCircleOutlined style={{ marginRight: 8 }} />
          Xóa tài khoản
        </span>
      }
      open={open}
      onCancel={onCancel}
      onOk={onConfirm}
      okType="danger"
      okText={loading ? "Đang xóa..." : "Xóa"}
      cancelText="Hủy"
      confirmLoading={loading}
      width={400}
    >
      <p>Bạn có chắc chắn muốn xóa tài khoản <strong>{username}</strong> không?</p>
      <p style={{ color: '#ff4d4f', fontSize: '14px', margin: '8px 0 0 0' }}>
        Hành động này không thể hoàn tác!
      </p>
    </Modal>
  );
};

export default DeleteModal;
