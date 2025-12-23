import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/v1/api',
  withCredentials: true,
});

let csrfToken = null;

export const setCsrfToken = (token) => {
  csrfToken = token;
};

// On attaching CSRF token before every request
api.interceptors.request.use((config) => {
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// On response interceptor with refresh
let isRefreshing = false;
let FailedQueue = [];

const  processQueue = (error) => {
  FailedQueue.forEach((p) => p.reject(error));
  FailedQueue = [];
};

// On handling expired JWT or invalid CSRF
api.interceptors.response.use(
  (response) => response, 
   async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((_, reject) => {
          FailedQueue.push({ reject });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh');
        isRefreshing = true;
        FailedQueue = [];
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);

        if (api.logoutHandler) {
          api.logoutHandler();
        }

        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      if (api.logoutHandler){
        api.logoutHandler();
      }
    }

    return Promise.reject(error);
  }
);

export default api