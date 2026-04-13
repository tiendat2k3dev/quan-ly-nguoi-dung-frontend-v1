// Component phân trang dữ liệu sử dụng Ant Design Pagination
import React from 'react';
{/* Ant Design Pagination */}
import { Pagination } from 'antd';
{/*
  current: số trang hiện tại
  pageSize: số bản ghi mỗi trang
  total: số bản ghi từ server
  onChange: hàm để thay đổi trang

  */}
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
        // không cho chọn 10 / 20 / 50 items
        showSizeChanger={false}
// không cho nhập số trang để nhảy nhanh
        showQuickJumper={false}
        // hiển thị tổng số bản ghi total la tong so ban gi con range la khoang tu bao den bao
        showTotal={(total, range) => 
          `${range[0]}-${range[1]} của ${total} items`
        }
      />
    </div>
  );
};

export default PaginationComponent;