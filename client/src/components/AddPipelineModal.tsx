import { useState } from "react";

type Step = { name: string; command: string };
type EnvVar = { key: string; value: string };

type Props = {
  projectId: string;
  onClose: () => void;
  onCreated: () => void;
};

const AddPipelineModal = ({ projectId, onClose, onCreated }: Props) => {
  const [dockerImage, setDockerImage] = useState("node:18-alpine");
  const [steps, setSteps] = useState<Step[]>([{ name: "", command: "" }]);
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors";

  const addStep = () => setSteps(s => [...s, { name: "", command: "" }]);
  const removeStep = (i: number) => setSteps(s => s.filter((_, idx) => idx !== i));
  const updateStep = (i: number, field: keyof Step, val: string) =>
    setSteps(s => s.map((step, idx) => idx === i ? { ...step, [field]: val } : step));

  const addEnvVar = () => setEnvVars(v => [...v, { key: "", value: "" }]);
  const removeEnvVar = (i: number) => setEnvVars(v => v.filter((_, idx) => idx !== i));
  const updateEnvVar = (i: number, field: keyof EnvVar, val: string) =>
    setEnvVars(v => v.map((ev, idx) => idx === i ? { ...ev, [field]: val } : ev));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pipeline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: projectId,
          docker_image: dockerImage,
          steps,
          env_vars: envVars,
          is_active: true,
        }),
      });

      if (!res.ok) throw new Error("Failed to create pipeline");
      onCreated();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Create Pipeline</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Docker Image</label>
            <input className={inputClass} value={dockerImage}
              onChange={e => setDockerImage(e.target.value)} required />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-zinc-400">Steps</label>
              <button type="button" onClick={addStep}
                className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors">+ Add Step</button>
            </div>
            <div className="flex flex-col gap-3">
              {steps.map((step, i) => (
                <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Step {i + 1}</span>
                    {steps.length > 1 && (
                      <button type="button" onClick={() => removeStep(i)}
                        className="text-xs text-red-400 hover:text-red-300">Remove</button>
                    )}
                  </div>
                  <input className={inputClass} placeholder="Step name (e.g. Install dependencies)"
                    value={step.name} onChange={e => updateStep(i, "name", e.target.value)} required />
                  <input className={inputClass} placeholder="Command (e.g. npm install)"
                    value={step.command} onChange={e => updateStep(i, "command", e.target.value)} required />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-zinc-400">Environment Variables</label>
              <button type="button" onClick={addEnvVar}
                className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors">+ Add Var</button>
            </div>
            <div className="flex flex-col gap-2">
              {envVars.map((ev, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input className={inputClass} placeholder="KEY" value={ev.key}
                    onChange={e => updateEnvVar(i, "key", e.target.value)} />
                  <input className={inputClass} placeholder="value" value={ev.value}
                    onChange={e => updateEnvVar(i, "value", e.target.value)} />
                  <button type="button" onClick={() => removeEnvVar(i)}
                    className="text-zinc-500 hover:text-red-400 transition-colors shrink-0">×</button>
                </div>
              ))}
              {envVars.length === 0 && (
                <p className="text-xs text-zinc-600">No env vars added.</p>
              )}
            </div>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-400 hover:border-zinc-500 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold transition-colors disabled:opacity-50">
              {loading ? "Creating..." : "Create Pipeline"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPipelineModal;
