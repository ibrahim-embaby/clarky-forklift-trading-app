import { toast } from "sonner";
import { adminActions } from "../slices/adminSlice";
import request from "../../utils/request";
import { refreshToken } from "./authApiCall";

// api/v1/admin/ads
export function adminFetchAds(adStatus) {
  return async (dispatch, getState) => {
    try {
      dispatch(adminActions.setLoading());
      const { data } = await request.get(
        `/api/v1/admin/ads?adStatus=${adStatus}`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
            Cookie: document.i18next,
          },
          withCredentials: true,
        }
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
      if (error?.response?.status === 401) {
        await dispatch(refreshToken());
        await dispatch(adminFetchAds(adStatus));
        return;
      } else {
        toast.error(error.response.data.message);
        dispatch(adminActions.clearLoading());
      }
    }
  };
}

// api/v1/admin/ads/count
export function adminfetchAdsCount(adStatus) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.get(
        `/api/v1/admin/ads/count?adStatus=${adStatus}`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
            Cookie: document.i18next,
          },
          withCredentials: true,
        }
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
      if (error?.response?.status === 401) {
        await dispatch(refreshToken());
        await dispatch(adminfetchAdsCount(adStatus));
        return;
      } else {
        toast.error(error.response.data.message);
      }
    }
  };
}

// api/v1/admin/ads/:adId
export function adminAcceptRefuseAd(adId, adStatus, rejectionReason = "") {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.put(
        `/api/v1/admin/ads/${adId}`,
        {
          adStatus,
          rejectionReason,
        },
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
            Cookie: document.i18next,
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 401) {
        await dispatch(refreshToken());
        await dispatch(adminAcceptRefuseAd(adId, adStatus));
        return;
      } else {
        toast.error(error.response.data.message);
      }
    }
  };
}
