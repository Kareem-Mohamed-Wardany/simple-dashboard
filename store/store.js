import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminBooksSlice from "./admin/books-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminBooks: adminBooksSlice,
  },
});

export default store;
