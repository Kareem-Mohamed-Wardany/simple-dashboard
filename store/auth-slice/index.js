import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Helper function for safe localStorage access
const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key, value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  }
};

const getInitialAuthState = () => {
  const user = safeLocalStorage.getItem("user");
  return {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    token: "",
    expiryDate: "",
    isAdmin: user ? JSON.parse(user)?.role === 'admin' : false,
    error: null
  };
};

// Thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {

    const response = await fetch("http://localhost:5000/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.msg || "Registration failed");
    }

    return data;

  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {

    const response = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.msg || "Login failed");
    }

    // Save credentials to localStorage
    if (data.success) {
      const expiryDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      safeLocalStorage.setItem("token", data.data.token);
      safeLocalStorage.setItem("user", JSON.stringify(data.data.user));
      safeLocalStorage.setItem("expiryDate", expiryDate);
    }

    return data;

  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: getInitialAuthState(),
  reducers: {
    setLogOut: (state) => {
      safeLocalStorage.removeItem("token");
      safeLocalStorage.removeItem("user");
      safeLocalStorage.removeItem("expiryDate");
      state.isAuthenticated = false;
      state.user = null;
      state.token = "";
      state.expiryDate = "";
      state.isAdmin = false;
      state.error = null;
    },
    initializeAuth: (state) => {
      const token = safeLocalStorage.getItem("token");
      const user = safeLocalStorage.getItem("user");
      const expiryDate = safeLocalStorage.getItem("expiryDate");

      if (token && user && expiryDate) {
        state.isAuthenticated = true;
        state.user = JSON.parse(user);
        state.token = token;
        state.expiryDate = expiryDate;
        state.isAdmin = JSON.parse(user)?.role === 'admin';
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.success;
        state.user = action.payload.data?.user || null;
        state.token = action.payload.data?.token || "";
        state.isAdmin = action.payload.data?.user?.role === 'admin';
        state.expiryDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export const { setLogOut, initializeAuth, clearError } = authSlice.actions;

export default authSlice.reducer;