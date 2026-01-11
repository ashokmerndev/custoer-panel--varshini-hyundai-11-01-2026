/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // 👈 Fix for About Page Error
      },
      {
        protocol: 'http',
        hostname: 'localhost', // For local backend images
      }
    ],
  },
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
