"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import { getTopHeadlines, getCurrencyRate } from "../services/api";

// ── Icons ─────────────────────────────────────────────────────────────────────
function SunIcon() {
  return (
    <svg
      className="icon-18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className="icon-18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      className="icon-20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="icon-20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const NAV_LINKS = [
  { href: "/", label: "Expenses" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function AppBar({ onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [news, setNews] = useState([]);
  const [rate, setRate] = useState(null);
  const [newsOpen, setNewsOpen] = useState(false); // mobile news accordion

  // ── Fetch live data ─────────────────────────────────────────────────────────
  useEffect(() => {
    getTopHeadlines()
      .then((res) => setNews(res.data || []))
      .catch(() => {});

    getCurrencyRate()
      .then((res) => setRate(res?.data?.rate ?? null))
      .catch(() => {});
  }, []);

  // Build the ticker string from headlines
  const tickerText = news.map((a) => a.title).join("   •   ");

  return (
    <header className="appbar">
      {/* ── Main nav bar ───────────────────────────────────────────────────── */}
      <div className="appbar-inner">
        {/* Logo */}
        <Link href="/" className="appbar-logo">
          <div className="appbar-logo-icon">💳</div>
          <span>Expense Tracker</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="appbar-nav" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link${pathname === link.href ? " active" : ""}`}
            >
              {link.label}
            </Link>
          ))}

          <span className="nav-divider" aria-hidden="true" />

          {/* Live exchange rate chip */}
          {rate && (
            <>
              <div className="rate-chip" title="Live USD/INR exchange rate">
                <span className="rate-chip-label">USD/INR</span>
                <span className="rate-chip-value">
                  ₹{Number(rate).toFixed(2)}
                </span>
              </div>
              <span className="nav-divider" aria-hidden="true" />
            </>
          )}

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>

          {onLogout && (
            <button className="btn btn-ghost btn-sm" onClick={onLogout}>
              Log out
            </button>
          )}
        </nav>

        {/* Mobile: theme toggle + hamburger */}
        <div className="desktop-hidden items-center gap-8">
          {rate && (
            <div className="rate-chip rate-chip-sm" title="USD/INR rate">
              <span className="rate-chip-value">₹{Number(rate)}</span>
            </div>
          )}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
          <button
            className="hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* ── News ticker strip (desktop) ─────────────────────────────────────── */}
      {tickerText && (
        <div className="news-ticker" aria-label="Latest news headlines">
          <span className="news-ticker-label">📰 LIVE</span>
          <div className="news-ticker-track-wrap">
            <div className="news-ticker-track">
              <span>
                {tickerText}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;{tickerText}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile dropdown menu ────────────────────────────────────────────── */}
      <div
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        role="navigation"
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`mobile-nav-link${pathname === link.href ? " active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}

        {onLogout && (
          <button
            className="mobile-nav-link"
            style={{
              textAlign: "left",
              border: "none",
              cursor: "pointer",
              background: "transparent",
              font: "inherit",
              padding: "10px 12px",
              borderRadius: 8,
              color: "var(--text-secondary)",
            }}
            onClick={() => {
              setMenuOpen(false);
              onLogout?.();
            }}
          >
            Log out
          </button>
        )}
      </div>
    </header>
  );
}
