import { useState, useMemo } from "react";
import "../../pages/Home/account.css";

// RoleDeptFilter component
// - onAdd: callback được gọi khi bấm nút "Create Account"
// - onSearch: callback dùng để thực hiện tìm kiếm
// - onClear: callback dùng để reset/clear toàn bộ filter
// - filters: giá trị filter hiện tại được truyền từ component cha
// - departments: object danh sách phòng ban dạng { id: name }
// - loadingDepartments: trạng thái loading danh sách phòng ban
const RoleDeptFilter = ({
  onAdd,
  onSearch,
  onClear,
  filters,
  departments = {},
  loadingDepartments = false
}) => {

  // localFilters là state filter cục bộ trong component.
  // Dùng để lưu giá trị người dùng nhập vào input/select
  // mà không gọi onSearch ngay lập tức, nhằm tránh gọi API liên tục.
  // Việc tìm kiếm chỉ xảy ra khi:
  // - Bấm nút Search
  // - Nhấn phím Enter
  // - Thay đổi dropdown role hoặc department
  const [localFilters, setLocalFilters] = useState({
    username: filters?.username || "",
    firstName: filters?.firstName || "",
    lastName: filters?.lastName || "",
    role: filters?.role || "",
    departmentid: filters?.departmentid || ""
  });
// Lưu filters trước đó để so sánh,
// tránh setState liên tục gây re-render vô hạn
const [prevFilters, setPrevFilters] = useState(filters);

// Chuyển departments từ object sang array để render select,
// useMemo giúp tối ưu, chỉ tính lại khi departments thay đổi
const departmentsList = useMemo(() =>
  Object.entries(departments).map(([id, name]) => ({
    id: parseInt(id),
    name
  })),
[departments]);
// Đồng bộ localFilters khi filters từ component cha thay đổi
// So sánh dữ liệu để tránh re-render không cần thiết
if (filters !== prevFilters) {
  setPrevFilters(filters);
  setLocalFilters(prev => {
    const next = {
      username: filters?.username || "",
      firstName: filters?.firstName || "",
      lastName: filters?.lastName || "",
      role: filters?.role || "",
      departmentid: filters?.departmentid || ""
    };

    return Object.keys(next).every(
      key => next[key] === prev[key]
    )
      ? prev
      : next;
  });
}

  const handleFilterChange = (field, value) => {
    const newFilters = {
      ...localFilters,
      [field]: value
    };
    setLocalFilters(newFilters);
    
    // Auto search khi thay đổi dropdown (role hoặc department)
    if (field === 'role' || field === 'departmentid') {
      if (onSearch) {
        onSearch(newFilters);
      }
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(localFilters);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="account-filter">
      {/* Search inputs */}
      <input
        type="text"
        placeholder="Search username..."
        value={localFilters.username}
        onChange={(e) => handleFilterChange('username', e.target.value)}
        onKeyDown={handleKeyPress}
        style={{
          padding: "8px 12px",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          marginRight: "10px"
        }}
      />

      <input
        type="text"
        placeholder="Tìm theo họ..."
        value={localFilters.lastName}
        onChange={(e) => handleFilterChange('lastName', e.target.value)}
        onKeyDown={handleKeyPress}
        style={{
          padding: "8px 12px",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          marginRight: "10px"
        }}
      />

      <input
        type="text"
        placeholder="Tìm theo tên..."
        value={localFilters.firstName}
        onChange={(e) => handleFilterChange('firstName', e.target.value)}
        onKeyDown={handleKeyPress}
        style={{
          padding: "8px 12px",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          marginRight: "10px"
        }}
      />

      {/* Filter selects */}
      <select
        value={localFilters.role}
        onChange={(e) => handleFilterChange('role', e.target.value)}
        style={{ marginRight: "10px" }}
      >
        <option value="">Role</option>
        <option value="ADMIN">Admin</option>
        <option value="MANAGER">Manager</option>
        <option value="EMPLOYEE">Employee</option>
      </select>

      <select
        value={localFilters.departmentid}
        onChange={(e) => handleFilterChange('departmentid', e.target.value)}
        disabled={loadingDepartments}
        style={{ marginRight: "10px" }}
      >
        <option value="">
          {loadingDepartments ? "Loading departments..." : "Department"}
        </option>
        {departmentsList.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </select>

      {/* Action buttons */}
      <button
        className="btn-search"
        onClick={handleSearch}
        style={{
          padding: "8px 16px",
          marginRight: "10px",
          border: "1px solid #1890ff",
          background: "#1890ff",
          color: "white",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Search
      </button>

      <button
        className="btn-clear"
        onClick={onClear}
        style={{
          padding: "8px 16px",
          marginRight: "10px",
          border: "1px solid #d9d9d9",
          background: "white",
          color: "#666",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Clear
      </button>

      {/* Create button - sẽ tự nhảy sang phải nhờ CSS margin-left: auto */}
      <button className="btn-create" onClick={onAdd}>
        + Create Account
      </button>
    </div>
  );
};

export default RoleDeptFilter;