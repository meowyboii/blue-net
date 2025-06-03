import api from "../api";

export const getFollowers = async () => {
  const response = await api.get(`follow/followers`);
  console.log("Fetched followers:", response.data);
  return response.data;
};
