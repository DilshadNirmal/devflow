import { Hono } from "hono";

const pipeline = new Hono();

pipeline.post("/", (c) => {
  return c.json({ message: "create a new pipeline" });
});

pipeline.get("/:projectId", (c) => {
  const { projectId } = c.req.param();
  return c.json({ message: `get pipeline for project with id ${projectId}` });
});

pipeline.put("/:id", (c) => {
  const { id } = c.req.param();
  return c.json({ message: `update pipeline with id ${id}` });
});

export default pipeline;
