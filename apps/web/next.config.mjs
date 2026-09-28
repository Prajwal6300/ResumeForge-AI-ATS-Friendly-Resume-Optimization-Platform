/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Only rewrite to localhost in development; in production the frontend
    // must call NEXT_PUBLIC_API_URL directly so the API hits the correct
    // deployed backend (Render, Fly, etc.) rather than localhost.
    if (process.env.NODE_ENV === "development") {
      const rawBackend = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const baseBackend = rawBackend.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "");
      return [
        {
          source: "/api/v1/:path*",
          destination: `${baseBackend}/api/v1/:path*`,
        },
        {
          source: "/uploads/:path*",
          destination: `${baseBackend}/uploads/:path*`,
        },
      ];
    }
    // In production: no rewrites – the frontend uses NEXT_PUBLIC_API_URL directly
    return [];
  },
};

export default nextConfig;