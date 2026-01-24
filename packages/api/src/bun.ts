// Bun-specific entry point
import app from "./index";
import type { Bindings } from "./types";

const port = parseInt(Bun.env.PORT || "3001");

console.log(`🚀 API server starting on port ${port}`);

export default {
  port,
  fetch: (request: Request) => {
    const env: Bindings = {
      RELAYER_PRIVATE_KEY: Bun.env.RELAYER_PRIVATE_KEY || "",
      PORT: Bun.env.PORT,
    };
    return app.fetch(request, env);
  },
};
