import Link from "next/link";

const agents = [
  {
    emoji: "🧠",
    name: "Planner",
    role: "Breaks the query into targeted search tasks",
    color: "from-purple-500/20 to-violet-500/10",
    border: "border-purple-500/20",
    dot: "bg-purple-400",
  },
  {
    emoji: "🔍",
    name: "Searcher",
    role: "Runs WebSearchTool across live web sources",
    color: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/20",
    dot: "bg-blue-400",
  },
  {
    emoji: "✍️",
    name: "Writer",
    role: "Synthesizes findings into a structured report",
    color: "from-cyan-500/20 to-teal-500/10",
    border: "border-cyan-500/20",
    dot: "bg-cyan-400",
  },
  {
    emoji: "📧",
    name: "Emailer",
    role: "LLM-triggered SendGrid dispatch to your inbox",
    color: "from-emerald-500/20 to-green-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
];

const stack = [
  {
    category: "Orchestration",
    gradient: "from-purple-500 to-violet-600",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
    items: [
      { name: "OpenAI Agents SDK", tag: "Latest", desc: "Multi-agent orchestration with built-in tracing, handoffs, and tool use." },
      { name: "GPT-4o", tag: "LLM", desc: "Powers all agents — planning, synthesis, and autonomous email triggering." },
    ],
  },
  {
    category: "Web Search",
    gradient: "from-blue-500 to-cyan-500",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
    items: [
      { name: "WebSearchTool", tag: "Built-in", desc: "Native SDK tool that lets the Searcher agent query the live web in real time." },
      { name: "Parallel search", tag: "Perf", desc: "Multiple searches run concurrently across news, articles, and authoritative sources." },
    ],
  },
  {
    category: "Email Delivery",
    gradient: "from-emerald-500 to-teal-500",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
    items: [
      { name: "SendGrid", tag: "API", desc: "Transactional email delivery — the agent calls SendGrid after report generation." },
      { name: "LLM-triggered", tag: "Agentic", desc: "Email is sent because the model decided to act — not a hardcoded if-statement." },
    ],
  },
  {
    category: "Backend",
    gradient: "from-orange-500 to-amber-500",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    items: [
      { name: "Python", tag: "Runtime", desc: "Hosts the agent pipeline, exposed as a streaming HTTP endpoint." },
      { name: "SSE Streaming", tag: "Protocol", desc: "Real-time agent status and report streamed back to the UI as events." },
      { name: "Hugging Face Spaces", tag: "Hosting", desc: "Zero-infrastructure deployment for the research API." },
    ],
  },
  {
    category: "Frontend",
    gradient: "from-pink-500 to-rose-500",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" />
      </svg>
    ),
    items: [
      { name: "Next.js 16", tag: "Framework", desc: "App Router, streaming, and the new proxy convention for auth." },
      { name: "NextAuth v5", tag: "Auth", desc: "Google SSO with session-based authentication." },
      { name: "Tailwind CSS v4", tag: "Styling", desc: "CSS-first utility styling with dark theme." },
    ],
  },
];

const steps = [
  { n: "01", title: "You ask a question", desc: "Your query is sent from the Next.js frontend to the Python backend. Your Google email is included so the report can be delivered to your inbox." },
  { n: "02", title: "Planner Agent breaks it down", desc: "The OpenAI Agents SDK orchestrates a Planner that analyzes your query and generates a set of targeted search tasks." },
  { n: "03", title: "Searcher hits the web", desc: "Using WebSearchTool, the Searcher runs multiple parallel web searches — pulling live data from news, articles, and authoritative sources." },
  { n: "04", title: "Writer composes the report", desc: "All gathered data is handed to the Content Writer, which synthesizes everything into a structured markdown report with a summary and follow-up questions." },
  { n: "05", title: "Email Agent delivers it", desc: "The LLM autonomously triggers the Email Agent once the report is ready. It calls SendGrid's API — no manual trigger, no schedule." },
  { n: "06", title: "Streamed back in real time", desc: "Throughout the process, SSE events animate the agent pipeline in the UI so you can see exactly which agent is working." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 h-14">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
              <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">Deep Research</span>
          </Link>

          <div className="flex items-center gap-1">
            <span className="hidden sm:inline text-xs text-white/30 px-3">About</span>
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Back to chat
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-14 space-y-20">

        {/* Hero */}
        <section className="text-center space-y-5 pt-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-1.5 text-xs font-medium text-purple-300">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
            Agentic AI · Multi-Agent Pipeline · OpenAI SDK
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            How Deep Research works
          </h1>
          <p className="mx-auto max-w-xl text-base text-white/45 leading-relaxed">
            A fully autonomous research pipeline — multiple AI agents collaborate to search the web, write reports, and deliver results to your inbox from a single question.
          </p>
        </section>

        {/* Agent pipeline */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-white/25">Agent Pipeline</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {agents.map((agent, i) => (
              <div key={agent.name} className="relative">
                <div className={`rounded-2xl border ${agent.border} bg-gradient-to-b ${agent.color} p-5 text-center space-y-3 h-full`}>
                  <div className="text-3xl">{agent.emoji}</div>
                  <div>
                    <p className="text-sm font-semibold text-white">{agent.name}</p>
                    <p className="text-[11px] text-white/45 mt-1 leading-snug">{agent.role}</p>
                  </div>
                  <div className={`mx-auto h-1.5 w-1.5 rounded-full ${agent.dot}`} />
                </div>
                {i < agents.length - 1 && (
                  <div className="hidden sm:flex absolute -right-1.5 top-1/2 -translate-y-1/2 z-10 h-3 w-3 items-center justify-center">
                    <svg className="h-3 w-3 text-white/20" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-white/25">
            Orchestrated by the OpenAI Agents SDK · Each agent has a single responsibility
          </p>
        </section>

        {/* Step by step */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-white/25">The Flow</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="flex gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-[11px] font-mono font-bold text-white/30 border border-white/8">
                  {n}
                </span>
                <div className="space-y-1 pt-0.5">
                  <p className="text-sm font-semibold text-white/90">{title}</p>
                  <p className="text-xs text-white/45 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech stack */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-white/25">Tech Stack</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stack.map((s) => (
              <div key={s.category} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${s.gradient} text-white`}>
                    {s.icon}
                  </div>
                  <span className="text-sm font-semibold text-white/80">{s.category}</span>
                </div>
                <ul className="space-y-3">
                  {s.items.map((item) => (
                    <li key={item.name} className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 rounded-md bg-white/5 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/30">
                        {item.tag}
                      </span>
                      <div>
                        <p className="text-xs font-medium text-white/70">{item.name}</p>
                        <p className="text-[11px] text-white/35 leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Why agentic */}
        <section className="rounded-2xl border border-purple-500/15 bg-gradient-to-br from-purple-500/8 to-blue-500/5 p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/20">
              <svg className="h-3.5 w-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-purple-300">Why agentic, not just a prompt?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: "⚡", title: "Specialization", desc: "Each agent has one job. The Searcher doesn't write; the Writer doesn't search. Single-responsibility produces better results than one monolithic prompt." },
              { icon: "🤖", title: "Autonomy", desc: "The email is sent because the LLM decided to act — not a hardcoded if-statement. The agent evaluates context and triggers the action itself." },
              { icon: "🔭", title: "Observability", desc: "Every run is traced via OpenAI's tracing platform. The trace ID surfaces in the UI so you can inspect exactly what each agent did." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{icon}</span>
                  <p className="text-sm font-semibold text-white/80">{title}</p>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 transition hover:from-purple-500 hover:to-purple-400"
          >
            Try it yourself
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </section>

      </main>
    </div>
  );
}
