import express from "express";
import cors from "cors";
import routes from "./src/routes/index.js";
import { prisma } from "./src/lib/prisma.js";

const app = express();
const PORT = Number(process.env.API_PORT || process.env.PORT || 4000);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "openfinance-api",
  });
});

app.use(routes);

app.use((_req, res) => {
  res.status(404).json({
    error: "NOT_FOUND",
    message: "Endpoint no encontrado.",
  });
});

app.use((error, _req, res, _next) => {
  console.error("API error:", error);

  res.status(error.statusCode || 500).json({
    error: error.code || "INTERNAL_SERVER_ERROR",
    message: error.message || "Ocurrio un error inesperado.",
  });
});

async function shutdown() {
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

app.listen(PORT, () => {
  console.log(`OpenFinance+ API escuchando en http://localhost:${PORT}`);
});
