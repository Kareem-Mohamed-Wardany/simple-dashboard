# Admin Dashboard For a Book Store with Auth

- Creating an admin dashboard where admin can perform sorting, filtration on books
  also adding pagination to the book list
- There is a demo server api, to run this project [Demo-Api](https://github.com/Kareem-Mohamed-Wardany/Demo-Api)

## 🎥 Demo Video

[![Watch the video](https://img.youtube.com/vi/HH_sIy1xdBg/maxresdefault.jpg)](https://www.youtube.com/watch?v=HH_sIy1xdBg)

Click the image above to watch the demo!

## Features

### Admin Features

- ➕ Add new book.
- 📅 View all books and sorting, filtration them.

## 🛠 Tech Stack

- **Next.js** – For server-side rendering and optimized performance.
- **Tailwind CSS** – For modern and responsive styling.
- **Redux** – For efficient global state management.

## 🚀 Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Kareem-Mohamed-Wardany/simple-dashboard.git
   ```

2. **Navigate to the project folder:**

   ```sh
   cd simple-dashboard
   ```

3. **Install dependencies:**

   ```sh
   npm install
   ```

4. **Run the development server:**
   ```sh
   npm run dev
   ```

## 🛠 Implementation Approach

- When you try to use
  ```sh
   http://localhost:3000
  ```
  it will forward you to dashboard if you logged in with an admin role else you will go to register page to create new account the demo api creates evey account with admin role.

```js
// Here we configure Redux Store Reducers inside folder store/index.js
const store = configureStore({
  reducer: {
    auth: authReducer,
    adminBooks: adminBooksSlice,
  },
});
```

- **in Store Folder we find 2 folder one for auth, and admin:**

1.  in admin there is the books-slice that creates admin books-slice and and the methods that will call our Api endpoints to add book or get all books
2.  in auth there is auth-slice that allow user to be logged in our system or register to enter the dashboard

### **Body.jsx**

1. in that component is holds all other components containing header section that contains Search or Add books methods

```jsx
<div className="mb-6">
  <h1 className="text-2xl font-bold text-gray-800 mb-2">Book Inventory</h1>
  <SearchandAdd
    setFilterText={setFilterText}
    setShowPopup={setShowPopup}
    filterText={filterText}
  />
</div>
```

2. a grid that contains two sections one for Chart

```js
<div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
  <h2 className="text-lg font-semibold text-gray-800 mb-4">
    Inventory Overview
  </h2>
  <div>
    <InventoryChart books={displayedBooks || []} />
  </div>
</div>
```

3. and another one for dynamic table section with its own pagination

```js
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
```

4. last is the hidden modal for adding new book

```js
<AddBook showPopup={showPopup} setShowPopup={setShowPopup} />
```

### **Chart implementation**

- chart is made to view quantity ranges

```js
const quantityRanges = [
  { label: "0-5", min: 0, max: 5 },
  { label: "6-10", min: 6, max: 10 },
  { label: "11-20", min: 11, max: 20 },
  { label: "21-50", min: 21, max: 50 },
  { label: "51-100", min: 51, max: 100 },
  { label: "101-200", min: 101, max: 200 },
  { label: "201-300", min: 201, max: 300 },
  { label: "301-400", min: 301, max: 400 },
  { label: "401-500", min: 401, max: 500 },
  { label: "501-600", min: 501, max: 600 },
  { label: "601+", min: 601, max: Infinity },
];
```

- Calculate books in each quantity range

```js
const booksByRange = quantityRanges.map((range) => {
  return books.filter(
    (book) =>
      (book.Quantity ?? 0) >= range.min && (book.Quantity ?? 0) <= range.max
  );
});
const quantityRangeData = booksByRange.map((group) => group.length);
```

- Configure the chart

```jsx
const chartData = {
  labels: quantityRanges.map((range) => `${range.label} units`),
  datasets: [
    {
      label: "Number of Titles",
      data: quantityRangeData,
      backgroundColor: "#6366f1", // indigo-500
      borderColor: "#4f46e5", // indigo-600
      borderWidth: 1,
      yAxisID: "y",
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || "";
          label += ": ";
          if (context.datasetIndex === 1) {
            label += `$${context.raw.toLocaleString()}`;
          } else {
            label += context.raw.toLocaleString();
          }
          return label;
        },
        afterLabel: function (context) {
          const rangeIndex = context.dataIndex;
          const bookTitles = booksByRange[rangeIndex]
            .map((book) => book.title)
            .join(", ");
          return bookTitles
            ? `Titles: ${bookTitles}`
            : "No books in this range";
        },
      },
    },
  },
  scales: {
    y: {
      type: "linear",
      display: true,
      position: "left",
      title: {
        display: true,
        text: "Number of Titles",
      },
      beginAtZero: true,
    },
  },
};
```

### Sort

- Sort is implemented in both Body.jsx and THead.jsx
- main functions in Body.jsx

```js
const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // Define initial state for sort configs

// Function Handles sorting to ASC or DESC
const handleSort = (key) => {
  const direction =
    sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
  setSortConfig({ key, direction }); // Update Config
  setCurrentPage(1); // Start from first Page
};

 // using Memo hook to cache sort
  const processedBooks = useMemo(() => {
    if (!booksList) return []; // check if there is no books

    let filteredBooks = [...booksList];

    // Filter by title
    code here

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
  }, [booksList, filterText, sortConfig]); // Re do it if one of them changed
```

- Change sort in THead.jsx

```js
<th
  key={key}
  onClick={() => handleSort(key)} // Change key in sortconfig
  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group"
>
  <div className="flex items-center">
    <span className="mr-1">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
    <span
      className={`opacity-0 group-hover:opacity-100 transition-opacity ${
        sortConfig.key === key ? "opacity-100" : ""
      }`}
    >
      {sortConfig.key === key ? (
        sortConfig.direction === "asc" ? (
          <ArrowUp className="w-4 h-4" /> // show ArrowUp at asc of a selected key for title or price or quantity
        ) : (
          <ArrowDown className="w-4 h-4" /> // show ArrowDown at Dsc of a selected key for title or price or quantity
        )
      ) : (
        <ArrowUpDown className="w-4 h-4" />
      )}
    </span>
  </div>
</th>
```

### Filter

- Filter is implemented in both Body.jsx and SearchandAdd.jsx
- main functions in Body.jsx

```js
const [filterText, setFilterText] = useState("");
const processedBooks = useMemo(() => {
    if (!booksList) return [];

    let filteredBooks = [...booksList];

    // Filter by title if any book title contains entered text both in lower case
    if (filterText) {
      filteredBooks = filteredBooks.filter((book) =>
        book.title.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    // Sorting logic
    code here

    return filteredBooks;
  }, [booksList, filterText, sortConfig]);

// the component that has input field for search as it get filterText and setFilterText
<SearchandAdd
          setFilterText={setFilterText}
          setShowPopup={setShowPopup}
          filterText={filterText}
        />
```

- **SearchandAdd component**

```js
<div className="relative">
  <input
    type="text"
    placeholder="Search books..."
    value={filterText}
    onChange={(e) => setFilterText(e.target.value)} // Set filter text to user input
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
    </button> // X button will be show to clear the filtertext if there is a text
  )}
</div>
```

### Pagination

- Main functions in Body.jsx and the controls in PaginationControls.jsx

```js
const pageSize = 5; // Define Max books per page
const [currentPage, setCurrentPage] = useState(1); // Start with our first page

// Pagination logic
const { totalPages, displayedBooks } = useMemo(() => {
  const bookLen = processedBooks.length; // get len of filtered and sorted books
  const totalPages = Math.ceil(bookLen / pageSize); // get total pages
  const displayedBooks = processedBooks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  ); //do the pagination magic by getting the books in each page
  return { totalPages, displayedBooks };
}, [processedBooks, currentPage]);

