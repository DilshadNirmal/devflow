export type Project = {
  _id: string;
  repo_name: string;
  repo_url: string;
  branch_name: string;
  owner: string;
  webhook_id: string;
  webhook_secret: string;
};

export type Run = {
  _id: string;
  project: string;
  pipeline: string;
  status: "pending" | "running" | "success" | "failed";
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
