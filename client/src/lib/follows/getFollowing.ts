import api from "../api";

export const getFollowing = async () => {
  const response = await api.get(`follow/following`);
  console.log("Fetched following:", response.data);
  return response.data;
};
