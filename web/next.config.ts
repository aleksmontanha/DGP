/** @type {import('next').NextConfig} */
const nextConfig = {
  // permita abrir o app a partir desses “origins” na rede local
  allowedDevOrigins: ['192.168.13.120', '*.local', 'localhost'],
};

module.exports = nextConfig;
