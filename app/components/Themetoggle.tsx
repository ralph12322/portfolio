'use client';
import { useTheme } from "./Themeprovider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        position: "relative",
        width: 44,
        height: 24,
        borderRadius: 99,
        border: isDark ? "1px solid rgba(45,212,191,0.25)" : "1px solid rgba(0,0,0,0.12)",
        background: isDark ? "#1a1916" : "#e8e4dc",
        cursor: "pointer",
        padding: 0,
        flexShrink: 0,
        transition: "background 0.3s, border-color 0.3s",
        outline: "none",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = isDark
          ? "rgba(45,212,191,0.55)"
          : "rgba(0,0,0,0.25)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = isDark
          ? "rgba(45,212,191,0.25)"
          : "rgba(0,0,0,0.12)";
      }}
    >
      <span style={{
        position: "absolute", left: 5, top: "50%",
        transform: "translateY(-50%)", fontSize: 10, lineHeight: 1,
        opacity: isDark ? 0.5 : 0, transition: "opacity 0.2s", userSelect: "none",
      }}>✦</span>
      <span style={{
        position: "absolute", right: 5, top: "50%",
        transform: "translateY(-50%)", fontSize: 10, lineHeight: 1,
        opacity: isDark ? 0 : 0.5, transition: "opacity 0.2s", userSelect: "none",
      }}>☀</span>
      <span style={{
        position: "absolute", top: 3,
        left: isDark ? 3 : 23,
        width: 16, height: 16, borderRadius: "50%",
        background: isDark ? "#2dd4bf" : "#c8a96e",
        transition: "left 0.28s cubic-bezier(0.34,1.56,0.64,1), background 0.3s",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8,
        boxShadow: isDark
          ? "0 0 6px rgba(45,212,191,0.4)"
          : "0 0 6px rgba(200,169,110,0.5)",
      }} />
    </button>
  );
}