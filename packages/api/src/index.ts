import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import reverseRoutes from "./routes/reverse";

const app = new Hono();

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

// Mount routes
app.route("/api", reverseRoutes);

// Export for Cloudflare Workers
export default app;
