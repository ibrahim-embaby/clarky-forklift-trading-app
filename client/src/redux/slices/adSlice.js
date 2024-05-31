const { createSlice } = require("@reduxjs/toolkit");

const adSlice = createSlice({
  name: "ad",
  initialState: {
    ads: [],
    currentAd: null,
    adLoading: false,
    userAdsLoading: false,
    searchResultsCount: 0,
  },
  reducers: {
    setAds(state, action) {
      state.ads = action.payload;
    },

    setCurrentAd(state, action) {
      state.currentAd = action.payload;
    },
    clearAds(state) {
      state.ads = [];
    },
    addAdToAds(state, action) {
      state.ads.unshift(action.payload);
    },
    removeAdFromAds(state, action) {
      state.ads = state.ads.filter((ad) => ad._id !== action.payload);
      state.searchResultsCount = state.searchResultsCount - 1;
    },
    updateAd(state, action) {
      const { _id: id } = action.payload;
      state.ads = state.ads.map((ad) => {
        if (ad._id === id) {
          return {
            ...ad,
            ...action.payload,
          };
        }

        return ad;
      });
    },
    setSearchResultsCount(state, action) {
      state.searchResultsCount = action.payload;
    },
    likeAd(state, action) {
      const likedAd = action.payload;
      state.ads = state.ads.map((ad) =>
        ad._id === likedAd._id
          ? {
              ...ad,
              likes: likedAd.likes,
              likedBy: likedAd.likedBy,
              liked: true,
            }
          : ad
      );
    },
    unlikeAd(state, action) {
      const unlikedAd = action.payload;
      state.ads = state.ads.map((ad) =>
        ad._id === unlikedAd._id
          ? {
              ...ad,
              likes: unlikedAd.likes,
              likedBy: unlikedAd.likedBy,
              liked: false,
            }
          : ad
      );
    },
    setAdLoading(state) {
      state.adLoading = true;
    },
    clearAdLoading(state) {
      state.adLoading = false;
    },

    setUserAdsLoading(state) {
      state.userAdsLoading = true;
    },
    clearUserAdsLoading(state) {
      state.userAdsLoading = false;
    },
  },
});

const adActions = adSlice.actions;
const adReducer = adSlice.reducer;

export { adActions, adReducer };
