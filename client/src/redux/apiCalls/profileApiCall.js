import { toast } from "sonner";
import { profileActions } from "../slices/profileSlice";
import axios from "axios";
import { authActions } from "../slices/authSlice";
import { apiRequest } from "../../utils/apiRequest";

// get user profile
export function fetchUserProfile(id) {
  return async (dispatch) => {
    try {
      const { data } = await apiRequest(`/api/v1/user/profile/${id}`, "GET");

      dispatch(profileActions.setProfile(data));
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
}

// /api/v1/user/:useId/ads/
export function fetchMyAds(userId, adStatus, page) {
  return async (dispatch) => {
    try {
      dispatch(profileActions.setLoading());
      const { data } = await apiRequest(
        `/api/v1/user/${userId}/profile/ads?adStatus=${adStatus}&page=${page}`,
        "GET"
      );

      dispatch(profileActions.setUserAds(data.ads));
      dispatch(profileActions.setUserAdsCount(data.count));
      dispatch(profileActions.clearLoading());
    } catch (error) {
      console.log(error);
      toast.error("some error happend");
    }
  };
}

// /api/v1/user/:useId/profile/ads/:adId
export function fetchMyAd(adId) {
  return async (dispatch, getState) => {
    try {
      dispatch(profileActions.setLoading());
      const { data } = await apiRequest(
        `/api/v1/user/${getState().auth.user.id}/profile/ads/${adId}`,
        "GET"
      );

      dispatch(profileActions.setUserAd(data.data));
      dispatch(profileActions.clearLoading());
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch(profileActions.clearLoading());
    }
  };
}

// delete single user
export function deleteUser(id) {
  return async (dispatch) => {
    try {
      const { data } = await apiRequest(`/api/v1/user/profile/${id}`, "DELETE");

      dispatch(profileActions.clearUser(id));
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
}

// update user profile
export function updateUserProfile(userInfo, profilePhotoData = new FormData()) {
  return async (dispatch) => {
    try {
      if (profilePhotoData.get("profilePhoto")) {
        const { data: uploadConfig } = await apiRequest(
          "/api/v1/upload",
          "POST",
          {
            count: 1,
          }
        );

        await axios.put(
          uploadConfig[0].url,
          profilePhotoData.get("profilePhoto"),
          {
            headers: {
              "Content-Type": profilePhotoData.get("profilePhoto").type,
            },
          }
        );
        userInfo["profilePhoto"] = {
          key: uploadConfig[0].key,
          url:
            "https://arabity.s3.eu-north-1.amazonaws.com/" +
            uploadConfig[0].key,
        };
      }

      const { data } = await apiRequest(
        "/api/v1/user/profile/",
        "PUT",
        userInfo
      );

      dispatch(profileActions.setProfile(data.data));
      dispatch(authActions.setUser(data.data));
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
}
