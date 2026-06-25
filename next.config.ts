import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  watchOptions: {
    pollIntervalMs: 1000,
  },
  async redirects() {
    return [
      { source: "/demo/dashboard/:path*", destination: "/demo", permanent: false },
      { source: "/demo/incidents/war-room", destination: "/demo", permanent: false },
      { source: "/demo/incidents/:id", destination: "/demo/incident/:id", permanent: false },
      { source: "/demo/incidents", destination: "/demo/pack/bangkaew", permanent: false },
      { source: "/demo/approvals/:path*", destination: "/demo/pack/collie", permanent: false },
      { source: "/demo/code/:path*", destination: "/demo/pack/retriever", permanent: false },
      { source: "/demo/cicd/:path*", destination: "/demo/pack/retriever", permanent: false },
      { source: "/demo/assets/:path*", destination: "/demo/pack/shepherd", permanent: false },
      { source: "/demo/runtime/:path*", destination: "/demo/pack/shepherd", permanent: false },
      { source: "/demo/playbooks/:path*", destination: "/demo/pack/collie", permanent: false },
      { source: "/demo/red-team/:path*", destination: "/demo/pack/pitbull", permanent: false },
      { source: "/demo/ai/:path*", destination: "/demo/pack/bangkaew", permanent: false },
      { source: "/demo/reports/:path*", destination: "/demo", permanent: false },
      { source: "/demo/admin/:path*", destination: "/demo/setup", permanent: false },
      { source: "/demo/setup/wizard", destination: "/demo/setup", permanent: false },
      { source: "/demo/setup/health", destination: "/demo/setup", permanent: false },
      { source: "/demo/setup/checklist", destination: "/demo/setup", permanent: false },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Avoid ENOSPC when IDE + Next.js exceed inotify max_user_watches
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ["**/node_modules/**", "**/.git/**"],
      };
    }
    return config;
  },
};

export default nextConfig;
