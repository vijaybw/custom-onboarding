import axios from "axios";

// Prefer env var, but gracefully fallback
const baseURL =
  import.meta.env.VITE_API_URL?.trim() || 
  (import.meta.env.MODE === "development"
    ? "http://localhost:5001/api" // local fallback
    : "/api"); // relative path in production

console.log("Using API base URL:", baseURL);

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;