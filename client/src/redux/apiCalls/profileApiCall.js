import { toast } from "sonner";
import request from "../../utils/request";
import { profileActions } from "../slices/profileSlice";
import { refreshToken } from "./authApiCall";
import axios from "axios";
import { authActions } from "../slices/authSlice";

// get user profile
export function fetchUserProfile(id) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.get(`/api/v1/user/profile/${id}`, {
        headers: {
          Authorization: "Bearer " + getState().auth.user.token,
          Cookie: document.cookie.i18next,
        },
        withCredentials: true,
      });
      dispatch(profileActions.setProfile(data));
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 401) {
        await dispatch(refreshToken());
        await dispatch(fetchUserProfile(id));
        return;
      } else {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  };
}

// fetch all users
export function fetchAllUsers() {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.get("api/v1/user/", {
        headers: {
          Authorization: "Bearer " + getState().auth.user.token,
          Cookie: document.cookie.i18next,
        },
        withCredentials: true,
      });
      dispatch(profileActions.setUsers(data));
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 401) {
        await dispatch(refreshToken());
        await dispatch(fetchAllUsers());
        return;
      } else {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  };
}

// /api/v1/user/:useId/ads/
export function fetchMyAds(userId, adStatus, page) {
  return async (dispatch, getState) => {
    try {
      dispatch(profileActions.setLoading());
      const { data } = await request.get(
        `/api/v1/user/${userId}/profile/ads?adStatus=${adStatus}&page=${page}`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
            Cookie: document.i18next,
          },
          withCredentials: true,
        }
      );

      dispatch(profileActions.setUserAds(data.ads));
      dispatch(profileActions.setUserAdsCount(data.count));
      dispatch(profileActions.clearLoading());
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 401) {
        await dispatch(refreshToken());
        await dispatch(fetchMyAds(userId, adStatus));
        return;
      } else {
        console.log(error);
        toast.error(error.response.data.message);
        dispatch(profileActions.clearLoading());
      }
    }
  };
}

// /api/v1/user/:useId/profile/ads/:adId
export function fetchMyAd(adId) {
  return async (dispatch, getState) => {
    try {
      dispatch(profileActions.setLoading());
      const { data } = await request.get(
        `/api/v1/user/${getState().auth.user.id}/profile/ads/${adId}`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
            Cookie: document.i18next,
          },
          withCredentials: true,
        }
      );

      dispatch(profileActions.setUserAd(data.data));
      dispatch(profileActions.clearLoading());
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 401) {
        await dispatch(refreshToken());
        await dispatch(fetchMyAd(adId));
        return;
      } else {
        console.log(error);
        toast.error(error.response.data.message);
        dispatch(profileActions.clearLoading());
      }
    }
  };
}

// delete single user
export function deleteUser(id) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.delete(`/api/v1/user/profile/${id}`, {
        headers: {
          Authorization: "Bearer " + getState().auth.user.token,
          Cookie: document.cookie.i18next,
        },
        withCredentials: true,
      });

      dispatch(profileActions.clearUser(id));
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 401) {
        await dispatch(refreshToken());
        await dispatch(deleteUser(id));
        return;
      } else {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  };
}

// update user profile
export function updateUserProfile(userInfo, profilePhotoData = new FormData()) {
  return async (dispatch, getState) => {
    try {
      if (profilePhotoData.get("profilePhoto")) {
        const { data: uploadConfig } = await request.post(
          "/api/v1/upload",
          {
            count: 1,
          },
          {
            headers: {
              Authorization: "Bearer " + getState().auth.user.token,
              Cookie: document.cookie.i18next,
            },
            withCredentials: true,
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
      const { data } = await request.put("/api/v1/user/profile/", userInfo, {
        headers: {
          Authorization: "Bearer " + getState().auth.user.token,
          Cookie: document.cookie.i18next,
        },
        withCredentials: true,
      });
      dispatch(profileActions.setProfile(data.data));
      dispatch(authActions.setUser(data.data));
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 401) {
        await dispatch(refreshToken());
        await dispatch(updateUserProfile(userInfo, profilePhotoData));
        return;
      } else {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  };
}
