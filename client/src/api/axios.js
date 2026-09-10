import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ===============================
// ADD JWT TOKEN TO REQUESTS
// ===============================
api.interceptors.request.use(
  (config) => {
    let token = null;

    // Admin APIs
    if (config.url?.startsWith("/admin")) {
      token = localStorage.getItem("adminToken");
    }

    // Provider APIs
    if (config.url?.startsWith("/provider")) {
      token = localStorage.getItem("providerToken");
    }

    // Add Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===============================
// RESPONSE ERROR HANDLER
// ===============================
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(
      "API ERROR:",
      error.response?.status,
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default api;