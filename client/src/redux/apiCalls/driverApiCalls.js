import { toast } from "sonner";
import request from "../../utils/request";
import axios from "axios";
import { refreshToken } from "./authApiCall";
import { apiRequest } from "../../utils/apiRequest";
import { driverActions } from "../slices/driverSlice";

// /api/v1/drivers/
export function createDriver(driver, driverPhoto) {
  return async () => {
    try {
      if (driverPhoto) {
        // Request signed upload URL for the driver photo
        const { data: uploadConfig } = await apiRequest(
          "/api/v1/upload",
          "POST",
          {
            count: 1,
          }
        );

        // Upload the driver photo using the signed upload URL
        const formData = new FormData();
        formData.append("file", driverPhoto);
        formData.append("api_key", uploadConfig[0].api_key);
        formData.append("timestamp", uploadConfig[0].timestamp);
        formData.append("public_id", uploadConfig[0].public_id);
        formData.append("signature", uploadConfig[0].signature);

        const uploadResponse = await axios.post(uploadConfig[0].url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Update driver photo property with Cloudinary response
        driver["photo"] = {
          public_id: uploadResponse.data.public_id,
          url: uploadResponse.data.secure_url,
        };
      }

      const { data } = await apiRequest("/api/v1/drivers", "POST", driver);

      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
}

// /api/v1/drivers/
export function fetchAllDrivers(
  province = "",
  cities = [],
  experienceYears = [],
  page = 1
) {
  return async (dispatch) => {
    try {
      dispatch(driverActions.setLoading());
      const { data } = await request.get(
        `/api/v1/drivers?province=${province}&cities=${cities}&experienceYears=${experienceYears}&page=${page}`,
        { withCredentials: true }
      );

      dispatch(driverActions.setDrivers(data.drivers));
      dispatch(driverActions.setSearchResultsCount(data.count));
      dispatch(driverActions.clearLoading());
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(driverActions.clearLoading());
    }
  };
}

// /api/v1/drivers/:id
export function getDriver(id) {
  return async (dispatch, getState) => {
    const user = getState()?.auth?.user;
    try {
      dispatch(driverActions.setLoading());

      const { data } = await request.get(`/api/v1/drivers/${id}`, {
        headers: {
          Authorization: user?.token ? "Bearer " + user.token : "",
          Cookie: document.i18next, // Include cookie for language preferences
        },
        withCredentials: true,
      });

      dispatch(driverActions.setCurrentDriver(data.data));
      dispatch(driverActions.clearLoading());
    } catch (error) {
      console.log(error);
      if (user) {
        if (error?.response?.status === 401) {
          await dispatch(refreshToken());
          await dispatch(getDriver(id));
          return;
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error("يرجي اعادة المحاولة لاحقا");
      }
      dispatch(driverActions.clearLoading());
    }
  };
}

// /api/v1/drivers/:id
export function updateDriver(id, driver) {
  return async (dispatch) => {
    try {
      dispatch(driverActions.setLoading());

      if (driver.photo) {
        // Request signed upload URL for the new driver photo
        const { data: uploadConfig } = await apiRequest(
          "/api/v1/upload",
          "POST",
          {
            count: 1,
          }
        );

        // Upload the new driver photo using the signed upload URL
        const formData = new FormData();
        formData.append("file", driver.photo);
        formData.append("api_key", uploadConfig[0].api_key);
        formData.append("timestamp", uploadConfig[0].timestamp);
        formData.append("public_id", uploadConfig[0].public_id);
        formData.append("signature", uploadConfig[0].signature);

        const uploadResponse = await axios.post(uploadConfig[0].url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Update driver photo property with Cloudinary response
        driver["photo"] = {
          public_id: uploadResponse.data.public_id,
          url: uploadResponse.data.secure_url,
        };
      }

      const { data } = await apiRequest(`/api/v1/drivers/${id}`, "PUT", driver);

      dispatch(driverActions.removeDriverFromDrivers(data.data));
      dispatch(driverActions.clearLoading());
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch(driverActions.clearLoading());
    }
  };
}

// /api/v1/drivers/:id
export function deleteDriver(id) {
  return async (dispatch) => {
    try {
      dispatch(driverActions.setLoading());
      const { data } = await apiRequest(`/api/v1/drivers/${id}`, "DELETE");

      dispatch(driverActions.removeDriverFromDrivers(data.data._id));
      dispatch(driverActions.clearLoading());
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch(driverActions.clearLoading());
    }
  };
}
