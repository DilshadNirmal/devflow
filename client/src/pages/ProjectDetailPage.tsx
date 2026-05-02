import { Link, useParams } from "react-router-dom";
import type { Run } from "../types";
import { useEffect, useState } from "react";
import AddPipelineModal from "../components/AddPipelineModal";

const statusStyles: Record<string, { badge: string; dot: string }> = {
  pending:  { badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", dot: "bg-yellow-400" },
  running:  { badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",   dot: "bg-blue-400 animate-pulse" },
  success:  { badge: "bg-green-500/10 text-green-400 border-green-500/20",  dot: "bg-green-400" },
  failed:   { badge: "bg-red-500/10 text-red-400 border-red-500/20",     dot: "bg-red-400" },
};

const duration = (start: string, end: string | null) => {
  if (!end) return null;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const s = Math.floor(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
};

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [runs, setRuns] = useState<Run[]>([]);
  const [hasPipeline, setHasPipeline] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/run/project/${id}`)
      .then((res) => res.json())
      .then((data) => setRuns(Array.isArray(data) ? data : []));

    fetch(`${import.meta.env.VITE_API_URL}/api/pipeline/${id}`)
      .then((res) => setHasPipeline(res.ok));
  }, [id]);

  const fetchRuns = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/run/project/${id}`)
      .then((res) => res.json())
      .then((data) => setRuns(Array.isArray(data) ? data : []));
  };

  const successCount = runs.filter(r => r.status === "success").length;
  const failedCount  = runs.filter(r => r.status === "failed").length;
  const pendingCount = runs.filter(r => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 px-8 py-0 sticky top-0 bg-zinc-950/90 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-cyan-500 flex items-center justify-center">
                <span className="text-black text-xs font-bold">D</span>
              </div>
              <span className="font-semibold text-white">DevFlow</span>
            </Link>
            <span className="text-zinc-600">/</span>
            <Link to="/dashboard" className="text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-zinc-800">dashboard</Link>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-300 px-2 py-1">runs</span>
          </div>
          {!hasPipeline && (
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold rounded-md transition-colors"
            >
              + Create Pipeline
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-white">Pipeline Runs</h1>
          <p className="text-zinc-500 text-sm mt-0.5">All triggered runs for this repository.</p>
        </div>

        {/* No pipeline warning */}
        {!hasPipeline && (
          <div className="mb-6 flex items-center gap-3 border border-yellow-500/20 bg-yellow-500/5 rounded-lg px-5 py-3.5">
            <span className="text-yellow-400 text-lg">⚠</span>
            <p className="text-yellow-400 text-sm">No pipeline configured. Create one to start running builds.</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Runs",  value: runs.length,  color: "text-zinc-400"  },
            { label: "Successful",  value: successCount, color: "text-green-400" },
            { label: "Failed",      value: failedCount,  color: "text-red-400"   },
            { label: "Pending",     value: pendingCount, color: "text-yellow-400"},
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3.5">
              <p className="text-xs text-zinc-500 mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Runs table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 px-5 py-3 border-b border-zinc-800 text-xs font-medium text-zinc-500 uppercase tracking-wider">
            <div className="col-span-2">Status</div>
            <div className="col-span-4">Started</div>
            <div className="col-span-3">Finished</div>
            <div className="col-span-2">Duration</div>
            <div className="col-span-1" />
          </div>

          {runs.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-4xl mb-3">▶</div>
              <p className="text-zinc-300 font-medium mb-1">No runs yet</p>
              <p className="text-zinc-600 text-sm">Push to your connected branch to trigger a pipeline run.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/60">
              {runs.map((run) => {
                const s = statusStyles[run.status] ?? statusStyles.pending;
                return (
                  <Link
                    key={run._id}
                    to={`/runs/${run._id}`}
                    className="grid grid-cols-12 items-center px-5 py-4 hover:bg-zinc-800/40 transition-colors group"
                  >
                    <div className="col-span-2 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${s.badge}`}>
                        {run.status}
                      </span>
                    </div>
                    <div className="col-span-4 text-sm text-zinc-400">
                      {new Date(run.started_at).toLocaleString()}
                    </div>
                    <div className="col-span-3 text-sm text-zinc-500">
                      {run.finished_at ? new Date(run.finished_at).toLocaleString() : "—"}
                    </div>
                    <div className="col-span-2 text-sm text-zinc-500 font-mono">
                      {duration(run.started_at, run.finished_at) ?? "—"}
                    </div>
                    <div className="col-span-1 text-right text-zinc-700 group-hover:text-cyan-500 transition-colors">→</div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showModal && id && (
        <AddPipelineModal
          projectId={id}
          onClose={() => setShowModal(false)}
          onCreated={() => { setHasPipeline(true); fetchRuns(); }}
        />
      )}
    </div>
  );
};

export default ProjectDetailPage;
