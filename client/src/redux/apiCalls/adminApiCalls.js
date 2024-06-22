import { toast } from "sonner";
import { adminActions } from "../slices/adminSlice";
import { apiRequest } from "../../utils/apiRequest";

// api/v1/admin/ads
export function adminFetchAds(params) {
  return async (dispatch) => {
    try {
      dispatch(adminActions.setLoading());
      const { data } = await apiRequest(
        `/api/v1/admin/ads?adStatus=${params.adStatus}&page=${params.page}&pageSize=${params.pageSize}`,
        "GET"
      );

      dispatch(adminActions.setAds(data.ads));
      dispatch(adminActions.setAdsCount(data.count));
      dispatch(adminActions.clearLoading());
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch(adminActions.clearLoading());
    }
  };
}

// api/v1/admin/ads/:adId
export function adminAcceptRefuseAd(adId, adStatus, rejectionReason = "") {
  return async () => {
    try {
      const { data } = await apiRequest(`/api/v1/admin/ads/${adId}`, "PUT", {
        adStatus,
        rejectionReason,
      });

      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
}

// /api/v1/admin/users
export function fetchAllUsers(params) {
  return async (dispatch) => {
    try {
      const { data } = await apiRequest(
        `/api/v1/admin/users?page=${params.page}&pageSize=${params.pageSize}`,
        "GET"
      );
      dispatch(adminActions.setUsers(data.users));
      dispatch(adminActions.setUsersCount(data.totalUsers));
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
}

// /api/v1/admin/statistics
export function fetchStatistics() {
  return async (dispatch) => {
    try {
      const { data } = await apiRequest("/api/v1/admin/statistics", "GET");
      dispatch(adminActions.setStatistics(data));
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
}
