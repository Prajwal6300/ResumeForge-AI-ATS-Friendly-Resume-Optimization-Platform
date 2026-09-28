import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

function resolveApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!url) {
    // Local dev fallback; in production the URL must be set via env var.
    // The "fail loud" mechanism is at runtime when API calls are made,
    // not during the Next.js build prerender phase.
    return "/api/v1";
  }
  const cleaned = url.replace(/\/+$/, "");
  if (!cleaned.endsWith("/api/v1") && !cleaned.includes("/api/")) {
    return `${cleaned}/api/v1`;
  }
  return cleaned;
}

// The base URL is resolved at module load time.
// If NEXT_PUBLIC_API_URL is missing in production, API calls will fail
// with clear error messages from the response interceptor.
export const API_BASE_URL = resolveApiBaseUrl();

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("resumeforge_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle standardized error formats
// and provide clear feedback when the API base URL is misconfigured.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Provide clear error message if the URL is the dev fallback,
    // indicating that NEXT_PUBLIC_API_URL needs to be set in production.
    if (typeof window !== "undefined") {
      // Check if error originates from the API base path
      const urlString = error.config?.url || "";
      if (urlString.includes("/api/v1") && !error.message.startsWith("NEXT_PUBLIC")) {
        // Show a friendly error message in the console to help the operator
        console.error(
          "ResumeForge AI: API request failed. " +
          "This may mean NEXT_PUBLIC_API_URL is not set in your production environment. " +
          "Set it in Vercel/Project Settings > Environment Variables to point " +
          "to your deployed API (e.g. https://your-render-service.onrender.com/api/v1)."
        );
      }
    }
    // Extract custom error message if provided by backend
    const responseData = error.response?.data as { error?: { message?: string; code?: string } } | undefined;
    const serverMessage = responseData?.error?.message;
    if (serverMessage) {
      error.message = serverMessage;
    }

    return Promise.reject(error);
  }
);