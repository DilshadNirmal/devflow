export type Project = {
  _id: string;
  name: string;
  repo_name: string;
  repo_url: string;
};

export type Run = {
  _id: string;
  project: string;
  pipeline: string;
  status: "pending" | "running" | "completed" | "failed";
  logs: string[];
  started_at: string;
  finished_at: string | null;
};

export type Pipeline = {
  _id: string;
  project: string;
  docker_image: string;
  steps: { name: string; command: string }[];
  is_active: boolean;
};
