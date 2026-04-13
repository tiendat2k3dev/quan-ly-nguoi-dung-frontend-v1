// Modal popup để sửa tài khoản với form validation và pre-fill data
import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, Row, Col } from "antd";
import { toast } from "react-toastify";
import { getDepartments } from "../../../services/department";

const { Option } = Select;

const EditModal = ({ open, onCancel, onSubmit, loading, data }) => {
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  // Reset form khi modal đóng
  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  // Fetch departments khi modal mở
  useEffect(() => {
    if (open) {
      fetchDepartments();
    }
  }, [open]);

  // Set form values khi có data
  useEffect(() => {
    if (open && data) {
      console.log('Account EditModal received data:', data);
      
      // Xử lý departmentid - nếu là magic number thì set undefined
      const departmentid = (data.departmentid === 1073741824 || !data.departmentid) 
        ? undefined 
        : data.departmentid;

      // Delay một chút để đảm bảo form và departments đã load
      setTimeout(() => {
        form.setFieldsValue({
          username: data.username || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          role: data.role || '',
          departmentid: departmentid
        });

        console.log('Account form values set:', {
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          departmentid: departmentid
        });
      }, 200);
    }
  }, [open, data, form, departments]);

  const fetchDepartments = async () => {
    setLoadingDepts(true);
    try {
      const response = await getDepartments();
      const departmentsData = response.data || response;
      const deptList = departmentsData.content || (Array.isArray(departmentsData) ? departmentsData : []);
      
      setDepartments(deptList);
      console.log('Departments loaded:', deptList);
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
      console.log('EditModal submitting values:', values);
      
      const submitData = {
        ...values,
        departmentid: values.departmentid ? parseInt(values.departmentid, 10) : null
      };

      // Validate departmentid
      if (isNaN(submitData.departmentid) && submitData.departmentid !== null) {
        toast.error("Department ID không hợp lệ");
        return;
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('EditModal submit error:', error);
      
      // Xử lý lỗi từ API
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || "";
        
        if (errorMessage.toLowerCase().includes("username") && errorMessage.toLowerCase().includes("tồn tại")) {
          toast.error("Username đã tồn tại");
        } else {
          toast.error(errorMessage || "Có lỗi xảy ra khi cập nhật tài khoản");
        }
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật tài khoản");
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
      title="Sửa tài khoản"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
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
            Cập nhật tài khoản
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;