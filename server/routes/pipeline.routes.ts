import { Hono } from "hono";

const pipelines = new Hono();

pipelines.post("/", (c) => {
  return c.json({ message: "create a new pipeline" });
});

pipelines.get("/:projectId", (c) => {
  const { projectId } = c.req.param();
  return c.json({ message: `get pipelines for project with id ${projectId}` });
});

pipelines.put("/:id", (c) => {
  const { id } = c.req.param();
  return c.json({ message: `update pipeline with id ${id}` });
});

export default pipelines;
