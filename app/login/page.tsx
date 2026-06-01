"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

type WebViewType = "linkedin" | "facebook" | "instagram" | "other" | null;

function detectWebView(): WebViewType {
  if (typeof window === "undefined") return null;
  const ua = navigator.userAgent || "";

  if (/LinkedInApp/i.test(ua)) return "linkedin";
  if (/FBAN|FBAV|FB_IAB|FB4A|FBIOS/i.test(ua)) return "facebook";
  if (/Instagram/i.test(ua)) return "instagram";

  // Generic WebView detection (covers most in-app browsers)
  if (
    /wv\b/.test(ua) ||
    (/Android/i.test(ua) && !/Chrome/i.test(ua)) ||
    (/iPhone|iPad/i.test(ua) && /AppleWebKit/i.test(ua) && !/Safari/i.test(ua))
  ) {
    return "other";
  }

  return null;
}

function isAndroid() {
  return /android/i.test(navigator.userAgent);
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function WebViewBlocker({ type }: { type: WebViewType }) {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    if (!isAndroid()) return;
    // Try to force-open Chrome on Android via intent URI
    const stripped = currentUrl.replace(/^https?:\/\//, "");
    window.location.href = `intent://${stripped}#Intent;scheme=https;package=com.android.chrome;end;`;
  }, [currentUrl]);

  const appName =
    type === "linkedin" ? "LinkedIn"
    : type === "facebook" ? "Facebook"
    : type === "instagram" ? "Instagram"
    : "this app";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 px-5">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-2xl text-center space-y-5">

        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <svg className="h-7 w-7 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-white">Open in your browser</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Google blocks sign-in inside the {appName} browser to protect your account. You need to open this in Chrome or Safari.
          </p>
        </div>

        {/* Instructions */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 text-left">
          {isAndroid() && (
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">🤖</span>
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-white">Android:</span> Chrome should open automatically. If not, tap the{" "}
                <span className="font-semibold text-white">⋮ menu</span> (top right) and select{" "}
                <span className="font-semibold text-white">"Open in browser"</span>.
              </div>
            </div>
          )}

          {isIOS() && (
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">🍏</span>
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-white">iPhone/iPad:</span> Tap the{" "}
                <span className="font-semibold text-white">Safari icon</span> or{" "}
                <span className="font-semibold text-white">⋯ menu</span> at the bottom of the screen and choose{" "}
                <span className="font-semibold text-white">"Open in Safari"</span>.
              </div>
            </div>
          )}

          {!isAndroid() && !isIOS() && (
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">🌐</span>
              <div className="text-xs text-slate-300 leading-relaxed">
                Copy the link and paste it into <span className="font-semibold text-white">Chrome</span> or your default browser.
              </div>
            </div>
          )}
        </div>

        {/* Copy URL button */}
        <button
          onClick={() => navigator.clipboard?.writeText(currentUrl)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-700 cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
          </svg>
          Copy link to open in browser
        </button>

      </div>
    </div>
  );
}

export default function LoginPage() {
  const [webViewType, setWebViewType] = useState<WebViewType>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setWebViewType(detectWebView());
    setChecked(true);
  }, []);

  // Don't render until we've checked (avoids hydration mismatch)
  if (!checked) return null;

  if (webViewType) {
    return <WebViewBlocker type={webViewType} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/5 p-10 backdrop-blur-xl border border-white/10 shadow-2xl">

        {/* Logo / Brand */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/25">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Deep Research</h1>
          <p className="text-sm text-white/60">
            Multi-agent AI research powered by collaborative intelligence
          </p>
        </div>

        {/* Google SSO Button */}
        <div className="space-y-3">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white/10 px-4 py-3.5 text-sm font-medium text-white transition hover:bg-white/20 border border-white/10 cursor-pointer"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-xs text-white/40">
          By signing in, you agree to our terms of service
        </p>
      </div>
    </div>
  );
}
