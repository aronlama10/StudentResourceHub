import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../css/Auth.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleError, handleSuccess } from "../utils.js";
import { signup } from "../services/authService.js";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword } = formData;
    // setError("");

    // Client-side validation
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Full Name, Email and Password are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      handleError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const result = await signup({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      const { success, message } = result;
      if(success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate('/login')
        },1000)
      } else {
        handleError(message);
      }
      console.log(result);

      // console.log("Signup submitted:", formData);
      // toast.success("Account created successfully!");
    } catch (err) {
      handleError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      {/* Background */}
      <div className="auth__bg">
        <div className="auth__orb auth__orb--1" />
        <div className="auth__orb auth__orb--2" />
        <div className="auth__orb auth__orb--3" />
        <div className="auth__grid" />
      </div>

      <div className="auth__container">
        {/* Back to Home */}
        <Link to="/" className="auth__back" id="auth-back-home">
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
        <div className="auth__card" id="auth-card">
          {/* Logo */}
          <div className="auth__logo">
            <span className="auth__logo-icon">
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
            <span className="auth__logo-text">
              Student<span className="gradient-text">Hub</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="auth__title" id="auth-title">
            Create your account
          </h1>
          <p className="auth__subtitle">
            Join the community and start sharing resources today.
          </p>

          {/* Error Message */}
          {error && <div className="auth__error">{error}</div>}

          {/* Form */}
          <form className="auth__form" id="signup-form" onSubmit={handleSubmit}>
            <div className="auth__field">
              <label className="auth__label" htmlFor="signup-fullname">
                Full Name
              </label>
              <div className="auth__input-wrap">
                <svg
                  className="auth__input-icon"
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
                  onChange={handleChange}
                  type="text"
                  id="signup-fullname"
                  name="fullName"
                  className="auth__input"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  value={formData.fullName}
                  // required
                />
              </div>
            </div>

            <div className="auth__field">
              <label className="auth__label" htmlFor="signup-email">
                Email Address
              </label>
              <div className="auth__input-wrap">
                <svg
                  className="auth__input-icon"
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
                  id="signup-email"
                  name="email"
                  className="auth__input"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  // required
                />
              </div>
            </div>

            <div className="auth__field">
              <label className="auth__label" htmlFor="signup-password">
                Password
              </label>
              <div className="auth__input-wrap">
                <svg
                  className="auth__input-icon"
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
                  type={showPassword ? "text" : "password"}
                  id="signup-password"
                  name="password"
                  className="auth__input"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  // required
                />
                <button
                  type="button"
                  className="auth__toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="auth__field">
              <label className="auth__label" htmlFor="signup-confirm-password">
                Confirm Password
              </label>
              <div className="auth__input-wrap">
                <svg
                  className="auth__input-icon"
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
                  type={showConfirmPassword ? "text" : "password"}
                  id="signup-confirm-password"
                  name="confirmPassword"
                  className="auth__input"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  // required
                />
                <button
                  type="button"
                  className="auth__toggle-password"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth__submit"
              id="signup-submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && (
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
              )}
            </button>
          </form>

          {/* Footer Toggle */}
          <p className="auth__toggle" id="auth-toggle">
            Already have an account?{" "}
            <Link to="/login" className="auth__toggle-btn">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        closeOnClick
        autoClose={3000}
        theme="dark"
      />
    </div>
  );
}
