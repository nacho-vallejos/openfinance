import type { MetadataRoute } from "next";

const baseUrl = "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/home",
    "/conexiones",
    "/certificado",
    "/ofertas-credito",
    "/asistente-fiscal",
    "/catalogo-bancos",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "/home" ? 1 : 0.8,
  }));
}
