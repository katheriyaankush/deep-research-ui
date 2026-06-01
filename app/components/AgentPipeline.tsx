"use client";

type AgentStatus = "idle" | "active" | "done";

interface Agent {
  id: string;
  name: string;
  icon: string;
  status: AgentStatus;
}

const AGENTS: Agent[] = [
  { id: "planner", name: "Planner", icon: "🧠", status: "idle" },
  { id: "searcher", name: "Searcher", icon: "🔍", status: "idle" },
  { id: "writer", name: "Writer", icon: "✍️", status: "idle" },
  { id: "emailer", name: "Emailer", icon: "📧", status: "idle" },
];

function getAgentStatuses(currentStep: string | null): Agent[] {
  if (!currentStep) return AGENTS;

  const stepMap: Record<string, Record<string, AgentStatus>> = {
    planning: { planner: "active", searcher: "idle", writer: "idle", emailer: "idle" },
    searching: { planner: "done", searcher: "active", writer: "idle", emailer: "idle" },
    writing: { planner: "done", searcher: "done", writer: "active", emailer: "idle" },
    emailing: { planner: "done", searcher: "done", writer: "done", emailer: "active" },
    complete: { planner: "done", searcher: "done", writer: "done", emailer: "done" },
  };

  const statuses = stepMap[currentStep] || {};
  return AGENTS.map((a) => ({ ...a, status: statuses[a.id] || "idle" }));
}

export default function AgentPipeline({ currentStep }: { currentStep: string | null }) {
  const agents = getAgentStatuses(currentStep);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 py-4 px-2">
      {agents.map((agent, i) => (
        <div key={agent.id} className="flex items-center gap-2 sm:gap-4">
          {/* Agent node */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full text-lg sm:text-xl transition-all duration-500 ${
                agent.status === "active"
                  ? "bg-purple-500/20 ring-2 ring-purple-400 agent-pulse text-purple-300"
                  : agent.status === "done"
                  ? "bg-green-500/20 ring-2 ring-green-400 text-green-300"
                  : "bg-white/5 ring-1 ring-white/10 text-white/40"
              }`}
            >
              {agent.icon}
            </div>
            <span
              className={`text-[10px] sm:text-xs font-medium transition-colors ${
                agent.status === "active"
                  ? "text-purple-300"
                  : agent.status === "done"
                  ? "text-green-300"
                  : "text-white/40"
              }`}
            >
              {agent.name}
            </span>
          </div>

          {/* Connector line */}
          {i < agents.length - 1 && (
            <div
              className={`h-0.5 w-6 sm:w-10 rounded transition-colors duration-500 ${
                agent.status === "done" ? "bg-green-400/50" : "bg-white/10"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
