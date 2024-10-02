/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['images.unsplash.com', 'assets.aceternity.com','pbs.twimg.com','firebasestorage.googleapis.com'], // Add the Unsplash domain here
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  };

export default nextConfig;
