import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/mcp",
          has: [{ type: "host", value: "mcp.genome.computer" }],
          destination: "/mcp",
        },
        {
          source: "/.well-known/oauth-authorization-server",
          has: [{ type: "host", value: "mcp.genome.computer" }],
          destination: "/api/oauth/well-known/oauth-authorization-server",
        },
        {
          source: "/.well-known/openid-configuration",
          has: [{ type: "host", value: "mcp.genome.computer" }],
          destination: "/api/oauth/well-known/oauth-authorization-server",
        },
        {
          source: "/.well-known/oauth-protected-resource",
          has: [{ type: "host", value: "mcp.genome.computer" }],
          destination: "/api/oauth/well-known/oauth-protected-resource",
        },
        {
          source: "/oauth/register",
          has: [{ type: "host", value: "mcp.genome.computer" }],
          destination: "/api/oauth/register",
        },
        {
          source: "/oauth/consent",
          has: [{ type: "host", value: "mcp.genome.computer" }],
          destination: "/api/oauth/consent",
        },
        {
          source: "/oauth/token",
          has: [{ type: "host", value: "mcp.genome.computer" }],
          destination: "/api/oauth/token",
        },
        {
          source: "/oauth/revoke",
          has: [{ type: "host", value: "mcp.genome.computer" }],
          destination: "/api/oauth/revoke",
        },
      ],
    };
  },
};

export default nextConfig;
