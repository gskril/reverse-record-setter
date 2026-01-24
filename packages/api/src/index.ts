import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import reverseRoutes from "./routes/reverse";
import type { Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

// Health check
app.get("/", (c) => {
  return c.json({
    name: "ENS Reverse Record Setter API",
    version: "1.0.0",
    status: "ok",
  });
});

// Mount routes
app.route("/api", reverseRoutes);

// Export for Cloudflare Workers
export default app;
