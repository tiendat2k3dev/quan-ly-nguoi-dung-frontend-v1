import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./account.css";
import AddModal from "../../components/Modal/Account/AddModal";
import EditModal from "../../components/Modal/Account/EditModal";
import DeleteModal from "../../components/Modal/Account/DeleteModal";
import ResetPasswordModal from "../../components/Modal/Account/ResetPasswordModal";
import RoleDeptFilter from "../../components/Account/RoleDeptFilter";
import AccountTable from "../../components/Account/Table";
import PaginationComponent from "../../components/Account/PaginationComponent";
import { 
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  resetPasswordById
} from "../../services/account";
import { getDepartments } from "../../services/department";
const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState({}); // Cache departments: {id: name}
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  // Filter states
  const [filters, setFilters] = useState({
    username: "",
    firstName: "",

    lastName: "",
    role: "",
    departmentid: ""
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Load departments để tạo mapping id -> name
  const loadDepartments = async () => {
    try {
      const response = await getDepartments({ page: 0, size: 100 });
      const departmentMap = {};
      
      let deptList = [];
      if (response.content) {
        deptList = response.content;
      } else if (Array.isArray(response)) {
        deptList = response;
      } else if (response.data) {
        deptList = Array.isArray(response.data) ? response.data : response.data.content || [];
      }
      
      deptList.forEach(dept => {
        departmentMap[dept.id] = dept.name;
      });
      
      setDepartments(departmentMap);
    } catch (error) {
      console.error("Load departments error:", error);
    }
  };

  // Fetch accounts từ API
  const fetchAccounts = async (page = 1, size = 10, filterParams = null) => {
    setLoading(true);
    try {
      // API sử dụng 0-based page
      const apiPage = page - 1;
      
      // Tạo params cho API
      const params = {
        page: apiPage,
        size: size
      };

      // Thêm filter params nếu có
      if (filterParams) {
        if (filterParams.username) params.username = filterParams.username;
        if (filterParams.firstName) params.firstName = filterParams.firstName;
        if (filterParams.lastName) params.lastName = filterParams.lastName;
        if (filterParams.role) params.role = filterParams.role;
        if (filterParams.departmentid) {
          // Đảm bảo departmentid là số
          const deptId = parseInt(filterParams.departmentid);
          if (!isNaN(deptId)) {
            params.departmentid = deptId;
          }
        }
      }

      // Gọi API
      const response = await getAccounts(params);
      
      // Xử lý response
      let accountData = [];
      let totalElements = 0;

      if (response.content) {
        // Format: { content: [...], totalElements: 10 }
        accountData = response.content;
        totalElements = response.totalElements || 0;
      } else if (Array.isArray(response)) {
        // Format: trực tiếp array
        accountData = response;
        totalElements = response.length;
      } else if (response.data) {
        // Format: { data: { content: [...], totalElements: 10 } }
        accountData = response.data.content || response.data;
        totalElements = response.data.totalElements || response.data.length || 0;
      }
      
      // Process accounts with fullName - Họ + Tên (lastName + firstName)
      const processedAccounts = accountData.map(account => ({
        ...account,
        fullName: `${account.lastName || ''} ${account.firstName || ''}`.trim()
      }));
      
      setAccounts(processedAccounts);
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: size,
        total: totalElements
      }));

      // Log để debug
      console.log('Accounts loaded:', {
        total: totalElements,
        count: processedAccounts.length,
        hasFilters: !!filterParams
      });

    } catch (error) {
      console.error("Fetch accounts error:", error);
      
      // Chỉ hiển thị toast error nếu là lỗi thật sự (không phải empty result)
      if (error.response?.status === 404) {
        // 404 có thể là không tìm thấy kết quả - không hiển thị error toast
        console.log('No accounts found for current filters');
        setAccounts([]);
        setPagination(prev => ({
          ...prev,
          current: page,
          pageSize: size,
          total: 0
        }));
      } else {
        // Lỗi thật sự - hiển thị toast
        toast.error("Không thể tải danh sách tài khoản");
        setAccounts([]);
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
    const initializeData = async () => {
      // Load departments trước
      await loadDepartments();
      // Sau đó load accounts
      fetchAccounts(1, 10, null);
    };
    
    initializeData();
  }, []);

  // Function để refresh departments (gọi khi cần)
  const refreshDepartments = async () => {
    await loadDepartments();
  };

  // Handle search/filter
  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
    fetchAccounts(1, pagination.pageSize, searchFilters);
    // Refresh departments để đảm bảo mapping up-to-date
    refreshDepartments();
  };

  // Clear filters
  const handleClearFilters = () => {
    const clearedFilters = {
      username: "",
      firstName: "",
      lastName: "",
      role: "",
      departmentid: ""
    };
    setFilters(clearedFilters);
    fetchAccounts(1, 10, null);
  };

  const handleAdd = async (values, form) => {
    try {
      // Gọi API tạo tài khoản
      await createAccount({
        username: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role,
        departmentid: values.departmentid
      });
      
      toast.success("Thêm tài khoản thành công!");
      form.resetFields();
      setIsAddOpen(false);
      
      // Refresh danh sách
      fetchAccounts(pagination.current, pagination.pageSize, Object.values(filters).some(v => v) ? filters : null);
    } catch (error) {
      console.error("Create account error:", error);
      toast.error(error.response?.data?.message || "Không thể thêm tài khoản");
    }
  };

  const handleEdit = async (values) => {
    try {
      // Gọi API cập nhật tài khoản
      await updateAccount(selectedUser.id, {
        username: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role,
        departmentid: values.departmentid
      });

      toast.success("Cập nhật tài khoản thành công!");
      setIsEditOpen(false);
      
      // Refresh danh sách
      fetchAccounts(pagination.current, pagination.pageSize, Object.values(filters).some(v => v) ? filters : null);
    } catch (error) {
      console.error("Update account error:", error);
      toast.error(error.response?.data?.message || "Không thể cập nhật tài khoản");
    }
  };

  const handleDelete = async () => {
    try {
      // Gọi API xóa tài khoản
      await deleteAccount(selectedUser.id);
      
      toast.success("Xóa tài khoản thành công!");
      setIsDeleteOpen(false);
      
      // Refresh danh sách
      fetchAccounts(pagination.current, pagination.pageSize, Object.values(filters).some(v => v) ? filters : null);
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error(error.response?.data?.message || "Không thể xóa tài khoản");
    }
  };

  const handleResetPassword = async (account) => {
    setSelectedUser(account);
    setIsResetPasswordOpen(true);
  };

  const handleConfirmResetPassword = async () => {
    try {
      // Gọi API reset password
      await resetPasswordById(selectedUser.id);
      
      toast.success(`Reset password thành công cho tài khoản: ${selectedUser.username}`);
      setIsResetPasswordOpen(false);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error.response?.data?.message || "Không thể reset password");
    }
  };

  const handlePageChange = (page, pageSize) => {
    const hasFilters = Object.values(filters).some(value => value !== "");
    fetchAccounts(page, pageSize, hasFilters ? filters : null);
  };

  return (
    <div className="account-container">
      <h2>ACCOUNT LIST</h2>

      {/* Filter */}
      <RoleDeptFilter 
        onAdd={() => setIsAddOpen(true)}
        onSearch={handleSearch}
        onClear={handleClearFilters}
        filters={filters}
        departments={departments}
        loadingDepartments={false}
      />

      {/* Table */}
      <div style={{ position: "relative" }}>
        <AccountTable
          filteredAccounts={accounts}
          currentPage={pagination.current}
          pageSize={pagination.pageSize}
          departments={departments}
          onEdit={(acc) => {
            setSelectedUser(acc);
            setIsEditOpen(true);
          }}
          onDelete={(acc) => {
            setSelectedUser(acc);
            setIsDeleteOpen(true);
          }}
          onResetPassword={handleResetPassword}
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
        data={selectedUser}
        onCancel={() => setIsEditOpen(false)}
        onSubmit={handleEdit}
      />

      <DeleteModal
        open={isDeleteOpen}
        username={selectedUser?.username}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      <ResetPasswordModal
        open={isResetPasswordOpen}
        username={selectedUser?.username}
        onCancel={() => setIsResetPasswordOpen(false)}
        onConfirm={handleConfirmResetPassword}
      />
    </div>
  );
};

export default Account;