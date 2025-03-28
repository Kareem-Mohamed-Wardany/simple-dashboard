import React from "react";
import { BookOpen } from "lucide-react";
const TableContent = ({ book }) => {
  return (
    <tr key={book._id} className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center mr-3">
            <BookOpen />
          </div>
          <div>
            <div className="font-medium text-gray-900">{book.title}</div>
            <div className="text-xs text-gray-500">
              ID: {book._id?.substring(0, 8)}...
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          ${book.price?.toFixed(2)}
        </span>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              (book.Quantity ?? 0) > 10
                ? "bg-green-100 text-green-800"
                : (book.Quantity ?? 0) > 0
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {book.Quantity}
          </span>
        </div>
      </td>
    </tr>
  );
};

export default TableContent;
