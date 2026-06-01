"use client";
import ReactMarkdown from "react-markdown";
import { useSession } from "next-auth/react";


interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  followUpQuestions?: string[];
  traceId?: string;
  emailSentTo?: string;
  onFollowUp?: (question: string) => void;
}

export default function ChatMessage({
  role,
  content,
  followUpQuestions,
  traceId,
  emailSentTo,
  onFollowUp,
}: ChatMessageProps) {

  const { data: session } = useSession();

  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] sm:max-w-[70%] rounded-2xl rounded-br-md bg-purple-600/80 px-4 py-3 text-sm text-white shadow-lg">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] sm:max-w-[80%] space-y-3">
        {/* Report sent / trace info banner */}
        {session?.user && (
          <div className="flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-2.5">
            <svg className="h-4 w-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <div className="flex flex-col gap-0.5 text-xs">
              {emailSentTo && (
                <span className="text-green-300">
                  Detailed report sent to <span className="font-medium">{emailSentTo}</span>
                </span>
              )}
              {traceId && (
                <span className="text-white/40 font-mono text-[10px]">
                  Report has been sent(Check in Spam) to: {session.user.email} 
                </span>
              )}
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="rounded-2xl rounded-bl-md bg-white/5 border border-white/10 px-5 py-4 text-sm text-white/90 shadow-lg">
          <div className="prose">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>

        {/* Follow-up Questions */}
        {followUpQuestions && followUpQuestions.length > 0 && (
          <div className="space-y-2 pl-2">
            <p className="text-xs font-medium text-white/40">Follow-up questions</p>
            <div className="flex flex-wrap gap-2">
              {followUpQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => onFollowUp?.(q)}
                  className="rounded-lg border border-purple-500/20 bg-purple-500/5 px-3 py-1.5 text-xs text-purple-300 transition hover:bg-purple-500/15 hover:border-purple-500/40 cursor-pointer text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
