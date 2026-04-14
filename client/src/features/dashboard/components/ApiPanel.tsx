import { useState, useRef } from "react";
import { testAPI } from "@/services/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "LOAD TEST";
type TabKey = "loadTestConfig" | "testOverview" | "graphs" | "detailedMetrics" | "aiInsights";

interface ConfigParam {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
  mandatory?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "LOAD TEST"];

const TABS: { key: TabKey; label: string }[] = [
  { key: "loadTestConfig", label: "Load Test Config" },
  { key: "testOverview", label: "Test Overview" },
  { key: "graphs", label: "Graphs" },
  { key: "detailedMetrics", label: "Detailed Metrics" },
  { key: "aiInsights", label: "AI Insights" },
];

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "#4CAF82",
  POST: "#F4A836",
  PUT: "#3B82F6",
  PATCH: "#A78BFA",
  DELETE: "#EF4444",
  "LOAD TEST": "#F4A836",
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  root: {
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  backgroundColor: "#1a1a1a",
  color: "#e0e0e0",
  overflow: "hidden",
  width: "100%",
  // ❌ Remove: border, borderRadius, boxShadow, minWidth, maxWidth
},

  // ── Top bar ────────────────────────────────────────────────
  topBar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: "10px 12px",
    gap: 8,
    borderBottom: "1px solid #2a2a2a",
  },
  methodWrapper: {
    position: "relative",
    flexShrink: 0,
  },
  methodButton: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#252525",
    border: "1px solid #333",
    borderRadius: 6,
    padding: "7px 10px",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "inherit",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap" as const,
    userSelect: "none" as const,
    transition: "background 0.15s",
  },
  chevron: {
    fontSize: 9,
    marginLeft: 2,
    opacity: 0.7,
  },
  dropdown: {
    position: "absolute" as const,
    top: "calc(100% + 4px)",
    left: 0,
    backgroundColor: "#242424",
    border: "1px solid #333",
    borderRadius: 6,
    overflow: "hidden",
    zIndex: 100,
    minWidth: 130,
    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
  },
  dropdownItem: {
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "inherit",
    letterSpacing: "0.04em",
    transition: "background 0.1s",
  },
  urlInput: {
    flex: 1,
    backgroundColor: "#252525",
    border: "1px solid #333",
    borderRadius: 6,
    padding: "8px 12px",
    color: "#e0e0e0",
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.15s",
  },
  sendWrapper: {
    display: "flex",
    borderRadius: 6,
    overflow: "hidden",
    flexShrink: 0,
  },
  sendButton: {
    backgroundColor: "#3B82F6",
    color: "#fff",
    border: "none",
    padding: "8px 20px",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "inherit",
    cursor: "pointer",
    letterSpacing: "0.03em",
    transition: "background 0.15s",
  },
  sendChevron: {
    backgroundColor: "#2563EB",
    color: "#fff",
    border: "none",
    padding: "8px 10px",
    fontSize: 12,
    cursor: "pointer",
    transition: "background 0.15s",
    borderLeft: "1px solid rgba(255,255,255,0.15)",
  },

  // ── Tab bar ────────────────────────────────────────────────
  tabBar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderBottom: "1px solid #252525",
    padding: "0 14px",
    gap: 0,
  },
  tabItem: {
    padding: "10px 14px",
    fontSize: 12.5,
    fontFamily: "inherit",
    cursor: "pointer",
    color: "#888",
    borderBottom: "2px solid transparent",
    whiteSpace: "nowrap" as const,
    transition: "color 0.15s",
    userSelect: "none" as const,
    letterSpacing: "0.01em",
  },
  tabItemActive: {
    color: "#e0e0e0",
    borderBottom: "2px solid #F4A836",
  },
  tabSpacer: {
    flex: 1,
  },
  cookiesLink: {
    fontSize: 12.5,
    color: "#888",
    cursor: "pointer",
    padding: "10px 4px",
    letterSpacing: "0.01em",
    transition: "color 0.15s",
  },

  // ── Body ───────────────────────────────────────────────────
  body: {
    display: "flex",
    alignItems: "flex-start",
    padding: "16px 18px",
    gap: 16,
    minHeight: 130,
  },

  // ── Config table ───────────────────────────────────────────
  tableWrap: {
    flex: 1,
    minWidth: 0,
    border: "1px solid #2a2a2a",
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "32px 1fr 1fr",
    backgroundColor: "#1e1e1e",
    borderBottom: "1px solid #2a2a2a",
    padding: "6px 12px",
    gap: 8,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: 600,
    color: "#666",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "32px 1fr 1fr",
    borderBottom: "1px solid #222",
    padding: "2px 12px",
    gap: 8,
    alignItems: "center",
    transition: "background 0.1s",
  },
  checkboxCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  checkbox: {
    width: 15,
    height: 15,
    accentColor: "#F4A836",
    cursor: "pointer",
  },
  cellInput: {
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "1px solid transparent",
    color: "#c8c8c8",
    fontSize: 12.5,
    fontFamily: "inherit",
    padding: "6px 4px",
    outline: "none",
    width: "100%",
    transition: "border-color 0.15s",
  },

  // ── Start Load Test button ─────────────────────────────────
  startButton: {
    backgroundColor: "#F4793A",
    color: "#fff",
    border: "none",
    borderRadius: 7,
    padding: "12px 28px",
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "inherit",
    cursor: "pointer",
    letterSpacing: "0.02em",
    whiteSpace: "nowrap" as const,
    boxShadow: "0 4px 16px rgba(244,121,58,0.35)",
    transition: "background 0.15s, transform 0.1s, box-shadow 0.15s",
    flexShrink: 0,
    alignSelf: "center",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ApiPanel({ onTestComplete }: any) {
  const [method, setMethod] = useState<HttpMethod>("LOAD TEST");
  const [url, setUrl] = useState("http://localhost:8080/test");
  const [activeTab, setActiveTab] = useState<TabKey>("loadTestConfig");
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [params, setParams] = useState<ConfigParam[]>([
    { id: "1", key: "Number of Requests", value: "10000", enabled: true, mandatory: true },
    { id: "2", key: "Concurrency", value: "50", enabled: true, mandatory: true },
  ]);
  const [startHover, setStartHover] = useState(false);
  const [sendHover, setSendHover] = useState(false);
  const [dropdownHoverIdx, setDropdownHoverIdx] = useState<number | null>(null);
  const [rowHoverIdx, setRowHoverIdx] = useState<number | null>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  const updateParam = (id: string, field: keyof ConfigParam, val: string | boolean) => {
    setParams((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const addRow = () => {
    setParams((prev) => [
      ...prev,
      { id: String(Date.now()), key: "", value: "", enabled: true },
    ]);
  };
const handleLoadTest = async () => {
  try {
    const requestsParam = params.find(p => p.key === "Number of Requests");
    const concurrencyParam = params.find(p => p.key === "Concurrency");

    const body = {
      url: url,
      requests: Number(requestsParam?.value),
      concurrency: Number(concurrencyParam?.value),
    };

    console.log("BODY:", body);

    const res = await testAPI(body);
    onTestComplete?.();
    console.log("RESPONSE:", res);

  } catch (err) {
    console.error("ERROR:", err);
  }
};


  return (
    <div style={styles.root}>
      {/* ── Top bar ── */}
      <div style={styles.topBar}>
        {/* Method selector */}
        <div style={styles.methodWrapper}>
          <button
            style={{
              ...styles.methodButton,
              color: METHOD_COLORS[method],
            }}
            onClick={() => setShowMethodDropdown((v) => !v)}
          >
            {method}
            <span style={styles.chevron}>▼</span>
          </button>

          {showMethodDropdown && (
            <div style={styles.dropdown}>
              {METHODS.map((m, i) => (
                <div
                  key={m}
                  style={{
                    ...styles.dropdownItem,
                    color: METHOD_COLORS[m],
                    backgroundColor: dropdownHoverIdx === i ? "#2e2e2e" : "transparent",
                  }}
                  onMouseEnter={() => setDropdownHoverIdx(i)}
                  onMouseLeave={() => setDropdownHoverIdx(null)}
                  onClick={() => {
                    setMethod(m);
                    setShowMethodDropdown(false);
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* URL input */}
        <input
          ref={urlRef}
          style={{
            ...styles.urlInput,
            borderColor: "#333",
          }}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL…"
          onFocus={(e) => (e.currentTarget.style.borderColor = "#555")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#333")}
        />

        {/* Send */}
        <div style={styles.sendWrapper}>
          <button
            style={{
              ...styles.sendButton,
              backgroundColor: sendHover ? "#2563EB" : "#3B82F6",
            }}
            onMouseEnter={() => setSendHover(true)}
            onMouseLeave={() => setSendHover(false)}
          >
            Send
          </button>
          <button style={styles.sendChevron}>▼</button>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div style={styles.tabBar}>
        {TABS.map((tab) => (
          <div
            key={tab.key}
            style={{
              ...styles.tabItem,
              ...(activeTab === tab.key ? styles.tabItemActive : {}),
            }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </div>
        ))}
        <div style={styles.tabSpacer} />
        <div style={styles.cookiesLink}>Cookies</div>
      </div>

      {/* ── Body ── */}
      <div style={styles.body}>
        {activeTab === "loadTestConfig" && (
          <>
            {/* Config table */}
            <div style={styles.tableWrap}>
              {/* Header */}
              <div style={styles.tableHeader}>
                <div />
                <div style={styles.tableHeaderCell}>Key</div>
                <div style={styles.tableHeaderCell}>Value</div>
              </div>

              {/* Rows */}
              {params.map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    ...styles.tableRow,
                    backgroundColor: rowHoverIdx === i ? "#202020" : "transparent",
                    borderBottom: i === params.length - 1 ? "none" : "1px solid #222",
                  }}
                  onMouseEnter={() => setRowHoverIdx(i)}
                  onMouseLeave={() => setRowHoverIdx(null)}
                >
                  <div style={styles.checkboxCell}>
                    {p.mandatory ? (
                      <span
                        title="Required"
                        style={{
                          fontSize: 13,
                          color: "#F4793A",
                          opacity: 0.85,
                          userSelect: "none",
                          lineHeight: 1,
                        }}
                      >
                        ✱
                      </span>
                    ) : (
                      <input
                        type="checkbox"
                        style={styles.checkbox}
                        checked={p.enabled}
                        onChange={(e) => updateParam(p.id, "enabled", e.target.checked)}
                      />
                    )}
                  </div>
                  <input
                    style={{
                      ...styles.cellInput,
                      color: p.mandatory ? "#8a8a8a" : "#c8c8c8",
                      cursor: p.mandatory ? "default" : "text",
                    }}
                    value={p.key}
                    readOnly={p.mandatory}
                    onChange={(e) => !p.mandatory && updateParam(p.id, "key", e.target.value)}
                    placeholder="Key"
                    onFocus={(e) => { if (!p.mandatory) e.currentTarget.style.borderBottomColor = "#555"; }}
                    onBlur={(e) => (e.currentTarget.style.borderBottomColor = "transparent")}
                  />
                  <input
                    style={styles.cellInput}
                    value={p.value}
                    onChange={(e) => updateParam(p.id, "value", e.target.value)}
                    placeholder="Value"
                    type={p.mandatory ? "number" : "text"}
                    min={p.mandatory ? 1 : undefined}
                    onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#555")}
                    onBlur={(e) => (e.currentTarget.style.borderBottomColor = "transparent")}
                  />
                </div>
              ))}

              {/* Add row */}
              <div
                style={{
                  padding: "7px 48px",
                  fontSize: 11.5,
                  color: "#555",
                  cursor: "pointer",
                  borderTop: "1px solid #222",
                  letterSpacing: "0.03em",
                  userSelect: "none",
                  transition: "color 0.15s",
                }}
                onClick={addRow}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#888")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
              >
                + Add Parameter
              </div>
            </div>

            {/* Start Load Test button */}
            <button
              onClick={handleLoadTest}
              style={{
                ...styles.startButton,
                backgroundColor: startHover ? "#e5682e" : "#F4793A",
                transform: startHover ? "translateY(-1px)" : "none",
                boxShadow: startHover
                  ? "0 6px 20px rgba(244,121,58,0.45)"
                  : "0 4px 16px rgba(244,121,58,0.35)",
              }}
              onMouseEnter={() => setStartHover(true)}
              onMouseLeave={() => setStartHover(false)}
            >
              Start Load Test 🚀
            </button>
          </>
        )}

        {activeTab !== "loadTestConfig" && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#444",
              fontSize: 13,
              fontFamily: "inherit",
              padding: "32px 0",
              letterSpacing: "0.03em",
            }}
          >
            — {TABS.find((t) => t.key === activeTab)?.label} —
          </div>
        )}
      </div>
    </div>
  );
}