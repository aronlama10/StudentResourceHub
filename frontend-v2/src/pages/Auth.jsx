import { useState } from "react";
import { Link } from "react-router-dom";

export default function Auth() {
  const [mode, setMode] = useState("signup"); // 'login' or 'signup'

  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-10 flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute rounded-full blur-[100px] opacity-[0.35] animate-authOrbFloat w-[500px] h-[500px] bg-[radial-gradient(circle,_#6366f1_0%,_transparent_70%)] top-[-10%] left-[-8%]" />
        <div
          className="absolute rounded-full blur-[100px] opacity-[0.35] animate-authOrbFloat w-[450px] h-[450px] bg-[radial-gradient(circle,_#06b6d4_0%,_transparent_70%)] bottom-[-10%] right-[-8%]"
          style={{ animationDelay: "-7s" }}
        />
        <div
          className="absolute rounded-full blur-[100px] opacity-[0.15] animate-authOrbFloat w-[350px] h-[350px] bg-[radial-gradient(circle,_#8b5cf6_0%,_transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ animationDelay: "-14s" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[length:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      <div className="relative z-[2] w-full max-w-[460px] flex flex-col gap-6 animate-authFadeIn">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[0.88rem] font-medium text-[var(--color-text-muted)] transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] self-start hover:text-[var(--color-text-primary)]"
          id="auth-back-home"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Auth Card */}
        <div
          className="bg-[rgba(17,24,39,0.65)] backdrop-blur-[24px] backdrop-saturate-[1.3] [border:1px_solid_rgba(255,255,255,0.08)] rounded-[28px] px-9 py-11 shadow-[var(--shadow-lg)] max-[520px]:px-5 max-[520px]:py-8"
          id="auth-card"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-[10px] font-[var(--font-heading)] text-[1.3rem] font-bold text-[var(--color-text-primary)] mb-6">
            <span className="flex items-center">
              <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <defs>
                  <linearGradient
                    id="authLogoGrad"
                    x1="0"
                    y1="0"
                    x2="32"
                    y2="32"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <rect
                  x="2"
                  y="4"
                  width="28"
                  height="24"
                  rx="4"
                  stroke="url(#authLogoGrad)"
                  strokeWidth="2.5"
                  fill="none"
                />
                <path
                  d="M8 12h16M8 16h12M8 20h8"
                  stroke="url(#authLogoGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="26"
                  cy="22"
                  r="4"
                  fill="url(#authLogoGrad)"
                  opacity="0.7"
                />
              </svg>
            </span>
            <span>
              Student<span className="gradient-text">Hub</span>
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-[1.7rem] font-extrabold text-center mb-1.5 tracking-[-0.02em]"
            id="auth-title"
          >
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-center text-[0.92rem] text-[var(--color-text-secondary)] mb-7 leading-[1.6]">
            {mode === "login"
              ? "Sign in to access your dashboard and resources."
              : "Join the community and start sharing resources today."}
          </p>

          {/* Toggle Tabs */}
          <div
            className="flex relative bg-white/[0.04] border border-white/[0.06] rounded-full p-1 mb-7"
            id="auth-tabs"
          >
            <button
              className={`flex-1 py-2.5 text-[0.88rem] font-semibold rounded-full relative z-[2] transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                mode === "login"
                  ? "text-[var(--color-text-primary)]"
                  : "text-[var(--color-text-muted)]"
              }`}
              onClick={() => setMode("login")}
              id="auth-tab-login"
            >
              Log In
            </button>
            <button
              className={`flex-1 py-2.5 text-[0.88rem] font-semibold rounded-full relative z-[2] transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                mode === "signup"
                  ? "text-[var(--color-text-primary)]"
                  : "text-[var(--color-text-muted)]"
              }`}
              onClick={() => setMode("signup")}
              id="auth-tab-signup"
            >
              Sign Up
            </button>
            <div
              className="absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-[rgba(99,102,241,0.15)] border border-[rgba(99,102,241,0.25)] rounded-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-[1]"
              style={{
                transform:
                  mode === "login" ? "translateX(0)" : "translateX(100%)",
              }}
            />
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-5"
            id="auth-form"
            onSubmit={(e) => e.preventDefault()}
          >
            {mode === "signup" && (
              <div
                className="flex flex-col gap-1.5 animate-fieldSlideIn"
                key="fullname"
              >
                <label
                  className="text-[0.82rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-[0.05em]"
                  htmlFor="auth-fullname"
                >
                  Full Name
                </label>
                <div className="relative flex items-center group">
                  <svg
                    className="absolute left-3.5 text-[var(--color-text-muted)] pointer-events-none transition-colors duration-200 group-focus-within:text-[var(--color-accent-primary)]"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    id="auth-fullname"
                    className="w-full py-[13px] pr-[14px] pl-[44px] bg-white/[0.04] border border-white/[0.08] rounded-[12px] text-[var(--color-text-primary)] text-[0.92rem] font-[var(--font-body)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)] focus:border-[rgba(99,102,241,0.5)] focus:bg-[rgba(99,102,241,0.04)] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5" key="email">
              <label
                className="text-[0.82rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-[0.05em]"
                htmlFor="auth-email"
              >
                Email Address
              </label>
              <div className="relative flex items-center group">
                <svg
                  className="absolute left-3.5 text-[var(--color-text-muted)] pointer-events-none transition-colors duration-200 group-focus-within:text-[var(--color-accent-primary)]"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  id="auth-email"
                  className="w-full py-[13px] pr-[14px] pl-[44px] bg-white/[0.04] border border-white/[0.08] rounded-[12px] text-[var(--color-text-primary)] text-[0.92rem] font-[var(--font-body)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)] focus:border-[rgba(99,102,241,0.5)] focus:bg-[rgba(99,102,241,0.04)] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5" key="password">
              <label
                className="text-[0.82rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-[0.05em]"
                htmlFor="auth-password"
              >
                Password
              </label>
              <div className="relative flex items-center group">
                <svg
                  className="absolute left-3.5 text-[var(--color-text-muted)] pointer-events-none transition-colors duration-200 group-focus-within:text-[var(--color-accent-primary)]"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  id="auth-password"
                  className="w-full py-[13px] pr-[14px] pl-[44px] bg-white/[0.04] border border-white/[0.08] rounded-[12px] text-[var(--color-text-primary)] text-[0.92rem] font-[var(--font-body)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)] focus:border-[rgba(99,102,241,0.5)] focus:bg-[rgba(99,102,241,0.04)] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                  placeholder={
                    mode === "login"
                      ? "Enter your password"
                      : "Create a password"
                  }
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
              </div>
            </div>

            {mode === "signup" && (
              <div
                className="flex flex-col gap-1.5 animate-fieldSlideIn"
                key="confirm-password"
              >
                <label
                  className="text-[0.82rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-[0.05em]"
                  htmlFor="auth-confirm-password"
                >
                  Confirm Password
                </label>
                <div className="relative flex items-center group">
                  <svg
                    className="absolute left-3.5 text-[var(--color-text-muted)] pointer-events-none transition-colors duration-200 group-focus-within:text-[var(--color-accent-primary)]"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <input
                    type="password"
                    id="auth-confirm-password"
                    className="w-full py-[13px] pr-[14px] pl-[44px] bg-white/[0.04] border border-white/[0.08] rounded-[12px] text-[var(--color-text-primary)] text-[0.92rem] font-[var(--font-body)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)] focus:border-[rgba(99,102,241,0.5)] focus:bg-[rgba(99,102,241,0.04)] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}

            {mode === "login" && (
              <div className="flex items-center justify-between">
                <label className="relative flex items-center gap-2 text-[0.85rem] text-[var(--color-text-secondary)] cursor-pointer">
                  <input
                    type="checkbox"
                    id="auth-remember"
                    className="peer absolute opacity-0 w-0 h-0"
                  />
                  <span className="w-[18px] h-[18px] border border-white/[0.15] rounded-[4px] bg-white/[0.04] flex items-center justify-center transition-all duration-200 peer-checked:bg-[var(--color-accent-primary)] peer-checked:border-[var(--color-accent-primary)] after:content-[''] after:text-white after:text-[0.7rem] after:font-bold after:leading-none peer-checked:after:content-['✓']" />
                  Remember me
                </label>
                <a
                  href="#"
                  className="text-[0.85rem] text-[var(--color-accent-primary)] font-medium transition-opacity duration-200 hover:opacity-80"
                  id="auth-forgot"
                >
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-[15px] bg-[image:var(--gradient-cta)] bg-[length:200%_200%] bg-no-repeat text-white font-bold text-[0.95rem] rounded-[12px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_4px_24px_rgba(99,102,241,0.3)] animate-gradientShift mt-1 hover:-translate-y-[2px] hover:shadow-[0_6px_32px_rgba(99,102,241,0.45)] active:translate-y-0"
              id="auth-submit"
            >
              {mode === "login" ? "Sign In" : "Create Account"}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>

          {/* Divider */}
          {/* <div className="auth__divider">
            <span>or continue with</span>
          </div> */}

          {/* Social Auth */}
          {/* <div className="auth__social" id="auth-social">
            <button className="auth__social-btn" id="auth-google" type="button">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="auth__social-btn" id="auth-github" type="button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div> */}

          {/* Footer Toggle */}
          <p
            className="text-center text-[0.88rem] text-[var(--color-text-muted)] mt-6"
            id="auth-toggle"
          >
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="bg-transparent text-[var(--color-accent-primary)] font-semibold text-[0.88rem] p-0 transition-opacity duration-200 hover:opacity-80"
                  onClick={() => setMode("signup")}
                >
                  Sign up for free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="bg-transparent text-[var(--color-accent-primary)] font-semibold text-[0.88rem] p-0 transition-opacity duration-200 hover:opacity-80"
                  onClick={() => setMode("login")}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
