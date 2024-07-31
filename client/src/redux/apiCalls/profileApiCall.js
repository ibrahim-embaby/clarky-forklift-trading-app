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
  return async (dispatch, getState) => {
    try {
      const { data } = await apiRequest(`/api/v1/user/profile/${id}`, "DELETE");
      if (getState().auth.user.id === id) {
        dispatch(profileActions.clearProfile());
        dispatch(authActions.logout());
      }
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
        // Request signed upload URL for the profile photo
        const { data: uploadConfig } = await apiRequest(
          "/api/v1/upload",
          "POST",
          {
            count: 1,
          }
        );

        // Upload the profile photo using the signed upload URL
        const formData = new FormData();
        formData.append("file", profilePhotoData.get("profilePhoto"));
        formData.append("api_key", uploadConfig[0].api_key);
        formData.append("timestamp", uploadConfig[0].timestamp);
        formData.append("public_id", uploadConfig[0].public_id);
        formData.append("signature", uploadConfig[0].signature);

        const uploadResponse = await axios.post(uploadConfig[0].url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Update userInfo profilePhoto property with Cloudinary response
        userInfo["profilePhoto"] = {
          public_id: uploadResponse.data.public_id,
          url: uploadResponse.data.secure_url,
        };
      }

      // Update user profile with the new data
      const { data } = await apiRequest(
        "/api/v1/user/profile/",
        "PUT",
        userInfo
      );

      // Update the Redux store with the new profile data
      dispatch(profileActions.setProfile(data.data));
      dispatch(authActions.setUser(data.data));
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
}
