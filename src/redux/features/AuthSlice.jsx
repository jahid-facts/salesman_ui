import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postApi } from "../../config/configAxios";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const response = await postApi("/admin-login", loginData);
      return fulfillWithValue(response.data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true" || false,
  status: "idle",
  error: null,
  success: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser(state) {
      state.status = "idle";
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      state.success = null;
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      localStorage.removeItem("isLoggedIn");
    },
    clearMessage(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isLoggedIn = true;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("isLoggedIn", "true");
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
        state.success = null;
      });
  },
});

export const { logoutUser, clearMessage } = authSlice.actions;

export default authSlice.reducer;
