import axios from "axios";

const API_BASE_URL = "https://YOUR-ACTUAL-BACKEND-URL";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export default api;
