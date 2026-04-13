import DepartmentRow from "./Row";

const DepartmentTable = ({ filteredDepartments, onEdit, onDelete, currentPage = 1, pageSize = 10, loading }) => {
  // Khai báo header giống AccountTable
  const headers = ["STT", "Name", "Total member", "Type", "Create date", "Actions"];
  
  return (
    <table className="department-table">
      <thead>
        <tr>
          {headers.map((item, index) => (
            <th key={index}>{item}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td colSpan={6} style={{ 
              textAlign: "center", 
              padding: "40px 20px",
              backgroundColor: '#fafafa',
              color: '#666'
            }}>
              <div className="spinner" style={{ marginBottom: '12px' }}></div>
              <div>Loading departments...</div>
            </td>
          </tr>
        ) : !Array.isArray(filteredDepartments) || filteredDepartments.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ 
              textAlign: "center", 
              padding: "40px 20px",
              backgroundColor: '#fafafa',
              color: '#666'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏢</div>
              <div style={{ fontWeight: '500', marginBottom: '4px' }}>Không tìm thấy phòng ban</div>
              <div style={{ fontSize: '14px' }}>Thử thay đổi bộ lọc hoặc tạo phòng ban mới</div>
            </td>
          </tr>
        ) : (
          filteredDepartments.map((dep, index) => (
            <DepartmentRow
              key={dep.id || index}
              dep={dep}
              stt={(currentPage - 1) * pageSize + index + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default DepartmentTable;
