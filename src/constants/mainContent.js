import axios from "axios";
import logo from "/logo1.png";
import { removeToken, removeRole, removeBannerShown } from "../utils/authStorage";
import Swal from "sweetalert2";

const mainContent = {
  logo: logo,
  appName: "Whiold",
  subtitle: "The next generation of social media",
  description:
    "Whiold is a social media platform that is designed to be more focused on community and engagement than on the number of followers.",
};

export const backendConfig = {
  base: import.meta.env.VITE_BASE_URL 
}

export const Axios = axios.create({
  baseURL: backendConfig.base,
  withCredentials: true,
});
Axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 || error.response.status === 403) {
      console.warn("⚠️ Unauthorized! Logging out...");
      Swal.fire({
        icon: "warning",
        title: "Session Expired",
        text: "Your session has expired. Please log in again.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then(() => {
        removeToken();
        removeRole();
        removeBannerShown();
        window.location.href = "/login";
      });
    }

    return Promise.reject(error);
  },
);

export default mainContent;