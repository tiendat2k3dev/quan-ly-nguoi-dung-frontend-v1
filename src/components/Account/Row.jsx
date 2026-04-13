// Component render từng dòng trong bảng tài khoản với department mapping
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const AccountRow = ({ acc, stt, onEdit, onDelete, onResetPassword, departments = {} }) => {
  // Helper function để get department name
  const getDepartmentName = (departmentid) => {
    if (!departmentid || departmentid === null || departmentid === undefined) {
      return 'No Department';
    }
    if (!departments[departmentid]) {
      return 'null';
    }
    return departments[departmentid];
  };

  return (
    <tr key={acc.id || stt} data-id={acc.id}>
      <td data-label="STT">{stt}</td>
      <td data-label="Username">
        <span className="text-mono">{acc?.username || 'N/A'}</span>
      </td>
      <td data-label="Full Name">{acc?.fullName || 'N/A'}</td>
      <td data-label="Role">
        <span className={`badge badge-${(acc?.role || '').toLowerCase()}`}>
          {acc?.role || 'N/A'}
        </span>
      </td>
      <td data-label="Department">
        <span className={`dept-badge ${getDepartmentName(acc?.departmentid) === 'null' ? 'empty' : ''}`}>
          {getDepartmentName(acc?.departmentid) || 'N/A'}
        </span>
      </td>
      <td data-label="Actions" className="actions-cell">
        <button 
          className="btn-icon btn-edit" 
          onClick={() => onEdit && onEdit(acc)}
          title="Edit account"
          style={{ color: "#1890ff", marginRight: "8px" }}
        >
          <FontAwesomeIcon icon={faPen} />
        </button>
        <button 
          className="btn-icon btn-reset" 
          onClick={() => {
            console.log('Reset clicked for:', acc.username);
            onResetPassword && onResetPassword(acc);
          }}
          title="Reset password"
          style={{ 
            color: "#52c41a", 
            marginRight: "8px", 
            background: "transparent",
            border: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "500"
          }}
        >
          Reset
        </button>
        <button 
          className="btn-icon btn-delete" 
          onClick={() => onDelete && onDelete(acc)}
          title="Delete account"
          style={{ color: "#ff4d4f" }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  );
};

export default AccountRow;