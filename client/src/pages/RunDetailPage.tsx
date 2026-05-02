import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Run } from "../types";

const statusStyles: Record<string, { badge: string; dot: string }> = {
  pending: { badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", dot: "bg-yellow-400" },
  running: { badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",       dot: "bg-blue-400 animate-pulse" },
  success: { badge: "bg-green-500/10 text-green-400 border-green-500/20",    dot: "bg-green-400" },
  failed:  { badge: "bg-red-500/10 text-red-400 border-red-500/20",          dot: "bg-red-400" },
};

const duration = (start: string, end: string | null) => {
  if (!end) return null;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const s = Math.floor(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
};

const RunDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [run, setRun] = useState<Run | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/run/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRun(data);
        if (data.logs?.length) setLogs(data.logs);
      });

    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/runs/${id}`);
    ws.onmessage = (event) => setLogs((prev) => [...prev, event.data]);
    ws.onerror = (error) => console.error("WebSocket error: ", error);
    return () => ws.close();
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const s = run ? (statusStyles[run.status] ?? statusStyles.pending) : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 px-8 py-0 sticky top-0 bg-zinc-950/90 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto flex items-center h-14 gap-2 text-sm">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-cyan-500 flex items-center justify-center">
              <span className="text-black text-xs font-bold">D</span>
            </div>
            <span className="font-semibold text-white">DevFlow</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <Link to="/dashboard" className="text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-zinc-800">dashboard</Link>
          <span className="text-zinc-600">/</span>
          <Link to={run ? `/projects/${run.project}` : "/dashboard"} className="text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-zinc-800">runs</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300 px-2 py-1 font-mono text-xs">{id?.slice(-8)}</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-semibold text-white">Run Details</h1>
              {s && run && (
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${s.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {run.status}
                </span>
              )}
            </div>
            {run && (
              <p className="text-zinc-500 text-sm">
                Started {new Date(run.started_at).toLocaleString()}
                {run.finished_at && (
                  <> · Finished {new Date(run.finished_at).toLocaleString()} · <span className="text-zinc-400 font-mono">{duration(run.started_at, run.finished_at)}</span></>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Run meta cards */}
        {run && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {[
              { label: "Run ID",    value: run._id.slice(-12), mono: true },
              { label: "Status",    value: run.status,         mono: false },
              { label: "Log Lines", value: logs.length,        mono: true },
            ].map(({ label, value, mono }) => (
              <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3.5">
                <p className="text-xs text-zinc-500 mb-1">{label}</p>
                <p className={`text-sm font-semibold text-zinc-200 ${mono ? "font-mono" : ""}`}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Log viewer */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs text-zinc-500 font-mono">stdout / stderr</span>
            </div>
            <span className="text-xs text-zinc-600 font-mono">{logs.length} lines</span>
          </div>

          <div className="p-5 font-mono text-sm min-h-72 max-h-[60vh] overflow-y-auto bg-zinc-950/50">
            {logs.length === 0 ? (
              <div className="flex items-center gap-2 text-zinc-600">
                <span className="inline-block w-2 h-4 bg-zinc-600 animate-pulse" />
                <span>Waiting for logs...</span>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="flex gap-4 leading-6 hover:bg-zinc-800/30 px-1 rounded group">
                  <span className="text-zinc-700 select-none w-8 text-right shrink-0 group-hover:text-zinc-500 transition-colors">
                    {i + 1}
                  </span>
                  <span className={log.includes("✗") || log.toLowerCase().includes("error") || log.toLowerCase().includes("failed")
                    ? "text-red-400" : log.includes("✓") || log.toLowerCase().includes("success")
                    ? "text-green-400" : "text-zinc-300"}>
                    {log}
                  </span>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunDetailPage;
