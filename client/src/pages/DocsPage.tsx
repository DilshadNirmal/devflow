import { Link } from "react-router-dom";

const CodeBlock = ({ code }: { code: string }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden my-4">
    <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-800">
      <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
      <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
    </div>
    <pre className="p-4 font-mono text-sm text-green-400 overflow-x-auto leading-relaxed whitespace-pre">{code}</pre>
  </div>
);

const Step = ({ number, title, children }: { number: number; title: string; children: React.ReactNode }) => (
  <div className="flex gap-6 mb-12">
    <div className="shrink-0 w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
      {number}
    </div>
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      {children}
    </div>
  </div>
);

const DocsPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <nav className="border-b border-zinc-800/60 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-white tracking-tight">DevFlow</Link>
          <Link to="/dashboard" className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold transition-colors">
            Dashboard →
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Documentation</h1>
          <p className="text-zinc-400 text-lg">How to connect a repo, configure a pipeline, and run your first build.</p>
        </div>

        {/* Overview */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4 pb-3 border-b border-zinc-800">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            {["Push to GitHub", "Webhook fires", "Go runner picks up job", "Logs stream live"].map((s, i) => (
              <div key={s} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
                <div className="text-cyan-400 font-mono text-xs mb-2">0{i + 1}</div>
                <p className="text-sm text-zinc-300">{s}</p>
              </div>
            ))}
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">
            DevFlow listens for GitHub push events via webhooks. When a push arrives, it verifies the HMAC signature,
            creates a run record in MongoDB, and the Go runner picks it up. The runner fetches the pipeline config,
            spins up Docker containers for each step, and streams logs back to the dashboard in real time via WebSockets.
          </p>
        </section>

        {/* Steps */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 pb-3 border-b border-zinc-800">Getting started</h2>

          <Step number={1} title="Connect your GitHub repository">
            <p className="text-zinc-400 text-sm leading-relaxed mb-3">
              Click <span className="text-cyan-400 font-medium">+ Connect Repo</span> on the dashboard and fill in your repository details.
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Owner", "Your GitHub username"],
                  ["Repo Name", "The repository name (not full URL)"],
                  ["Repo URL", "https://github.com/owner/repo"],
                  ["Branch", "Branch to watch (e.g. main)"],
                  ["Webhook ID", "From GitHub webhook settings page"],
                  ["Webhook Secret", "The secret you set in GitHub"],
                ].map(([field, desc]) => (
                  <div key={field}>
                    <p className="text-zinc-200 font-medium">{field}</p>
                    <p className="text-zinc-500 text-xs">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Step>

          <Step number={2} title="Set up a GitHub webhook">
            <p className="text-zinc-400 text-sm leading-relaxed mb-3">
              Go to your repo → <span className="text-zinc-200">Settings → Webhooks → Add webhook</span>
            </p>
            <CodeBlock code={`Payload URL:   https://your-server.com/api/webhook
Content type:  application/json
Secret:        your-webhook-secret
Events:        Just the push event`} />
            <p className="text-zinc-500 text-xs mt-2">
              For local development, use <span className="text-cyan-400">ngrok http 3000</span> to expose your server.
            </p>
          </Step>

          <Step number={3} title="Create a pipeline">
            <p className="text-zinc-400 text-sm leading-relaxed mb-3">
              Click <span className="text-cyan-400 font-medium">+ Create Pipeline</span> on the project page.
              Define your Docker image and steps:
            </p>
            <CodeBlock code={`Docker Image:  node:18-alpine

Step 1
  Name:     Install dependencies
  Command:  npm install

Step 2
  Name:     Run tests
  Command:  npm test

Step 3
  Name:     Build
  Command:  npm run build`} />
          </Step>

          <Step number={4} title="Push and watch it run">
            <p className="text-zinc-400 text-sm leading-relaxed mb-3">
              Make any commit and push to your connected branch:
            </p>
            <CodeBlock code={`git add .
git commit -m "trigger devflow pipeline"
git push origin main`} />
            <p className="text-zinc-400 text-sm leading-relaxed">
              The dashboard will show a new run appear with <span className="text-yellow-400">pending</span> status.
              Click it to watch logs stream live as each step executes in Docker.
            </p>
          </Step>
        </section>

        {/* Pipeline reference */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4 pb-3 border-b border-zinc-800">Pipeline reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-left">
                  <th className="pb-3 text-zinc-400 font-medium">Field</th>
                  <th className="pb-3 text-zinc-400 font-medium">Type</th>
                  <th className="pb-3 text-zinc-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {[
                  ["docker_image", "string", "Docker image to run each step in"],
                  ["steps[].name", "string", "Human-readable step name"],
                  ["steps[].command", "string", "Shell command to run in the container"],
                  ["env_vars[].key", "string", "Environment variable name"],
                  ["env_vars[].value", "string", "Environment variable value"],
                  ["is_active", "boolean", "Whether this pipeline is active"],
                ].map(([field, type, desc]) => (
                  <tr key={field}>
                    <td className="py-3 font-mono text-cyan-400 text-xs">{field}</td>
                    <td className="py-3 text-zinc-500 text-xs">{type}</td>
                    <td className="py-3 text-zinc-400">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Run statuses */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4 pb-3 border-b border-zinc-800">Run statuses</h2>
          <div className="flex flex-col gap-3">
            {[
              { status: "pending", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", desc: "Run is queued, waiting for the Go runner to pick it up." },
              { status: "running", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", desc: "Steps are currently executing inside Docker containers." },
              { status: "success", color: "bg-green-500/10 text-green-400 border-green-500/20", desc: "All steps finished successfully." },
              { status: "failed", color: "bg-red-500/10 text-red-400 border-red-500/20", desc: "One or more steps returned an error." },
            ].map(({ status, color, desc }) => (
              <div key={status} className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-lg px-5 py-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${color}`}>{status}</span>
                <p className="text-zinc-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-zinc-800 pt-8 text-center">
          <Link to="/dashboard" className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-colors inline-block">
            Go to Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
