import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/private/",
    },
    sitemap: "http://localhost:3000/sitemap.xml",
  };
}
