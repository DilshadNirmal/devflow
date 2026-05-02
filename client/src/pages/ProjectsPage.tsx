import { useEffect, useState } from "react";
import type { Project } from "../types";
import { Link } from "react-router-dom";

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/project")
      .then((res) => res.json())
      .then((data) => setProjects(data.projects));
  }, []);

  return (
    <div>
      <h1>Projects</h1>
      {projects.map((project) => (
        <Link key={project._id} to={`/projects/${project._id}`}>
          <p>{project.name}</p>
        </Link>
      ))}
    </div>
  );
};

export default ProjectsPage;
