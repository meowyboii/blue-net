import api from "../api";

export const getPost = async (postId: string) => {
  const response = await api.get(`/post/${postId}`);
  return response.data;
};
