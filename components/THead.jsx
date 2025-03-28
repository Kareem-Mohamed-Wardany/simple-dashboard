import React from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

const THead = ({ sortConfig, handleSort }) => {
  return (
    <thead className="bg-gray-50">
      <tr>
        {["title", "price", "Quantity"].map((key) => (
          <th
            key={key}
            onClick={() => handleSort(key)}
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group"
          >
            <div className="flex items-center">
              <span className="mr-1">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
              <span
                className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                  sortConfig.key === key ? "opacity-100" : ""
                }`}
              >
                {sortConfig.key === key ? (
                  sortConfig.direction === "asc" ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )
                ) : (
                  <ArrowUpDown className="w-4 h-4" />
                )}
              </span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default THead;
