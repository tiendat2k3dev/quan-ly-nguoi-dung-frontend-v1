import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./department.css";
import DateTypeFilter from "../../components/Department/DateType";
import DepartmentTable from "../../components/Department/Table";
import PaginationComponent from "../../components/Department/PaginationComponent";
import AddModal from "../../components/Modal/Department/AddModal";
import EditModal from "../../components/Modal/Department/EditModal";
import DeleteModal from "../../components/Modal/Department/DeleteModal";
import { 
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from "../../services/department";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Filter states
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    dateFrom: "",
    dateTo: ""
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Fetch departments từ API
  const fetchDepartments = async (page = 1, size = 10, filterParams = null) => {
    setLoading(true);
    try {
      // API sử dụng 0-based page (page=0 là trang đầu tiên)
      const apiPage = page - 1;
      
      // Tạo params cho API
      const params = {
        page: apiPage,
        size: size
      };

      // Thêm filter params nếu có
      if (filterParams) {
        if (filterParams.name) params.name = filterParams.name;
        if (filterParams.type) params.type = filterParams.type;
        if (filterParams.dateFrom) params.dateFrom = filterParams.dateFrom;
        if (filterParams.dateTo) params.dateTo = filterParams.dateTo;
      }

      // Gọi API
      const response = await getDepartments(params);
      
      // Xử lý response (tuỳ vào cấu trúc API)
      let departmentData = [];
      let totalElements = 0;

      if (response.content) {
        // Format: { content: [...], totalElements: 10 }
        departmentData = response.content;
        totalElements = response.totalElements || 0;
      } else if (Array.isArray(response)) {
        // Format: trực tiếp array
        departmentData = response;
        totalElements = response.length;
      } else if (response.data) {
        // Format: { data: { content: [...], totalElements: 10 } }
        departmentData = response.data.content || response.data;
        totalElements = response.data.totalElements || response.data.length || 0;
      }

      setDepartments(departmentData);
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: size,
        total: totalElements
      }));

      // Log để debug
      console.log('Departments loaded:', {
        total: totalElements,
        count: departmentData.length,
        hasFilters: !!filterParams
      });

    } catch (error) {
      console.error("Fetch departments error:", error);
      
      // Chỉ hiển thị toast error nếu là lỗi thật sự (không phải empty result)
      if (error.response?.status === 404) {
        // 404 có thể là không tìm thấy kết quả - không hiển thị error toast
        console.log('No departments found for current filters');
        setDepartments([]);
        setPagination(prev => ({
          ...prev,
          current: page,
          pageSize: size,
          total: 0
        }));
      } else {
        // Lỗi thật sự - hiển thị toast
        toast.error("Không thể tải danh sách phòng ban");
        setDepartments([]);
        setPagination(prev => ({
          ...prev,
          current: page,
          pageSize: size,
          total: 0
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  // Load data lần đầu
  useEffect(() => {
    fetchDepartments(1, 10, null);
  }, []);

  // Handle search/filter
  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
    fetchDepartments(1, pagination.pageSize, searchFilters);
  };

  // Clear filters
  const handleClearFilters = () => {
    const clearedFilters = {
      name: "",
      type: "",
      dateFrom: "",
      dateTo: ""
    };
    setFilters(clearedFilters);
    fetchDepartments(1, 10, null);
  };

  const handleAdd = async (values) => {
    try {
      // Gọi API tạo phòng ban
      await createDepartment({
        name: values.name,
        type: values.type
      });
      
      toast.success("Thêm phòng ban thành công!");
      setIsAddOpen(false);
      
      // Refresh danh sách
      fetchDepartments(pagination.current, pagination.pageSize, Object.values(filters).some(v => v) ? filters : null);
    } catch (error) {
      console.error("Create department error:", error);
      toast.error(error.response?.data?.message || "Không thể thêm phòng ban");
    }
  };

  const handleEdit = async (values, departmentId) => {
    try {
      const deptId = departmentId || selectedDepartment.id;
      
      // Gọi API cập nhật phòng ban
      await updateDepartment(deptId, {
        name: values.name,
        type: values.type
      });

      toast.success("Cập nhật phòng ban thành công!");
      setIsEditOpen(false);
      
      // Refresh danh sách
      fetchDepartments(pagination.current, pagination.pageSize, Object.values(filters).some(v => v) ? filters : null);
    } catch (error) {
      console.error("Update department error:", error);
      toast.error(error.response?.data?.message || "Không thể cập nhật phòng ban");
    }
  };

  const handleDelete = async () => {
    try {
      // Gọi API xóa phòng ban
      await deleteDepartment(selectedDepartment.id);
      
      toast.success("Xóa phòng ban thành công!");
      setIsDeleteOpen(false);
      
      // Refresh danh sách
      fetchDepartments(pagination.current, pagination.pageSize, Object.values(filters).some(v => v) ? filters : null);
    } catch (error) {
      console.error("Delete department error:", error);
      toast.error(error.response?.data?.message || "Không thể xóa phòng ban");
    }
  };

  const handlePageChange = (page, pageSize) => {
    const hasFilters = Object.values(filters).some(value => value !== "");
    fetchDepartments(page, pageSize, hasFilters ? filters : null);
  };

  return (
    <div className="department-container">
      <h2>DEPARTMENT LIST</h2>

      {/* Filter */}
      <DateTypeFilter 
        onAdd={() => setIsAddOpen(true)}
        onSearch={handleSearch}
        onClear={handleClearFilters}
        filters={filters}
      />

      {/* Table */}
      <div style={{ position: "relative" }}>
        <DepartmentTable
          filteredDepartments={departments}
          currentPage={pagination.current}
          pageSize={pagination.pageSize}
          onEdit={(dep) => {
            setSelectedDepartment(dep);
            setIsEditOpen(true);
          }}
          onDelete={(dep) => {
            setSelectedDepartment(dep);
            setIsDeleteOpen(true);
          }}
          loading={loading}
        />
      </div>

      {/* Pagination */}
      <PaginationComponent 
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={handlePageChange}
      />

      {/* Modals */}
      <AddModal
        open={isAddOpen}
        onCancel={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
      />

      <EditModal
        open={isEditOpen}
        data={selectedDepartment}
        onCancel={() => setIsEditOpen(false)}
        onSubmit={handleEdit}
      />

      <DeleteModal
        open={isDeleteOpen}
        departmentName={selectedDepartment?.name}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Department;