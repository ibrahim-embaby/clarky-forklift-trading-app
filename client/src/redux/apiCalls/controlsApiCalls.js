import request from "../../utils/request";
import { controlsActions } from "../slices/controlsSlice";
import { toast } from "sonner";

export function fetchControls() {
  return async (dispatch) => {
    try {
      dispatch(controlsActions.setLoading());

      // fetch statuses
      const { data: statuses } = await request.get(
        "/api/v1/controls/statuses",
        {
          headers: {
            Cookie: document.cookie.i18next,
          },
          withCredentials: true,
        }
      );
      dispatch(controlsActions.setStatuses(statuses));

      // fetch itemTypes
      const { data: itemTypes } = await request.get(
        "/api/v1/controls/item-types",
        {
          headers: {
            Cookie: document.cookie.i18next,
          },
          withCredentials: true,
        }
      );
      dispatch(controlsActions.setItemTypes(itemTypes));

      // fetch adTargets
      const { data: adTargets } = await request.get(
        "/api/v1/controls/ad-targets",
        {
          headers: {
            Cookie: document.cookie.i18next,
          },
          withCredentials: true,
        }
      );
      dispatch(controlsActions.setAdTargets(adTargets));

      // fetch provinces
      const { data: provinces } = await request.get(
        "/api/v1/controls/provinces",
        {
          headers: {
            Cookie: document.cookie.i18next,
          },
          withCredentials: true,
        }
      );
      dispatch(controlsActions.setProvinces(provinces));

      dispatch(controlsActions.clearLoading());
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch(controlsActions.clearLoading());
    }
  };
}

// /api/controls/services
export function fetchServices() {
  return async (dispatch) => {
    try {
      dispatch(controlsActions.setLoading());
      const { data } = await request.get("/api/controls/services", {
        headers: {
          Cookie: document.cookie.i18next,
        },
        withCredentials: true,
      });
      dispatch(controlsActions.setServices(data));
      dispatch(controlsActions.clearLoading());
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch(controlsActions.clearLoading());
    }
  };
}

// /api/controls/cars
export function fetchCars() {
  return async (dispatch) => {
    try {
      dispatch(controlsActions.setLoading());
      const { data } = await request.get("/api/controls/cars", {
        headers: {
          Cookie: document.cookie.i18next,
        },
        withCredentials: true,
      });
      dispatch(controlsActions.setCars(data));
      dispatch(controlsActions.clearLoading());
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch(controlsActions.clearLoading());
    }
  };
}

// /api/controls/provinces
export function fetchProvinces() {
  return async (dispatch) => {
    try {
      dispatch(controlsActions.setLoading());
      const { data } = await request.get("/api/controls/provinces", {
        headers: {
          Cookie: document.cookie.i18next,
        },
        withCredentials: true,
      });
      dispatch(controlsActions.setProvinces(data));
      dispatch(controlsActions.clearLoading());
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch(controlsActions.clearLoading());
    }
  };
}

// /api/controls/province/:id
export function fetchProvince(id) {
  return async (dispatch) => {
    try {
      dispatch(controlsActions.setLoading());
      const { data } = await request.get(`api/controls/province/${id}`, {
        headers: {
          Cookie: document.cookie.i18next,
        },
        withCredentials: true,
      });
      dispatch(controlsActions.setProvince(data));
      dispatch(controlsActions.clearLoading());
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch(controlsActions.clearLoading());
    }
  };
}
