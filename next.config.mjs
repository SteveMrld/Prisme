/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ibb.co' },
    ],
  },
  experimental: {
    viewTransition: true,
  },
}

export default nextConfig
