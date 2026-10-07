// src/utils/authStorage.js

export const getToken = () => {
  return sessionStorage.getItem("token");
};

export const setToken = (token) => {
  sessionStorage.setItem("token", token);
};

export const removeToken = () => {
  sessionStorage.removeItem("token");
};

export const getRole = () => {
  return sessionStorage.getItem("role");
};

export const setRole = (role) => {
  sessionStorage.setItem("role", role);
}

export const removeRole = () => {
  sessionStorage.removeItem("role");
}

export const removeBannerShown = () => {
  sessionStorage.removeItem("bannerShown");
}