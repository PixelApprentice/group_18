/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable static export for deployment
  output: 'export',
  trailingSlash: true,
  // Remove outputFileTracingRoot for static export
}

export default nextConfig
