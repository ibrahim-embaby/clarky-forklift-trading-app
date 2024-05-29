import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    users: [],
    userAds: [],
    userAdsCount: 0,
    ad: null,
    loading: false,
  },
  reducers: {
    setProfile(state, action) {
      state.profile = action.payload;
    },

    setUserAds(state, action) {
      state.userAds = action.payload;
    },
    setUserAdsCount(state, action) {
      state.userAdsCount = action.payload;
    },

    setUserAd(state, action) {
      state.ad = action.payload;
    },

    removeUserAdFromAds(state, action) {
      state.userAds = state.userAds.filter((ad) => ad._id !== action.payload);
      state.userAdsCount = state.userAdsCount - 1;
    },

    clearProfile(state) {
      state.profile = null;
    },
    setUsers(state, action) {
      state.users = action.payload;
    },
    clearUser(state, action) {
      state.users = state.users.filter((user) => user._id !== action.payload);
    },
    setLoading(state) {
      state.loading = true;
    },
    clearLoading(state) {
      state.loading = false;
    },
  },
});

const profileActions = profileSlice.actions;
const profileReducer = profileSlice.reducer;

export { profileActions, profileReducer };
