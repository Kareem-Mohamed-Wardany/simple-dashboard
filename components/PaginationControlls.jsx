import React from "react";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import PaginationButton from "./UI/PaginationButton";

const PaginationControlls = ({
  totalPages,
  currentPage,
  pageSize,
  processedBooks,
  handlePageChange,
}) => {
  return (
    totalPages > 1 && (
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 gap-3">
        <div className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-medium">
            {(currentPage - 1) * pageSize + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(currentPage * pageSize, processedBooks.length)}
          </span>{" "}
          of <span className="font-medium">{processedBooks.length}</span>{" "}
          results
        </div>
        <div className="text-sm text-gray-700">
          Page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages} Pages</span>
        </div>

        <div className="flex items-center space-x-1 ">
          <PaginationButton
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            icon={<ChevronsLeft className="w-5 h-5" />}
          />
          <PaginationButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            icon={<ChevronLeft className="w-5 h-5" />}
          />

          <PaginationButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            icon={<ChevronRight className="w-5 h-5" />}
          />
          <PaginationButton
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            icon={<ChevronsRight className="w-5 h-5" />}
          />
        </div>
      </div>
    )
  );
};

export default PaginationControlls;
