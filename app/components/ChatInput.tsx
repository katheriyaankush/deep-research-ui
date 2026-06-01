"use client";

import { useState, useRef } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  tokensRemaining: number;
  maxTokens: number;
  isExhausted: boolean;
  nextResetTime: number | null;
}

function formatTimeLeft(resetTime: number): string {
  const diff = resetTime - Date.now();
  if (diff <= 0) return "now";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function ChatInput({
  onSend,
  disabled,
  tokensRemaining,
  maxTokens,
  isExhausted,
  nextResetTime,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled || isExhausted) return;
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 150) + "px";
    }
  };

  return (
    <div className="space-y-2">
      {/* Token counter */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: maxTokens }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i < tokensRemaining
                    ? "bg-purple-400"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>
          <span className={`text-[11px] font-medium ${isExhausted ? "text-red-400" : "text-white/50"}`}>
            {tokensRemaining}/{maxTokens} queries left
          </span>
        </div>
        {isExhausted && nextResetTime && (
          <span className="text-[11px] text-red-400/80">
            Resets in {formatTimeLeft(nextResetTime)}
          </span>
        )}
      </div>

      {/* Exhausted banner */}
      {isExhausted && (
        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5">
          <svg className="h-4 w-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span className="text-xs text-red-300">
            Daily limit reached. You can ask {maxTokens} questions per 24 hours.
            {nextResetTime && ` Next token available in ${formatTimeLeft(nextResetTime)}.`}
          </span>
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={`flex items-end gap-2 rounded-2xl border p-2 backdrop-blur-sm transition-colors ${
          isExhausted
            ? "border-red-500/20 bg-red-500/5"
            : "border-white/10 bg-white/5 focus-within:border-purple-500/50"
        }`}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={isExhausted ? "Daily limit reached — try again later" : "Ask anything... e.g. 'Explain Agentic AI'"}
            disabled={disabled || isExhausted}
            rows={1}
            className="flex-1 resize-none bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={disabled || !input.trim() || isExhausted}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white transition-all hover:bg-purple-500 disabled:opacity-30 disabled:hover:bg-purple-600 cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
