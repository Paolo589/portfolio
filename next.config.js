/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.paolominopoli.com',
      },
      {
        protocol: 'https',
        hostname: 'www.paolopiez.com',
      },
      {
        protocol: 'https',
        hostname: 'paolominopoli.com',
      },
    ],
  },
  i18n: {
    locales: ["it"],
    defaultLocale: "it",
  },
}

module.exports = nextConfig
