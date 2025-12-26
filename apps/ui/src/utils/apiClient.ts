import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { validatedEnv } from "./validateEnvVars";

function configureInstance(instance: AxiosInstance) {
  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (error?: Error) => void;
  }> = [];

  const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
      if (error) reject(error);
      else resolve(token);
    });
    failedQueue = [];
  };

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const refreshTokenApi = "/account/auth/refresh-token";
      const originalRequest = error.config;

      if (
        (error.response?.status === 401 || error.response?.status === 403) &&
        !originalRequest._retry &&
        !originalRequest.url.includes(refreshTokenApi)
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => instance(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await instance.get(refreshTokenApi);
          processQueue(null, null);
          return instance(originalRequest);
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

  axiosRetry(instance, {
    retries: 3,
    retryCondition: (error) => {
      if (error.response?.status === 401 || error.response?.status === 403)
        return false;
      return axiosRetry.isNetworkOrIdempotentRequestError(error);
    },
    retryDelay: (retryCount, error) => {
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers["retry-after"];
        if (retryAfter) return parseInt(retryAfter) * 1000;
      }
      return axiosRetry.exponentialDelay(retryCount);
    },
  });

  return instance;
}

const clientInstance =
  typeof window !== "undefined"
    ? configureInstance(
        axios.create({
          baseURL: validatedEnv.VITE_API_BASE_URL,
          withCredentials: true,
        }),
      )
    : null;

export const getAxios = createIsomorphicFn()
  .client(() => {
    // singleton client-side instance
    return clientInstance!;
  })
  .server(() => {
    // server-side one-off instances
    const incomingHeaders = getRequestHeaders();

    // Helper to extract headers safely
    const getHeader = (name: string) => {
      if (!incomingHeaders) return "";
      if (typeof (incomingHeaders as Headers).get === "function") {
        return (incomingHeaders as Headers).get(name) ?? "";
      }
      const val = (incomingHeaders as Record<string, any>)[name];
      return Array.isArray(val) ? val.join("; ") : (val ?? "");
    };

    const instance = axios.create({
      baseURL: validatedEnv.VITE_API_BASE_URL,
      withCredentials: true,
      timeout: 5000,
      headers: {
        cookie: getHeader("cookie"),
        "user-agent": getHeader("user-agent"),
      },
    });

    return configureInstance(instance);
  });
