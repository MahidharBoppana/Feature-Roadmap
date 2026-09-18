import api from "@/lib/axios";

export const createComment = async (
  featureId,
  content,
  parentComment = null,
) => {
  const response = await api.post(`/features/${featureId}/comments`, {
    content,
    parentComment,
  });

  return response.data;
};

export const updateComment = async (commentId, content) => {
  const response = await api.patch(`/comments/${commentId}`, {
    content,
  });

  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);

  return response.data;
};
