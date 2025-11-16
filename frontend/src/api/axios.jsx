import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Queue to hold pending requests while refreshing
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request has already been retried, reject immediately
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If we're currently refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    return new Promise((resolve, reject) => {
      // Create a new axios instance without interceptors for refresh call
      const refreshApi = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        withCredentials: true,
      });

      refreshApi
        .post("/auth/refresh-token")
        .then((response) => {
          const newAccessToken = response.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);

          // Update authorization header for future requests
          api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          resolve(api(originalRequest));
        })
        .catch((refreshError) => {
          console.error("Refresh token expired or invalid:", refreshError);
          
          // Clear tokens and redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          processQueue(refreshError, null);
          
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = "/login";
          }
          
          reject(refreshError);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  }
);


export const LoginUser = async (userData) => {
  const res = await api.post("/auth/login", userData);
  const { accessToken, user } = res.data;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("user", JSON.stringify(user));

  return res;
};

export const SignupUser = async (userData) => {
  const res = await api.post("/auth/signup", userData);
  const { accessToken, user } = res.data;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("user", JSON.stringify(user));

  return res;
};

export const LogoutUser = async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

export default api;
