import AccountRow from "./Row";

const AccountTable = ({ filteredAccounts, onEdit, onDelete, onResetPassword, currentPage = 1, pageSize = 10, loading, departments = {} }) => {
  console.log('AccountTable props:', { onResetPassword: !!onResetPassword });
  
  // Header configuration
  const headers = [
    { label: "STT", width: "50px" },
    { label: "Username", width: "150px" },
    { label: "Họ và tên đầy đủ", width: "180px" },
    { label: "Role", width: "100px" },
    { label: "Department", width: "120px" },
    { label: "Actions", width: "120px" }
  ];

  return (
    <div className="table-wrapper">
      <table className="account-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} style={{ width: header.width }}>
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                backgroundColor: '#fafafa',
                color: '#666'
              }}>
                <div className="spinner" style={{ marginBottom: '12px' }}></div>
                <div>Loading accounts...</div>
              </td>
            </tr>
          ) : !Array.isArray(filteredAccounts) || filteredAccounts.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                backgroundColor: '#fafafa',
                color: '#666'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                <div style={{ fontWeight: '500', marginBottom: '4px', color: '#333' }}>Không tìm thấy tài khoản</div>
                <div style={{ fontSize: '14px' }}>Thử thay đổi bộ lọc hoặc tạo tài khoản mới</div>
              </td>
            </tr>
          ) : (
            filteredAccounts.map((acc, index) => {
              const stt = (currentPage - 1) * pageSize + index + 1;
              return (
                <AccountRow
                  key={acc.id || index}
                  acc={acc}
                  stt={stt}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onResetPassword={onResetPassword}
                  departments={departments}
                />
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AccountTable;