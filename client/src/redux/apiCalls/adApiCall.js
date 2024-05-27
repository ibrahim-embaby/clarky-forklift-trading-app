import { toast } from "react-toastify";
import request from "../../utils/request";
import { adActions } from "../slices/adSlice";
import axios from "axios";
import { refreshToken } from "./authApiCall";

// /api/v1/posts/
export function createAd(ad) {
  return async (dispatch, getState) => {
    try {
      const { photos } = ad;

      // Request presigned URLs for multiple photos
      const { data: uploadConfigs } = await request.post(
        "/api/v1/upload",
        {
          count: photos.length,
        },
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
            Cookie: document.cookie.i18next,
          },
          withCredentials: true,
        }
      );

      // Upload each photo using its corresponding presigned URL
      const uploadPromises = photos.map((file, index) => {
        return axios.put(uploadConfigs[index].url, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
      });

      await Promise.all(uploadPromises);

      // Collect the URLs of the uploaded photos
      const photoUrls = uploadConfigs.map(
        (config) => "https://arabity.s3.eu-north-1.amazonaws.com/" + config.key
      );
      const adWithImages = { ...ad, photos: photoUrls };

      // Assuming you have an API endpoint to create an ad
      const { data } = await request.post("/api/v1/ads", adWithImages, {
        headers: {
          Authorization: "Bearer " + getState().auth.user.token,
          Cookie: document.cookie.i18next,
        },
        withCredentials: true,
      });

      toast.success(data.message);
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 401) {
        await dispatch(refreshToken());
        await dispatch(createAd(ad));
        return;
      } else {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  };
}

// /api/v1/ads/
export function fetchAllAds(
  adStatus,
  province = "",
  status = "",
  itemType = "",
  search = "",
  page = null
) {
  return async (dispatch) => {
    try {
      dispatch(adActions.setAdLoading());
      const { data } = await request.get(
        `/api/v1/ads?adStatus=${adStatus}&province=${province}&status=${status}&itemType=${itemType}&search=${search}&page=${page}`,
        {
          headers: {
            Cookie: document.i18next,
          },
          withCredentials: true,
        }
      );

      dispatch(adActions.setAds(data.ads));
      dispatch(adActions.setSearchResultsCount(data.count));
      dispatch(adActions.clearAdLoading());
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(adActions.clearAdLoading());
    }
  };
}

// /api/posts/user/:userId
export function fetchUserPosts(userId) {
  return async (dispatch, getState) => {
    try {
      dispatch(adActions.setPostLoading());
      const { data } = await request.get(`/api/posts/user/${userId}`, {
        headers: {
          Cookie: document.i18next,
        },
        withCredentials: true,
      });
      const payload = data.map((post) => ({
        ...post,
        liked: post.likedBy.includes(getState().auth.user?.id),
      }));
      dispatch(adActions.setPosts(payload));
      dispatch(adActions.clearPostLoading());
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(adActions.clearPostLoading());
    }
  };
}

// /api/v1/ads/:adId
export function updateAd(adId, ad) {
  return async (dispatch, getState) => {
    try {
      // dispatch(adActions.setAdLoading());
      const { data } = await request.put(`/api/v1/ads/${adId}`, ad, {
        headers: {
          Authorization: "Bearer " + getState().auth.user.token,
          Cookie: document.cookie.i18next,
        },
        withCredentials: true,
      });
      // console.log(data);
      dispatch(adActions.updateAd(data.data));
      // dispatch(adActions.clearAdLoading());
      // toast.success(data.message);
    } catch (error) {
      console.log(error);
      // toast.error(error.response.data.message);
      // dispatch(adActions.clearAdLoading());
    }
  };
}

// /api/posts/:postId
export function deleteAd(adId) {
  return async (dispatch, getState) => {
    try {
      dispatch(adActions.setAdLoading());
      const { data } = await request.delete(`/api/v1/ads/${adId}`, {
        headers: {
          Authorization: "Bearer " + getState().auth.user.token,
          Cookie: document.i18next,
        },
        withCredentials: true,
      });
      dispatch(adActions.removeAdFromAds(data.data._id));
      dispatch(adActions.clearAdLoading());
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch(adActions.clearAdLoading());
    }
  };
}

// /api/v1/ads/:adId
export function getAd(adId) {
  return async (dispatch) => {
    try {
      dispatch(adActions.setAdLoading());
      const { data } = await request.get(`/api/v1/ads/${adId}`, {
        headers: {
          Cookie: document.i18next,
        },
        withCredentials: true,
      });
      dispatch(adActions.setCurrentAd(data.data));
      dispatch(adActions.clearAdLoading());
    } catch (error) {
      console.log(error);
    }
  };
}

// /api/posts/:postId/like
export function likePost(postId) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.put(`/api/posts/${postId}/like`, null, {
        headers: {
          Authorization: "Bearer " + getState().auth.user.token,
          Cookie: document.i18next,
        },
        withCredentials: true,
      });
      dispatch(adActions.likePost(data.data));
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
}

// /api/posts/:postId/like
export function unlikePost(postId) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.put(`/api/posts/${postId}/unlike`, null, {
        headers: {
          Authorization: "Bearer " + getState().auth.user.token,
          Cookie: document.i18next,
        },
        withCredentials: true,
      });
      dispatch(adActions.unlikePost(data.data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// /api/mechanic/:id/photo
export function uploadAdPhotos(id, photos) {
  return async (dispatch, getState) => {
    try {
      const uploadConfig = await request.get("/api/v1/upload", {
        headers: {
          Authorization: "Bearer " + getState().auth.user.token,
          Cookie: document.cookie.i18next,
        },
        withCredentials: true,
      });

      const uploadPromises = photos.map((photo) => {
        return axios.put(uploadConfig.data.url, photo, {
          headers: {
            "Content-Type": photo.type,
          },
        });
      });

      await Promise.all(uploadPromises);

      const photoUrls = photos.map(
        (photo) => `${uploadConfig.data.url}/${photo.name}`
      );

      return photoUrls;
    } catch (error) {
      if (error.response.status === 401) {
        await dispatch(refreshToken());
        await dispatch(uploadAdPhotos(photos));
        return;
      } else {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  };
}
