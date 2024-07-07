import { toast } from "sonner";
import request from "../../utils/request";
import { adActions } from "../slices/adSlice";
import axios from "axios";
import { refreshToken } from "./authApiCall";
import { profileActions } from "../slices/profileSlice";
import { apiRequest } from "../../utils/apiRequest";

// /api/v1/ads/
export function createAd(ad) {
  return async () => {
    try {
      const { photos } = ad;

      // Request presigned URLs for multiple photos
      const { data: uploadConfigs } = await apiRequest(
        "/api/v1/upload",
        "POST",
        {
          count: photos.length,
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

      const { data } = await apiRequest("/api/v1/ads", "POST", adWithImages);

      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
}

// /api/v1/ads/
export function fetchAllAds(
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
        `/api/v1/ads?province=${province}&status=${status}&itemType=${itemType}&search=${search}&page=${page}`,
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

// /api/v1/ads/users/:userId
export function fetchAllUserAds(userId) {
  return async (dispatch) => {
    try {
      dispatch(adActions.setUserAdsLoading());
      const { data } = await request.get(`/api/v1/ads/users/${userId}`, {
        headers: {
          Cookie: document.i18next,
        },
        withCredentials: true,
      });

      dispatch(adActions.setAds(data));
      dispatch(adActions.clearUserAdsLoading());
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(adActions.clearUserAdsLoading());
    }
  };
}

async function uploadPhotos(files, uploadConfigs) {
  // Upload each photo using its corresponding presigned URL
  const uploadPromises = files.map((file, index) => {
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

  return photoUrls;
}

// /api/v1/ads/:adId
export function updateAd(adId, newAd) {
  return async (dispatch) => {
    try {
      dispatch(adActions.setAdLoading());
      let newPhotoUrls = [];

      if (newAd.newFiles.length >= 1) {
        const { data: uploadConfigs } = await apiRequest(
          "/api/v1/upload",
          "POST",
          {
            count: newAd.newFiles.length,
          }
        );

        // Upload new photos to S3
        newPhotoUrls = await uploadPhotos(newAd.newFiles, uploadConfigs);
      }
      const allPhotoUrls = [...newAd.existingFileUrls, ...newPhotoUrls];

      // Prepare the final ad payload
      const finalAdPayload = {
        ...newAd,
        photos: allPhotoUrls,
      };
      delete finalAdPayload.newFiles;
      delete finalAdPayload.existingFileUrls;

      const { data } = await apiRequest(
        `/api/v1/ads/${adId}`,
        "PUT",
        finalAdPayload
      );

      dispatch(adActions.updateAd(data.data));
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
export function deleteAd(adId) {
  return async (dispatch) => {
    try {
      dispatch(adActions.setAdLoading());
      dispatch(profileActions.setLoading());
      const { data } = await apiRequest(`/api/v1/ads/${adId}`, "DELETE");

      dispatch(adActions.removeAdFromAds(data.data._id));
      dispatch(profileActions.removeUserAdFromAds(data.data._id));
      dispatch(adActions.clearAdLoading());
      dispatch(profileActions.clearLoading());
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch(adActions.clearAdLoading());
      dispatch(profileActions.clearLoading());
    }
  };
}

// /api/v1/ads/:adId
export function getAd(adId) {
  return async (dispatch, getState) => {
    const user = getState()?.auth?.user;
    try {
      dispatch(adActions.setAdLoading());

      const { data } = await request.get(`/api/v1/ads/${adId}`, {
        headers: {
          Authorization: user?.token ? "Bearer " + user.token : "",
          Cookie: document.i18next, // Include cookie for language preferences
        },
        withCredentials: true,
      });

      dispatch(adActions.setCurrentAd(data.data));
      dispatch(adActions.clearAdLoading());
    } catch (error) {
      console.log(error);
      if (user) {
        if (error?.response?.status === 401) {
          await dispatch(refreshToken());
          await dispatch(getAd(adId));
          return;
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error("يرجي اعادة المحاولة لاحقا");
      }
      dispatch(adActions.clearAdLoading());
    }
  };
}
