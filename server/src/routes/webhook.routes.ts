import { Hono } from "hono";
import { GithubWebhookPayload } from "../types";
import { ProjectModel } from "../models/models";
import { getPipelineByProjectId } from "../services/pipeline.service";
import { createRun } from "../services/run.service";

const webhook = new Hono();

webhook.post("/", async (c) => {
  try {
    const body = await c.req.text();
    const payload = JSON.parse(body) as GithubWebhookPayload;
    const headers = c.req.header("X-Hub-Signature-256");

    const project = await ProjectModel.findOne({
      repo_name: payload.repository.name,
    });

    if (!project) {
      return c.json({ message: "Project not found" }, 404);
    }

    const hasher = new Bun.CryptoHasher("sha256", project.webhook_secret);
    hasher.update(body);
    const expectedSignature = `sha256=${hasher.digest("hex")}`;

    if (headers !== expectedSignature) {
      return c.json({ message: "Invalid Signature" }, 401);
    }

    const pipeline = await getPipelineByProjectId(project._id.toString());

    if (!pipeline) {
      return c.json({ message: "Pipeline not found for the project" }, 404);
    }

    await createRun(pipeline._id.toString(), {
      project: project._id.toString(),
      pipeline: pipeline._id.toString(),
      status: "pending",
      logs: [],
      started_at: new Date(),
      finished_at: null,
    });

    return c.json({ message: "Webhook processed successfully" }, 200);
  } catch (error) {
    console.error((error as Error).message);
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default webhook;
