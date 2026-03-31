import { Hono } from "hono";
import { getRunById, getRunsByProjectId } from "../services/run.service";

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

export default run;
