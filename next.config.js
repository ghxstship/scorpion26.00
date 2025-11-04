/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  webpack: (config, { isServer }) => {
    // Ignore optional native modules that are not available in web builds
    config.externals = config.externals || [];
    config.externals.push({
      '@capacitor-community/health': 'commonjs @capacitor-community/health',
    });
    
    return config;
  },
};

module.exports = nextConfig;
