import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  redirects() {
    return [
      {
        source: "/",
        destination: "/knowledge",
        permanent: false,
      },
      {
        source: "/knowledge/:page(view|edit)",
        missing: [{ type: "query", key: "id" }],
        destination: "/knowledge",
        permanent: false,
      },
    ];
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
