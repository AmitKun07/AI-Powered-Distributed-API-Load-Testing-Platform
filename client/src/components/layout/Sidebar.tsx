import { useState, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type NavSection = "collections" | "environments" | "history" | "flows" | "apps";

interface ApiRequest {
  id: string;
  method: HttpMethod;
  name: string;
}

interface Collection {
  id: string;
  name: string;
  expanded: boolean;
  requests: ApiRequest[];
}

// ─── Method Colors ────────────────────────────────────────────────────────────

const METHOD_COLOR: Record<HttpMethod, string> = {
  GET: "#4CAF82",
  POST: "#F4A836",
  PUT: "#3B82F6",
  PATCH: "#A78BFA",
  DELETE: "#EF4444",
};

// ─── Initial Data ─────────────────────────────────────────────────────────────

const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: "algo-prep",
    name: "Algo PREP",
    expanded: false,
    requests: [],
  },
  {
    id: "student-api",
    name: "student api",
    expanded: true,
    requests: [
      { id: "r1", method: "GET", name: "results" },
      { id: "r2", method: "GET", name: "get student by id" },
      { id: "r3", method: "GET", name: "New Request" },
      { id: "r4", method: "POST", name: "test" },
      { id: "r5", method: "GET", name: "result" },
      { id: "r6", method: "GET", name: "New Request" },
      { id: "r7", method: "GET", name: "New Request" },
    ],
  },
  {
    id: "worker-api",
    name: "worker api",
    expanded: false,
    requests: [],
  },
  {
    id: "customer-api",
    name: "customer api",
    expanded: false,
    requests: [],
  },
  {
    id: "other-api",
    name: "other api",
    expanded: false,
    requests: [],
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

const Icons = {
  collections: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  environments: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="4" width="15" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 8l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 14h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  history: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 5v5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 10a6.5 6.5 0 1 0 1.1-3.6L3 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  flows: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="4" cy="10" r="2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16" cy="4" r="2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16" cy="16" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 10h4m0 0v-4.2M10 10v4.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  apps: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11 14.5h7M14.5 11v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  folder: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M1.5 4.5C1.5 3.67 2.17 3 3 3h3l1.5 1.5H12a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 12 13.5H3A1.5 1.5 0 0 1 1.5 12V4.5z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  chevronRight: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4 2.5l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevronDown: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2.5 4l3.5 4 3.5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  lock: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  search: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  plus: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  cloudView: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M11 9.5a3 3 0 0 0-2.5-5.4A4 4 0 1 0 4 12h7a2.5 2.5 0 0 0 0-5z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  findReplace: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="5.5" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8.5 8.5l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M3 11h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  console: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="2" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3.5 5l2.5 2-2.5 2M7.5 9h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  terminal: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="2" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3 7h8M7 5v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
};

// ─── New Collection Modal ─────────────────────────────────────────────────────

function NewCollectionModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#1e1e1e",
          border: "1px solid #333",
          borderRadius: 10,
          padding: "24px 24px 20px",
          width: 340,
          boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e0e0e0", marginBottom: 16 }}>
          New Collection
        </div>
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") onClose(); }}
          placeholder="Collection name…"
          style={{
            width: "100%",
            backgroundColor: "#252525",
            border: "1px solid #404040",
            borderRadius: 6,
            padding: "8px 12px",
            color: "#e0e0e0",
            fontSize: 13,
            fontFamily: "inherit",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: 16,
          }}
        />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid #333",
              borderRadius: 6,
              color: "#888",
              padding: "7px 16px",
              fontSize: 12,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            style={{
              backgroundColor: "#F4793A",
              border: "none",
              borderRadius: 6,
              color: "#fff",
              padding: "7px 16px",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: "pointer",
              opacity: name.trim() ? 1 : 0.4,
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Request Modal ────────────────────────────────────────────────────────

function AddRequestModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (method: HttpMethod, name: string) => void;
}) {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(method, trimmed);
    onClose();
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}
      onClick={onClose}
    >
      <div
        style={{ backgroundColor: "#1e1e1e", border: "1px solid #333", borderRadius: 10, padding: "24px 24px 20px", width: 360, boxShadow: "0 16px 48px rgba(0,0,0,0.7)", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e0e0e0", marginBottom: 16 }}>Add API Request</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {(["GET", "POST", "PUT", "PATCH", "DELETE"] as HttpMethod[]).map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              style={{
                background: method === m ? "#252525" : "none",
                border: `1px solid ${method === m ? METHOD_COLOR[m] : "#333"}`,
                borderRadius: 5,
                color: METHOD_COLOR[m],
                padding: "4px 8px",
                fontSize: 10,
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
                letterSpacing: "0.04em",
              }}
            >
              {m}
            </button>
          ))}
        </div>
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") onClose(); }}
          placeholder="Request name…"
          style={{ width: "100%", backgroundColor: "#252525", border: "1px solid #404040", borderRadius: 6, padding: "8px 12px", color: "#e0e0e0", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: 16 }}
        />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: "1px solid #333", borderRadius: 6, color: "#888", padding: "7px 16px", fontSize: 12, fontFamily: "inherit", cursor: "pointer" }}>Cancel</button>
          <button onClick={submit} style={{ backgroundColor: "#F4793A", border: "none", borderRadius: 6, color: "#fff", padding: "7px 16px", fontSize: 12, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", opacity: name.trim() ? 1 : 0.4 }}>Add</button>
        </div>
      </div>
    </div>
  );
}

