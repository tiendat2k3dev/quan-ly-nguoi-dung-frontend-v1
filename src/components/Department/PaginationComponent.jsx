// Component phân trang dữ liệu cho Department sử dụng Ant Design Pagination
import { Pagination } from 'antd';
const PaginationComponent = ({ current, pageSize, total, onChange }) => {
  return (
    <div className="table-footer" style={{ marginTop: '15px' }}>
      {/* Hiển thị số lượng bản ghi ở bên trái */}
      <span>{total} records</span>
      
      {/* Ant Design Pagination ở bên phải */}
      <Pagination 
        align="end" 
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        showSizeChanger={false}
        showQuickJumper={false}
        showTotal={(total, range) => 
          `${range[0]}-${range[1]} của ${total} items`
        }
      />
    </div>
  );
};

export default PaginationComponent;