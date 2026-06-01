"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between border-b border-white/5 px-4 sm:px-6 py-3 backdrop-blur-md bg-black/40 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
        </div>
        <h1 className="text-sm font-semibold text-white">Deep Research</h1>
        <span className="hidden sm:inline rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-300 border border-purple-500/20">
          Multi-Agent
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        <Link
          href="/about"
          className="rounded-lg px-3 py-1.5 text-xs text-white/50 transition hover:bg-white/5 hover:text-white/80"
        >
          About
        </Link>

        {session?.user && (
          <>
            <button
              onClick={() => signOut()}
              className="rounded-lg px-3 py-1.5 text-xs text-white/50 transition hover:bg-white/5 hover:text-white/80 cursor-pointer"
            >
              Sign out
            </button>
            <div className="flex items-center gap-2">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-7 w-7 rounded-full ring-1 ring-white/10"
                />
              )}
              <span className="hidden sm:inline text-xs text-white/60">{session.user.name}</span>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
