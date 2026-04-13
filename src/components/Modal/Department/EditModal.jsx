// Modal popup để sửa phòng ban với form validation và pre-fill data
import { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { toast } from "react-toastify";

const { Option } = Select;

const EditModal = ({ open, onCancel, onSubmit, data, loading }) => {
  const [form] = Form.useForm();

  // Reset form khi modal đóng
  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  // Set form values khi có data
  useEffect(() => {
    if (open && data) {
      console.log('Department EditModal received data:', data);
      
      // Delay một chút để đảm bảo form đã render
      setTimeout(() => {
        form.setFieldsValue({
          name: data.name || "",
          type: data.type || ""
        });

        console.log('Department form values set:', {
          name: data.name,
          type: data.type
        });
      }, 100);
    }
  }, [open, data, form]);

  const handleSubmit = async (values) => {
    try {
      console.log('Department EditModal submitting:', values);
      
      // Truyền cả data.id để biết đang sửa department nào
      await onSubmit(values, data?.id);
    } catch (error) {
      console.error("Edit department error:", error);
      
      // Xử lý lỗi từ API
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || "";
        toast.error(errorMessage || "Có lỗi xảy ra khi cập nhật phòng ban");
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật phòng ban");
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
      title="Sửa phòng ban"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={500}
      centered
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
        preserve={false}
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
            Cập nhật phòng ban
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;