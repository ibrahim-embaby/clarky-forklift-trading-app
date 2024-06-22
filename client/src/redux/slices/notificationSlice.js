const { createSlice } = require("@reduxjs/toolkit");

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    notificationsCount: 0,
    loading: false,
  },
  reducers: {
    setNotifications(state, action) {
      state.notifications = action.payload;
    },
    addMoreNotifications(state, action) {
      const newNotifications = action.payload.filter(
        (newNotif) =>
          !state.notifications.some((notif) => notif._id === newNotif._id)
      );
      state.notifications = state.notifications.concat(newNotifications);
    },
    clearNotifications(state) {
      state.notifications = [];
    },
    setNotificationsCount(state, action) {
      state.notificationsCount = action.payload;
    },

    setLoading(state) {
      state.loading = true;
    },
    clearLoading(state) {
      state.loading = false;
    },
  },
});

const notificationActions = notificationSlice.actions;
const notificationReducer = notificationSlice.reducer;

export { notificationActions, notificationReducer };
