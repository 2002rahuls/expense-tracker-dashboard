"use client";

import { useState, useEffect } from "react";

export default function AuthGate({ children }) {
  const [auth,  setAuth]  = useState(null); // null = loading
  const [user,  setUser]  = useState("");
  const [pass,  setPass]  = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    try {
      const ok = localStorage.getItem("isAuthenticated") === "true";
      setAuth(ok);
    } catch {
      setAuth(false);
    }
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (user === "admin" && pass === "admin") {
      setLoading(true);
      setTimeout(() => {
        localStorage.setItem("isAuthenticated", "true");
        setAuth(true);
        setLoading(false);
      }, 500);
    } else {
      setError("Invalid username or password. Try admin / admin.");
    }
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    setAuth(false);
    setUser("");
    setPass("");
  };

  // Still reading localStorage ── render nothing to avoid flash
  if (auth === null) return null;

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!auth) {
    return (
      <div className="auth-wrap">
        <div className="card auth-card">
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-icon">💳</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-primary)", letterSpacing: "-0.3px" }}>
                Expense Tracker
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Personal Finance Dashboard
              </div>
            </div>
          </div>

          <h1 className="text-h2" style={{ marginBottom: 4 }}>Welcome back</h1>
          <p className="text-sm text-muted" style={{ marginBottom: 28 }}>
            Sign in to your account to continue
          </p>

          <form onSubmit={submit} noValidate>
            <div className="form-field">
              <label className="form-label" htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="input"
                placeholder="Enter username"
                autoFocus
                autoComplete="username"
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="password">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="input"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-muted)", fontSize: 14, padding: 4,
                  }}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: "10px 14px", borderRadius: 8, marginBottom: 16,
                background: "var(--danger-muted)", color: "var(--danger)",
                fontSize: 13, fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading || !user || !pass}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div style={{
            marginTop: 20, padding: "12px 16px", borderRadius: 8,
            background: "var(--surface-hover)", fontSize: 12,
            color: "var(--text-muted)", textAlign: "center",
          }}>
            Demo credentials: <strong style={{ color: "var(--text-secondary)" }}>admin</strong> / <strong style={{ color: "var(--text-secondary)" }}>admin</strong>
          </div>
        </div>
      </div>
    );
  }

  // ── Authenticated layout ──────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Pass logout to children via cloneElement on AppBar — 
          instead we surface it as a button inside children context.
          We inject a tiny logout bar for simplicity. */}
      <div style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 200,
      }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={logout}
          style={{
            boxShadow: "var(--shadow-md)",
            background: "var(--surface)",
          }}
        >
          Log out
        </button>
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
