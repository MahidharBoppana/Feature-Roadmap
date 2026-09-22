import api from "@/lib/axios";

export const getFeatures = async (params = {}) => {
  const response = await api.get("/features", {
    params,
  });

  return response.data;
};

export const getFeatureById = async (featureId) => {
  const response = await api.get(`/features/${featureId}`);

  return response.data;
};

export const createFeature = async (featureData) => {
  const response = await api.post("/features", featureData);

  return response.data;
};

export const updateFeature = async (featureId, featureData) => {
  const response = await api.patch(`/features/${featureId}`, featureData);

  return response.data;
};

export const deleteFeature = async (featureId) => {
  const response = await api.delete(`/features/${featureId}`);

  return response.data;
};

export const voteFeature = async (featureId) => {
  const response = await api.post(`/features/${featureId}/vote`);

  return response.data;
};

export const unvoteFeature = async (featureId) => {
  const response = await api.delete(`/features/${featureId}/vote`);

  return response.data;
};

export const getFeatureComments = async (featureId) => {
  const response = await api.get(`/features/${featureId}/comments`);

  return response.data;
};

export const getRoadmapFeatures = async () => {
  const response = await api.get("/features", {
    params: {
      limit: 50,
      sort: "newest",
    },
  });

  return response.data;
};

