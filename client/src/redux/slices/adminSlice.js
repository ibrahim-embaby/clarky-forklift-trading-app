const { createSlice } = require("@reduxjs/toolkit");

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    usersCount: 0,
    ads: [],
    adsCount: 0,
    statistics: null,
    loading: false,
  },
  reducers: {
    setAds(state, action) {
      state.ads = action.payload;
    },

    setAdsCount(state, action) {
      state.adsCount = action.payload;
    },

    setUsers(state, action) {
      state.users = action.payload;
    },
    setUsersCount(state, action) {
      state.usersCount = action.payload;
    },

    setStatistics(state, action) {
      state.statistics = action.payload;
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