const handlePageChange = (page) => {
  // change current page within the range of pages
  if (page >= 1 && page <= totalPages) setCurrentPage(page);
};

// Reset to first page when filters change
useEffect(() => {
  setCurrentPage(1);
}, [filterText, sortConfig]);

// Pagination buttons to navigate
<PaginationControls
  totalPages={totalPages}
  currentPage={currentPage}
  pageSize={pageSize}
  processedBooks={processedBooks}
  handlePageChange={handlePageChange}
/>;
```

- **Pagination Controls**

```js
const PaginationControls = ({
  totalPages,
  currentPage,
  pageSize,
  processedBooks,
  handlePageChange,
}) => {
  return (
    totalPages > 1 && (
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 gap-3">
        // show how many books shown in that range in current page
        <div className="text-sm text-gray-700">
          <span className="font-medium">
            {" "}
            Showing
            {(currentPage - 1) * pageSize + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(currentPage * pageSize, processedBooks.length)}
          </span>{" "}
          of <span className="font-medium">{processedBooks.length}</span>{" "}
          results
        </div>
        // show current page number of all pages
        <div className="text-sm text-gray-700">
          {" "}
          Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages} Pages</span>
        </div>
        // Control buttons
        <div className="flex items-center space-x-1 ">
          <PaginationButton
            onClick={() => handlePageChange(1)} // set page to first one
            disabled={currentPage === 1} // disable it if its first page
            icon={<ChevronsLeft className="w-5 h-5" />}
          />
          <PaginationButton
            onClick={() => handlePageChange(currentPage - 1)} // set page to previous page
            disabled={currentPage === 1} // disable it if its first page
            icon={<ChevronLeft className="w-5 h-5" />}
          />

          <PaginationButton
            onClick={() => handlePageChange(currentPage + 1)} // set page to next page
            disabled={currentPage === totalPages} // disable it if its last page
            icon={<ChevronRight className="w-5 h-5" />}
          />
          <PaginationButton
            onClick={() => handlePageChange(totalPages)} // set page to last page
            disabled={currentPage === totalPages} // disable it if its last page
            icon={<ChevronsRight className="w-5 h-5" />}
          />
        </div>
      </div>
    )
  );
};
```

## 🌍 Deployment

There is a separate repository for the backend, which handles business logic and database interactions. You can find it here: [Demo-Api](https://github.com/Kareem-Mohamed-Wardany/Demo-Api).
