// Component filter theo type và search cho Department với auto-search
import { useState } from 'react';

const DateTypeFilter = ({ onAdd, onSearch, onClear, filters }) => {
  const [localFilters, setLocalFilters] = useState({
    name: filters?.name || "",
    type: filters?.type || "",
    dateFrom: filters?.dateFrom || "",
    dateTo: filters?.dateTo || ""
  });
  const [prevFilters, setPrevFilters] = useState(filters);

  // Sync với filters từ parent
  if (filters !== prevFilters) {
    setPrevFilters(filters);
    if (filters) {
      setLocalFilters({
        name: filters.name || "",
        type: filters.type || "",
        dateFrom: filters.dateFrom || "",
        dateTo: filters.dateTo || ""
      });
    }
  }

  const handleFilterChange = (field, value) => {
    const newFilters = {
      ...localFilters,
      [field]: value
    };
    setLocalFilters(newFilters);
    
    // Auto search khi thay đổi type dropdown
    if (field === 'type') {
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
    <div className="department-filter">
      {/* Search input */}
      <input 
        type="text"
        placeholder="Search department name..."
        value={localFilters.name}
        onChange={(e) => handleFilterChange('name', e.target.value)}
        onKeyDown={handleKeyPress}
        style={{
          padding: "8px 12px",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          marginRight: "10px"
        }}
      />

      {/* Date filters */}
      <input 
        type="date" 
        value={localFilters.dateFrom}
        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
        style={{ marginRight: "10px" }}
        placeholder="From date"
      />
      
      <input 
        type="date" 
        value={localFilters.dateTo}
        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
        style={{ marginRight: "10px" }}
        placeholder="To date"
      />

      {/* Type filter */}
      <select 
        value={localFilters.type}
        onChange={(e) => handleFilterChange('type', e.target.value)}
        style={{ marginRight: "10px" }}
      >
        <option value="">Type</option>
        <option value="DEV">DEV</option>
        <option value="PM">PM</option>
        <option value="Scrum Master">Scrum Master</option>
        <option value="TES">TES</option>
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

      {/* Create button - đẩy sang phải nhờ margin-left: auto trong CSS */}
      <button className="btn-create" onClick={onAdd}>
        + Create Department
      </button>
    </div>
  );
};

export default DateTypeFilter;