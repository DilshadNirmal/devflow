import { Hono } from "hono";
import { ProjectModel, PipelineModel, RunModel } from "../models/models";

const seed = new Hono();

seed.post("/", async (c) => {
  try {
    await ProjectModel.deleteMany({ repo_name: "demo-app" });

    const project = await ProjectModel.create({
      repo_name: "demo-app",
      branch_name: "main",
      repo_url: "https://github.com/devflow-demo/demo-app",
      webhook_id: "demo-webhook-001",
      webhook_secret: "demo-secret",
      owner: "devflow-demo",
    });

    const pipeline = await PipelineModel.create({
      project: project._id,
      docker_image: "node:18-alpine",
      steps: [
        { name: "Install dependencies", command: "npm install" },
        { name: "Run tests", command: "npm test" },
        { name: "Build", command: "npm run build" },
      ],
      env_vars: [{ key: "NODE_ENV", value: "production" }],
      is_active: true,
    });

    await RunModel.deleteMany({ project: project._id });

    await RunModel.insertMany([
      {
        project: project._id,
        pipeline: pipeline._id,
        status: "success",
        logs: [
          "npm install",
          "added 312 packages in 4.2s",
          "npm test",
          "✓ 12 tests passed",
          "npm run build",
          "Build completed successfully",
        ],
        started_at: new Date(Date.now() - 1000 * 60 * 30),
        finished_at: new Date(Date.now() - 1000 * 60 * 28),
      },
      {
        project: project._id,
        pipeline: pipeline._id,
        status: "failed",
        logs: [
          "npm install",
          "added 312 packages in 4.1s",
          "npm test",
          "✗ Test failed: expected 200 but got 404",
        ],
        started_at: new Date(Date.now() - 1000 * 60 * 60),
        finished_at: new Date(Date.now() - 1000 * 60 * 58),
      },
      {
        project: project._id,
        pipeline: pipeline._id,
        status: "pending",
        logs: [],
        started_at: new Date(),
        finished_at: null,
      },
    ]);

    return c.json({ message: "Demo data loaded successfully" }, 200);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default seed;
