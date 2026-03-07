'use client';
import { useState, useEffect } from "react";

export interface NavItem {
  label: string;
  action: () => void;
}

interface NavbarProps {
  navItems: NavItem[];
  activeNav: string | null;
}

export default function Navbar({ navItems, activeNav }: NavbarProps) {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!mobileMenu) return;
    const fn = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".nav-mobile-root")) setMobileMenu(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [mobileMenu]);

  if (!mounted) return null;

  // Soft threshold — start transitioning at 20px, fully switched at 70px
  const progress = Math.min(Math.max((scrollY - 20) / 50, 0), 1);
  const isTop = progress === 0;
  const isPill = progress === 1;

  return (
    <>
      <style>{`
        @keyframes mobileDropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .nav-btn {
          position: relative;
          background: none; border: none; cursor: pointer;
          font-family: inherit; letter-spacing: 0.01em;
        }
        .nav-top-btn {
          font-size: 13px; font-weight: 500;
          color: #57534e; padding: 6px 13px; border-radius: 6px;
          transition: color 0.2s, background 0.2s;
        }
        .nav-top-btn:hover { color: #1c1917; background: rgba(0,0,0,0.04); }
        .nav-top-btn.active { color: #ea580c; }

        .nav-pill-btn {
          font-size: 13px; font-weight: 600;
          color: #78716c; padding: 7px 14px; border-radius: 999px;
          transition: color 0.2s;
        }
        .nav-pill-btn:hover { color: #1c1917; }
        .nav-pill-btn.active { color: #ea580c; }
        .nav-pill-btn .dot {
          position: absolute; bottom: 4px; left: 50%;
          transform: translateX(-50%) scale(0);
          width: 3px; height: 3px; border-radius: 50%;
          background: #ea580c;
          transition: transform 0.2s, opacity 0.2s;
          opacity: 0;
        }
        .nav-pill-btn:hover .dot,
        .nav-pill-btn.active .dot {
          transform: translateX(-50%) scale(1);
          opacity: 1;
        }

        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-root { display: flex !important; }
        }
      `}</style>

      {/* ══ DESKTOP: FULL-WIDTH BAR ══
          Fades out + slides up as user scrolls.
          pointerEvents disabled once it's invisible so it doesn't block clicks.
      */}
      <header
        className="nav-desktop"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          opacity: 1 - progress,
          transform: `translateY(${-progress * 10}px)`,
          pointerEvents: isPill ? "none" : "auto",
          transition: "opacity 0.35s ease, transform 0.35s ease",
          willChange: "opacity, transform",
        }}
      >
        {/* Top accent line */}
        <div style={{
          height: 2,
          background: "linear-gradient(90deg, transparent 0%, #ea580c 30%, #f59e0b 70%, transparent 100%)",
          opacity: 0.45,
        }} />

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(24px, 4vw, 56px)",
          height: 66,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 23, fontWeight: 700,
              letterSpacing: "-0.5px", color: "#1c1917",
              fontStyle: "italic", lineHeight: 1,
            }}>De</span>
            <span style={{
              fontWeight: 900, fontSize: 23,
              letterSpacing: "-1px", color: "#ea580c",
              fontFamily: "'Sora', sans-serif", lineHeight: 1,
            }}>Ralph</span>
            <span style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "#ea580c", display: "inline-block",
              marginLeft: 3, marginBottom: 2, opacity: 0.7, flexShrink: 0,
            }} />
          </div>

          {/* Nav links */}
          <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {navItems.map((n) => (
              <button
                key={n.label}
                className={`nav-btn nav-top-btn${activeNav === n.label ? " active" : ""}`}
                onClick={n.action}
              >
                {n.label}
              </button>
            ))}
          </nav>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{
              fontSize: 10, color: "#c4bfba",
              letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
            }}>Full-Stack Dev</span>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#1c1917", color: "#fafaf9",
                padding: "8px 18px", borderRadius: 8,
                fontSize: 12, fontWeight: 700, textDecoration: "none",
                letterSpacing: "0.04em", display: "inline-block",
                transition: "background 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#ea580c"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#1c1917"; e.currentTarget.style.transform = "translateY(0)"; }}
            >Resume ↗</a>
          </div>
        </div>

        {/* Bottom separator */}
        <div style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.07) 20%, rgba(0,0,0,0.07) 80%, transparent)",
        }} />
      </header>

      {/* ══ DESKTOP: FLOATING PILL ══
          Fades in + slides down as user scrolls.
          Starts slightly above and scales up from 0.94 → 1.
          pointerEvents disabled while still invisible.
      */}
      <nav
        className="nav-desktop"
        style={{
          position: "fixed",
          top: 14,
          left: "50%",
          zIndex: 100,
          opacity: progress,
          transform: `translateX(-50%) translateY(${(1 - progress) * -12}px) scale(${0.94 + progress * 0.06})`,
          pointerEvents: isTop ? "none" : "auto",
          transition: "opacity 0.35s ease, transform 0.35s ease",
          willChange: "opacity, transform",
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: "6px 8px 6px 16px",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderRadius: 999,
          border: "1px solid rgba(234,88,12,0.13)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.95) inset",
        }}>
          {/* Logo */}
          <span style={{
            fontWeight: 800, fontSize: 14, letterSpacing: "-0.5px",
            marginRight: 8, paddingRight: 12,
            borderRight: "1px solid #e7e5e4",
            whiteSpace: "nowrap", lineHeight: 1,
          }}>
            De<span style={{ color: "#ea580c" }}>Ralph</span>
          </span>

          {/* Nav items */}
          {navItems.map((n) => (
            <button
              key={n.label}
              className={`nav-btn nav-pill-btn${activeNav === n.label ? " active" : ""}`}
              onClick={n.action}
            >
              {n.label}
              <span className="dot" />
            </button>
          ))}

          {/* Résumé CTA */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginLeft: 6,
              background: "#1c1917", color: "#fafaf9",
              padding: "7px 16px", borderRadius: 999,
              fontSize: 12, fontWeight: 700, textDecoration: "none",
              letterSpacing: "0.02em", display: "inline-block",
              whiteSpace: "nowrap",
              transition: "background 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#ea580c"; e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#1c1917"; e.currentTarget.style.transform = "scale(1)"; }}
          >Resume ↗</a>
        </div>
      </nav>

      {/* ══ MOBILE ══ */}
      <div
        className="nav-mobile-root"
        style={{
          display: "none",
          position: "fixed",
          top: 14, left: 0, right: 0,
          zIndex: 100,
          padding: "0 16px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo pill */}
        <div style={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(234,88,12,0.12)",
          borderRadius: 999, padding: "9px 18px",
          fontWeight: 800, fontSize: 15, letterSpacing: "-0.5px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)", lineHeight: 1,
        }}>
          De<span style={{ color: "#ea580c" }}>Ralph</span>
        </div>

        {/* Menu pill */}
        <button
          onClick={() => setMobileMenu((v) => !v)}
          style={{
            background: mobileMenu ? "#1c1917" : "rgba(255,255,255,0.9)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${mobileMenu ? "transparent" : "rgba(234,88,12,0.12)"}`,
            borderRadius: 999, padding: "9px 18px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 12, fontWeight: 700, fontFamily: "inherit",
            color: mobileMenu ? "#fff" : "#1c1917",
            letterSpacing: "0.04em", textTransform: "uppercase",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            transition: "background 0.25s, color 0.25s, border-color 0.25s",
          }}
        >
          <span style={{ display: "flex", flexDirection: "column", gap: 4, width: 14, flexShrink: 0 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                display: "block", height: 1.5,
                background: mobileMenu ? "#fff" : "#1c1917",
                borderRadius: 2, transition: "all 0.25s ease",
                opacity: mobileMenu && i === 1 ? 0 : 1,
                transform: mobileMenu
                  ? i === 0 ? "rotate(45deg) translate(3.5px, 4px)"
                  : i === 2 ? "rotate(-45deg) translate(3.5px, -4px)"
                  : "none"
                  : "none",
              }} />
            ))}
          </span>
          {mobileMenu ? "Close" : "Menu"}
        </button>

        {/* Dropdown */}
        {mobileMenu && (
          <div style={{
            position: "absolute",
            top: "calc(100% + 8px)", right: 16,
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(234,88,12,0.1)",
            borderRadius: 20, padding: "10px 8px",
            boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
            minWidth: 192,
            animation: "mobileDropIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
          }}>
            {navItems.map((n, i) => (
              <button
                key={n.label}
                onClick={() => { n.action(); setMobileMenu(false); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", background: "none", border: "none", cursor: "pointer",
                  fontSize: 14, fontWeight: 600, fontFamily: "inherit",
                  color: "#1c1917", padding: "11px 14px", borderRadius: 12,
                  textAlign: "left", transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#fff7ed"; e.currentTarget.style.color = "#ea580c"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#1c1917"; }}
              >
                {n.label}
                <span style={{ fontSize: 10, color: "#d4d0cb", fontFamily: "monospace" }}>0{i + 1}</span>
              </button>
            ))}
            <div style={{ margin: "6px 8px", borderTop: "1px solid #f0ede9" }} />
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "11px 14px", background: "#1c1917", color: "#fff",
                borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: "none",
              }}
            >
              Resume <span>↗</span>
            </a>
          </div>
        )}
      </div>
    </>
  );
}