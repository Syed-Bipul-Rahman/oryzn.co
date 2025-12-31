import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/checkout/"],
    },
    sitemap: "https://orizn-store.vercel.app/sitemap.xml",
  };
}
