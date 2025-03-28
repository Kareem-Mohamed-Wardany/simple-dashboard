import React from "react";

const PaginationButton = ({ onClick, disabled, icon }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-2.5 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {icon}
    </button>
  );
};

export default PaginationButton;
