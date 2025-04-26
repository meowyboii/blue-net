import axios from "axios";

// Create an axios instance with a base URL and credentials enabled
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
  withCredentials: true,
});

export default api;
