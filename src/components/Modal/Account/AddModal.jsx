// Modal popup để thêm tài khoản mới với form validation sử dụng Ant Design
import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, Row, Col } from "antd";
import { toast } from "react-toastify";
import { getDepartments } from "../../../services/department";
const { Option } = Select;
const AddModal = ({ open, onCancel, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  useEffect(() => {
    if (open) {
      fetchDepartments();
      form.resetFields();
    }
  }, [open, form]);

  const fetchDepartments = async () => {
    setLoadingDepts(true);
    try {
      const response = await getDepartments();
      const data = response.data || response;
      const departmentsData = data.content || (Array.isArray(data) ? data : []);
      setDepartments(departmentsData);
    } catch (error) {
      console.error("Fetch departments error:", error);
      toast.error("Không thể tải danh sách phòng ban");
      setDepartments([]);
    } finally {
      setLoadingDepts(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const submitData = {
        ...values,
        departmentid: values.departmentid ? parseInt(values.departmentid, 10) : null
      };
      
      // Validate departmentid không được NaN
      if (isNaN(submitData.departmentid) && submitData.departmentid !== null) {
        toast.error("Department ID không hợp lệ");
        return;
      }

      await onSubmit(submitData, form);
    } catch (error) {
      // Xử lý lỗi từ API
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || "";

        if (errorMessage.toLowerCase().includes("username") && errorMessage.toLowerCase().includes("tồn tại")) {
          toast.error("Username đã tồn tại");
        } else {
          toast.error(errorMessage || "Có lỗi xảy ra khi thêm tài khoản");
        }
      } else {
        toast.error("Có lỗi xảy ra khi thêm tài khoản");
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
      title="Thêm tài khoản mới"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: "Vui lòng nhập username!" },
            { whitespace: true, message: "Username không được để trống!" }
          ]}
        >
          <Input 
            placeholder="Nhập username"
            size="large"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Họ"
              name="lastName"
              rules={[
                { required: true, message: "Vui lòng nhập họ!" },
                { whitespace: true, message: "Họ không được để trống!" }
              ]}
            >
              <Input 
                placeholder="Nhập họ"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tên"
              name="firstName"
              rules={[
                { required: true, message: "Vui lòng nhập tên!" },
                { whitespace: true, message: "Tên không được để trống!" }
              ]}
            >
              <Input 
                placeholder="Nhập tên"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Role"
          name="role"
          rules={[
            { required: true, message: "Vui lòng chọn role!" }
          ]}
        >
          <Select 
            placeholder="Chọn role"
            size="large"
          >
            <Option value="ADMIN">Admin</Option>
            <Option value="MANAGER">Manager</Option>
            <Option value="EMPLOYEE">Employee</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Department"
          name="departmentid"
          rules={[
            { required: true, message: "Vui lòng chọn phòng ban!" }
          ]}
        >
          <Select 
            placeholder={loadingDepts ? "Loading departments..." : "Chọn phòng ban"}
            size="large"
            loading={loadingDepts}
            disabled={loadingDepts}
          >
            {departments.map((dept) => (
              <Option key={dept.id} value={dept.id}>
                {dept.name}
              </Option>
            ))}
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
            Thêm tài khoản
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddModal;
