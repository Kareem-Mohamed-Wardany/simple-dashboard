import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  booksList: [],
};

export const addNewBook = createAsyncThunk(
  "/books/addnewbook",
  async (formData) => {
    const token = localStorage.getItem("token");
    console.log(formData)
    const result = await fetch("http://localhost:5000/api/v1/admin/books/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: formData.title,
        price: formData.price,
        Quantity: formData.Quantity,
        category: formData.category,
      }),
    });
    const data = await result.json();
    return data;
  }
);

export const fetchAllBooks = createAsyncThunk(
  "/books/fetchAllBooks",
  async () => {
    const token = localStorage.getItem("token");
    const result = await fetch(
      `http://localhost:5000/api/v1/admin/books/get`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await result.json();
    return data;
  }
);

const AdminBooksSlice = createSlice({
  name: "adminBooks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBooks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.booksList = action.payload.data.Books;
      })
      .addCase(fetchAllBooks.rejected, (state) => {
        state.isLoading = false;
        state.booksList = [];
        state.pagination = {};
      })
      .addCase(addNewBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewBook.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addNewBook.rejected, (state) => {
        state.isLoading = false;
      })
  },
});

export default AdminBooksSlice.reducer;
