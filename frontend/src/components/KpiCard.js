"use client";

export default function KpiCard({ label, value, icon, iconBg, loading }) {
  if (loading) {
    return (
      <div className="card kpi-card card-hover">
        <div className="skeleton skeleton-line" style={{ width: "40%" }} />
        <div className="skeleton skeleton-value" />
        <div className="skeleton skeleton-line" style={{ width: "30%", marginTop: 12 }} />
      </div>
    );
  }

  return (
    <div className="card kpi-card card-hover">
      {icon && (
        <div
          className="kpi-card-icon"
          style={{ background: iconBg || "var(--primary-muted)" }}
        >
          {icon}
        </div>
      )}
      <p className="kpi-card-label">{label}</p>
      <p className="kpi-card-value">{value}</p>
      <div
        className="kpi-accent"
        style={{ background: iconBg || "var(--primary)" }}
        aria-hidden="true"
      />
    </div>
  );
}
