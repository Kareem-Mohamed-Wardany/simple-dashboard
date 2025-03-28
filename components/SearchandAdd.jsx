import React from "react";
import { Search, X, Plus } from "lucide-react";
const SearchandAdd = ({ setFilterText, setShowPopup, filterText }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="relative w-full md:w-96">
        <div className="relative">
          <input
            type="text"
            placeholder="Search books..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all text-gray-700"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-700" />

          {filterText && (
            <button
              onClick={() => setFilterText("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      <button
        onClick={() => setShowPopup(true)}
        className="w-full md:w-auto flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Book
      </button>
    </div>
  );
};

export default SearchandAdd;
