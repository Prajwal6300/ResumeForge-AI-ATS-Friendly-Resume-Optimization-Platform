/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
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
  },
};

export default nextConfig;
