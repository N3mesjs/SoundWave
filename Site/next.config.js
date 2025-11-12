/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
  images: {
    remotePatterns: [new URL('https://i1.sndcdn.com/**')],
  }
};