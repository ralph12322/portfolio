'use client';
import { useState, useEffect, ReactNode } from "react";
import {
  Github, Linkedin, Mail, Facebook, ExternalLink,
  Music, Film, Gamepad2, X, ArrowUpRight, GitCommit,
  GitPullRequest, Star, Zap, Code2, Layers, Database,
  Terminal, CheckCircle2, Instagram, Clapperboard, SquareChevronRight,
} from "lucide-react";
import { createPortal } from "react-dom";
import Navbar from "./components/Navbar";
import MusicPlayer from "./components/MusicPlayer";
import SkillsBubble from "./components/SkillCarousel";
import ShootingStars from "./components/Shootingstars";
import { useTheme } from "./components/Themeprovider";
import { useRef } from "react";
import SpotifyWidget from "./components/Spotifywidget";

interface Project { title: string; tag: string; description: string; tech: string[]; github: string; demo: string; accent: string; num: string; }
interface TimelineItem { year: string; title: string; company: string; description: string; accent: string; }
interface InterestItem { label: string; sub: string; }
interface Interest { category: string; icon: ReactNode; accent: string; description: string; items: InterestItem[]; }
interface PanelProps { open: boolean; onClose: () => void; children: ReactNode; }
interface PanelHeaderProps { label: string; title: string; italic?: string; onClose: () => void; }

/* ── Responsive hook ── */
function useBreakpoint() {
  const [w, setW] = useState(1200);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setW(window.innerWidth);
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  if (!mounted) return { isMobile: false, isTablet: false, isDesktop: true, w: 1200 };
  return { isMobile: w < 768, isTablet: w >= 768 && w < 900, isDesktop: w >= 900, w };
}

