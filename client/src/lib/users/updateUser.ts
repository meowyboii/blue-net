import { userProfileData } from "@/schemas/user";
import api from "../api";

export const updateUserProfile = async (payload: userProfileData) => {
  const response = await api.put("/user/profile", payload);
  return response.data;
};
