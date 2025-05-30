import api from "../api";

export const getComments = async (
  postId: string,
  skip?: number,
  take?: number
) => {
  const response = await api.get(`post/${postId}/comments`, {
    params: { skip, take },
  });
  return response.data;
};