function GitHubStats({ username }: { username: string }) {
  const [repos, setRepos] = useState<string>("…");
  const [contributions, setContributions] = useState<string>("…");
  useEffect(() => {
    fetch(`https://api.github.com/users/${username}`)
      .then(r => r.json()).then(d => setRepos(String(d.public_repos ?? "—"))).catch(() => setRepos("—"));
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}`)
      .then(r => r.json()).then(d => {
        const total = Object.values(d.total as Record<string, number>).reduce((a, v) => a + v, 0);
        setContributions(String(total));
      });
  }, [username]);
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
      {[{ label: "PUBLIC REPOS", value: repos }, { label: "CONTRIBUTIONS", value: contributions }].map((s, i) => (
        <div key={i} style={{ flex: 1, background: "var(--bg-card-inner)", border: "1px solid var(--border-subtle)", borderRadius: 8, padding: "9px 11px" }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: "var(--text-ghost)", marginBottom: 3, fontFamily: "'JetBrains Mono', monospace" }}>{s.label}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-1px" }}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}

function Reveal({ children, style = {} }: { children: ReactNode; delay?: number; style?: React.CSSProperties }) {
  return <div style={{ minWidth: 0, ...style }}>{children}</div>;
}

function Panel({ open, onClose, children }: PanelProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);

  if (!mounted) return null;

  return createPortal(
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 998, background: "rgba(0,0,0,0.6)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.35s", backdropFilter: open ? "blur(6px)" : "none" }} />
      <div className={`panel-drawer ${open ? "open" : ""}`}>
        {children}
      </div>
    </>,
    document.body
  );
}

function PanelHeader({ label, title, italic, onClose }: PanelHeaderProps) {
  return (
    <div style={{ padding: "clamp(14px,3vw,36px) clamp(14px,4vw,48px) 18px", borderBottom: "1px solid var(--border-default)", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--text-faint)", fontWeight: 700, marginBottom: 8 }}>{label}</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px,4vw,44px)", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-1px", margin: 0, lineHeight: 1.1 }}>
          {title}{italic && <span style={{ color: "var(--accent)", fontStyle: "italic" }}> {italic}</span>}
        </h2>
      </div>
      <button className="close-btn" onClick={onClose} aria-label="Close panel">
        <X style={{ width: 16, height: 16, color: "var(--text-muted)" }} />
      </button>
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--text-muted)", letterSpacing: 1 }}>{time}</span>;
}

function VisitorCount() {
  const [count, setCount] = useState<string | null>(null);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    fetch("https://api.visitorbadge.io/api/visitors?path=github.com%2Fralph12322")
      .then(r => r.text())
      .then(svg => {
        const match = svg.match(/<text[^>]*font-weight="bold">(\d+)<\/text>/);
        setCount(match ? Number(match[1]).toLocaleString() : "—");
      })
      .catch(() => setCount("—"));
  }, []);

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, animation: "pulse 2s infinite" }} />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--text-muted)", letterSpacing: 1 }}>
        {count ?? "…"} visitors
      </span>
    </div>
  );
}

const projects: Project[] = [
  { title: "TrackTag", tag: "Thesis Project", description: "Full-stack price tracking platform monitoring apparel prices and reviews from Amazon and Lazada via automated web scraping. Dashboard to visualize price history and trends.", tech: ["Next.js", "TypeScript", "Node.js", "MongoDB"], github: "https://github.com/ralph12322/tracktag", demo: "https://tracktag-production.up.railway.app/", accent: "#2dd4bf", num: "01" },
  { title: "Spotify Clone", tag: "Hubby Project", description: "Responsive music streaming app inspired by Spotify's UI. Full audio upload, playback controls, playlist management, and cloud-hosted media via Cloudinary.", tech: ["React", "Node.js", "JavaScript", "Tailwind CSS", "Cloudinary", "MongoDB"], github: "https://github.com/ralph12322/Spotify-Clone", demo: "https://lindsaaayspoti.vercel.app/", accent: "#14b8a6", num: "02" },
  { title: "EmoVOX", tag: "Baby-Thesis", description: "Emotion-aware translation app integrating speech-to-text, text-to-speech, and real-time emotion detection to enhance how people communicate.", tech: ["React", "Node.js", "Express", "Tailwind CSS"], github: "#", demo: "https://emovox.vercel.app/", accent: "#5eead4", num: "03" }
];

const timeline: TimelineItem[] = [
  { year: "2026", title: "Fullstack Web Developer Intern", company: "Jurisprudence Application Services", description: "Built Paysync — a payroll automation system designed for accountants.", accent: "#2dd4bf" },
  { year: "2025", title: "Thesis Defense", company: "University", description: "Defended TrackTag successfully. Earned commendation from the panel.", accent: "#99f6e4" },
  { year: "2024", title: "Baby-Thesis Completion", company: "University Lab", description: "Shipped EmoVOX as a collaborative AI + speech processing research project.", accent: "#5eead4" },
  { year: "2023", title: "Went Deep into Full-Stack", company: "Self-taught", description: "Immersed in the MERN stack, built multiple personal projects, sharpened TypeScript skills.", accent: "#14b8a6" },
  { year: "2022", title: "CS Journey Begins", company: "University", description: "First lines of Python and JavaScript. Fell in love with programming from day one.", accent: "#0d9488" },
];

const interests: Interest[] = [
  { category: "Music", icon: <Music style={{ width: 18, height: 18 }} />, accent: "#2dd4bf", description: "Music is woven into my day — OPM when I need to feel something, lo-fi when I need to focus.", items: [{ label: "OPM / Filipino Music", sub: "Ben&Ben, IV of Spades, Cup of Joe, SB19" }, { label: "Lo-fi / Chill", sub: "Late-night coding sessions and deep focus" }, { label: "Bedroom Pop", sub: "Soft, dreamy vibes for any mood" }, { label: "Acoustic Sets", sub: "Raw, stripped-back and emotional" }] },
  { category: "Film & Shows", icon: <Film style={{ width: 18, height: 18 }} />, accent: "#14b8a6", description: "A good story gets me every time — emotional anime arcs, slow-burn romances, high-stakes thrillers.", items: [{ label: "Anime", sub: "AOT, Haikyuu, Vinland Saga, Demon Slayer" }, { label: "Romance / Drama", sub: "Kilig moments and emotional gut punches" }, { label: "Action / Thriller", sub: "Edge-of-seat tension and satisfying payoffs" }, { label: "Slice of Life", sub: "Calm, relatable, oddly comforting" }] },
  { category: "Gaming", icon: <Gamepad2 style={{ width: 18, height: 18 }} />, accent: "#5eead4", description: "My go-to unwind — anything with a great story or competitive depth, mobile or PC.", items: [{ label: "Story-Driven RPGs", sub: "Deep lore and memorable characters" }, { label: "Battle Royale / FPS", sub: "When it's time to go sweaty mode" }, { label: "Indie Gems", sub: "Surprising, creative, underrated finds" }, { label: "Mobile Games", sub: "Quick sessions on the go" }] }
];

const skills: Record<string, { label: string; icon: ReactNode }[]> = {
  "Languages": [{ label: "Python", icon: <Code2 size={13} /> }, { label: "JavaScript", icon: <Code2 size={13} /> }, { label: "TypeScript", icon: <Code2 size={13} /> }],
  "Web": [{ label: "React", icon: <Layers size={13} /> }, { label: "Next.js", icon: <Layers size={13} /> }, { label: "Node.js", icon: <Layers size={13} /> }, { label: "Express", icon: <Layers size={13} /> }],
  "Database": [{ label: "MongoDB", icon: <Database size={13} /> }],
  "Tools": [{ label: "Git", icon: <Terminal size={13} /> }, { label: "GitHub", icon: <Terminal size={13} /> }, { label: "Vercel", icon: <Terminal size={13} /> }, { label: "Railway", icon: <Terminal size={13} /> }]
};

const roadmap = [
  { phase: "Start · 2022", label: "Curiosity", desc: "Python & HTML/CSS", status: "done", accent: "#0d9488" },
  { phase: "2023", label: "Foundation", desc: "MERN stack mastery", status: "done", accent: "#14b8a6" },
  { phase: "2024", label: "Shipped Projects", desc: "EmoVOX & full-stack apps", status: "done", accent: "#5eead4" },
  { phase: "2025", label: "Impact", desc: "Thesis + Internship ready", status: "done", accent: "#99f6e4" },
  { phase: "2026+", label: "Growth", desc: "Next.js, TypeScript, DevOps, Internship", status: "active", accent: "#2dd4bf" },
  { phase: "Future", label: "Vision", desc: "Senior Engineer & Mentor", status: "future", accent: "#0d9488" },
];

const interestTiles = [
  { label: "Music & OPM", sub: "Ben&Ben, lo-fi, acoustic", icon: <Music />, color: "#2dd4bf", bg: "#0d2424" },
  { label: "Anime & Film", sub: "AOT, Haikyuu, slice of life", icon: <Clapperboard />, color: "#14b8a6", bg: "#0a1f1f" },
  { label: "Gaming", sub: "RPGs, FPS, mobile games", icon: <Gamepad2 />, color: "#5eead4", bg: "#0a1f1f" },
  { label: "Coding", sub: "Side projects & learning", icon: <SquareChevronRight />, color: "#0d9488", bg: "#0d2424" },
];

export default function Portfolio() {
  const [panel, setPanel] = useState<string | null>(null);
  const [activeInterest, setActiveInterest] = useState(0);
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const [hoveredTile, setHoveredTile] = useState<number | null>(null);
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const { theme } = useTheme();
  const isLight = theme === "light";

  /* card style uses CSS vars so it flips automatically */
  const card: React.CSSProperties = {
    background: "var(--bg-card)",
    border: "1px solid var(--border-default)",
    borderRadius: 12,
    overflow: "hidden",
  };

  const scrollTo = (id: string) => { document.querySelector(id)?.scrollIntoView({ behavior: "smooth" }); setActiveNav("Contact"); };
  const open = (name: string) => { setPanel(name); setActiveNav(name.charAt(0).toUpperCase() + name.slice(1)); };
  const close = () => { setPanel(null); setActiveNav(null); };

  const navItems = [
    { label: "About", action: () => open("about") },
    { label: "Projects", action: () => open("projects") },
    { label: "Experience", action: () => open("experience") },
    { label: "Interests", action: () => open("interests") },
    { label: "Contact", action: () => scrollTo("#contact") },
  ];

  /* ── Layout styles ── */
  const rootGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : isTablet ? "220px 1fr" : "300px 1fr",
    gap: isMobile ? 10 : 12,
    alignItems: "start",
  };

  const colLeftStyle: React.CSSProperties = {
    display: "flex", flexDirection: "column", gap: 10, minWidth: 0, width: "100%",
    ...(isDesktop
      ? { position: "sticky", top: 78, maxHeight: "calc(100vh - 92px)", overflowY: "auto", scrollbarWidth: "none" as const }
      : { position: "static", maxHeight: "none", overflowY: "visible" }),

  };

  const photoCardStyle: React.CSSProperties = {
    ...card, position: "relative",
    ...(isMobile ? { height: "56vw", minHeight: 220, maxHeight: 340 } : { aspectRatio: "3/3.8" }),
  };

  const midRowStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 1fr",
    gap: 12,
  };

  const projMiniGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)",
    gap: 10,
  };

  const tileGridStyle: React.CSSProperties = {
    display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8,
  };

  const panelAboutGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: isMobile ? 24 : 40, alignItems: "start",
  };

  const panelInterestsGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: isMobile ? 20 : 40, alignItems: "start",
  };

  const panelProjRowStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "52px 1fr auto",
    gap: isMobile ? 10 : 20, padding: "22px 0",
    borderBottom: "1px solid var(--border-default)",
    alignItems: "start", transition: "opacity 0.2s",
  };

  const panelExpRowStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "88px 1fr",
    gap: isMobile ? 6 : 20, padding: "20px 0",
    borderBottom: "1px solid var(--border-default)",
    transition: "opacity 0.2s",
  };

  /* Light-mode tile bg is a warm tinted surface instead of dark green */
  const tileBg = (darkBg: string) => isLight ? "var(--bg-hover)" : darkBg;

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: "var(--bg-page)", color: "var(--text-secondary)", minHeight: "100vh", }}>
      <ShootingStars />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />

      <Navbar navItems={navItems} activeNav={activeNav} />

      {/* Spacer */}
      <div style={{ paddingTop: 64, background: "var(--bg-page)", }} />

      <main style={{ maxWidth: 1380, margin: "0 auto", padding: isMobile ? "12px 10px 0" : "14px clamp(10px,3vw,16px) 0" }}>
        <div style={rootGridStyle}>

          {/* ══ LEFT COLUMN ══ */}
          <div style={colLeftStyle}>

            {/* Photo card */}
            <div style={photoCardStyle}>
              <img src="./heroMe.jfif" alt="Ralph Geo Santos" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
              <div style={{ position: "absolute", top: 10, left: 10, right: 10, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
                <LiveClock /><VisitorCount />
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(to top,var(--bg-card),transparent)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: 14, left: 16, right: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--accent)", fontFamily: "'JetBrains Mono',monospace", marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", animation: "pulse 2s infinite", flexShrink: 0 }} />
                  Open to Opportunities
                </div>
                <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(18px,3vw,26px)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2, letterSpacing: "-0.5px" }}>
                  Ralph Geo <span style={{ color: "var(--accent)", fontStyle: "italic" }}>Santos</span>
                </h1>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>4th Year CS · Full-Stack Developer</div>
              </div>
            </div>

            {/* Blurb */}
            <Reveal>
              <div style={{ ...card, padding: "13px 14px" }}>
                <p style={{ fontSize: "clamp(11px,1.2vw,13px)", color: "var(--text-muted)", lineHeight: 1.75 }}>
                  A Philippines-based <span style={{ color: "var(--accent)", fontWeight: 600 }}>4th-year CS student</span> building scalable web apps — from price trackers to music platforms. MERN stack is my comfort zone.
                </p>
              </div>
            </Reveal>

            {/* Role badge */}
            <Reveal>
              <div style={{ ...card, padding: "11px 13px", display: "flex", alignItems: "center", gap: 11 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--bg-hover)", border: "1px solid var(--border-strong)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Layers size={15} color="var(--accent)" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 1 }}>Fullstack Dev Intern</div>
                  <div style={{ fontSize: 10, color: "var(--text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Jurisprudence Application Services</div>
                </div>
              </div>
            </Reveal>
            <Reveal>
              <SpotifyWidget />
            </Reveal>

            {/* Skills */}
            <div style={{ minWidth: 0, width: "100%" }}>
              <SkillsBubble />
            </div>
            {/* Socials */}
            <Reveal>
              <div style={{ ...card, padding: "11px 13px", display: "flex", gap: 6 }}>
                {[
                  { href: "https://github.com/ralph12322", icon: <Github size={14} />, label: "GitHub" },
                  { href: "https://www.linkedin.com/in/ralph-geo-santos-49226b281/", icon: <Linkedin size={14} />, label: "LinkedIn" },
                  { href: "mailto:gjcshs.santos.ralphgeo@gmail.com", icon: <Mail size={14} />, label: "Email" },
                  { href: "https://www.facebook.com/ralph.santos.620659/", icon: <Facebook size={14} />, label: "FB" },
                  { href: "https://www.instagram.com/depapelpluma/?hl=en", icon: <Instagram size={14} />, label: "IG" },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "7px 3px", background: "var(--bg-card-inner)", border: "1px solid var(--border-subtle)", borderRadius: 8, color: "var(--text-faint)", fontSize: 8, fontWeight: 700, letterSpacing: 0.5, transition: "color 0.2s, border-color 0.2s", minWidth: 0 }}
                    onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "var(--text-faint)"; e.currentTarget.style.borderColor = "var(--border-subtle)"; }}>
                    {s.icon}
                    <span style={{ textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>{s.label}</span>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div style={{
            maxHeight: "calc(100vh - 92px)",
            overflowY: "auto",
            scrollbarWidth: "none",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0, paddingBottom: 48 }}>

              {/* Tagline */}
              <Reveal>
                <div style={{ ...card, padding: "clamp(14px,2vw,18px) clamp(14px,2vw,20px)" }}>
                  <p style={{ fontSize: "clamp(12px,1.4vw,16px)", color: "var(--text-muted)", lineHeight: 1.75 }}>
                    Building at the intersection of <span style={{ color: "var(--accent)", fontWeight: 600 }}>full-stack engineering</span>, clean UI, and <span style={{ color: "var(--accent-dim)", fontWeight: 600 }}>developer experience</span> — crafting apps that are fast, scalable, and genuinely useful.
                  </p>
                </div>
              </Reveal>

              {/* Experience + Roadmap */}
              <div style={midRowStyle}>
                <Reveal>
                  <div style={{ ...card, padding: "15px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "var(--text-faint)" }}>Experience</div>
                      <button onClick={() => open("experience")} style={{ fontSize: 9, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, display: "flex", alignItems: "center", gap: 2, letterSpacing: 1, textTransform: "uppercase", flexShrink: 0 }}>Full <ArrowUpRight size={9} /></button>
                    </div>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: 6, top: 8, bottom: 8, width: 1, background: "var(--border-default)" }} />
                      {[
                        { period: "2026–Now", title: "Fullstack Dev Intern", co: "Jurisprudence App. Services", accent: "#2dd4bf" },
                        { period: "2025", title: "Thesis Defense", co: "University · TrackTag", accent: "#99f6e4" },
                        { period: "2022–26", title: "B.S. Computer Science", co: "University", accent: "#0d9488" },
                      ].map((item, i) => (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "18px 1fr", gap: 9, marginBottom: i < 2 ? 13 : 0 }}>
                          <div style={{ display: "flex", justifyContent: "center", paddingTop: 2 }}>
                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: item.accent, border: "2px solid var(--bg-page)", zIndex: 1, boxShadow: `0 0 0 2px ${item.accent}25`, flexShrink: 0 }} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 9, color: "var(--text-ghost)", fontFamily: "'JetBrains Mono',monospace", marginBottom: 2 }}>{item.period}</div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 1 }}>{item.title}</div>
                            <div style={{ fontSize: 10, color: item.accent, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.co}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>

                <Reveal>
                  <div style={{ ...card, padding: "15px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "var(--text-faint)" }}>Journey Roadmap</div>
                      <span style={{ fontSize: 9, color: "var(--text-dead)", fontStyle: "italic", fontFamily: "'Playfair Display',serif", flexShrink: 0 }}>Aspirational</span>
                    </div>
                    <div style={{ position: "relative", paddingLeft: 8 }}>
                      <div style={{ position: "absolute", left: 8, top: 5, bottom: 5, width: 2, background: "linear-gradient(to bottom,#0d9488,#14b8a6,#2dd4bf,#5eead4,#99f6e4,#ccfbf1)", borderRadius: 2, opacity: 0.3 }} />
                      {roadmap.map((step, i) => (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: 7, marginBottom: i < roadmap.length - 1 ? 9 : 0 }}>
                          <div style={{ display: "flex", justifyContent: "center", paddingTop: 1, zIndex: 1 }}>
                            {step.status === "done" ? (
                              <div style={{ width: 12, height: 12, borderRadius: "50%", background: step.accent, border: "2px solid var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <CheckCircle2 size={6} color="var(--bg-page)" strokeWidth={3} />
                              </div>
                            ) : step.status === "active" ? (
                              <div style={{ width: 12, height: 12, borderRadius: "50%", background: step.accent, border: "2px solid var(--bg-page)", animation: "roadPulse 2s infinite", flexShrink: 0 }} />
                            ) : (
                              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "transparent", border: `2px solid ${step.accent}30`, flexShrink: 0 }} />
                            )}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 8, fontFamily: "'JetBrains Mono',monospace", color: "var(--text-dead)" }}>{step.phase}</div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: step.status === "future" ? "var(--text-dead)" : "var(--text-secondary)" }}>{step.label}</div>
                            <div style={{ fontSize: 9, color: step.status === "future" ? "var(--border-default)" : "var(--text-ghost)" }}>{step.desc}</div>
                            {step.status === "active" && (
                              <div style={{ marginTop: 2, display: "inline-flex", alignItems: "center", gap: 3, background: step.accent + "18", padding: "1px 5px", borderRadius: 6, fontSize: 7, fontWeight: 700, color: step.accent, letterSpacing: 1 }}>
                                <Zap size={6} style={{ animation: "pulse 1.5s infinite" }} /> NOW
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* GitHub contributions card */}
              <Reveal>
                <div style={{ ...card, padding: "13px 15px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "var(--text-faint)" }}>GitHub Contributions</div>
                    <a href="https://github.com/ralph12322" target="_blank" rel="noopener noreferrer" style={{ fontSize: 9, color: "var(--accent)", fontWeight: 700, display: "flex", alignItems: "center", gap: 3, letterSpacing: 1, textTransform: "uppercase", flexShrink: 0 }}>
                      Live <ArrowUpRight size={9} />
                    </a>
                  </div>
                  {isMobile && <GitHubStats username="ralph12322" />}
                  <div style={{ background: "var(--bg-card-inner)", border: "1px solid var(--border-subtle)", borderRadius: 7, padding: "8px 6px", marginBottom: 10, overflow: "hidden" }}>
                    <img src="https://ghchart.rshah.org/2dd4bf/ralph12322" alt="GitHub contributions" style={{ width: "100%", display: "block", borderRadius: 3 }} />
                  </div>
                  <GitHubStats username="ralph12322" />
                </div>
              </Reveal>

              {/* Projects mini-grid */}
              <Reveal>
                <div style={{ ...card, padding: "13px 15px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "var(--text-faint)" }}>Projects</div>
                    <button onClick={() => open("projects")} style={{ fontSize: 9, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, display: "flex", alignItems: "center", gap: 2, letterSpacing: 1, textTransform: "uppercase", flexShrink: 0 }}>
                      All <ArrowUpRight size={9} />
                    </button>
                  </div>
                  <div style={projMiniGridStyle}>
                    {projects.map((p, i) => (
                      <div key={i}
                        style={{ background: "var(--bg-card-inner)", border: "1px solid var(--border-subtle)", borderTop: `2px solid ${p.accent}`, borderRadius: 9, padding: "12px", transition: "transform 0.2s, border-color 0.2s", cursor: "default" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.borderColor = p.accent; }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLDivElement).style.transform = ""; // ← empty string, not "translateY(0)"
                          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-subtle)";
                        }}>
                        <div style={{ fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: p.accent, fontWeight: 700, marginBottom: 4, fontFamily: "'JetBrains Mono',monospace" }}>{p.tag}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 5, fontFamily: "'Playfair Display',serif" }}>{p.title}</div>
                        <div style={{ fontSize: 10, color: "var(--text-ghost)", lineHeight: 1.5, marginBottom: 8 }}>{p.description.slice(0, 85)}…</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 9 }}>
                          {p.tech.slice(0, 3).map(t => <span key={t} style={{ padding: "2px 5px", borderRadius: 3, fontSize: 8, fontFamily: "'JetBrains Mono',monospace", background: "var(--bg-hover)", color: "var(--text-ghost)", border: "1px solid var(--border-strong)" }}>{t}</span>)}
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                          {p.github !== "#" && (
                            <a href={p.github} target="_blank" rel="noopener noreferrer"
                              style={{ fontSize: 10, color: "var(--text-faint)", display: "flex", alignItems: "center", gap: 3, fontWeight: 600, transition: "color 0.2s" }}
                              onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
                              onMouseLeave={e => e.currentTarget.style.color = "var(--text-faint)"}>
                              <Github size={10} /> Code
                            </a>
                          )}
                          <a href={p.demo} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: 10, color: p.accent, display: "flex", alignItems: "center", gap: 3, fontWeight: 600, transition: "opacity 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                            <ExternalLink size={10} /> Demo
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Interest tiles */}
              <Reveal>
                <div style={{ ...card, padding: "13px 15px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 11 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "var(--text-faint)" }}>Thing I'm Interested</div>
                    <button onClick={() => open("interests")} style={{ fontSize: 9, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, display: "flex", alignItems: "center", gap: 2, letterSpacing: 1, textTransform: "uppercase", flexShrink: 0 }}>
                      Interests &amp; Fun <ArrowUpRight size={9} />
                    </button>
                  </div>
                  <div style={tileGridStyle}>
                    {interestTiles.map((tile, i) => (
                      <div key={i} onClick={() => open("interests")}
                        style={{ background: hoveredTile === i ? tileBg(tile.bg) : "var(--bg-card-inner)", border: `1px solid ${hoveredTile === i ? tile.color + "45" : "var(--border-subtle)"}`, borderRadius: 9, padding: "11px 9px", cursor: "pointer", transition: "all 0.2s", transform: hoveredTile === i ? "translateY(-2px)" : undefined }}
                        onMouseEnter={() => setHoveredTile(i)} onMouseLeave={() => setHoveredTile(null)}>
                        <div style={{ fontSize: 17, marginBottom: 5, color: hoveredTile === i ? tile.color : "var(--text-faint)", transition: "color 0.2s" }}>{tile.icon}</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: hoveredTile === i ? tile.color : "var(--text-muted)", marginBottom: 2, transition: "color 0.2s" }}>{tile.label}</div>
                        <div style={{ fontSize: 8, color: "var(--text-dead)", lineHeight: 1.4 }}>{tile.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* ══ CONTACT ══ */}
              <section id="contact" style={{ padding: "clamp(36px,6vw,56px) clamp(16px,4vw,20px)", background: "var(--contact-bg)", borderTop: "1px solid var(--border-subtle)", borderRadius: 9 }}>
                <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
                  <div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "var(--text-faint)", fontWeight: 700, marginBottom: 12 }}>CONTACT</div>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(22px,6vw,44px)", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-1.5px", marginBottom: 12, lineHeight: 1.1 }}>
                    Let&apos;s build<br /><span style={{ color: "var(--accent)", fontStyle: "italic" }}>something together</span>
                  </h2>
                  <p style={{ fontSize: "clamp(12px,1.5vw,13px)", color: "var(--text-faint)", lineHeight: 1.8, marginBottom: 28 }}>Open to internship opportunities, collaborations, and interesting conversations.</p>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 24, flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center" }}>
                    <a href="https://mail.google.com/mail/?view=cm&to=gjcshs.santos.ralphgeo@gmail.com"
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: "var(--accent)", color: isLight ? "#fff" : "#0a0908", padding: "10px 22px", borderRadius: 7, fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>
                      <Mail size={13} /> Send a message
                    </a>
                    <a href="https://www.facebook.com/ralph.santos.620659/"
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: "transparent", color: "var(--text-muted)", padding: "10px 22px", borderRadius: 7, fontSize: 12, fontWeight: 600, border: "1px solid var(--border-strong)", fontFamily: "inherit" }}>
                      <Facebook size={13} /> Facebook
                    </a>
                  </div>
                  <p style={{ color: "var(--text-ghost)", fontSize: 11, borderTop: "1px solid var(--border-subtle)", paddingTop: 20, wordBreak: "break-all" }}>gjcshs.santos.ralphgeo@gmail.com</p>
                </div>
              </section>

              <div style={{ textAlign: "center", padding: "20px 0 8px", borderTop: "1px solid var(--border-subtle)" }}>
                <p style={{ color: "var(--text-dead)", fontSize: 11 }}>© 2025 Ralph Geo Santos</p>
              </div>
            </div>





          </div>
        </div>
      </main>



      {/* ══ PANELS ══ */}

      {/* About */}
      <Panel open={panel === "about"} onClose={close}>
        <PanelHeader label="01 / About" title="Who I" italic="Am" onClose={close} />
        <div style={{ flex: 1, overflowY: "auto", padding: "clamp(16px,3vw,44px) clamp(14px,4vw,48px)" }}>
          <div style={panelAboutGridStyle}>
            <div>
              <p style={{ fontSize: "clamp(12px,1.4vw,16px)", color: "var(--text-muted)", lineHeight: 1.9, marginBottom: 20 }}>
                I&apos;m a <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>fourth-year CS student</span> who loves building things that work well and look clean. I specialize in full-stack development — REST APIs, MVC architecture, and modern JS frameworks.
              </p>
              <p style={{ fontSize: "clamp(11px,1.2vw,14px)", color: "var(--text-faint)", lineHeight: 1.85 }}>
                Currently looking for an internship where I can contribute to real engineering problems and keep growing as a developer.
              </p>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,7vw,88px)", fontWeight: 700, color: "var(--border-default)", lineHeight: 1, marginTop: 28, letterSpacing: "-4px", userSelect: "none" }}>CS<span style={{ color: "var(--accent)" }}>.</span></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {Object.entries(skills).map(([cat, items]) => (
                <div key={cat}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "var(--text-ghost)", marginBottom: 9, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 12, height: 1, background: "var(--text-ghost)", flexShrink: 0 }} />{cat}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {items.map(s => (
                      <span key={s.label}
                        style={{ padding: "5px 11px", background: "var(--bg-hover)", borderRadius: 5, fontSize: 12, color: "var(--text-muted)", fontWeight: 500, border: "1px solid var(--border-strong)", cursor: "default", display: "flex", alignItems: "center", gap: 5, transition: "color 0.2s, border-color 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}>
                        {s.icon}{s.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      {/* Projects */}
      <Panel open={panel === "projects"} onClose={close}>
        <PanelHeader label="02 / Projects" title="Things I've" italic="Shipped" onClose={close} />
        <div style={{ flex: 1, overflowY: "auto", padding: "clamp(14px,3vw,40px) clamp(14px,4vw,48px)" }}>
          {projects.map((p, i) => (
            <div key={i} style={panelProjRowStyle}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.65")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              {!isMobile && <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "var(--text-dead)", fontWeight: 700, paddingTop: 2 }}>{p.num}</div>}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: p.accent, fontWeight: 700, marginBottom: 5 }}>{p.tag}</div>
                <h3 style={{ fontSize: "clamp(14px,2.5vw,22px)", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px", margin: "0 0 9px", fontFamily: "'Playfair Display',serif" }}>{p.title}</h3>
                <p style={{ fontSize: "clamp(11px,1.2vw,13px)", color: "var(--text-faint)", lineHeight: 1.7, margin: "0 0 12px", maxWidth: 480 }}>{p.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {p.tech.map(t => <span key={t} style={{ padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace", background: "var(--bg-hover)", color: "var(--text-faint)", border: "1px solid var(--border-strong)" }}>{t}</span>)}
                </div>
                {isMobile && (
                  <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
                    {p.github !== "#" && <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-faint)", fontWeight: 600 }}><Github size={12} /> Code</a>}
                    <a href={p.demo} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: p.accent, fontWeight: 600 }}><ExternalLink size={12} /> Demo</a>
                  </div>
                )}
              </div>
              {!isMobile && (
                <div style={{ display: "flex", flexDirection: "column", gap: 9, paddingTop: 2, minWidth: 54 }}>
                  {p.github !== "#" && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-faint)", fontWeight: 600, transition: "color 0.2s", whiteSpace: "nowrap" }}
                      onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
                      onMouseLeave={e => e.currentTarget.style.color = "var(--text-faint)"}>
                      <Github size={12} /> Code
                    </a>
                  )}
                  <a href={p.demo} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: p.accent, fontWeight: 600, transition: "opacity 0.2s", whiteSpace: "nowrap" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    <ExternalLink size={12} /> Demo
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </Panel>

      {/* Experience */}
      <Panel open={panel === "experience"} onClose={close}>
        <PanelHeader label="03 / Experience" title="The" italic="Journey" onClose={close} />
        <div style={{ flex: 1, overflowY: "auto", padding: "clamp(14px,3vw,40px) clamp(14px,4vw,48px)" }}>
          {timeline.map((item, i) => (
            <div key={i} style={panelExpRowStyle}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.65"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              <div style={{ paddingTop: 3, flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", padding: "4px 9px", background: `${item.accent}18`, color: item.accent, borderRadius: 4, border: `1px solid ${item.accent}30`, display: "inline-block" }}>{item.year}</span>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "var(--text-ghost)", fontWeight: 700, marginBottom: 5 }}>{item.company}</div>
                <h3 style={{ fontSize: "clamp(13px,2vw,19px)", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.3px", margin: "0 0 7px", fontFamily: "'Playfair Display',serif" }}>{item.title}</h3>
                <p style={{ fontSize: "clamp(11px,1.2vw,13px)", color: "var(--text-faint)", lineHeight: 1.7, maxWidth: 480 }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Interests */}
      <Panel open={panel === "interests"} onClose={close}>
        <PanelHeader label="04 / Interests" title="Beyond the" italic="Code" onClose={close} />
        <div style={{ display: "flex", padding: "0 clamp(14px,4vw,48px)", borderBottom: "1px solid var(--border-default)", flexShrink: 0, overflowX: "auto", scrollbarWidth: "none" }}>
          {interests.map((b, i) => (
            <button key={i} onClick={() => setActiveInterest(i)}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "clamp(11px,1.3vw,12px)", fontWeight: 600, padding: "12px clamp(10px,2vw,16px)", color: activeInterest === i ? "var(--text-primary)" : "var(--text-ghost)", borderBottom: activeInterest === i ? `2px solid ${b.accent}` : "2px solid transparent", transition: "color 0.2s", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
              <span style={{ color: activeInterest === i ? b.accent : "var(--text-ghost)", transition: "color 0.2s", display: "flex" }}>{b.icon}</span>{b.category}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "clamp(14px,3vw,40px) clamp(14px,4vw,48px)" }}>
          {interests.map((b, i) => (
            <div key={i} style={{ ...panelInterestsGridStyle, display: activeInterest === i ? "grid" : "none" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 18, color: b.accent }}>{b.icon}<span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>{b.category}</span></div>
                <p style={{ fontSize: "clamp(12px,1.4vw,16px)", color: "var(--text-muted)", lineHeight: 1.85 }}>{b.description}</p>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,7vw,80px)", fontWeight: 700, color: "var(--border-default)", lineHeight: 1, marginTop: 28, letterSpacing: "-3px", userSelect: "none" }}>
                  {b.category.split(" ")[0]}<span style={{ color: b.accent }}>.</span>
                </div>
              </div>
              <div>
                {b.items.map((item, j) => (
                  <div key={j}
                    style={{ padding: "14px 0", borderBottom: "1px solid var(--border-default)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, cursor: "default", transition: "opacity 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.55"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 3 }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: "var(--text-ghost)" }}>{item.sub}</div>
                    </div>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: b.accent, flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <MusicPlayer />
    </div>
  );
}