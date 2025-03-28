import React from "react";
import { AlertTriangle } from "lucide-react";

const NoData = ({ booksList }) => {
  return (
    <tr>
      <td colSpan="3" className="px-4 py-6 text-center text-sm text-gray-500">
        <div className="flex flex-col items-center justify-center py-8">
          <AlertTriangle className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {booksList.length === 0
              ? "No books in inventory"
              : "No matching books found"}
          </h3>
          <p className="text-gray-500 max-w-xs">
            {booksList.length === 0
              ? "Add your first book to get started."
              : "Try adjusting your search or filters."}
          </p>
        </div>
      </td>
    </tr>
  );
};

export default NoData;
