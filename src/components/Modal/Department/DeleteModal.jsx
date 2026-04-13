import { Modal } from "antd";

const DeleteModal = ({ open, onCancel, onConfirm, loading, departmentName }) => {
  return (
    <Modal
      title="Xác nhận xóa"
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okType="danger"
      confirmLoading={loading}
    >
      <p>
        Bạn có chắc chắn muốn xóa phòng ban{" "}
        <b>{departmentName}</b> không?
      </p>
   
    </Modal>
  );
};

export default DeleteModal;
