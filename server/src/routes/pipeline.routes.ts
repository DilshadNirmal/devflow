import { Hono } from "hono";
import { CreatePipeline } from "../types";
import {
  createPipeline,
  getPipelineByProjectId,
  updatePipeline,
} from "../services/pipeline.service";

const pipeline = new Hono();

pipeline.post("/", async (c) => {
  try {
    const body = await c.req.json<CreatePipeline>();
    const result = await createPipeline(body);
    return c.json(result, 201);
  } catch (error) {
    console.error((error as Error).message);
    return c.json({ error: (error as Error).message }, 500);
  }
});

pipeline.get("/:projectId", async (c) => {
  try {
    const { projectId } = c.req.param();
    const result = await getPipelineByProjectId(projectId);

    if (!result) {
      return c.json({ message: "Pipeline not found" }, 404);
    }
    return c.json(result, 200);
  } catch (error) {
    console.error((error as Error).message);
    return c.json({ error: (error as Error).message }, 500);
  }
});

pipeline.put("/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const result = await c.req.json<Partial<CreatePipeline>>();
    const updatedPipeline = await updatePipeline(id, result);

    if (!updatedPipeline) {
      return c.json({ message: "Pipeline not found" }, 404);
    }

    return c.json(updatedPipeline, 200);
  } catch (error) {
    console.error((error as Error).message);
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default pipeline;
