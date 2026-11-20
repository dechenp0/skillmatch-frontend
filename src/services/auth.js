import { apiFetch } from "./api";

export const registerUser = ({ name, email, password }) =>
  apiFetch("/api/auth/register/", { method: "POST", body: { name, email, password } });

export const loginUser = ({ email, password, remember }) =>
  apiFetch("/api/auth/login/", { method: "POST", body: { email, password, remember } });

export const logoutUser = () => apiFetch("/api/auth/logout/", { method: "POST" });

export const getCurrentUser = () => apiFetch("/api/auth/me/");