import { useEffect, useState } from "react";

function AuthModal({ authMode, isOpen, onClose, onModeChange }) {
  const [localMode, setLocalMode] = useState(authMode ?? "register");

  useEffect(() => {
    if (isOpen) {
      setLocalMode(authMode ?? "register");
    }
  }, [authMode, isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const activeMode = localMode === "login" ? "login" : "register";

  const handleModeChange = (mode) => {
    setLocalMode(mode);
    onModeChange(mode);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        aria-modal="true"
        className="w-full max-w-lg border-[3px] border-black bg-(--card) p-5 shadow-[8px_8px_0_0_#111] sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-black/55">
              Access the dashboard
            </p>
            <h3 className="text-2xl font-black tracking-[-0.03em] sm:text-3xl">
              Log in or create an account
            </h3>
          </div>
          <button
            className="border-[3px] border-black bg-(--sun) px-3 py-2 text-xs font-black uppercase tracking-[0.12em] shadow-[3px_3px_0_0_#111]"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>
        <div className="mt-5 flex gap-3 border-[3px] border-black bg-white p-2">
          <button
            className={`flex-1 border-2 border-black px-4 py-2 text-sm font-extrabold uppercase tracking-widest shadow-[1px_1px_0_0_#111] transition ${
              activeMode === "login"
                ? "bg-(--berry) text-white"
                : "bg-white"
            }`}
            onClick={() => handleModeChange("login")}
            type="button"
          >
            Log in
          </button>
          <button
            className={`flex-1 border-2 border-black px-4 py-2 text-sm font-extrabold uppercase tracking-widest shadow-[1px_1px_0_0_#111] transition ${
              activeMode === "register" ? "bg-(--mint)" : "bg-white"
            }`}
            onClick={() => handleModeChange("register")}
            type="button"
          >
            Register
          </button>
        </div>
        <div className="mt-5 space-y-3">
          {activeMode === "register" && (
            <label className="block text-sm font-black uppercase tracking-widest">
              Full name
              <input
                className="mt-2 w-full border-[3px] border-black px-3 py-3 text-sm font-normal shadow-[3px_3px_0_0_#111] outline-none"
                placeholder="Your name"
                type="text"
              />
            </label>
          )}
          <label className="block text-sm font-black uppercase tracking-widest">
            Email
            <input
              className="mt-2 w-full border-[3px] border-black px-3 py-3 text-sm font-normal shadow-[3px_3px_0_0_#111] outline-none"
              placeholder="you@campus.edu"
              type="email"
            />
          </label>
          <label className="block text-sm font-black uppercase tracking-widest">
            Password
            <input
              className="mt-2 w-full border-[3px] border-black px-3 py-3 text-sm font-normal shadow-[3px_3px_0_0_#111] outline-none"
              placeholder="••••••••"
              type="password"
            />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="border-[3px] border-black bg-(--berry) px-4 py-3 text-sm font-extrabold uppercase tracking-widest text-white shadow-[2px_2px_0_0_#111]"
            type="button"
          >
            {activeMode === "login" ? "Sign in" : "Create account"}
          </button>
        </div>
        <p className="mt-4 text-xs leading-5 text-black/68">
          By continuing you agree to the Student Resource Hub terms. The modal
          is only a UI flow for now, so no authentication is wired yet.
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