// ─── CollectionItem ───────────────────────────────────────────────────────────

function CollectionItem({
  col,
  onToggle,
  onAddRequest,
}: {
  col: Collection;
  onToggle: (id: string) => void;
  onAddRequest: (colId: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [addHovered, setAddHovered] = useState(false);

  return (
    <div>
      {/* Collection row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "5px 8px 5px 12px",
          cursor: "pointer",
          borderRadius: 5,
          backgroundColor: hovered ? "#252525" : "transparent",
          transition: "background 0.12s",
          userSelect: "none",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onToggle(col.id)}
      >
        <span style={{ color: "#666", flexShrink: 0, width: 14, display: "flex", alignItems: "center" }}>
          {col.expanded ? Icons.chevronDown : Icons.chevronRight}
        </span>
        <span style={{ color: "#6a7a6a", flexShrink: 0, display: "flex", alignItems: "center" }}>
          {Icons.folder}
        </span>
        <span style={{ fontSize: 13, color: "#c8c8c8", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginLeft: 4 }}>
          {col.name}
        </span>
        {/* Add request button */}
        {hovered && (
          <span
            title="Add request"
            onClick={(e) => { e.stopPropagation(); onAddRequest(col.id); }}
            onMouseEnter={() => setAddHovered(true)}
            onMouseLeave={() => setAddHovered(false)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 20,
              height: 20,
              borderRadius: 4,
              backgroundColor: addHovered ? "#333" : "transparent",
              color: "#888",
              transition: "background 0.1s",
              flexShrink: 0,
            }}
          >
            {Icons.plus}
          </span>
        )}
      </div>

      {/* Requests */}
      {col.expanded && col.requests.map((req) => (
        <RequestItem key={req.id} request={req} />
      ))}
    </div>
  );
}

// ─── RequestItem ──────────────────────────────────────────────────────────────

function RequestItem({ request }: { request: ApiRequest }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 8px 5px 42px",
        cursor: "pointer",
        borderRadius: 5,
        backgroundColor: hovered ? "#252525" : "transparent",
        transition: "background 0.12s",
        userSelect: "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{
        fontSize: 10,
        fontWeight: 700,
        color: METHOD_COLOR[request.method],
        letterSpacing: "0.04em",
        minWidth: 34,
        flexShrink: 0,
      }}>
        {request.method}
      </span>
      <span style={{ fontSize: 13, color: "#b0b0b0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {request.name}
      </span>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const [activeNav, setActiveNav] = useState<NavSection>("collections");
  const [collections, setCollections] = useState<Collection[]>(INITIAL_COLLECTIONS);
  const [search, setSearch] = useState("");
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [addRequestForCol, setAddRequestForCol] = useState<string | null>(null);

  const NAV_ITEMS: { key: NavSection; label: string; icon: React.ReactNode }[] = [
    { key: "collections", label: "Collections", icon: Icons.collections },
    { key: "environments", label: "Environmens", icon: Icons.environments },
    { key: "history", label: "History", icon: Icons.history },
    { key: "flows", label: "Flows", icon: Icons.flows },
    { key: "apps", label: "", icon: Icons.apps },
  ];

  const toggleCollection = (id: string) => {
    setCollections((prev) =>
      prev.map((c) => c.id === id ? { ...c, expanded: !c.expanded } : c)
    );
  };

  const createCollection = (name: string) => {
    setCollections((prev) => [
      ...prev,
      { id: `col-${Date.now()}`, name, expanded: false, requests: [] },
    ]);
  };

  const addRequest = (colId: string, method: HttpMethod, name: string) => {
    setCollections((prev) =>
      prev.map((c) =>
        c.id === colId
          ? { ...c, expanded: true, requests: [...c.requests, { id: `req-${Date.now()}`, method, name }] }
          : c
      )
    );
  };

  const filtered = collections.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {showNewCollection && (
        <NewCollectionModal
          onClose={() => setShowNewCollection(false)}
          onCreate={createCollection}
        />
      )}
      {addRequestForCol && (
        <AddRequestModal
          onClose={() => setAddRequestForCol(null)}
          onAdd={(method, name) => addRequest(addRequestForCol, method, name)}
        />
      )}

      <div style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 44px)",
        width: 340,
        backgroundColor: "#141414",
        color: "#e0e0e0",
        borderRight: "1px solid #222",
        overflow: "hidden",
        userSelect: "none",
      }}>

        {/* ── Main area: nav rail + panel ── */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* ── Nav rail ── */}
          <div style={{
            width: 64,
            flexShrink: 0,
            backgroundColor: "#141414",
            borderRight: "1px solid #1e1e1e",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 8,
            gap: 2,
          }}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveNav(item.key)}
                style={{
                  background: "none",
                  border: "none",
                  borderRadius: 8,
                  width: 48,
                  padding: "10px 0 8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  cursor: "pointer",
                  color: activeNav === item.key ? "#e0e0e0" : "#555",
                  backgroundColor: activeNav === item.key ? "#252525" : "transparent",
                  transition: "all 0.12s",
                  fontFamily: "inherit",
                }}
              >
                {item.icon}
                {item.label && (
                  <span style={{ fontSize: 9.5, letterSpacing: "0.02em", color: "inherit" }}>
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Collections panel ── */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Panel header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 12px 8px",
              borderBottom: "1px solid #1e1e1e",
              flexShrink: 0,
              gap: 6,
            }}>
              <span style={{ color: "#888", display: "flex", alignItems: "center" }}>{Icons.lock}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#e0e0e0", flex: 1, letterSpacing: "0.01em" }}>
                Collections
              </span>
              <button
                onClick={() => {}}
                style={{ ...smallBtnStyle }}
              >
                New
              </button>
              <button style={{ ...smallBtnStyle }}>Import</button>
            </div>

            {/* Search + plus */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 10px",
              borderBottom: "1px solid #1a1a1a",
              flexShrink: 0,
            }}>
              {/* Plus button */}
              <button
                onClick={() => setShowNewCollection(true)}
                title="New collection"
                style={{
                  background: "none",
                  border: "none",
                  color: "#777",
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 4,
                  transition: "color 0.12s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e0e0e0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}
              >
                {Icons.plus}
              </button>

              {/* Search */}
              <div style={{ display: "flex", alignItems: "center", flex: 1, backgroundColor: "#1e1e1e", borderRadius: 6, padding: "5px 10px", gap: 6, border: "1px solid #272727" }}>
                <span style={{ color: "#555", display: "flex", alignItems: "center", flexShrink: 0 }}>{Icons.search}</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search collections"
                  style={{
                    background: "none",
                    border: "none",
                    outline: "none",
                    color: "#aaa",
                    fontSize: 12.5,
                    fontFamily: "inherit",
                    flex: 1,
                    minWidth: 0,
                  }}
                />
              </div>
            </div>

            {/* Collections list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "6px 6px" }}>
              {filtered.length === 0 && (
                <div style={{ fontSize: 12, color: "#444", padding: "16px 12px", textAlign: "center" }}>
                  No collections found
                </div>
              )}
              {filtered.map((col) => (
                <CollectionItem
                  key={col.id}
                  col={col}
                  onToggle={toggleCollection}
                  onAddRequest={(colId) => setAddRequestForCol(colId)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          padding: "8px 12px",
          borderTop: "1px solid #1e1e1e",
          flexShrink: 0,
          backgroundColor: "#111",
        }}>
          {[
            { icon: Icons.cloudView, label: "Cloud View" },
            { icon: Icons.findReplace, label: "Find and replace" },
            { icon: Icons.console, label: "Console" },
            { icon: Icons.terminal, label: "Terminal" },
          ].map(({ icon, label }) => (
            <button
              key={label}
              style={{
                background: "none",
                border: "none",
                color: "#555",
                cursor: "pointer",
                padding: "4px 8px",
                fontSize: 11,
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 5,
                borderRadius: 4,
                transition: "color 0.12s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#aaa")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Shared button styles ─────────────────────────────────────────────────────

const iconBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#666",
  cursor: "pointer",
  padding: 4,
  display: "flex",
  alignItems: "center",
  borderRadius: 4,
  transition: "color 0.12s",
};

const smallBtnStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid #333",
  borderRadius: 5,
  color: "#aaa",
  padding: "4px 10px",
  fontSize: 11.5,
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  cursor: "pointer",
  letterSpacing: "0.02em",
  transition: "border-color 0.12s, color 0.12s",
};