import api from "../api";
import { CommentData } from "@/schemas/comment";

export const createComment = async (payload: CommentData, postId: string) => {
  console.log("Creating comment with payload:", payload);
  const response = await api.post(`post/${postId}/comments`, payload);
  return response.data;
};
