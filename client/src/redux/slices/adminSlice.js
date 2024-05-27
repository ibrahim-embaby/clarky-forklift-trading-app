const { createSlice } = require("@reduxjs/toolkit");

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    publishedAds: [],
    users: [],
    usersCount: 0,
    publishedAdsCount: 0,
    pendingAds: [],
    pendingAdsCount: 0,
    reportedAds: [],
    reportedAdsCount: 0,
    loading: false,
  },
  reducers: {
    setPublishedAds(state, action) {
      state.publishedAds = action.payload;
    },
    setPublishedAdsCount(state, action) {
      state.publishedAdsCount = action.payload;
    },

    setPendingAds(state, action) {
      state.pendingAds = action.payload;
    },
    setPendingAdsCount(state, action) {
      state.pendingAdsCount = action.payload;
    },

    setReportedAds(state, action) {
      state.reportedAds = action.payload;
    },
    setReportedAdsCount(state, action) {
      state.reportedAdsCount = action.payload;
    },

    setUsers(state, action) {
      state.users = action.payload;
    },
    setUsersCount(state, action) {
      state.usersCount = action.payload;
    },

    setLoading(state) {
      state.loading = true;
    },
    clearLoading(state) {
      state.loading = false;
    },
  },
});

const adminActions = adminSlice.actions;
const adminReducer = adminSlice.reducer;

export { adminActions, adminReducer };
