import { Hono } from "hono";
import { cors } from "hono/cors";
import project from "./routes/project.routes";
import pipeline from "./routes/pipeline.routes";
import run from "./routes/run.routes";
import webhook from "./routes/webhook.routes";
import connectDb from "./config/db";
import ws, { websocket } from "./routes/ws.routes";
import seed from "./routes/seed.routes";

await connectDb();

const app = new Hono();

app.use("*", cors({ origin: "*" }));

app.get("/api/health", (c) => {
  return c.text("server running...");
});

app.route("/api/project", project);
app.route("/api/pipeline", pipeline);
app.route("/api/run", run);
app.route("/api/webhook", webhook);
app.route("/api/seed", seed);
app.route("/ws", ws);

export default {
  fetch: app.fetch,
  websocket,
};
