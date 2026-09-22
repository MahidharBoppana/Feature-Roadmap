import api from "@/lib/axios";

export const updateFeatureStatus = async (featureId, status) => {
  const response = await api.patch(`/admin/features/${featureId}/status`, {
    status,
  });

  return response.data;
};
