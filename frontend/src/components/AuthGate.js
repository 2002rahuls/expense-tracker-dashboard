"use client";

import { useState, useEffect } from "react";

export default function AuthGate({ children }) {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const ok = localStorage.getItem("isAuthenticated") === "true";
      setAuth(ok);
    } catch (e) {
      setAuth(false);
    }
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (user === "admin" && pass === "admin") {
      localStorage.setItem("isAuthenticated", "true");
      setAuth(true);
    } else {
      setError("Invalid username or password");
    }
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    setAuth(false);
    setUser("");
    setPass("");
  };

  if (auth === null) return null;

  if (!auth) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <div className="card" style={{ width: 360 }}>
          <h2 className="title">Sign in</h2>

          <form onSubmit={submit} className="space-y-4">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label className="label">Username</label>
              <input
                name="username"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="input"
                placeholder="username"
                autoFocus
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label className="label">Password</label>
              <input
                name="password"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="input"
                placeholder="password"
              />
            </div>

            {error && (
              <div style={{ color: "var(--danger)", fontSize: 13 }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Sign in
              </button>
            </div>
          </form>

          <div style={{ marginTop: 12, fontSize: 12, color: "var(--muted)" }}>
            Use username <strong>admin</strong> and password{" "}
            <strong>admin</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div style={{ display: "flex", justifyContent: "flex-end", padding: 12 }}>
        <button
          className="btn btn-ghost"
          onClick={logout}
          style={{ marginRight: 12 }}
        >
          Logout
        </button>
      </div>

      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
