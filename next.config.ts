
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, 

  images: {
  
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.corenexis.com',
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https', 
        hostname: 'ibb.co',
        port: '',
        pathname: '/**',
      },
    
    ],
  },
};

module.exports = nextConfig; 