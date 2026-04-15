import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TestStatus = "Simulated" | "Complete" | "Analyzing...";

interface TestResult {
  id: string;
  timestamp: string;
  url: string;
  rps: number;
  avgLatency: number;
  p95Latency: number;
  status: TestStatus;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_RESULTS: TestResult[] = [
  { id: "1233000200", timestamp: "2023-05-12 18:45:30", url: "https://api.example.com/v1/users", rps: 1000, avgLatency: 338, p95Latency: 288, status: "Simulated" },
  { id: "1233000001", timestamp: "2023-05-12 19:45:30", url: "https://api.example.com/v1/users", rps: 1000, avgLatency: 375, p95Latency: 233, status: "Complete" },
  { id: "1233000202", timestamp: "2023-05-12 18:45:30", url: "https://api.example.com/v1/users", rps: 100,  avgLatency: 380, p95Latency: 287, status: "Complete" },
  { id: "1233000007", timestamp: "2023-05-12 19:45:30", url: "https://api.example.com/v1/users", rps: 50,   avgLatency: 135, p95Latency: 212, status: "Analyzing..." },
];

// ─── Grid template ────────────────────────────────────────────────────────────

const GRID = "130px 170px 1fr 70px 110px 110px 120px 70px";

const COLUMNS = ["Test ID", "Timestamp", "URL", "RPS", "Avg Latency", "P95 Latency", "Status", "Actions"];

// ─── StatusBadge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: TestStatus }) {
  if (status === "Complete") {
    return (
      <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#4CAF82", fontSize: 13 }}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="7.5" r="6.8" stroke="#4CAF82" strokeWidth="1.3" />
          <path d="M4.5 7.5l2.2 2.2 3.8-3.8" stroke="#4CAF82" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Complete
      </span>
    );
  }
  if (status === "Analyzing...") {
    return <span style={{ color: "#aaa", fontSize: 13 }}>Analyzing...</span>;
  }
  return <span style={{ color: "#999", fontSize: 13 }}>Simulated</span>;
}

// ─── InfoButton ───────────────────────────────────────────────────────────────

function InfoButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      title="View Details"
      style={{
        background: "none",
        border: "1.5px solid",
        borderColor: hovered ? "#555" : "#3a3a3a",
        borderRadius: 6,
        width: 30,
        height: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: hovered ? "#c0c0c0" : "#5a5a5a",
        backgroundColor: hovered ? "#252525" : "transparent",
        transition: "all 0.13s",
        padding: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ⓘ icon */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6.2" stroke="currentColor" strokeWidth="1.3" />
        <rect x="6.4" y="6" width="1.2" height="4.2" rx="0.6" fill="currentColor" />
        <rect x="6.4" y="3.8" width="1.2" height="1.2" rx="0.6" fill="currentColor" />
      </svg>
    </button>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function Row({ result, isLast }: { result: TestResult; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: GRID,
        padding: "11px 20px",
        gap: 8,
        alignItems: "center",
        borderBottom: isLast ? "none" : "1px solid #212121",
        backgroundColor: hovered ? "#1f1f1f" : "transparent",
        transition: "background 0.12s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ fontSize: 13, color: "#c8c8c8", fontVariantNumeric: "tabular-nums" }}>{result.id}</div>
      <div style={{ fontSize: 13, color: "#888" }}>{result.timestamp}</div>
      <div style={{ fontSize: 13, color: "#aaa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{result.url}</div>
      <div style={{ fontSize: 13, color: "#c8c8c8" }}>{result.rps}</div>
      <div style={{ fontSize: 13, color: "#c8c8c8" }}>{result.avgLatency}</div>
      <div style={{ fontSize: 13, color: "#c8c8c8" }}>{result.p95Latency}</div>
      <div><StatusBadge status={result.status} /></div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <InfoButton />
      </div>
    </div>
  );
}

// ─── RecentTestResults ────────────────────────────────────────────────────────

export default function RecentTestResults({ results }: { results: TestResult[] }) {
  return (
    <div
      style={{
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  backgroundColor: "#1a1a1a",
  color: "#e0e0e0",
  overflow: "hidden",
  width: "100%",
  borderTop: "1px solid #252525", // subtle divider between the two panels
}}
    >
      {/* ── Section title ── */}
      <div
        style={{
          padding: "14px 20px",
          fontSize: 14,
          fontWeight: 700,
          color: "#e0e0e0",
          backgroundColor: "#1e1e1e",
          borderBottom: "1px solid #252525",
          letterSpacing: "0.01em",
        }}
      >
        Recent Test Results
      </div>

      {/* ── Column headers ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: GRID,
          padding: "10px 20px",
          gap: 8,
          borderBottom: "1px solid #252525",
          backgroundColor: "#1a1a1a",
        }}
      >
        {COLUMNS.map((col) => (
          <div
            key={col}
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#e0e0e0",
              letterSpacing: "0.02em",
            }}
          >
            {col}
          </div>
        ))}
      </div>

      {/* ── Data rows ── */}
      {results.map((r, i) => (
        <Row key={r.id} result={r} isLast={i === results.length - 1} />
      ))}
    </div>
  );
}