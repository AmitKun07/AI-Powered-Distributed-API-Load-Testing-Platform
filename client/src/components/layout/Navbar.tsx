import { useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

const Icons = {
  hamburger: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  back: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  forward: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  search: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <circle cx="8.5" cy="8.5" r="2.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8.5 1.5v1.8M8.5 13.7v1.8M1.5 8.5h1.8M13.7 8.5h1.8M3.5 3.5l1.27 1.27M12.23 12.23l1.27 1.27M3.5 13.5l1.27-1.27M12.23 4.77l1.27-1.27" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  notification: (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <path d="M8.5 2a5 5 0 0 0-5 5v3l-1.5 2h13L13.5 10V7a5 5 0 0 0-5-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M7 14a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  chat: (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <path d="M2 3h13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5l-3 2V4a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
  pen: (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <path d="M11.5 2.5l3 3-9 9H2.5v-3l9-9z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar() {
  return (
    <div style={{
      width: 28,
      height: 28,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%)",
      border: "2px solid #555",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 11,
      fontWeight: 700,
      color: "#fff",
      flexShrink: 0,
      cursor: "pointer",
    }}>
      LA
    </div>
  );
}

// ─── IconButton ───────────────────────────────────────────────────────────────

function IconBtn({ children, title, dim }: { children: React.ReactNode; title?: string; dim?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      title={title}
      style={{
        background: "none",
        border: "none",
        color: hovered ? "#c8c8c8" : dim ? "#3a3a3a" : "#666",
        cursor: "pointer",
        padding: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        backgroundColor: hovered ? "#252525" : "transparent",
        transition: "all 0.12s",
        flexShrink: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}

// ─── NavBar ───────────────────────────────────────────────────────────────────

export default function NavBar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      display: "flex",
      alignItems: "center",
      height: 46,
      backgroundColor: "#111111",
      borderBottom: "1px solid #1e1e1e",
      padding: "0 10px 0 12px",
      gap: 6,
      width: "100vw", 
      boxSizing: "border-box",
    }}>

      {/* ── Left: hamburger + nav arrows + title ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
        <IconBtn title="Menu">{Icons.hamburger}</IconBtn>
        <IconBtn title="Back">{Icons.back}</IconBtn>
        <IconBtn title="Forward" dim>{Icons.forward}</IconBtn>
      </div>

      {/* Title */}
      <span style={{
        fontSize: 13,
        fontWeight: 700,
        color: "#d8d8d8",
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
        marginLeft: 4,
        marginRight: 8,
        flexShrink: 0,
      }}>
        LOADTEST AI Dashboard
      </span>

      {/* ── Center: search bar ── */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", minWidth: 0 }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          backgroundColor: "#1c1c1c",
          border: `1px solid ${searchFocused ? "#444" : "#282828"}`,
          borderRadius: 7,
          padding: "5px 14px",
          width: "100%",
          maxWidth: 340,
          transition: "border-color 0.15s",
          cursor: "text",
        }}>
          <span style={{ color: "#555", display: "flex", alignItems: "center", flexShrink: 0 }}>
            {Icons.search}
          </span>
          <input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search Postman"
            style={{
              background: "none",
              border: "none",
              outline: "none",
              color: "#aaa",
              fontSize: 12.5,
              fontFamily: "inherit",
              width: "100%",
              minWidth: 0,
            }}
          />
        </div>
      </div>

      {/* ── Right: action icons ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0, marginLeft: 8 }}>
        <IconBtn title="Settings">{Icons.settings}</IconBtn>
        <Avatar />
        <IconBtn title="Notifications">{Icons.notification}</IconBtn>
        <IconBtn title="Chat">{Icons.chat}</IconBtn>
        <IconBtn title="Edit">{Icons.pen}</IconBtn>
      </div>
    </div>
  );
}