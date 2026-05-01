import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/profil",
          "/reset-password",
        ],
      },
    ],
    sitemap: "https://alltoolbox.fr/sitemap.xml",
  };
}
