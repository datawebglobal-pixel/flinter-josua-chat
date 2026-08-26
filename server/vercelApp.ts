import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { registerOAuthRoutes } from "./_core/oauth";
import { registerStorageProxy } from "./_core/storageProxy";

/**
 * Express application factory for serverless platforms such as Vercel.
 * It deliberately does not call listen(); the platform owns the HTTP lifecycle.
 */
export function createVercelApp() {
  const app = express();

  app.use(express.json({ limit: "4mb" }));
  app.use(express.urlencoded({ limit: "4mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ ok: true, service: "flinter-josua-chat", runtime: "vercel" });
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  return app;
}

export const vercelApp = createVercelApp();
