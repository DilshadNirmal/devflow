import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Run } from "../types";

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  running: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

const RunDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [run, setRun] = useState<Run | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/run/${id}`)
      .then((res) => res.json())
      .then((data) => setRun(data));

    const ws = new WebSocket(`ws://localhost:3000/ws/runs/${id}`);

    ws.onmessage = (event) => {
      setLogs((prev) => [...prev, event.data]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    return () => {
      ws.close();
    };
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to={`/projects/${run?.project}`} className="text-xs text-zinc-500 hover:text-cyan-400 transition-colors">
            ← Back to Runs
          </Link>
          <div className="flex items-center gap-4 mt-4">
            <h1 className="text-2xl font-bold text-white tracking-tight">Run Details</h1>
            {run && (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles[run.status] ?? ""}`}>
                {run.status}
              </span>
            )}
          </div>
          {run && (
            <p className="text-zinc-500 text-sm mt-1">
              Started {new Date(run.started_at).toLocaleString()}
              {run.finished_at && ` · Finished ${new Date(run.finished_at).toLocaleString()}`}
            </p>
          )}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-2 text-xs text-zinc-500 font-mono">logs</span>
          </div>

          <div className="p-4 font-mono text-sm text-green-400 min-h-64 max-h-[60vh] overflow-y-auto">
            {logs.length === 0 ? (
              <span className="text-zinc-600">Waiting for logs...</span>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="flex gap-3 leading-6">
                  <span className="text-zinc-600 select-none w-6 text-right shrink-0">{i + 1}</span>
                  <span>{log}</span>
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
