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
    origin: ["http://localhost:5173", "http://localhost:3000"],
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

const port = parseInt(Bun.env.PORT || "3001");

console.log(`🚀 API server starting on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
