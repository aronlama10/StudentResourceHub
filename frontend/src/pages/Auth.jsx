import { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

export default function Auth() {
  const [mode, setMode] = useState("signup");

  return (
    <div className="auth">
      <div className="auth__panel">
        <Link to="/" className="auth__back">
          Back to home
        </Link>

        <div className="auth__card">
          <div className="auth__logo">StudentHub</div>
          <h1 className="auth__title">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="auth__subtitle">
            {mode === "login"
              ? "Sign in to access your dashboard and resources."
              : "Join the community and start sharing resources today."}
          </p>

          <div className="auth__tabs">
            <button
              className={`auth__tab${mode === "login" ? " auth__tab--active" : ""}`}
              onClick={() => setMode("login")}
              type="button"
            >
              Log in
            </button>
            <button
              className={`auth__tab${mode === "signup" ? " auth__tab--active" : ""}`}
              onClick={() => setMode("signup")}
              type="button"
            >
              Sign up
            </button>
          </div>

          <form
            className="auth__form"
            onSubmit={(event) => event.preventDefault()}
          >
            {mode === "signup" && (
              <label className="auth__field" htmlFor="auth-name">
                Full name
                <input id="auth-name" type="text" placeholder="Your name" />
              </label>
            )}

            <label className="auth__field" htmlFor="auth-email">
              Email
              <input
                id="auth-email"
                type="email"
                placeholder="you@campus.edu"
              />
            </label>

            <label className="auth__field" htmlFor="auth-password">
              Password
              <input
                id="auth-password"
                type="password"
                placeholder={
                  mode === "login" ? "Enter your password" : "Create a password"
                }
              />
            </label>

            {mode === "signup" && (
              <label className="auth__field" htmlFor="auth-confirm">
                Confirm password
                <input
                  id="auth-confirm"
                  type="password"
                  placeholder="Confirm password"
                />
              </label>
            )}

            <button type="submit" className="auth__submit">
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="auth__toggle">
            {mode === "login" ? (
              <>
                Need an account?{" "}
                <button type="button" onClick={() => setMode("signup")}>
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button type="button" onClick={() => setMode("login")}>
                  Log in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
