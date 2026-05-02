import { Link, useParams } from "react-router-dom";
import type { Run } from "../types";
import { useEffect, useState } from "react";

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [runs, setRuns] = useState<Run[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/run/project/${id}`)
      .then((res) => res.json())
      .then((data) => setRuns(data));
  }, [id]);

  return (
    <div>
      <h1>Runs</h1>
      {runs.map((run) => (
        <Link key={run._id} to={`/runs/${run._id}`}>
          <p>
            {run.status} - {new Date(run.started_at).toLocaleString()}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default ProjectDetailPage;
