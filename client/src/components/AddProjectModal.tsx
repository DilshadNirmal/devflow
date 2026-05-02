import { useState } from "react";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

const AddProjectModal = ({ onClose, onCreated }: Props) => {
  const [form, setForm] = useState({
    repo_name: "",
    branch_name: "main",
    repo_url: "",
    webhook_id: "",
    webhook_secret: "",
    owner: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create project");
      onCreated();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Connect a Repository</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Owner (GitHub username)</label>
            <input className={inputClass} placeholder="e.g. octocat" value={form.owner}
              onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} required />
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Repository Name</label>
            <input className={inputClass} placeholder="e.g. my-app" value={form.repo_name}
              onChange={e => setForm(f => ({ ...f, repo_name: e.target.value }))} required />
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Repository URL</label>
            <input className={inputClass} placeholder="https://github.com/owner/repo" value={form.repo_url}
              onChange={e => setForm(f => ({ ...f, repo_url: e.target.value }))} required />
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Branch</label>
            <input className={inputClass} placeholder="main" value={form.branch_name}
              onChange={e => setForm(f => ({ ...f, branch_name: e.target.value }))} required />
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Webhook ID</label>
            <input className={inputClass} placeholder="GitHub webhook ID" value={form.webhook_id}
              onChange={e => setForm(f => ({ ...f, webhook_id: e.target.value }))} required />
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Webhook Secret</label>
            <input className={inputClass} type="password" placeholder="Your webhook secret" value={form.webhook_secret}
              onChange={e => setForm(f => ({ ...f, webhook_secret: e.target.value }))} required />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-400 hover:border-zinc-500 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold transition-colors disabled:opacity-50">
              {loading ? "Connecting..." : "Connect"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
