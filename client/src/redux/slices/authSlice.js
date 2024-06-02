const { createSlice } = require("@reduxjs/toolkit");
const { withReduxStateSync } = require("redux-state-sync");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:
      localStorage.getItem("userInfo") &&
      localStorage.getItem("userInfo") !== "undefined"
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null,
    loading: false,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    updateUser(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("userInfo", JSON.stringify(state.user));
      }
    },
    verifyAccount(state, action) {
      if (state.user) {
        const user = action.payload;
        localStorage.setItem("userInfo", JSON.stringify(user));
        state.user = user;
      }
    },
    updateToken(state, action) {
      if (state.user) {
        state.user.token = action.payload;
        localStorage.setItem("userInfo", JSON.stringify(state.user));
      }
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("userInfo");
    },
    setLoading(state) {
      state.loading = true;
    },
    clearLoading(state) {
      state.loading = false;
    },
  },
});

const authActions = authSlice.actions;
const authReducer = withReduxStateSync(authSlice.reducer);

export { authActions, authReducer };
