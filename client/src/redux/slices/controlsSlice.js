const { createSlice } = require("@reduxjs/toolkit");

const controlsSlice = createSlice({
  name: "controls",
  initialState: {
    statuses: [],
    itemTypes: [],
    provinces: [],
    adTargets: [],
    province: null,
    loading: false,
  },
  reducers: {
    setStatuses(state, action) {
      state.statuses = action.payload;
    },
    setItemTypes(state, action) {
      state.itemTypes = action.payload;
    },
    setAdTargets(state, action) {
      state.adTargets = action.payload;
    },
    setProvinces(state, action) {
      state.provinces = action.payload;
    },
    setProvince(state, action) {
      state.province = action.payload;
    },
    setLoading(state) {
      state.loading = true;
    },
    clearLoading(state) {
      state.loading = false;
    },
  },
});

const controlsActions = controlsSlice.actions;
const controlsReducer = controlsSlice.reducer;

export { controlsActions, controlsReducer };
