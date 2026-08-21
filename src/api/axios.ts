import axios from "axios";

const api = axios.create({
  // Aquí está la clave: busca la variable de Vercel primero, si no existe, usa localhost
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;