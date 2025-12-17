/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'i9.ytimg.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'yt3.googleusercontent.com',
        pathname: '/**'
      },
    ],
  }
};