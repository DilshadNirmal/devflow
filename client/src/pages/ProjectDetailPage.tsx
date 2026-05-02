import { Link, useParams } from "react-router-dom";
import type { Run } from "../types";
import { useEffect, useState } from "react";

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  running: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [runs, setRuns] = useState<Run[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/run/project/${id}`)
      .then((res) => res.json())
      .then((data) => setRuns(data));
  }, [id]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <Link to="/" className="text-xs text-zinc-500 hover:text-cyan-400 transition-colors">
            ← Back to Projects
          </Link>
          <h1 className="text-2xl font-bold text-white mt-4 tracking-tight">Pipeline Runs</h1>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-zinc-200">Runs</h2>
          <span className="text-xs text-zinc-500">{runs.length} total</span>
        </div>

        {runs.length === 0 ? (
          <div className="border border-zinc-800 rounded-lg p-10 text-center text-zinc-500 text-sm">
            No runs yet. Push to your repo to trigger a pipeline.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {runs.map((run) => (
              <Link
                key={run._id}
                to={`/runs/${run._id}`}
                className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-5 py-4 hover:border-cyan-500 hover:bg-zinc-800 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles[run.status] ?? ""}`}>
                    {run.status}
                  </span>
                  <p className="text-sm text-zinc-400">
                    {new Date(run.started_at).toLocaleString()}
                  </p>
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

export default ProjectDetailPage;
