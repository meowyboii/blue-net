import api from "../api";
import { ReactionData } from "@/types/reaction";

export const createReaction = async (payload: ReactionData) => {
  console.log("Creating reaction with payload:", payload);
  const response = await api.post("/reaction/create", payload);
  return response.data;
};
