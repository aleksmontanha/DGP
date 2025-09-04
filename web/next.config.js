/**
 * Arquivo CommonJS para garantir que o Next carregue allowedDevOrigins em ambiente dev
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.13.210:3000',
    'http://192.168.13.120:3000'
  ],
};

module.exports = nextConfig;
