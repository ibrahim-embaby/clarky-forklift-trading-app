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
      //   Request presigned URL for photo
      const { data: uploadConfigs } = await apiRequest(
        "/api/v1/upload",
        "POST",
        {
          count: 1,
        }
      );

      //   Upload photo to S3
      await axios.put(uploadConfigs[0].url, driverPhoto, {
        headers: {
          "Content-Type": driverPhoto.type,
        },
      });

      //   update driver photo property
      driver["photo"] = {
        key: uploadConfigs[0].key,
        url:
          "https://arabity.s3.eu-north-1.amazonaws.com/" + uploadConfigs[0].key,
      };

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
        const { data: uploadConfigs } = await apiRequest(
          "/api/v1/upload",
          "POST",
          {
            count: 1,
          }
        );

        //   Upload photo to S3
        await axios.put(uploadConfigs[0].url, driver.photo, {
          headers: {
            "Content-Type": driver.photo.type,
          },
        });

        //   update driver photo property
        driver["photo"] = {
          key: uploadConfigs[0].key,
          url:
            "https://arabity.s3.eu-north-1.amazonaws.com/" +
            uploadConfigs[0].key,
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
