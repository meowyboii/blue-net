import api from "../api";
import { PostData } from "@/schemas/post";

export const createPost = async (payload: PostData) => {
  console.log("Creating post with payload:", payload);
  const response = await api.post("/post/create", payload);
  return response.data;
};
