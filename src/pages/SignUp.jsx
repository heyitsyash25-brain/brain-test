import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import darkLogo from "../assets/images/quinfosys-logo-dark.png";
import logo from "../assets/images/quinfosys-logo-transparent.png";
import { useAuth } from "../hooks/useAuth.js";
import { useAuthPageTheme } from "../hooks/useAuthPageTheme.js";

export function SignUp() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Sign Up — Quinfosys™ Quantum AI";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { theme, toggleTheme } = useAuthPageTheme("auth-signup");
  const [fields, setFields] = useState({
    name: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setFields((current) => ({ ...current, [name]: value }));
    if (error) setError("");
  }

  // Password requirements state
  const password = fields.password;
  const reqLength = password.length >= 8;
  const reqCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const reqNumber = /\d/.test(password);
  const reqSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  function handleSubmit(event) {
    event.preventDefault();
    if (!fields.name.trim() || !fields.username.trim() || !fields.email.trim() || !fields.mobile.trim() || !fields.password) {
      setError("Please fill in all required fields marked with *");
      return;
    }

    if (!reqLength || !reqCase || !reqNumber || !reqSpecial) {
      setError("Please meet all password strength requirements before proceeding.");
      return;
    }

    setIsSubmitting(true);
    const result = signUp(fields);
    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      if (result.error.startsWith("An account")) {
        window.setTimeout(() => navigate("/signin"), 1800);
      }
      return;
    }
    navigate("/dashboard");
  }

  return (
    <main className="auth-card signup-card">
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

      <h1 className="auth-title">Create your Quantum AI account</h1>
      <p className="auth-subtitle">to continue to Quinfosys™ Quantum AI</p>

      {error && (
        <div role="alert" className="auth-error-msg">
          {error}
          {error.startsWith("An account") && " Redirecting to Sign In..."}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-4">
        <div>
          <input
            name="name"
            type="text"
            placeholder="Full name*"
            className="auth-input"
            autoComplete="name"
            required
            value={fields.name}
            onChange={updateField}
          />
        </div>
        <div>
          <input
            name="username"
            type="text"
            placeholder="Create a username*"
            className="auth-input"
            autoComplete="username"
            required
            value={fields.username}
            onChange={updateField}
          />
        </div>
        <div>
          <input
            name="email"
            type="email"
            placeholder="Email address*"
            className="auth-input"
            autoComplete="email"
            required
            value={fields.email}
            onChange={updateField}
          />
        </div>
        <div>
          <input
            name="mobile"
            type="tel"
            placeholder="Mobile number*"
            className="auth-input"
            autoComplete="tel"
            required
            value={fields.mobile}
            onChange={updateField}
          />
        </div>
        <div className="password-input-wrapper">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create password*"
            className="auth-input"
            autoComplete="new-password"
            required
            value={fields.password}
            onChange={updateField}
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

        {/* Live Password Requirements Checklist */}
        {fields.password.length > 0 && (
          <div className="password-requirements">
            <div className={`requirement-item ${reqLength ? "met" : "unmet"}`}>
              <span>{reqLength ? "✓" : "○"}</span> At least 8 characters
            </div>
            <div className={`requirement-item ${reqCase ? "met" : "unmet"}`}>
              <span>{reqCase ? "✓" : "○"}</span> Uppercase & lowercase letters
            </div>
            <div className={`requirement-item ${reqNumber ? "met" : "unmet"}`}>
              <span>{reqNumber ? "✓" : "○"}</span> At least 1 number
            </div>
            <div className={`requirement-item ${reqSpecial ? "met" : "unmet"}`}>
              <span>{reqSpecial ? "✓" : "○"}</span> At least 1 special character (!@#$%^&*)
            </div>
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="signup-btn">
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/signin" className="auth-footer-link">
            Sign In
          </Link>
        </p>
      </form>
    </main>
  );
}
