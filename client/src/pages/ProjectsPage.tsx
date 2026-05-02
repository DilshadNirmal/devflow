import { useEffect, useState } from "react";
import type { Project } from "../types";
import { Link } from "react-router-dom";
import AddProjectModal from "../components/AddProjectModal";
import ConfirmModal from "../components/ConfirmModal";

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const fetchProjects = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/project`)
      .then((res) => res.json())
      .then((data) => setProjects(data.projects));
  };

  const loadDemoData = async () => {
    setSeeding(true);
    await fetch(`${import.meta.env.VITE_API_URL}/api/seed`, { method: "POST" });
    fetchProjects();
    setSeeding(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 px-8 py-0 sticky top-0 bg-zinc-950/90 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14">
          {/* Left */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-cyan-500 flex items-center justify-center">
                <span className="text-black text-xs font-bold">D</span>
              </div>
              <span className="font-semibold text-white text-sm">DevFlow</span>
            </Link>
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-zinc-600 text-sm">/</span>
              <span className="text-zinc-400 text-sm px-2 py-1 rounded hover:bg-zinc-800 transition-colors cursor-default">dashboard</span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <Link to="/docs" className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors">
              Docs
            </Link>
            <button
              onClick={loadDemoData}
              disabled={seeding}
              className="px-3 py-1.5 text-xs text-zinc-400 border border-zinc-700 hover:border-zinc-500 hover:text-white rounded-md transition-colors disabled:opacity-40 flex items-center gap-1.5"
            >
              <span className="text-yellow-400">⚡</span>
              {seeding ? "Loading..." : "Load Demo"}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold rounded-md transition-colors"
            >
              + Connect Repo
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-white">Projects</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Manage your connected repositories and pipelines.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Repositories", value: projects.length, icon: "📦", color: "text-cyan-400" },
            { label: "Pipelines", value: projects.length, icon: "⚙️", color: "text-blue-400" },
            { label: "Total Runs", value: "—", icon: "▶", color: "text-green-400" },
            { label: "Runner", value: "Active", icon: "●", color: "text-emerald-400" },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3.5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-zinc-500">{label}</p>
                <span className={`text-xs ${color}`}>{icon}</span>
              </div>
              <p className="text-xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Projects list */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-900/80">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Repository</p>
            <div className="flex items-center gap-8 pr-4">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider hidden sm:block">Branch</p>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider hidden sm:block">Owner</p>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider w-12" />
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-4xl mb-3">🚀</div>
              <p className="text-zinc-300 font-medium mb-1">No repositories connected</p>
              <p className="text-zinc-600 text-sm mb-6">Connect a GitHub repo or load demo data to see it here.</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold rounded-lg transition-colors"
                >
                  + Connect Repo
                </button>
                <button
                  onClick={loadDemoData}
                  disabled={seeding}
                  className="px-4 py-2 border border-zinc-700 text-sm text-zinc-400 hover:border-zinc-500 hover:text-white rounded-lg transition-colors"
                >
                  ⚡ Load Demo Data
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/60">
              {projects.map((project) => (
                <div key={project._id} className="flex items-center justify-between px-5 py-4 hover:bg-zinc-800/40 transition-colors group">
                  <Link to={`/projects/${project._id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm shrink-0">
                      📦
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-100 group-hover:text-cyan-400 transition-colors">
                        {project.owner} / {project.repo_name}
                      </p>
                      <p className="text-xs text-zinc-600 mt-0.5 truncate max-w-xs">{project.repo_url}</p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-6 shrink-0">
                    <span className="text-xs text-zinc-500 font-mono hidden sm:block">{project.branch_name ?? "main"}</span>
                    <span className="text-xs text-zinc-500 hidden sm:block">{project.owner}</span>
                    <button
                      onClick={(e) => { e.preventDefault(); setDeleteTarget({ id: project._id, name: project.repo_name }); }}
                      className="text-xs text-zinc-600 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-400/5"
                    >
                      Delete
                    </button>
                    <Link to={`/projects/${project._id}`} className="text-zinc-700 group-hover:text-cyan-500 transition-colors text-sm">→</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <AddProjectModal
          onClose={() => setShowModal(false)}
          onCreated={fetchProjects}
        />
      )}
      {deleteTarget && (
        <ConfirmModal
          message={`"${deleteTarget.name}" and all its runs will be permanently deleted.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await fetch(`${import.meta.env.VITE_API_URL}/api/project/${deleteTarget.id}`, { method: "DELETE" });
            setDeleteTarget(null);
            fetchProjects();
          }}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
