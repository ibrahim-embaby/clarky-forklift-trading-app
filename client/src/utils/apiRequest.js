import axios from "axios";
import { refreshToken } from "../redux/apiCalls/authApiCall";
import store from "../redux/store";

export const apiRequest = async (url, method, data = null, headers = {}) => {
  const state = store.getState();
  let token = state.auth.user.token;
  try {
    const response = await axios({
      url: process.env.REACT_APP_SERVER_URL + url,
      method,
      data,
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired, refresh token
      await store.dispatch(refreshToken());
      token = store.getState().auth.user.token;

      // Retry the request with the new token
      const retryResponse = await axios({
        url: process.env.REACT_APP_SERVER_URL + url,
        method,
        data,
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return retryResponse;
    } else {
      console.log(error);
      throw error;
    }
  }
};
