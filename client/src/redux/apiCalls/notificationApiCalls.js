import { toast } from "sonner";
import { notificationActions } from "../slices/notificationSlice";
import { apiRequest } from "../../utils/apiRequest";

// /api/v1/notifications/
export function createNotification(notification) {
  return async () => {
    try {
      await apiRequest("/api/v1/notifications", "POST", notification);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
}

// /api/v1/notifications/
export function fetchAllNotifications(page, limit) {
  return async (dispatch) => {
    try {
      dispatch(notificationActions.setLoading());
      const { data } = await apiRequest(
        `/api/v1/notifications?page=${page}&limit=${limit}`,
        "GET"
      );

      dispatch(notificationActions.addMoreNotifications(data.notifications));
      dispatch(
        notificationActions.setNotificationsCount(data.notificationsCount)
      );
      dispatch(notificationActions.clearLoading());
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(notificationActions.clearLoading());
    }
  };
}

// /api/v1/notifications/
export function readNotifications(notificationIds) {
  return async (dispatch) => {
    try {
      await apiRequest("/api/v1/notifications", "PUT", { notificationIds });
      dispatch(notificationActions.setLoading());
      const { data } = await apiRequest(
        `/api/v1/notifications?page=${1}&limit=${10}`,
        "GET"
      );

      dispatch(notificationActions.setNotifications(data.notifications));
      dispatch(notificationActions.clearLoading());
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(notificationActions.clearLoading());
    }
  };
}
