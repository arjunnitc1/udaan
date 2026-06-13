/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Note: serverExternalPackages is a Next.js 15+ option.
  // For Next.js 14, the `postgres` driver works without this flag.
  // When you upgrade to Next.js 15, uncomment the line below:
  // serverExternalPackages: ["postgres"],
};

export default nextConfig;
