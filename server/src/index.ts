import { Hono } from "hono";

const app = new Hono();

app.get("/api/health", (c) => {
  return c.text("server running...");
});

export default app;
