// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: false, // Garantir que não estamos usando o App Router ainda, focaremos no Pages Router
  },
  // Habilitar CSS Modules por padrão
  webpack: (config) => {
    config.module.rules.forEach((rule) => {
      if (rule.oneOf) {
        rule.oneOf.forEach((oneOfRule) => {
          if (oneOfRule.use && oneOfRule.use.loader === 'next-swc-loader') {
            oneOfRule.use.options.has
          }
        });
      }
    });
    return config;
  },
};

export default nextConfig;