import { Hono } from "hono";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
} from "../services/project.service";
import { CreateProject } from "../types";

const project = new Hono();

project.get("/", async (c) => {
  try {
    const projects = await getAllProjects();
    return c.json({ projects });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

project.get("/:id", async (c) => {
  const { id } = c.req.param();
  const result = await getProjectById(id);

  if (!result) {
    return c.json({ error: "Not found" }, 404);
  }

  return c.json(result, 200);
});

project.post("/", async (c) => {
  try {
    const body = await c.req.json<CreateProject>();
    const result = await createProject(body);
    return c.json(result, 201);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

project.delete("/:id", async (c) => {
  const { id } = c.req.param();
  const result = await deleteProject(id);

  if (!result) {
    return c.json({ error: "Not found" }, 404);
  }

  return c.json(result, 200);
});

export default project;
