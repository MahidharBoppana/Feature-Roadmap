import api from "@/lib/axios";

export const getMyFeatures = async (params = {}) => {
  const response = await api.get("/users/me/features", {
    params,
  });

  return response.data;
};
