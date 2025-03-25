import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Чтобы не зациклиться
      console.log("Access token expired. Trying to refresh...");

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) throw new Error("No refresh token found!");

        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        Cookies.set("accessToken", accessToken, { expires: 1, sameSite: "None", secure: true });
        Cookies.set("refreshToken", newRefreshToken, { expires: 7, sameSite: "None", secure: true });

        console.log("New tokens received:", { accessToken, refreshToken: newRefreshToken });

        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        onRefreshed(accessToken);
        return api(originalRequest);
      } catch (err) {
        console.error("Error refreshing token:", err);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login"; 
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
