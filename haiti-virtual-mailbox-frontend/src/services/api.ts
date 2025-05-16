import axios from "axios";

const api = axios.create({
  baseURL: "/api", // ✅ Make sure it's "/api" only, no extra slashes
});

// ✅ Interceptor to automatically attach Authorization header
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("haitiUser");
  if (userInfo && config.headers) {
    const user = JSON.parse(userInfo);
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

export default api;
