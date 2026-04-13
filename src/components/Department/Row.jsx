import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const DepartmentRow = ({ dep, stt, onEdit, onDelete }) => {
  // Format date using toLocaleString
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <tr key={dep.id || stt} data-id={dep.id}>
      <td data-label="STT">{stt}</td>
      <td data-label="Name">
        <span className="text-mono">{dep?.name || 'N/A'}</span>
      </td>
      <td data-label="Total Member">{dep?.totalMember || 0}</td>
      <td data-label="Type">
        <span className={`badge badge-${(dep?.type || '').toLowerCase()}`}>
          {dep?.type || 'N/A'}
        </span>
      </td>
      <td data-label="Create Date">{formatDate(dep?.createDate || dep?.createdDate)}</td>
      <td data-label="Actions" className="actions-cell">
        <button 
          className="btn-icon btn-edit" 
          onClick={() => onEdit(dep)}
          title="Edit department"
          style={{ color: "#1890ff", marginRight: "8px" }}
        >
          <FontAwesomeIcon icon={faPen} />
        </button>
        <button 
          className="btn-icon btn-delete" 
          onClick={() => onDelete(dep)}
          title="Delete department"
          style={{ color: "#ff4d4f" }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  );
};

export default DepartmentRow;
