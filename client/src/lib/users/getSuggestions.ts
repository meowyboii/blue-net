import api from "../api";

export const getSuggestions = async () => {
  const response = await api.get("/user/suggested");
  return response.data;
};
