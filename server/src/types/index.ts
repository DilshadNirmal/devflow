export interface CreateProject {
  repo_name: string;
  branch_name: string;
  repo_url: string;
  webhook_id: string;
  webhook_secret: string;
  owner: string;
}

export interface CreatePipeline {
  project: string;
  docker_image: string;
  steps: { name: string; command: string }[];
  env_vars: { key: string; value: string }[];
  is_active: boolean;
}

export interface CreateRun {
  project: string;
  pipeline: string;
  status?: "pending" | "running" | "success" | "failed";
  logs?: string[];
  started_at?: Date;
  finished_at?: Date | null;
}

export interface GithubWebhookPayload {
  ref: string;
  repository: {
    name: string;
    url: string;
  };
  head_commit: {
    id: string;
    message: string;
    timestamp: string;
  };
}
