"use client";

import { useRef, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import AgentPipeline from "./components/AgentPipeline";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import { useTokenQuota } from "./hooks/useTokenQuota";

interface Message {
  role: "user" | "assistant";
  content: string;
  followUpQuestions?: string[];
  traceId?: string;
  emailSentTo?: string;
}

function eventToAgentStep(eventType: string): string | null {
  switch (eventType) {
    case "planning":
    case "plan":
      return "planning";
    case "searching":
    case "search":
      return "searching";
    case "writing":
    case "write":
    case "report":
      return "writing";
    case "emailing":
    case "email":
      return "emailing";
    case "complete":
    case "done":
      return "complete";
    default:
      return null;
  }
}

function fallbackAgentStep(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes("searches planned") || lower.includes("planning")) return "planning";
  if (lower.includes("starting to search") || lower.includes("searching")) return "searching";
  if (lower.includes("searches complete") || lower.includes("writing report")) return "writing";
  if (lower.includes("report written") || lower.includes("sending email")) return "emailing";
  if (lower.includes("email sent") || lower.includes("research complete")) return "complete";
  return null;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { tokensRemaining, maxTokens, isExhausted, nextResetTime, consumeToken } =
    useTokenQuota(session?.user?.email);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0ms]" />
          <span className="h-2 w-2 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" />
          <span className="h-2 w-2 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    );
  }

  const handleSend = async (query: string) => {
    if (isExhausted) return;
    if (!consumeToken()) return;

    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setIsLoading(true);
    setCurrentStep("planning");

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error("Research request failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";
      let currentEvent = "";
      let fullDataBuffer = "";
      let traceId = "";
      let emailSentTo = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          // Parse event type
          if (line.startsWith("event: ")) {
            currentEvent = line.slice(7).trim();
            continue;
          }

          // Parse data
          if (line.startsWith("data: ")) {
            const rawData = line.slice(6);
            if (!rawData.trim()) continue;

            // Check for trace link in plain text format
            const traceMatch = rawData.match(/trace_id[=:]([a-zA-Z0-9_]+)/);
            if (traceMatch) {
              traceId = traceMatch[1];
            }

            // Check for email sent status in plain text
            if (rawData.toLowerCase().includes("email sent")) {
              setCurrentStep("complete");
            }

            // Accumulate data (JSON might span multiple data lines)
            fullDataBuffer += rawData;

            // Try to parse as JSON
            let parsed: Record<string, unknown> | null = null;
            try {
              parsed = JSON.parse(fullDataBuffer);
              fullDataBuffer = ""; // Reset on successful parse
            } catch {
              // Might be incomplete JSON or plain text — check if it's plain text status
              const step = eventToAgentStep(currentEvent) || fallbackAgentStep(rawData);
              if (step) {
                setCurrentStep(step);
                fullDataBuffer = ""; // It was a status message, not partial JSON
              }
              continue;
            }

            // Successfully parsed JSON
            if (parsed) {
              // Extract trace_id if present
              if (parsed.trace_id) traceId = String(parsed.trace_id);
              if (parsed.traceId) traceId = String(parsed.traceId);
              // Extract email if present in response
              if (parsed.email_sent_to) emailSentTo = String(parsed.email_sent_to);
              if (parsed.email) emailSentTo = String(parsed.email);

              // Check if it's the final research response with markdown_report
              if (parsed.markdown_report) {
                setCurrentStep("complete");
                const report = String(parsed.markdown_report);
                const followUps = Array.isArray(parsed.follow_up_questions)
                  ? (parsed.follow_up_questions as string[])
                  : [];

                setMessages((prev) => {
                  const updated = [...prev];
                  const lastMsg = updated[updated.length - 1];
                  if (lastMsg?.role === "assistant") {
                    lastMsg.content = report;
                    lastMsg.followUpQuestions = followUps;
                    lastMsg.traceId = traceId || undefined;
                    lastMsg.emailSentTo = emailSentTo || undefined;
                  } else {
                    updated.push({
                      role: "assistant",
                      content: report,
                      followUpQuestions: followUps,
                      traceId: traceId || undefined,
                      emailSentTo: emailSentTo || undefined,
                    });
                  }
                  return [...updated];
                });
              } else {
                // It's a progress/status JSON event
                const step = eventToAgentStep(currentEvent) ||
                  (parsed.status ? fallbackAgentStep(String(parsed.status)) : null) ||
                  (parsed.message ? fallbackAgentStep(String(parsed.message)) : null);
                if (step) setCurrentStep(step);

                // If it has content/text but no markdown_report, show it
                const content = parsed.content || parsed.text || parsed.report;
                if (content) {
                  setMessages((prev) => {
                    const updated = [...prev];
                    const lastMsg = updated[updated.length - 1];
                    if (lastMsg?.role === "assistant") {
                      lastMsg.content = String(content);
                    } else {
                      updated.push({ role: "assistant", content: String(content) });
                    }
                    return [...updated];
                  });
                }
              }
            }

            currentEvent = "";
            continue;
          }

          // Empty line resets event context (SSE spec)
          if (line.trim() === "") {
            currentEvent = "";
          }
        }
      }

      // Handle any remaining buffer (in case stream ended without newline)
      if (fullDataBuffer.trim()) {
        try {
          const parsed = JSON.parse(fullDataBuffer);
          if (parsed.trace_id) traceId = String(parsed.trace_id);
          if (parsed.traceId) traceId = String(parsed.traceId);
          if (parsed.email_sent_to) emailSentTo = String(parsed.email_sent_to);
          if (parsed.email) emailSentTo = String(parsed.email);

          if (parsed.markdown_report) {
            setCurrentStep("complete");
            const followUps = Array.isArray(parsed.follow_up_questions)
              ? (parsed.follow_up_questions as string[])
              : [];
            setMessages((prev) => {
              const updated = [...prev];
              const lastMsg = updated[updated.length - 1];
              if (lastMsg?.role === "assistant") {
                lastMsg.content = String(parsed.markdown_report);
                lastMsg.followUpQuestions = followUps;
                lastMsg.traceId = traceId || undefined;
                lastMsg.emailSentTo = emailSentTo || undefined;
              } else {
                updated.push({
                  role: "assistant",
                  content: String(parsed.markdown_report),
                  followUpQuestions: followUps,
                  traceId: traceId || undefined,
                  emailSentTo: emailSentTo || undefined,
                });
              }
              return [...updated];
            });
          }
        } catch {
          // ignore
        }
      }

      // If we got a trace ID but haven't attached it to a message yet, update the last assistant message
      if (traceId || emailSentTo) {
        setMessages((prev) => {
          const updated = [...prev];
          const lastAssistant = [...updated].reverse().find((m) => m.role === "assistant");
          if (lastAssistant) {
            if (traceId) lastAssistant.traceId = traceId;
            if (emailSentTo) lastAssistant.emailSentTo = emailSentTo;
          }
          return [...updated];
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => setCurrentStep(null), 3000);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[#0a0a0f]">
      <Header />

      {/* Agent Pipeline Visualization */}
      {(isLoading || currentStep) && (
        <div className="border-b border-white/5 bg-black/20">
          <AgentPipeline currentStep={currentStep} />
        </div>
      )}

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center pt-8 pb-4 space-y-10">

              {/* Hero */}
              <div className="text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-2xl shadow-purple-900/50">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Deep Research Agent</h2>
                  <p className="mt-1.5 text-sm text-white/45 max-w-sm mx-auto leading-relaxed">
                    Ask anything. Four AI agents collaborate to search, synthesize, and deliver a full report to your inbox.
                  </p>
                </div>
              </div>

              {/* Agent mini-pipeline */}
              <div className="flex items-center gap-2 sm:gap-3">
                {[
                  { emoji: "🧠", label: "Planner", color: "border-purple-500/25 bg-purple-500/8" },
                  { emoji: "🔍", label: "Searcher", color: "border-blue-500/25 bg-blue-500/8" },
                  { emoji: "✍️", label: "Writer", color: "border-cyan-500/25 bg-cyan-500/8" },
                  { emoji: "📧", label: "Emailer", color: "border-emerald-500/25 bg-emerald-500/8" },
                ].map((a, i) => (
                  <div key={a.label} className="flex items-center gap-2 sm:gap-3">
                    <div className={`flex flex-col items-center gap-1 rounded-xl border ${a.color} px-3 py-2.5`}>
                      <span className="text-lg">{a.emoji}</span>
                      <span className="text-[10px] text-white/40 font-medium">{a.label}</span>
                    </div>
                    {i < 3 && (
                      <svg className="h-3 w-3 text-white/15 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { icon: "🌐", text: "Live web search" },
                  { icon: "📄", text: "Markdown report" },
                  { icon: "📬", text: "Email delivery" },
                  { icon: "🔭", text: "OpenAI tracing" },
                ].map(({ icon, text }) => (
                  <span key={text} className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-xs text-white/40">
                    <span>{icon}</span>{text}
                  </span>
                ))}
              </div>

              {/* Suggestions */}
              <div className="w-full max-w-lg space-y-2">
                <p className="text-center text-[11px] text-white/25 uppercase tracking-wider font-medium">Try asking</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { q: "Latest trends in AI", icon: "🤖" },
                    { q: "Remote work trends and productivity research", icon: "💼" },
                    { q: "Best AI frameworks for production", icon: "🤖" },
                    { q: "Electric vehicles market analysis", icon: "⚡" },
                  ].map(({ q, icon }) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      disabled={isExhausted}
                      className="flex items-start gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-left text-xs text-white/50 transition hover:bg-white/[0.07] hover:text-white/80 hover:border-white/15 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed group"
                    >
                      <span className="text-base shrink-0 mt-0.5">{icon}</span>
                      <span className="leading-relaxed">{q}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              role={msg.role}
              content={msg.content}
              followUpQuestions={msg.followUpQuestions}
              traceId={msg.traceId}
              emailSentTo={msg.emailSentTo}
              onFollowUp={handleSend}
            />
          ))}

          {isLoading && !messages.find((m) => m.role === "assistant") && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" />
                </div>
                <span className="text-xs text-white/40">Agents working...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/5 bg-black/40 backdrop-blur-md px-4 sm:px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <ChatInput
            onSend={handleSend}
            disabled={isLoading}
            tokensRemaining={tokensRemaining}
            maxTokens={maxTokens}
            isExhausted={isExhausted}
            nextResetTime={nextResetTime}
          />
          <p className="mt-2 text-center text-[10px] text-white/30">
            Powered by multi-agent deep research • Results may take a moment
          </p>
        </div>
      </div>
    </div>
  );
}
