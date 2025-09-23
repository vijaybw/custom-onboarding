import axios from "axios";

const api = axios.create({
  baseURL: __API_URL__, // injected from vite.config.js
});

export default api;