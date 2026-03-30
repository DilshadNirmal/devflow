import { Hono } from "hono";

const run = new Hono();

run.get("/project/:projectId", (c) => {
  const { projectId } = c.req.param();
  return c.json({ message: `get runs for project with id ${projectId}` });
});

run.get("/:id", (c) => {
  const { id } = c.req.param();
  return c.json({ message: `get run with id ${id}` });
});

export default run;
