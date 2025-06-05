import api from "../api";

export const getPosts = async (params: { skip?: number; take?: number }) => {
  const response = await api.get("/post", { params });
  return response.data;
};

export const getUserPosts = async (params: {
  skip?: number;
  take?: number;
}) => {
  const response = await api.get("/post/me", { params });
  return response.data;
};
