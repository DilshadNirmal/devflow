import { Hono } from "hono";

const projects = new Hono();

projects.get("/", (c) => {
  return c.json({ message: "get all projects" });
});

projects.get("/:id", (c) => {
  const { id } = c.req.param();
  return c.json({ message: `get project with id ${id}` });
});

projects.post("/", (c) => {
  return c.json({ message: "create a new project" });
});

projects.delete("/:id", (c) => {
  const { id } = c.req.param();
  return c.json({ message: `delete project with id ${id}` });
});

export default projects;
