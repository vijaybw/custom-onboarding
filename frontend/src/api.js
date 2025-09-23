import axios from "axios";

const api = axios.create({
  baseURL: "https://custom-onboarding-q00q.onrender.com/api/", // injected from vite.config.js
});

export default api;