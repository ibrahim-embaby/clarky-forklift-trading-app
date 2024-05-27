import { toast } from "react-toastify";
import request from "../../utils/request";
import { authActions } from "../slices/authSlice";
import { profileActions } from "../slices/profileSlice";

// /api/v1/auth/register
export function registerUser(user) {
  return async () => {
    try {
      const { data } = await request.post("/api/v1/auth/register", user, {
        headers: {
          Cookie: document.cookie.i18next,
        },
        withCredentials: true,
      });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// /api/v1/auth/login
export function loginUser(user) {
  return async (dispatch) => {
    try {
      const { data } = await request.post("/api/v1/auth/login", user, {
        headers: {
          Cookie: document.cookie.i18next,
        },
        withCredentials: true,
      });
      dispatch(authActions.setUser(data));
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
}

// /api/v1/auth/me
export function fetchMe() {
  return async (dispatch, getState) => {
    try {
      dispatch(authActions.setLoading());
      const { data } = await request.get("/api/v1/auth/me", {
        headers: {
          Authorization: "Bearer " + getState().auth.user.token,
          Cookie: document.cookie.i18next,
        },
        withCredentials: true,
      });
      dispatch(authActions.setUser(data));
      dispatch(authActions.clearLoading());
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch(authActions.clearLoading());
    }
  };
}

// /api/v1/auth/signout
export function logoutUser() {
  return async (dispatch) => {
    dispatch(profileActions.clearProfile());
    await request.get("/api/v1/auth/signout", { withCredentials: true });
    dispatch(authActions.logout());
  };
}

// /api/v1/auth/send-verification-mail
export function sendVerificationMail(email, userType) {
  return async (dispatch) => {
    try {
      const { data } = await request.post(
        "/api/v1/auth/send-verification-mail",
        {
          email,
          userType,
        },
        {
          headers: {
            Cookie: document.cookie.i18next,
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
    } catch (error) {
      if (error.response.status === 404) {
        await dispatch(logoutUser());
      }
      toast.error(error.response.data.message);
    }
  };
}

// /api/v1/auth/verify-email
export function verifyEmail(token) {
  return async (dispatch) => {
    try {
      dispatch(authActions.setLoading());
      const { data } = await request.post(
        "/api/v1/auth/verify-email",
        {
          token,
        },
        {
          headers: {
            Cookie: document.cookie.i18next,
          },
          withCredentials: true,
        }
      );

      let user =
        localStorage.getItem("userInfo") &&
        localStorage.getItem("userInfo") !== "undefined"
          ? JSON.parse(localStorage.getItem("userInfo"))
          : null;
      if (user && user.email !== data.data?.email) {
        dispatch(logoutUser());
      }
      dispatch(authActions.verifyAccount(data.data));

      dispatch(authActions.clearLoading());
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch(authActions.clearLoading());
    }
  };
}

// /api/v1/auth/forgot-password
export function forgotPassword(email, userType) {
  return async () => {
    try {
      const { data } = await request.post(
        "/api/v1/auth/forgot-password",
        {
          email,
          userType,
        },
        {
          headers: {
            Cookie: document.cookie.i18next,
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// /api/v1/auth/reset-password
export function resetPassword(token, password) {
  return async () => {
    try {
      const { data } = await request.post(
        "/api/v1/auth/reset-password",
        {
          token,
          password,
        },
        {
          headers: {
            Cookie: document.cookie.i18next,
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// /api/v1/auth/refresh-token
export function refreshToken() {
  return async (dispatch) => {
    try {
      const { data } = await request.get("/api/v1/auth/refresh-token", {
        withCredentials: true,
      });
      dispatch(authActions.updateToken(data.token));
    } catch (error) {
      if (error.response.status === 403 || error.response.status === 404) {
        await dispatch(logoutUser());
      }
      toast.error(error.response.data.message);
    }
  };
}
