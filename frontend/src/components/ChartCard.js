"use client";

export default function ChartCard({ title, subtitle, children }) {
  return (
    <div className="card card-pad">
      <p className="chart-card-title">{title}</p>
      {subtitle && <p className="chart-card-subtitle">{subtitle}</p>}
      {!subtitle && <div style={{ marginBottom: 20 }} />}
      {children}
    </div>
  );
}
