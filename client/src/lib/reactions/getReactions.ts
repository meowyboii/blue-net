import api from "../api";

export const getReactions = async (postId: string) => {
  const response = await api.get(`/reaction/counts/${postId}`);
  return response.data;
};
