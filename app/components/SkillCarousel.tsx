'use client';
import { useState, useRef } from "react";

interface Skill {
  label: string;
  icon: string;
}

interface SkillsBubbleProps {
  skills?: Skill[];
}

const DEFAULT_SKILLS: Skill[] = [
  { label: "React",      icon: "⚛" },
  { label: "Next.js",    icon: "N" },
  { label: "TypeScript", icon: "TS" },
  { label: "Node.js",    icon: "🟢" },
  { label: "MongoDB",    icon: "🍃" },
  { label: "Express",    icon: "EX" },
  { label: "Python",     icon: "🐍" },
  { label: "Tailwind",   icon: "🌊" },
  { label: "Git",        icon: "G" },
  { label: "PostgreSQL", icon: "🐘" },
  { label: "Docker",     icon: "🐳" },
  { label: "GraphQL",    icon: "◈" },
  { label: "Redis",      icon: "R" },
  { label: "Figma",      icon: "F" },
  { label: "AWS",        icon: "☁" },
];

export default function SkillsBubble({ skills = DEFAULT_SKILLS }: SkillsBubbleProps) {
  const [open, setOpen] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const togglePanel = () => {
    if (!open) {
      setOpen(true);
      setPanelVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPanelOpen(true));
      });
    } else {
      setPanelOpen(false);
      setOpen(false);
      setTimeout(() => setPanelVisible(false), 400);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) togglePanel();
  };

  const doubled = [...skills, ...skills];

  return (
    <>
      <style>{`
        @keyframes sb-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes sb-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(45,212,191,0.35); }
          50%       { box-shadow: 0 0 0 8px rgba(45,212,191,0); }
        }
        @keyframes sb-tag-pop {
          from { opacity: 0; transform: scale(0.75) translateY(4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .sb-track { animation: sb-scroll 18s linear infinite; }
        .sb-track:hover { animation-play-state: paused; }

        .sb-bubble-btn {
          animation: sb-pulse 3s ease-in-out infinite;
          transition: transform 0.18s, background 0.18s;
        }
        .sb-bubble-btn:hover {
          transform: scale(1.07) !important;
          animation: none;
          box-shadow: none;
        }
        .sb-bubble-btn:active { transform: scale(0.95) !important; }

        .sb-pill { transition: border-color 0.2s, background 0.2s; }
        .sb-pill:hover {
          border-color: #2dd4bf !important;
          background: #0d2424 !important;
        }
        .sb-pill:hover .sb-pill-label { color: #2dd4bf !important; }

        .sb-panel-tag {
          transition: color 0.18s, border-color 0.18s, background 0.18s;
          animation: sb-tag-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .sb-panel-tag:hover {
          color: #2dd4bf !important;
          border-color: #2dd4bf !important;
          background: #0d2424 !important;
        }

        .sb-close-btn { transition: background 0.18s, color 0.18s; }
        .sb-close-btn:hover {
          background: #2a2825 !important;
          color: #2dd4bf !important;
        }

        /* ── Responsive: shrink bubble button on narrow left columns ── */
        @media (max-width: 400px) {
          .sb-bubble-btn { width: 48px !important; height: 48px !important; }
        }
      `}</style>

      {/* ── Main bar ── */}
      <div style={{
        background: "#0d0c0b",
        border: "1px solid #1e1c1a",
        borderRadius: 14,
        /* Use min-height instead of fixed height so it never clips */
        minHeight: 72,
        padding: "0 14px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Sora', sans-serif",
      }}>

        {/* Carousel */}
        <div style={{
          flex: 1,
          minWidth: 0,          /* lets flex child shrink below content size */
          overflow: "hidden",
          position: "relative",
          height: 56,
          display: "flex",
          alignItems: "center",
        }}>
          {/* Fade edges */}
          <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 28, background: "linear-gradient(to right, #0d0c0b, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 28, background: "linear-gradient(to left, #0d0c0b, transparent)", zIndex: 2, pointerEvents: "none" }} />

          {/* Scrolling track */}
          <div className="sb-track" style={{ display: "flex", alignItems: "center", gap: 8, willChange: "transform" }}>
            {doubled.map((s, i) => (
              <div
                key={`${s.label}-${i}`}
                className="sb-pill"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "0 11px",
                  height: 36,
                  borderRadius: 8,
                  background: "#111009",
                  border: "1px solid #272421",
                  whiteSpace: "nowrap",
                  cursor: "default",
                  flexShrink: 0,
                }}
              >
                <div style={{
                  width: 20, height: 20,
                  borderRadius: 4,
                  background: "#1c1915",
                  border: "1px solid #2a2825",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, flexShrink: 0,
                }}>{s.icon}</div>
                <span className="sb-pill-label" style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#78716c",
                  letterSpacing: "0.02em",
                }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 40, background: "#1e1c1a", flexShrink: 0 }} />

        {/* Bubble button — slightly smaller (56px) so it fits narrow columns */}
        <button
          className="sb-bubble-btn"
          onClick={togglePanel}
          style={{
            width: 56, height: 56,
            borderRadius: "50%",
            background: open ? "#0a1f1f" : "#2dd4bf",
            border: open ? "1.5px solid #2dd4bf" : "none",
            cursor: "pointer",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 3,
            flexShrink: 0,
            animationPlayState: open ? "paused" : "running",
          }}
        >
          <svg width={16} height={16} viewBox="0 0 20 20" fill="none">
            <rect x={2} y={3}    width={16} height={2.5} rx={1.25} fill={open ? "#2dd4bf" : "#0a0908"} opacity={0.9} />
            <rect x={2} y={8.75} width={11} height={2.5} rx={1.25} fill={open ? "#2dd4bf" : "#0a0908"} opacity={0.6} />
            <rect x={2} y={14.5} width={7}  height={2.5} rx={1.25} fill={open ? "#2dd4bf" : "#0a0908"} opacity={0.35} />
          </svg>
        </button>
      </div>

      {/* ── Full list panel (bottom sheet) ── */}
      {panelVisible && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            /* Subtle backdrop so it feels intentional */
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            transition: "background 0.3s",
          }}
        >
          <div style={{
            background: "#111009",
            border: "1px solid #1e1c1a",
            borderTop: "1px solid rgba(45,212,191,0.15)",
            borderRadius: "16px 16px 0 0",
            /* Padding scales with viewport: more breathing room on large screens */
            padding: "20px clamp(16px, 5vw, 32px) 36px",
            width: "100%",
            /* Cap width on large screens; on mobile it fills edge-to-edge */
            maxWidth: "min(520px, 100vw)",
            /* Never taller than 80% of the viewport */
            maxHeight: "80vh",
            overflowY: "auto",
            transform: panelOpen ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.38s cubic-bezier(0.34,1.56,0.64,1)",
          }}>

            {/* Drag handle */}
            <div style={{ width: 36, height: 3, borderRadius: 99, background: "#2a2825", margin: "0 auto 18px" }} />

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#3a3733", fontFamily: "'Sora', sans-serif" }}>
                Full Stack
              </span>
              <span style={{ fontSize: 11, color: "#3a3733", fontFamily: "'JetBrains Mono', monospace" }}>
                {skills.length} skills
              </span>
              <button
                className="sb-close-btn"
                onClick={togglePanel}
                style={{
                  width: 28, height: 28,
                  borderRadius: "50%",
                  background: "#1a1815",
                  border: "1px solid #2a2825",
                  color: "#57534e",
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >✕</button>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {skills.map((s, i) => (
                <span
                  key={s.label}
                  className="sb-panel-tag"
                  style={{
                    padding: "5px 12px",
                    background: "#0f0e0c",
                    border: "1px solid #2a2825",
                    borderRadius: 6,
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "#57534e",
                    cursor: "default",
                    animationDelay: `${i * 35}ms`,
                  }}
                >{s.label}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}