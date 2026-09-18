import api from "@/lib/axios";

export const signupUser = async (userData) => {
  const response = await api.post("/auth/signup", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await api.post("/auth/refresh-token");
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await api.post("/auth/verify-email", { token });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.post("/auth/reset-password", {
    token,
    password,
  });

  return response.data;
};
