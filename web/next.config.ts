/** @type {import('next').NextConfig} */
const nextConfig = {
  // liste TODAS as origens que vão abrir o seu app em DEV
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.13.210:3000", // IP do servidor que roda o Next
    "http://192.168.13.120:3000"  // máquina cliente que acessa
  ],
};

// Para Next com TypeScript, exporte como default
export default nextConfig;
