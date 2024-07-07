const { createSlice } = require("@reduxjs/toolkit");

const driverSlice = createSlice({
  name: "driver",
  initialState: {
    drivers: [],
    currentDriver: null,
    loading: false,
    searchResultsCount: 0,
  },
  reducers: {
    setDrivers(state, action) {
      state.drivers = action.payload;
    },

    setCurrentDriver(state, action) {
      state.currentDriver = action.payload;
    },

    clearDrivers(state) {
      state.drivers = [];
    },

    addDriverToDrivers(state, action) {
      state.drivers.unshift(action.payload);
    },

    removeDriverFromDrivers(state, action) {
      state.drivers = state.drivers.filter(
        (driver) => driver._id !== action.payload
      );
      state.searchResultsCount = state.searchResultsCount - 1;
    },

    updateDriver(state, action) {
      state.currentDriver = action.payload;
      const { _id: id } = action.payload;
      state.drivers = state.drivers.map((driver) => {
        if (driver._id === id) {
          return {
            ...driver,
            ...action.payload,
          };
        }
        return driver;
      });
    },

    setSearchResultsCount(state, action) {
      state.searchResultsCount = action.payload;
    },

    setLoading(state) {
      state.loading = true;
    },

    clearLoading(state) {
      state.loading = false;
    },
  },
});

const driverActions = driverSlice.actions;
const driverReducer = driverSlice.reducer;

export { driverActions, driverReducer };
