import axios from "axios";
import axiosRetry from "axios-retry";
import { validatedEnv } from "./validateEnvVars";

export const axiosInstance = axios.create({
  baseURL: validatedEnv.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 5000, // 5 seconds
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/account/auth/refresh")
    ) {
      console.log("Trying to refresh token...");
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.get("/account/auth/refresh");
        processQueue(null, null);
        return axiosInstance(originalRequest);
      } catch {
        processQueue(error, null);
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

axiosRetry(axiosInstance, {
  retries: 3,

  retryCondition: (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return false;
    }
    return axiosRetry.isNetworkOrIdempotentRequestError(error);
  },

  retryDelay: (retryCount, error) => {
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers["retry-after"];
      if (retryAfter) {
        return parseInt(retryAfter) * 1000;
      }
    }
    return axiosRetry.exponentialDelay(retryCount);
  },
});
