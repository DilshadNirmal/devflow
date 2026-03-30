import { Hono } from "hono";

const project = new Hono();

project.get("/", (c) => {
  return c.json({ message: "get all project" });
});

project.get("/:id", (c) => {
  const { id } = c.req.param();
  return c.json({ message: `get project with id ${id}` });
});

project.post("/", (c) => {
  return c.json({ message: "create a new project" });
});

project.delete("/:id", (c) => {
  const { id } = c.req.param();
  return c.json({ message: `delete project with id ${id}` });
});

export default project;
