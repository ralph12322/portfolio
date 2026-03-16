'use client';
import { useState, useEffect, useCallback } from "react";
import ThemeToggle from "./Themetoggle";
import { useTheme } from "./Themeprovider";

export interface NavItem { label: string; action: () => void; }
interface NavbarProps { navItems: NavItem[]; activeNav: string | null; }

export default function Navbar({ navItems, activeNav }: NavbarProps) {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    setMounted(true);
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setMobileMenu(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    if (!mobileMenu) return;
    const fn = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".nav-mobile-root")) setMobileMenu(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [mobileMenu]);

  useEffect(() => {
    document.body.style.overflow = mobileMenu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenu]);

  const handleNavAction = useCallback((action: () => void) => { action(); setMobileMenu(false); }, []);

  if (!mounted) return null;

  const progress = Math.min(Math.max((scrollY - 20) / 50, 0), 1);
  const isTop = progress === 0;
  const isPill = progress === 1;

  /* ── Light mode colour overrides ── */
  const navbarBg    = isLight ? "rgba(245,242,236,0.92)" : "rgba(10,9,8,0.88)";
  const pillBg      = isLight ? "rgba(240,236,228,0.98)" : "#111009";
  const pillBorder  = isLight ? "rgba(13,148,136,0.18)" : "rgba(45,212,191,0.15)";
  const logoItalic  = isLight ? "rgba(30,25,20,0.85)"   : "rgba(255,255,255,0.88)";
  const accentColor = isLight ? "#0d9488"                : "#2dd4bf";
  const resumeBg    = isLight ? "rgba(13,148,136,0.10)"  : "rgba(45,212,191,0.08)";
  const resumeText  = accentColor;
  const resumeBorder= isLight ? "rgba(13,148,136,0.25)"  : "rgba(45,212,191,0.2)";
  const topAccent1  = isLight ? "#0f766e" : "#0d9488";
  const topAccent2  = isLight ? "#0d9488" : "#2dd4bf";
  const sepLine     = isLight ? "rgba(13,148,136,0.1)"   : "rgba(45,212,191,0.08)";
  const subtitleCol = isLight ? "rgba(30,25,20,0.22)"    : "rgba(255,255,255,0.18)";
  const mobileBtnBg = isLight ? "rgba(240,236,228,0.97)" : "rgba(17,16,9,0.95)";
  const mobilePanelBg = isLight ? "rgba(245,242,236,0.99)" : "rgba(14,13,10,0.98)";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&family=Sora:wght@500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes mobileDropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .nav-btn {
          position: relative; background: none; border: none; cursor: pointer;
          font-family: 'Sora', sans-serif; letter-spacing: 0.01em;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
        }
        .nav-top-btn {
          font-size: clamp(11px,1.1vw,13px); font-weight: 500;
          color: ${isLight ? "rgba(30,25,20,0.45)" : "rgba(255,255,255,0.35)"};
          padding: 6px clamp(8px,1.2vw,13px); border-radius: 6px;
          transition: color 0.2s, background 0.2s; white-space: nowrap;
        }
        .nav-top-btn:hover {
          color: ${isLight ? "rgba(30,25,20,0.85)" : "rgba(255,255,255,0.75)"};
          background: ${isLight ? "rgba(13,148,136,0.08)" : "rgba(45,212,191,0.07)"};
        }
        .nav-top-btn.active { color: ${accentColor}; }

        .nav-pill-btn {
          font-size: clamp(11px,1vw,12.5px); font-weight: 600;
          color: ${isLight ? "#6b6460" : "#57534e"};
          padding: 7px clamp(10px,1.2vw,14px); border-radius: 999px;
          transition: color 0.2s; white-space: nowrap;
        }
        .nav-pill-btn:hover { color: ${accentColor}; }
        .nav-pill-btn.active { color: ${accentColor}; }
        .nav-pill-btn .dot {
          position: absolute; bottom: 4px; left: 50%;
          transform: translateX(-50%) scale(0);
          width: 3px; height: 3px; border-radius: 50%;
          background: ${accentColor};
          transition: transform 0.2s, opacity 0.2s; opacity: 0;
        }
        .nav-pill-btn:hover .dot, .nav-pill-btn.active .dot {
          transform: translateX(-50%) scale(1); opacity: 1;
        }

        .nav-desktop { display: flex; }
        .nav-mobile-root { display: none; }

        @media (max-width: 900px) and (min-width: 769px) {
          .nav-top-label { display: none; }
          .nav-top-btn { padding: 6px 9px; }
        }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-root { display: flex !important; }
        }

        .mobile-menu-item {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; background: none; border: none; cursor: pointer;
          font-family: 'Sora', sans-serif;
          color: ${isLight ? "rgba(30,25,20,0.6)" : "rgba(255,255,255,0.55)"};
          padding: 13px 16px; border-radius: 12px; text-align: left;
          transition: background 0.15s, color 0.15s;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
          font-size: 14px; font-weight: 600;
        }
        .mobile-menu-item:hover, .mobile-menu-item:active {
          background: ${isLight ? "rgba(13,148,136,0.08)" : "rgba(45,212,191,0.1)"};
          color: ${accentColor};
        }
        .mobile-menu-item.active { color: ${accentColor}; background: ${isLight ? "rgba(13,148,136,0.06)" : "rgba(45,212,191,0.06)"}; }

        .resume-link-pill {
          display: flex; align-items: center; justify-content: space-between;
          padding: 13px 16px; background: ${accentColor}; color: ${isLight ? "#fff" : "#0a0908"};
          border-radius: 12px; font-size: 13.5px; font-weight: 700;
          text-decoration: none; font-family: 'Sora', sans-serif; transition: background 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .resume-link-pill:hover, .resume-link-pill:active { background: ${isLight ? "#0f766e" : "#14b8a6"}; }
      `}</style>

      {/* ── Desktop full-width bar ── */}
      <header className="nav-desktop" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        flexDirection: "column",
        opacity: 1 - progress,
        transform: `translateY(${-progress * 10}px)`,
        pointerEvents: isPill ? "none" : "auto",
        transition: "opacity 0.35s ease, transform 0.35s ease",
        background: navbarBg,
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
      }}>
        <div style={{ height: 1.5, background: `linear-gradient(90deg, transparent 0%, ${topAccent1} 20%, ${topAccent2} 50%, ${topAccent1} 80%, transparent 100%)`, opacity: 0.5 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(16px,4vw,56px)", height: "clamp(54px,7vw,64px)", gap: 12, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 0, flexShrink: 0 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(18px,2.2vw,22px)", fontWeight: 700, letterSpacing: "-0.3px", color: logoItalic, fontStyle: "italic", lineHeight: 1 }}>De</span>
            <span style={{ fontWeight: 900, fontSize: "clamp(18px,2.2vw,22px)", letterSpacing: "-1px", color: accentColor, fontFamily: "'Sora', sans-serif", lineHeight: 1 }}>Ralph</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: accentColor, display: "inline-block", marginLeft: 2, marginBottom: 3, opacity: 0.8, flexShrink: 0 }} />
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 2, flex: "1 1 auto", justifyContent: "center", minWidth: 0, overflow: "hidden" }}>
            {navItems.map((n) => (
              <button key={n.label} className={`nav-btn nav-top-btn${activeNav === n.label ? " active" : ""}`} onClick={n.action}>
                <span className="nav-top-label">{n.label}</span>
              </button>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px,1.5vw,16px)", flexShrink: 0 }}>
            <span style={{ fontSize: "clamp(9px,0.85vw,10px)", color: subtitleCol, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, fontFamily: "'Sora', sans-serif", whiteSpace: "nowrap" }}>Full-Stack Dev</span>
            <ThemeToggle />
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
              style={{ background: resumeBg, color: resumeText, border: `1px solid ${resumeBorder}`, padding: "7px clamp(12px,1.5vw,17px)", borderRadius: 8, fontSize: "clamp(11px,1.1vw,12px)", fontWeight: 700, textDecoration: "none", letterSpacing: "0.04em", display: "inline-block", fontFamily: "'Sora', sans-serif", transition: "background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s", whiteSpace: "nowrap" }}
              onMouseEnter={e => { e.currentTarget.style.background = accentColor; e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.color = isLight ? "#fff" : "#0a0908"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = resumeBg; e.currentTarget.style.borderColor = resumeBorder; e.currentTarget.style.color = resumeText; e.currentTarget.style.transform = "translateY(0)"; }}
            >Resume ↗</a>
          </div>
        </div>
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${sepLine} 20%, ${sepLine} 80%, transparent)` }} />
      </header>

      {/* ── Desktop floating pill ── */}
      <nav className="nav-desktop" style={{
        position: "fixed", top: 14, left: "50%", zIndex: 100,
        opacity: progress,
        transform: `translateX(-50%) translateY(${(1 - progress) * -12}px) scale(${0.94 + progress * 0.06})`,
        pointerEvents: isTop ? "none" : "auto",
        transition: "opacity 0.35s ease, transform 0.35s ease",
        maxWidth: "calc(100vw - 32px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "5px 6px 5px clamp(12px,1.5vw,16px)", background: pillBg, backdropFilter: "blur(28px) saturate(180%)", WebkitBackdropFilter: "blur(28px) saturate(180%)", borderRadius: 999, border: `1px solid ${pillBorder}`, boxShadow: isLight ? "0 8px 32px rgba(0,0,0,0.08)" : "0 8px 32px rgba(0,0,0,0.4)", overflow: "hidden", maxWidth: "calc(100vw - 32px)" }}>
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "clamp(12px,1.3vw,13.5px)", letterSpacing: "-0.5px", marginRight: 6, paddingRight: "clamp(8px,1.2vw,12px)", borderRight: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)"}`, whiteSpace: "nowrap", lineHeight: 1, display: "flex", alignItems: "baseline", gap: 0, flexShrink: 0 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 700, color: logoItalic, fontSize: "clamp(12px,1.3vw,14px)" }}>De</span>
            <span style={{ color: accentColor }}>Ralph</span>
          </span>
          {navItems.map((n) => (
            <button key={n.label} className={`nav-btn nav-pill-btn${activeNav === n.label ? " active" : ""}`} onClick={n.action}>
              {n.label}<span className="dot" />
            </button>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 4, flexShrink: 0 }}>
            <ThemeToggle />
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
              style={{ background: accentColor, color: isLight ? "#fff" : "#0a0908", padding: "7px clamp(12px,1.5vw,16px)", borderRadius: 999, fontSize: "clamp(11px,1vw,12px)", fontWeight: 700, textDecoration: "none", letterSpacing: "0.02em", display: "inline-block", fontFamily: "'Sora', sans-serif", whiteSpace: "nowrap", transition: "background 0.2s, transform 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = isLight ? "#0f766e" : "#14b8a6"; e.currentTarget.style.transform = "scale(1.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = accentColor; e.currentTarget.style.transform = "scale(1)"; }}
            >Resume ↗</a>
          </div>
        </div>
      </nav>

      {/* ── Mobile backdrop ── */}
      {mobileMenu && (
        <div onClick={() => setMobileMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 98, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", animation: "overlayFadeIn 0.25s ease both" }} />
      )}

      {/* ── Mobile nav bar ── */}
      <div className="nav-mobile-root" style={{ display: "none", position: "fixed", top: 0, left: 0, right: 0, zIndex: 99, padding: "clamp(10px,3vw,14px) clamp(12px,4vw,16px)", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ background: mobileBtnBg, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: `1px solid ${pillBorder}`, borderRadius: 999, padding: "clamp(8px,2vw,10px) clamp(14px,4vw,18px)", fontWeight: 800, fontSize: "clamp(14px,4vw,16px)", letterSpacing: "-0.5px", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", lineHeight: 1, fontFamily: "'Sora', sans-serif", display: "flex", alignItems: "baseline", gap: 0 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 700, color: logoItalic, fontSize: "clamp(14px,4vw,16px)" }}>De</span>
          <span style={{ color: accentColor }}>Ralph</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ThemeToggle />
          <button onClick={() => setMobileMenu(v => !v)} aria-label={mobileMenu ? "Close menu" : "Open menu"} aria-expanded={mobileMenu}
            style={{ background: mobileMenu ? accentColor : mobileBtnBg, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: `1px solid ${mobileMenu ? "transparent" : pillBorder}`, borderRadius: 999, padding: "clamp(8px,2vw,10px) clamp(14px,4vw,18px)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: "clamp(10px,2.5vw,11px)", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: mobileMenu ? (isLight ? "#fff" : "#0a0908") : (isLight ? "rgba(30,25,20,0.8)" : "#fff"), letterSpacing: "0.06em", textTransform: "uppercase", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", transition: "background 0.25s, border-color 0.25s, color 0.25s", flexShrink: 0 }}>
            <span aria-hidden="true" style={{ display: "flex", flexDirection: "column", gap: "3.5px", width: 14, flexShrink: 0 }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ display: "block", height: 1.5, background: mobileMenu ? (isLight ? "#fff" : "#0a0908") : (isLight ? "rgba(30,25,20,0.8)" : "#fff"), borderRadius: 2, transition: "all 0.25s ease", transformOrigin: "center", opacity: mobileMenu && i === 1 ? 0 : 1, transform: mobileMenu ? (i === 0 ? "rotate(45deg) translate(3.5px, 4px)" : i === 2 ? "rotate(-45deg) translate(3.5px, -4px)" : "none") : "none" }} />
              ))}
            </span>
            {mobileMenu ? "Close" : "Menu"}
          </button>
        </div>

        {mobileMenu && (
          <div role="dialog" aria-label="Navigation menu" style={{ position: "absolute", top: "calc(100% + 6px)", right: "clamp(12px,4vw,16px)", background: mobilePanelBg, backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)", border: `1px solid ${pillBorder}`, borderRadius: 20, padding: "10px 8px", boxShadow: "0 24px 64px rgba(0,0,0,0.15)", minWidth: "clamp(200px,60vw,240px)", maxWidth: "calc(100vw - 24px)", animation: "mobileDropIn 0.32s cubic-bezier(0.34,1.56,0.64,1) both", zIndex: 99 }}>
            {navItems.map((n, i) => (
              <button key={n.label} onClick={() => handleNavAction(n.action)} className={`mobile-menu-item${activeNav === n.label ? " active" : ""}`}>
                <span>{n.label}</span>
                <span style={{ fontSize: 10, color: isLight ? "rgba(30,25,20,0.2)" : "rgba(255,255,255,0.15)", fontFamily: "monospace", fontWeight: 400 }}>0{i + 1}</span>
              </button>
            ))}
            <div style={{ margin: "8px 8px", borderTop: `1px solid ${pillBorder}` }} />
            <div style={{ padding: "0 0px" }}>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="resume-link-pill">
                <span>Resume</span><span>↗</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}