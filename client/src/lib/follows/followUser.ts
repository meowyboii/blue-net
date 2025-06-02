import api from "../api";

export const followUser = async (followingId: string) => {
  console.log("Creating following with id:", followingId);
  const response = await api.post(`follow/${followingId}`);
  return response.data;
};
