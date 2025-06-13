import api from "../api";
import { PostData } from "@/schemas/post";

export const createPost = async (payload: PostData) => {
  console.log("Creating post with payload:", payload);
  const formData = new FormData();
  formData.append("content", payload.content);

  if (payload.audio instanceof File) {
    console.log("audio: ", payload.audio);
    formData.append("audio", payload.audio);
  }

  const response = await api.post("/post/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
