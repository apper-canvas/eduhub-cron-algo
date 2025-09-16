import React from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const TableHeader = ({ 
  title, 
  searchValue, 
  onSearchChange, 
  onAdd, 
  addLabel = "Add New",
  children 
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              placeholder={`Search ${title.toLowerCase()}...`}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {children}
          {onAdd && (
            <Button onClick={onAdd} className="flex items-center gap-2">
              <ApperIcon name="Plus" className="w-4 h-4" />
              {addLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableHeader;