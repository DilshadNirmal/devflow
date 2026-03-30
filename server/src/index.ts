import { Hono } from "hono";
import project from "../routes/project.routes";
import pipeline from "../routes/pipeline.routes";
import run from "../routes/run.routes";
import webhook from "../routes/webhook.routes";

const app = new Hono();

app.get("/api/health", (c) => {
  return c.text("server running...");
});

app.route("/api/project", project);
app.route("/api/pipeline", pipeline);
app.route("/api/run", run);
app.route("/api/webhook", webhook);

export default app;
