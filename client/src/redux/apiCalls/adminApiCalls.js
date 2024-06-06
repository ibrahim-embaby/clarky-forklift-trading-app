import { toast } from "sonner";
import { adminActions } from "../slices/adminSlice";
import { apiRequest } from "../../utils/apiRequest";

// api/v1/admin/ads
export function adminFetchAds(adStatus) {
  return async (dispatch) => {
    try {
      dispatch(adminActions.setLoading());
      const { data } = await apiRequest(
        `/api/v1/admin/ads?adStatus=${adStatus}`,
        "GET"
      );

      if (adStatus === "published") {
        dispatch(adminActions.setPublishedAds(data.ads));
        dispatch(adminActions.setPublishedAdsCount(data.count));
      } else if (adStatus === "pending") {
        dispatch(adminActions.setPendingAds(data.ads));
        dispatch(adminActions.setPendingAdsCount(data.count));
      } else if (adStatus === "reported") {
        dispatch(adminActions.setReportedAds(data.ads));
        dispatch(adminActions.setReportedAdsCount(data.count));
      }
      dispatch(adminActions.clearLoading());
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch(adminActions.clearLoading());
    }
  };
}

// api/v1/admin/ads/count
export function adminfetchAdsCount(adStatus) {
  return async (dispatch) => {
    try {
      const { data } = await apiRequest(
        `/api/v1/admin/ads/count?adStatus=${adStatus}`,
        "GET"
      );

      if (adStatus === "published") {
        dispatch(adminActions.setPublishedAdsCount(data.count));
      } else if (adStatus === "pending") {
        dispatch(adminActions.setPendingAdsCount(data.count));
      } else if (adStatus === "reported") {
        dispatch(adminActions.setReportedAdsCount(data.count));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
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
