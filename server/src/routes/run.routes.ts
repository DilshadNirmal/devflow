import { Hono } from "hono";
import { getRunById, getRunsByProjectId } from "../services/run.service";
import { clients } from "./ws.routes";
import { RunModel } from "../models/models";

const run = new Hono();

run.get("/project/:projectId", async (c) => {
  try {
    const { projectId } = c.req.param();
    const result = await getRunsByProjectId(projectId);

    if (result.length === 0) {
      return c.json({ message: "No runs found for this project" }, 404);
    }
    return c.json(result, 200);
  } catch (error) {
    console.error((error as Error).message);
    return c.json({ error: (error as Error).message }, 500);
  }
});

run.get("/:id", async (c) => {
  const { id } = c.req.param();

  try {
    const result = await getRunById(id);

    if (!result) {
      return c.json({ message: "Run not found" }, 404);
    }

    return c.json(result, 200);
  } catch (error) {
    console.error((error as Error).message);
    return c.json({ error: (error as Error).message }, 500);
  }
});

run.post("/:id/logs", async (c) => {
  const id = c.req.param("id") ?? "";
  const { log } = await c.req.json<{ log: string }>();

  await RunModel.updateOne({ _id: id }, { $push: { logs: log } });

  const ws = clients.get(id);
  if (ws) {
    ws.send(log);
  }

  return c.json({ message: "log saved" }, 200);
});

export default run;
