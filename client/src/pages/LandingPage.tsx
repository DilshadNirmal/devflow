import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const terminal_lines = [
  { text: "$ git push origin main", delay: 0 },
  { text: "✓ Webhook received", delay: 600 },
  { text: "✓ Pipeline triggered", delay: 1200 },
  { text: "⠸ Pulling node:18-alpine...", delay: 1800 },
  { text: "⠸ Running: npm install", delay: 2600 },
  { text: "⠸ Running: npm test", delay: 3400 },
  { text: "✓ All steps completed", delay: 4200 },
  { text: "✓ Run marked as completed", delay: 4800 },
];

const features = [
  {
    icon: "⚡",
    title: "Webhook Triggered",
    desc: "Push to GitHub and your pipeline fires automatically via webhooks.",
  },
  {
    icon: "🐳",
    title: "Docker Execution",
    desc: "Every step runs in an isolated Docker container — clean, repeatable builds.",
  },
  {
    icon: "📡",
    title: "Live Log Streaming",
    desc: "Watch logs stream in real time via WebSockets as your pipeline runs.",
  },
  {
    icon: "🔧",
    title: "Pipeline as Config",
    desc: "Define your steps, Docker image, and env vars through the dashboard UI.",
  },
  {
    icon: "📊",
    title: "Run History",
    desc: "Every run is recorded — status, logs, timestamps, all in one place.",
  },
  {
    icon: "🔒",
    title: "Webhook Verification",
    desc: "HMAC SHA-256 signature verification on every incoming webhook payload.",
  },
];

const stack = [
  { name: "React", color: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5" },
  { name: "Bun + Hono", color: "text-orange-400 border-orange-400/20 bg-orange-400/5" },
  { name: "Go", color: "text-blue-400 border-blue-400/20 bg-blue-400/5" },
  { name: "MongoDB", color: "text-green-400 border-green-400/20 bg-green-400/5" },
  { name: "Docker", color: "text-sky-400 border-sky-400/20 bg-sky-400/5" },
  { name: "WebSockets", color: "text-purple-400 border-purple-400/20 bg-purple-400/5" },
  { name: "Tailwind CSS", color: "text-teal-400 border-teal-400/20 bg-teal-400/5" },
];

const TerminalDemo = () => {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);

  useEffect(() => {
    terminal_lines.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
      }, line.delay);
    });
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-zinc-500 font-mono">devflow — pipeline run</span>
      </div>
      <div className="p-5 font-mono text-sm min-h-48">
        {terminal_lines.map((line, i) => (
          <div
            key={i}
            className={`leading-7 transition-all duration-300 ${
              visibleLines.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
            } ${line.text.startsWith("✓") ? "text-green-400" : line.text.startsWith("⠸") ? "text-cyan-400" : "text-zinc-300"}`}
          >
            {line.text}
          </div>
        ))}
        {visibleLines.length < terminal_lines.length && (
          <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1" />
        )}
      </div>
    </div>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Navbar */}
      <nav className="border-b border-zinc-800/60 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold text-white tracking-tight">DevFlow</span>
          <div className="flex items-center gap-6">
            <Link to="/docs" className="text-sm text-zinc-400 hover:text-white transition-colors">Docs</Link>
            <Link
              to="/dashboard"
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold transition-colors"
            >
              Dashboard →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Self-hosted CI/CD
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight tracking-tight mb-6">
            Your own{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              pipeline
            </span>
            ,<br /> your own rules.
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            DevFlow is a self-hosted CI/CD dashboard. Connect a GitHub repo,
            define your pipeline steps, and watch them execute live in Docker containers —
            all streamed to your browser in real time.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-colors"
            >
              Open Dashboard
            </Link>
            <Link
              to="/docs"
              className="px-6 py-3 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold transition-colors"
            >
              Read the Docs
            </Link>
          </div>
        </div>
        <TerminalDemo />
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-zinc-800/60">
        <h2 className="text-2xl font-bold text-white mb-2">Everything you need</h2>
        <p className="text-zinc-500 text-sm mb-10">Built from scratch — no third-party CI services.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-zinc-100 mb-1">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-zinc-800/60">
        <h2 className="text-2xl font-bold text-white mb-2">Tech Stack</h2>
        <p className="text-zinc-500 text-sm mb-8">Built with modern, production-grade tools.</p>
        <div className="flex flex-wrap gap-3">
          {stack.map((s) => (
            <span
              key={s.name}
              className={`px-4 py-2 rounded-lg border text-sm font-medium ${s.color}`}
            >
              {s.name}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-zinc-800/60">
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">See it in action</h2>
          <p className="text-zinc-400 mb-6">Load demo data and explore the full pipeline flow.</p>
          <Link
            to="/dashboard"
            className="inline-block px-8 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-colors"
          >
            Open Dashboard →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 px-6 py-8 text-center text-zinc-600 text-sm">
        Built by Dilshad Nirmal · DevFlow
      </footer>
    </div>
  );
};

export default LandingPage;
