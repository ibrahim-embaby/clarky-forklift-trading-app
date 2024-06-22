import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
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
