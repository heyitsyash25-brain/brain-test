import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import darkLogo from "../assets/images/quinfosys-logo-dark.png";
import logo from "../assets/images/quinfosys-logo-transparent.png";
import { useAuthPageTheme } from "../hooks/useAuthPageTheme.js";
import { useAuth } from "../hooks/useAuth.js";

export function SignIn() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Sign In — Quinfosys™ Quantum AI";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { theme, toggleTheme } = useAuthPageTheme("auth-signin");
  const [userInput, setUserInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (!userInput.trim() || !password) {
      setError("Please enter your username/email and password.");
      return;
    }

    setIsSubmitting(true);
    const result = signIn(userInput.trim(), password);
    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      if (result.error.startsWith("No account found")) {
        window.setTimeout(() => navigate("/signup"), 1800);
      }
      return;
    }
    navigate("/dashboard");
  }

  return (
    <main className="auth-card signin-card">
      {/* Lightbulb Theme Toggle */}
      <div 
        className="bulb-container" 
        onClick={toggleTheme} 
        title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Theme`}
        aria-label="Toggle theme"
      >
        <span className="bulb-toggle"></span>
      </div>

      {/* Brand Logo Container */}
      <div className="auth-logo-container">
        <Link to="/" className="inline-block transition-transform hover:scale-105" title="Quinfosys Quantum AI Home">
          <span className="auth-logo-switch">
            <img src={logo} alt="Quinfosys Logo" className="auth-logo-light" />
            <img src={darkLogo} alt="Quinfosys Logo" className="auth-logo-dark" />
          </span>
        </Link>
      </div>

      <h1 className="auth-title">Sign in to your Quantum AI account</h1>
      <p className="auth-subtitle">to continue to Quinfosys™ Quantum AI</p>

      {error && (
        <div role="alert" className="auth-error-msg">
          {error}
          {error.startsWith("No account found") && " Redirecting to Sign Up..."}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-4">
        <div>
          <input
            id="signin-userinput"
            type="text"
            placeholder="Username or email address*"
            className="auth-input"
            autoComplete="username"
            required
            value={userInput}
            onChange={(event) => {
              setUserInput(event.target.value);
              if (error) setError("");
            }}
          />
        </div>

        <div className="password-input-wrapper mb-1">
          <input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            placeholder="Password*"
            className="auth-input"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (error) setError("");
            }}
          />
          <button
            type="button"
            className="password-toggle-btn"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((visible) => !visible)}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>

        <a href="/forgot-password.html" className="forgot-password-link">
          Forgot password?
        </a>

        <button type="submit" disabled={isSubmitting} className="signin-btn">
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>

        <p className="auth-footer">
          New to Quantum AI?{" "}
          <Link to="/signup" className="auth-footer-link">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
