import { userProfileData } from "@/schemas/user";
import api from "../api";

export const updateUserProfile = async (payload: userProfileData) => {
  const formData = new FormData();
  formData.append("displayName", payload.displayName);
  if (payload.bio) {
    formData.append("bio", payload.bio);
  }
  if (payload.avatar instanceof File) {
    console.log("avatar: ", payload.avatar);
    formData.append("avatar", payload.avatar);
  }

  const response = await api.patch("/user/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
