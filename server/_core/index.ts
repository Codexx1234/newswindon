import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import path from "path";
import helmet from "helmet";
import sharp from "sharp";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { authRateLimiter, globalRateLimiter } from "./rateLimit";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { runMigrations } from "../db";
import { sendAppointmentReminders } from "../reminders";

async function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  // Run database migrations before starting the server
  await runMigrations().catch(err => console.error("Migration failed:", err));

  const app = express();
  const server = createServer(app);

  // Seguridad: Configuración de cabeceras HTTP con Helmet
  app.use(helmet({
    contentSecurityPolicy: false, // Desactivado para facilitar la carga de recursos externos si es necesario
    crossOriginEmbedderPolicy: false,
  }));

  // Limitador de tasa global para prevenir abusos
  app.use(globalRateLimiter);

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  app.use("/api/oauth", authRateLimiter);
  registerOAuthRoutes(app);
  // File Upload Endpoint (Protegido con Rate Limit)
  app.post("/api/upload", authRateLimiter, async (req, res) => {
    try {
      const { image, name } = req.body;
      if (!image || !name) {
        return res.status(400).json({ error: "Faltan datos de la imagen" });
      }

      // Validar que sea una imagen base64
      const matches = image.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Formato de imagen inválido" });
      }

      const buffer = Buffer.from(matches[2], "base64");
      
      // Generar nombre único con extensión .webp
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.webp`;
      const uploadPath = path.join(process.cwd(), "public", "uploads", fileName);

      // Optimizar imagen: Redimensionar (máx 1200px ancho) y convertir a WebP
      await sharp(buffer)
        .resize(1200, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(uploadPath);

      res.json({ url: `/uploads/${fileName}` });
    } catch (error) {
      console.error("[Upload Error]:", error);
      res.status(500).json({ error: "Error al subir la imagen" });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    
    // Run reminders check every hour
    setInterval(() => {
      sendAppointmentReminders().catch(err => console.error("Reminder task failed:", err));
    }, 60 * 60 * 1000);
    
    // Run once on start
    sendAppointmentReminders().catch(err => console.error("Initial reminder task failed:", err));
  });
}

startServer().catch(console.error);
