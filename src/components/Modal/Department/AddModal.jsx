// Modal popup để thêm phòng ban mới với form validation đơn giản
import { Modal, Form, Input, Select, Button } from "antd";
import { toast } from "react-toastify";

const { Option } = Select;

const AddModal = ({ open, onCancel, onSubmit, loading }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      console.log('Department AddModal submitting:', values);
      await onSubmit(values);
    } catch (error) {
      console.error('Department AddModal submit error:', error);
      
      // Xử lý lỗi từ API
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || "";
        toast.error(errorMessage || "Có lỗi xảy ra khi thêm phòng ban");
      } else {
        toast.error("Có lỗi xảy ra khi thêm phòng ban");
      }
    }
  };

  const handleClose = () => {
    if (!loading) {
      form.resetFields();
      onCancel();
    }
  };

  return (
    <Modal
      title="Thêm phòng ban mới"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={500}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
      >
        <Form.Item
          label="Tên phòng ban"
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập tên phòng ban!" },
            { whitespace: true, message: "Tên phòng ban không được để trống!" }
          ]}
        >
          <Input 
            placeholder="Nhập tên phòng ban"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Loại phòng ban"
          name="type"
          rules={[
            { required: true, message: "Vui lòng chọn loại phòng ban!" }
          ]}
        >
          <Select 
            placeholder="Chọn loại phòng ban"
            size="large"
          >
            <Option value="DEV">DEV</Option>
            <Option value="PM">PM</Option>
            <Option value="Scrum Master">Scrum Master</Option>
            <Option value="TES">TES</Option>
          </Select>
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
            Thêm phòng ban
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddModal;