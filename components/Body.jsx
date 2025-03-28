import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBooks } from "@/store/admin/books-slice";
import AddBook from "./AddBook";
import InventoryChart from "./InventoryChart";
import TableContent from "./TableContent";
import NoData from "./NoData";
import PaginationControls from "./PaginationControls";
import THead from "./THead";
import SearchandAdd from "./SearchandAdd";

const Body = () => {
  const dispatch = useDispatch();
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filterText, setFilterText] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const { booksList } = useSelector((state) => state.adminBooks);
  const { isAdmin } = useSelector((state) => state.auth);

  // Fetch books on mount
  useEffect(() => {
    if (isAdmin) dispatch(fetchAllBooks());
  }, [dispatch, showPopup]);

  // Handle sorting
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction }); // Update Config
    setCurrentPage(1); // Start from first Page
  };

  // Process books with filtering and sorting
  const processedBooks = useMemo(() => {
    if (!booksList) return [];

    let filteredBooks = [...booksList];

    // Filter by title
    if (filterText) {
      filteredBooks = filteredBooks.filter((book) =>
        book.title.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    // Sorting logic
    if (sortConfig.key) {
      filteredBooks.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? "";
        const bValue = b[sortConfig.key] ?? "";

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filteredBooks;
  }, [booksList, filterText, sortConfig]);

  // Pagination logic
  const { totalPages, displayedBooks } = useMemo(() => {
    const bookLen = processedBooks.length;
    const totalPages = Math.ceil(bookLen / pageSize);
    const displayedBooks = processedBooks.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
    return { totalPages, displayedBooks };
  }, [processedBooks, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterText, sortConfig]);

  return (
    <section className="px-4 lg:px-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Book Inventory
        </h1>
        <SearchandAdd
          setFilterText={setFilterText}
          setShowPopup={setShowPopup}
          filterText={filterText}
        />
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Inventory Overview
          </h2>
          <div>
            <InventoryChart books={displayedBooks || []} />
          </div>
        </div>

        {/* Table Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Book List</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <THead sortConfig={sortConfig} handleSort={handleSort} />
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedBooks.length > 0 ? (
                  displayedBooks.map((book) => (
                    <TableContent key={book._id} book={book} />
                  ))
                ) : (
                  <NoData booksList={booksList} />
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <PaginationControls
            totalPages={totalPages}
            currentPage={currentPage}
            pageSize={pageSize}
            processedBooks={processedBooks}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>

      <AddBook showPopup={showPopup} setShowPopup={setShowPopup} />
    </section>
  );
};

export default Body;
