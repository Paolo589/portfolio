/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:{
    domains:['www.dariovettura.com','paolominopoli.vercel.app']
  },
  i18n: {
    locales: ["it"],
    defaultLocale: "it",
  },
}

module.exports = nextConfig
