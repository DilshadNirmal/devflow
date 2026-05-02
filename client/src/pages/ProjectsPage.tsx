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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">DevFlow</h1>
          <p className="text-zinc-400 mt-1 text-sm">Your self-hosted CI/CD pipeline</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-zinc-200">Projects</h2>
          <span className="text-xs text-zinc-500">{projects.length} connected</span>
        </div>

        {projects.length === 0 ? (
          <div className="border border-zinc-800 rounded-lg p-10 text-center text-zinc-500 text-sm">
            No projects connected yet.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map((project) => (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-5 py-4 hover:border-cyan-500 hover:bg-zinc-800 transition-all group"
              >
                <div>
                  <p className="font-medium text-zinc-100 group-hover:text-cyan-400 transition-colors">
                    {project.name}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">{project.repo_url}</p>
                </div>
                <span className="text-zinc-600 group-hover:text-cyan-500 transition-colors text-lg">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
