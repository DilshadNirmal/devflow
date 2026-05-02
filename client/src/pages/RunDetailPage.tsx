import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Run } from "../types";

const RunDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [run, setRun] = useState<Run | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3000/runs/${id}`)
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

  return (
    <div>
      <h1>Run {id}</h1>
      <p>Status: {run?.status}</p>
      <div>
        {logs.map((log, i) => (
          <p key={i}>{log}</p>
        ))}
      </div>
    </div>
  );
};

export default RunDetailPage;
