'use client';
import { useState, useEffect, ReactNode } from "react";
import {
  Github, Linkedin, Mail, Facebook, ExternalLink,
  Music, Film, Gamepad2, X, ArrowUpRight,
  Zap, Code2, Layers, Database,
  Terminal, CheckCircle2, Instagram, Clapperboard, SquareChevronRight,
} from "lucide-react";
import { createPortal } from "react-dom";
import Navbar from "./components/Navbar";
import MusicPlayer from "./components/MusicPlayer";
import SkillsBubble from "./components/SkillCarousel";
import ShootingStars from "./components/Shootingstars";
import { useTheme } from "./components/Themeprovider";
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
    const fetchData = async () => {
      try {
        const [githubRes, contributionsRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://github-contributions-api.jogruber.de/v4/${username}`),
        ]);

        const githubData = await githubRes.json();
        const contributionsData = await contributionsRes.json();

        setRepos(String(githubData.public_repos ?? "—"));

        const total = Object.values(contributionsData.total as Record<string, number>)
          .reduce((a, v) => a + v, 0);
        setContributions(String(total));

      } catch (error) {
        setRepos("—");
        setContributions("—");
      }
    };

    fetchData();
  }, [username]);
  return (
    <div className="flex gap-2 mb-2.5">
      {[{ label: "PUBLIC REPOS", value: repos }, { label: "CONTRIBUTIONS", value: contributions }].map((s, i) => (
        <div key={i} className="flex-1 bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] rounded-lg p-[9px_11px]">
          <div className="text-[8px] font-bold tracking-[2px] text-white mb-[3px] font-mono">{s.label}</div>
          <div className="text-xl font-bold text-[var(--accent)] font-mono tracking-[-1px]">{s.value}</div>
        </div>
      ))}
    </div>
  );
}

function Reveal({ children, style = {} }: { children: ReactNode; style?: React.CSSProperties }) {
  return <div className="min-w-0" style={style}>{children}</div>;
}

function Panel({ open, onClose, children }: PanelProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  if (!mounted) return null;
  return createPortal(
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[998] bg-black/60 transition-opacity duration-[350ms] ${open ? "opacity-100 pointer-events-auto backdrop-blur-md" : "opacity-0 pointer-events-none"}`}
      />
      <div className={`panel-drawer ${open ? "open" : ""}`}>
        {children}
      </div>
    </>,
    document.body
  );
}

function PanelHeader({ label, title, italic, onClose }: PanelHeaderProps) {
  return (
    <div className="px-[clamp(14px,4vw,48px)] pt-[clamp(14px,3vw,36px)] pb-[18px] border-b border-[var(--border-default)] flex-shrink-0 flex justify-between items-start">
      <div className="min-w-0 flex-1">
        <div className="text-[10px] tracking-[4px] uppercase text-[var(--text-faint)] font-bold mb-2">{label}</div>
        <h2 className="font-serif text-[clamp(20px,4vw,44px)] font-bold text-[var(--text-primary)] tracking-[-1px] m-0 leading-[1.1]">
          {title}{italic && <span className="text-[var(--accent)] italic"> {italic}</span>}
        </h2>
      </div>
      <button className="close-btn" onClick={onClose} aria-label="Close panel">
        <X className="w-4 h-4 text-[var(--text-muted)]" />
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
  return (
    <div className="flex items-center gap-1">
      <div className="w-[5px] h-[5px] rounded-full bg-[var(--accent)] flex-shrink-0 animate-pulse" />
      <span className="font-mono text-xs text-[var(--text-muted)] tracking-wide">{time}</span>
    </div>

  );
}

function VisitorCount() {
  return (
    <div className="inline-flex items-center gap-[5px]">
      <img
        src="https://api.visitorbadge.io/api/visitors?path=github.com%2Fralph12322&labelColor=%23000000&countColor=%232dd4bf&style=flat"
        alt="visitors"
        className="h-4"
      />
    </div>
  );
}

const projects: Project[] = [
  {
    title: "TrackTag",
    tag: "Thesis Project",
    description: "Full-stack price tracking platform monitoring apparel prices and reviews from Amazon and Lazada via automated web scraping. Dashboard to visualize price history and trends.",
    tech: ["Next.js", "TypeScript", "Node.js", "MongoDB"],
    github: "https://github.com/ralph12322/tracktag",
    demo: "https://tracktag-production.up.railway.app/",
    accent: "#2dd4bf", num: "01"
  },
  {
    title: "Spotify Clone",
    tag: "Hubby Project",
    description: "Responsive music streaming app inspired by Spotify's UI. Full audio upload, playback controls, playlist management, and cloud-hosted media via Cloudinary.",
    tech: ["React", "Node.js", "JavaScript", "Tailwind CSS", "Cloudinary", "MongoDB"],
    github: "https://github.com/ralph12322/Spotify-Clone",
    demo: "https://lindsaaayspoti.vercel.app/",
    accent: "#14b8a6", num: "02"
  },
  {
    title: "EmoVOX",
    tag: "Baby-Thesis",
    description: "Emotion-aware translation app integrating speech-to-text, text-to-speech, and real-time emotion detection to enhance how people communicate.",
    tech: ["React", "Node.js", "Express", "Tailwind CSS"],
    github: "#", demo: "https://emovox.vercel.app/",
    accent: "#5eead4", num: "03"
  },
  {
    title: "BingeGazette",
    tag: "Project",
    description: "Built a Youtube video player without ads, by embedding videos using youtube api",
    tech: ["Next.js", "Tailwind CSS", "Supabase"],
    github: "https://github.com/ralph12322/psite", demo: "https://bingewatcher.vercel.app/",
    accent: "#5eead4", num: "04"
  },
  {
    title: "Pokemon Fetch",
    tag: "Project",
    description: "Built a Youtube video player without ads, by embedding videos using youtube api",
    tech: ["HTML", "CSS", "Javascript"],
    github: "https://github.com/ralph12322/PokemonFetch", demo: "https://pokemon-fetch-black.vercel.app/",
    accent: "#5eead4", num: "05"
  }
];

const timeline: TimelineItem[] = [
  { year: "2026", title: "Fullstack Web Developer Intern", company: "Jurisprudence Application Services", description: "Built Paysync — a payroll automation system designed for accountants.", accent: "#2dd4bf" },
  { year: "2025", title: "Thesis Defense", company: "University", description: "Defended TrackTag successfully. Earned commendation from the panel.", accent: "#99f6e4" },
  { year: "2024", title: "Baby-Thesis Completion", company: "University Lab", description: "Shipped EmoVOX as a collaborative AI + speech processing research project.", accent: "#5eead4" },
  { year: "2023", title: "Went Deep into Full-Stack", company: "Self-taught", description: "Immersed in the MERN stack, built multiple personal projects, sharpened TypeScript skills.", accent: "#14b8a6" },
  { year: "2022", title: "CS Journey Begins", company: "University", description: "First lines of Python and JavaScript. Fell in love with programming from day one.", accent: "#0d9488" },
];

const interests: Interest[] = [
  { category: "Music", icon: <Music className="w-[18px] h-[18px]" />, accent: "#2dd4bf", description: "Music is woven into my day — OPM when I need to feel something, lo-fi when I need to focus.", items: [{ label: "OPM / Filipino Music", sub: "Ben&Ben, IV of Spades, Cup of Joe, Zack Tabudlo" }, { label: "Lo-fi / Chill", sub: "Late-night coding sessions and deep focus" }, { label: "Bedroom Pop", sub: "Soft, dreamy vibes for any mood" }, { label: "Acoustic Sets", sub: "Raw, stripped-back and emotional" }] },
  { category: "Film & Shows", icon: <Film className="w-[18px] h-[18px]" />, accent: "#14b8a6", description: "A good story gets me every time — emotional anime arcs, slow-burn romances, high-stakes thrillers.", items: [{ label: "Anime", sub: "AOT, Haikyuu, Vinland Saga, Demon Slayer" }, { label: "Romance / Drama", sub: "Kilig moments and emotional gut punches" }, { label: "Action / Thriller", sub: "Edge-of-seat tension and satisfying payoffs" }, { label: "Slice of Life", sub: "Calm, relatable, oddly comforting" }] },
  { category: "Gaming", icon: <Gamepad2 className="w-[18px] h-[18px]" />, accent: "#5eead4", description: "My go-to unwind — anything with a great story or competitive depth, mobile or PC.", items: [{ label: "Story-Driven RPGs", sub: "Deep lore and memorable characters" }, { label: "Battle Royale / FPS", sub: "When it's time to go sweaty mode" }, { label: "Indie Gems", sub: "Surprising, creative, underrated finds" }, { label: "Mobile Games", sub: "Quick sessions on the go" }] }
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

  const tileBg = (darkBg: string) => isLight ? "var(--bg-hover)" : darkBg;

  return (
    <div className="font-sans bg-[var(--bg-page)] text-[var(--text-secondary)] min-h-screen">
      <ShootingStars />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />

      <Navbar navItems={navItems} activeNav={activeNav} />

      {/* Spacer */}
      <div className="pt-16 bg-[var(--bg-page)]" />

      <main className={`max-w-[1380px] mx-auto ${isMobile ? "px-[10px] pt-3" : "px-[clamp(10px,3vw,16px)] pt-[14px]"}`}>
        {/* Root grid */}
        <div
          className="grid items-start gap-[10px] md:gap-3"
          style={{
            gridTemplateColumns: isMobile ? "1fr" : isTablet ? "220px 1fr" : "300px 1fr",
          }}
        >

          {/* ══ LEFT COLUMN ══ */}
          <div
            className="flex flex-col gap-[10px] min-w-0 w-full"
            style={isDesktop ? { position: "sticky", top: 78, maxHeight: "calc(100vh - 92px)", overflowY: "auto", scrollbarWidth: "none" } : {}}
          >

            {/* Photo card */}
            <div
              className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden relative"
              style={isMobile ? { height: "56vw", minHeight: 220, maxHeight: 340 } : { aspectRatio: "3/3.8" }}
            >
              <img
                src="./heroMe.jfif"
                alt="Ralph Geo Santos"
                className="w-full h-full object-cover object-top block"
              />
              {/* Top bar */}
              <div className="absolute top-[10px] left-[10px] right-[10px] flex justify-between items-center flex-wrap gap-1">
                <LiveClock /> <VisitorCount />
              </div>
              {/* Gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-[var(--bg-card)] to-transparent pointer-events-none" />
              {/* Name / title */}
              <div className="absolute bottom-[14px] left-4 right-4">
                <div className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--accent)] font-mono mb-[5px] flex items-center gap-[6px]">
                  <div className="w-[5px] h-[5px] rounded-full bg-[var(--accent)] animate-pulse flex-shrink-0" />
                  Open to Opportunities
                </div>
                <h1 className="font-serif text-[clamp(18px,3vw,26px)] font-bold text-[var(--text-primary)] leading-[1.2] tracking-[-0.5px]">
                  Ralph Geo <span className="text-[var(--accent)] italic">Santos</span>
                </h1>
                <div className="text-[11px] text-[var(--text-muted)] mt-[3px]">4th Year CS · Full-Stack Developer</div>
              </div>
            </div>

            {/* Blurb */}
            <Reveal>
              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden p-[13px_14px]">
                <p className="text-[clamp(11px,1.2vw,13px)] text-[var(--text-muted)] leading-[1.75]">
                  A Philippines-based <span className="text-[var(--accent)] font-semibold">4th-year CS student</span> building scalable web apps — from price trackers to music platforms. Expanding my knowledge overtime.
                </p>
              </div>
            </Reveal>

            {/* Role badge */}
            <Reveal>
              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden p-[11px_13px] flex items-center gap-[11px]">
                <div className="w-[34px] h-[34px] rounded-[9px] bg-[var(--bg-hover)] border border-[var(--border-strong)] flex items-center justify-center flex-shrink-0">
                  <Layers size={15} color="var(--accent)" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[var(--text-primary)] mb-[1px]">Fullstack Dev Intern</div>
                  <div className="text-[10px] text-[var(--text-faint)] overflow-hidden text-ellipsis whitespace-nowrap">Jurisprudence Application Services</div>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <SpotifyWidget />
            </Reveal>

            {/* Skills */}
            <div className="min-w-0 w-full">
              <SkillsBubble />
            </div>

            {/* Socials */}
            <Reveal>
              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden p-[11px_13px] flex gap-[6px]">
                {[
                  { href: "https://github.com/ralph12322", icon: <Github size={14} />, label: "GitHub" },
                  { href: "https://www.linkedin.com/in/ralph-geo-santos-49226b281/", icon: <Linkedin size={14} />, label: "LinkedIn" },
                  { href: "mailto:gjcshs.santos.ralphgeo@gmail.com", icon: <Mail size={14} />, label: "Email" },
                  { href: "https://www.facebook.com/ralph.santos.620659/", icon: <Facebook size={14} />, label: "FB" },
                  { href: "https://www.instagram.com/depapelpluma/?hl=en", icon: <Instagram size={14} />, label: "IG" },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex flex-col items-center gap-1 p-[7px_3px] bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-faint)] text-[8px] font-bold tracking-[0.5px] transition-colors duration-200 min-w-0 hover:text-[var(--accent)] hover:border-[var(--accent)]"
                  >
                    {s.icon}
                    <span className="uppercase overflow-hidden text-ellipsis whitespace-nowrap max-w-full">{s.label}</span>
                  </a>
                ))}
              </div>
            </Reveal>

            <div className="text-center py-5 border-t border-[var(--border-subtle)]">
              <p className="text-[#979797] text-[11px]">© 2025 Ralph Geo Santos</p>
            </div>
          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div
            className="min-w-0"
            style={{ maxHeight: "calc(100vh - 92px)", overflowY: "auto", scrollbarWidth: "none" }}
          >
            <div className="flex flex-col gap-3 min-w-0 pb-12">

              {/* Tagline */}
              <Reveal>
                <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden p-[clamp(14px,2vw,18px)_clamp(14px,2vw,20px)]">
                  <p className="text-[clamp(12px,1.4vw,16px)] text-[var(--text-muted)] leading-[1.75]">
                    Building at the intersection of <span className="text-[var(--accent)] font-semibold">full-stack engineering</span>, clean UI, and <span className="text-[var(--accent-dim)] font-semibold">developer experience</span> — crafting apps that are fast, scalable, and genuinely useful.
                  </p>
                </div>
              </Reveal>

              {/* Experience + Roadmap */}
              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 1fr" }}
              >
                {/* Experience mini */}
                <Reveal>
                  <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden p-[15px]">
                    <div className="flex justify-between items-center mb-[14px]">
                      <div className="text-[9px] font-bold tracking-[3px] uppercase text-[var(--text-faint)]">Experience</div>
                      <button
                        onClick={() => open("experience")}
                        className="text-[9px] text-[var(--accent)] bg-transparent border-none cursor-pointer font-bold flex items-center gap-[2px] tracking-wide uppercase flex-shrink-0 font-sans"
                      >
                        Full <ArrowUpRight size={9} />
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute left-[6px] top-2 bottom-2 w-px bg-[var(--border-default)]" />
                      {[
                        { period: "2026–Now", title: "Fullstack Dev Intern", co: "Jurisprudence App. Services", accent: "#2dd4bf" },
                        { period: "2025", title: "Thesis Defense", co: "University · TrackTag", accent: "#99f6e4" },
                        { period: "2022–26", title: "B.S. Computer Science", co: "University", accent: "#0d9488" },
                      ].map((item, i) => (
                        <div key={i} className="grid gap-[9px] mb-[13px] last:mb-0" style={{ gridTemplateColumns: "18px 1fr" }}>
                          <div className="flex justify-center pt-[2px] relative">
                            <div
                              className="w-3 h-3 rounded-full border-2 border-[var(--bg-page)] flex-shrink-0"
                              style={{ background: item.accent, boxShadow: `0 0 0 2px ${item.accent}25` }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[9px] text-white font-mono mb-[2px]">{item.period}</div>
                            <div className="text-xs font-bold text-[var(--text-primary)] mb-[1px]">{item.title}</div>
                            <div className="text-[10px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: item.accent }}>{item.co}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>

                {/* Roadmap */}
                <Reveal>
                  <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden p-[15px]">
                    <div className="flex justify-between items-center mb-[14px]">
                      <div className="text-[9px] font-bold tracking-[3px] uppercase text-[var(--text-faint)]">Journey Roadmap</div>
                      <span className="text-[9px] text-white italic font-serif flex-shrink-0">Aspirational</span>
                    </div>
                    <div className="relative pl-2">
                      <div className="absolute left-2 top-[5px] bottom-[5px] w-[2px] rounded-[2px] opacity-30" style={{ background: "linear-gradient(to bottom,#0d9488,#14b8a6,#2dd4bf,#5eead4,#99f6e4,#ccfbf1)" }} />
                      {roadmap.map((step, i) => (
                        <div key={i} className="grid gap-[7px] mb-[9px] last:mb-0" style={{ gridTemplateColumns: "20px 1fr" }}>
                          <div className="flex justify-center pt-[1px] relative">
                            {step.status === "done" ? (
                              <div className="w-3 h-3 rounded-full border-2 border-[var(--bg-page)] flex items-center justify-center flex-shrink-0" style={{ background: step.accent }}>
                                <CheckCircle2 size={6} color="var(--bg-page)" strokeWidth={3} />
                              </div>
                            ) : step.status === "active" ? (
                              <div className="w-3 h-3 rounded-full border-2 border-[var(--bg-page)] animate-pulse flex-shrink-0" style={{ background: step.accent }} />
                            ) : (
                              <div className="w-3 h-3 rounded-full bg-transparent flex-shrink-0" style={{ border: `2px solid ${step.accent}30` }} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[8px] font-mono text-[#b3b3b3]">{step.phase}</div>
                            <div className="text-[11px] font-bold" style={{ color: step.status === "future" ? "#fff" : "var(--text-secondary)" }}>{step.label}</div>
                            <div className="text-[9px] text-[#888]">{step.desc}</div>
                            {step.status === "active" && (
                              <div className="mt-[2px] inline-flex items-center gap-[3px] rounded-[6px] text-[7px] font-bold tracking-wide px-[5px] py-[1px]" style={{ background: step.accent + "18", color: step.accent }}>
                                <Zap size={6} className="animate-pulse" /> NOW
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* GitHub contributions */}
              <Reveal>
                <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden p-[13px_15px]">
                  <div className="flex justify-between items-center mb-[10px]">
                    <div className="text-[9px] font-bold tracking-[3px] uppercase text-[var(--text-faint)]">GitHub Contributions</div>
                    <a
                      href="https://github.com/ralph12322"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] text-[var(--accent)] font-bold flex items-center gap-[3px] tracking-wide uppercase flex-shrink-0"
                    >
                      Live <ArrowUpRight size={9} />
                    </a>
                  </div>
                  {isMobile && <GitHubStats username="ralph12322" />}
                  <div className="bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] rounded-[7px] p-[8px_6px] mb-[10px] overflow-hidden">
                    <img src="https://ghchart.rshah.org/2dd4bf/ralph12322" alt="GitHub contributions" className="w-full block rounded-[3px]" />
                  </div>
                  <GitHubStats username="ralph12322" />
                </div>
              </Reveal>

              {/* Projects mini-grid */}
              <Reveal>
                <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden p-[13px_15px]">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-[9px] font-bold tracking-[3px] uppercase text-[var(--text-faint)]">Projects</div>
                    <button
                      onClick={() => open("projects")}
                      className="text-[9px] text-[var(--accent)] bg-transparent border-none cursor-pointer font-bold flex items-center gap-[2px] tracking-wide uppercase flex-shrink-0 font-sans"
                    >
                      All <ArrowUpRight size={9} />
                    </button>
                  </div>
                  <div
                    className="grid gap-[10px]"
                    style={{ gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)" }}
                  >
                    {projects.map((p, i) => (
                      <div
                        key={i}
                        className="bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] rounded-[9px] p-3 transition-transform duration-200 cursor-default hover:-translate-y-[2px]"
                        style={{ borderTop: `2px solid ${p.accent}` }}
                      >
                        <div className="text-[8px] tracking-[2px] uppercase font-bold mb-1 font-mono" style={{ color: p.accent }}>{p.tag}</div>
                        <div className="text-[13px] font-bold text-[var(--text-primary)] mb-[5px] font-serif">{p.title}</div>
                        <div className="text-[10px] text-[#888] leading-[1.5] mb-2">{p.description.slice(0, 85)}…</div>
                        <div className="flex flex-wrap gap-[3px] mb-[9px]">
                          {p.tech.slice(0, 3).map(t => (
                            <span key={t} className="px-[5px] py-[2px] rounded-[3px] text-[8px] font-mono bg-[var(--bg-hover)] text-[#8a8a8a] border border-[var(--border-strong)]">{t}</span>
                          ))}
                        </div>
                        <div className="flex gap-3">
                          {p.github !== "#" && (
                            <a
                              href={p.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-[var(--text-faint)] flex items-center gap-[3px] font-semibold transition-colors duration-200 hover:text-[var(--text-primary)]"
                            >
                              <Github size={10} /> Code
                            </a>
                          )}
                          <a
                            href={p.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] flex items-center gap-[3px] font-semibold transition-opacity duration-200 hover:opacity-70"
                            style={{ color: p.accent }}
                          >
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
                <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden p-[13px_15px]">
                  <div className="flex justify-between items-center mb-[11px]">
                    <div className="text-[9px] font-bold tracking-[3px] uppercase text-[var(--text-faint)]">Thing I'm Interested</div>
                    <button
                      onClick={() => open("interests")}
                      className="text-[9px] text-[var(--accent)] bg-transparent border-none cursor-pointer font-bold flex items-center gap-[2px] tracking-wide uppercase flex-shrink-0 font-sans"
                    >
                      Interests &amp; Fun <ArrowUpRight size={9} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {interestTiles.map((tile, i) => (
                      <div
                        key={i}
                        onClick={() => open("interests")}
                        className="border rounded-[9px] p-[11px_9px] cursor-pointer transition-all duration-200"
                        style={{
                          background: hoveredTile === i ? tileBg(tile.bg) : "var(--bg-card-inner)",
                          borderColor: hoveredTile === i ? tile.color + "45" : "var(--border-subtle)",
                          transform: hoveredTile === i ? "translateY(-2px)" : undefined,
                        }}
                        onMouseEnter={() => setHoveredTile(i)}
                        onMouseLeave={() => setHoveredTile(null)}
                      >
                        <div className="text-[17px] mb-[5px] transition-colors duration-200" style={{ color: hoveredTile === i ? tile.color : "var(--text-faint)" }}>{tile.icon}</div>
                        <div className="text-[10px] font-bold mb-[2px] transition-colors duration-200" style={{ color: hoveredTile === i ? tile.color : "var(--text-primary)" }}>{tile.label}</div>
                        <div className="text-[8px] text-[#888] leading-[1.4]">{tile.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* ══ CONTACT ══ */}
              <section
                id="contact"
                className="px-[clamp(16px,4vw,20px)] py-[clamp(36px,6vw,56px)] bg-[var(--contact-bg)] border-t border-[var(--border-subtle)] rounded-[9px]"
              >
                <div className="max-w-[520px] mx-auto text-center">
                  <div className="text-[9px] tracking-[4px] uppercase text-[var(--text-faint)] font-bold mb-3">CONTACT</div>
                  <h2 className="font-serif text-[clamp(22px,6vw,44px)] font-bold text-[var(--text-primary)] tracking-[-1.5px] mb-3 leading-[1.1]">
                    Let&apos;s build<br /><span className="text-[var(--accent)] italic">something together</span>
                  </h2>
                  <p className="text-[clamp(12px,1.5vw,13px)] text-[var(--text-faint)] leading-[1.8] mb-7">
                    Open to internship opportunities, collaborations, and interesting conversations.
                  </p>
                  <div className={`flex gap-[10px] justify-center flex-wrap mb-6 ${isMobile ? "flex-col items-stretch" : "flex-row items-center"}`}>
                    <a
                      href="https://mail.google.com/mail/?view=cm&to=gjcshs.santos.ralphgeo@gmail.com"
                      className="inline-flex items-center justify-center gap-[7px] bg-[var(--accent)] px-[22px] py-[10px] rounded-[7px] text-xs font-bold"
                      style={{ color: isLight ? "#fff" : "#0a0908" }}
                    >
                      <Mail size={13} /> Send a message
                    </a>
                    <a
                      href="https://www.facebook.com/ralph.santos.620659/"
                      className="inline-flex items-center justify-center gap-[7px] bg-transparent text-[var(--text-muted)] px-[22px] py-[10px] rounded-[7px] text-xs font-semibold border border-[var(--border-strong)]"
                    >
                      <Facebook size={13} /> Facebook
                    </a>
                  </div>
                  <p className="text-white text-[11px] border-t border-[var(--border-subtle)] pt-5 break-all">
                    ralphgeosantos.dev@gmail.com
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>

      {/* ══ PANELS ══ */}

      {/* About */}
      <Panel open={panel === "about"} onClose={close}>
        <PanelHeader label="01 / About" title="Who I" italic="Am" onClose={close} />
        <div className="flex-1 overflow-y-auto p-[clamp(16px,3vw,44px)_clamp(14px,4vw,48px)]">
          <div
            className="grid gap-[clamp(24px,4vw,40px)] items-start"
            style={{ gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}
          >
            <div>
              <p className="text-[clamp(12px,1.4vw,16px)] text-[var(--text-muted)] leading-[1.9] mb-5">
                I&apos;m a <span className="text-[var(--text-primary)] font-semibold">fourth-year CS student</span> who loves building things that work well and look clean. I specialize in full-stack development — REST APIs, MVC architecture, and modern JS frameworks.
              </p>
              <p className="text-[clamp(11px,1.2vw,14px)] text-[var(--text-faint)] leading-[1.85]">
                Currently looking for an internship where I can contribute to real engineering problems and keep growing as a developer.
              </p>
              <div className="font-serif text-[clamp(36px,7vw,88px)] font-bold text-[var(--border-default)] leading-none mt-7 tracking-[-4px] select-none">
                CS<span className="text-[var(--accent)]">.</span>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              {Object.entries(skills).map(([cat, items]) => (
                <div key={cat}>
                  <div className="text-[10px] font-bold tracking-[3px] uppercase text-white mb-[9px] flex items-center gap-2">
                    <div className="w-3 h-px bg-white flex-shrink-0" />{cat}
                  </div>
                  <div className="flex flex-wrap gap-[6px]">
                    {items.map(s => (
                      <span
                        key={s.label}
                        className="px-[11px] py-[5px] bg-[var(--bg-hover)] rounded-[5px] text-xs text-[var(--text-muted)] font-medium border border-[var(--border-strong)] cursor-default flex items-center gap-[5px] transition-colors duration-200 hover:text-[var(--accent)] hover:border-[var(--accent)]"
                      >
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
        <div className="flex-1 overflow-y-auto p-[clamp(14px,3vw,40px)_clamp(14px,4vw,48px)]">
          {projects.map((p, i) => (
            <div
              key={i}
              className="py-[22px] border-b border-[var(--border-default)] transition-opacity duration-200 hover:opacity-65"
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "52px 1fr auto",
                gap: isMobile ? 10 : 20,
                alignItems: "start",
              }}
            >
              {!isMobile && (
                <div className="font-mono text-[11px] text-white font-bold pt-[2px]">{p.num}</div>
              )}
              <div className="min-w-0">
                <div className="text-[9px] tracking-[3px] uppercase font-bold mb-[5px]" style={{ color: p.accent }}>{p.tag}</div>
                <h3 className="text-[clamp(14px,2.5vw,22px)] font-bold text-[var(--text-primary)] tracking-[-0.5px] m-0 mb-[9px] font-serif">{p.title}</h3>
                <p className="text-[clamp(11px,1.2vw,13px)] text-[var(--text-faint)] leading-[1.7] m-0 mb-3 max-w-[480px]">{p.description}</p>
                <div className="flex flex-wrap gap-[5px]">
                  {p.tech.map(t => (
                    <span key={t} className="px-2 py-[3px] rounded-[4px] text-[10px] font-semibold font-mono bg-[var(--bg-hover)] text-[var(--text-faint)] border border-[var(--border-strong)]">{t}</span>
                  ))}
                </div>
                {isMobile && (
                  <div className="flex gap-[14px] mt-[10px]">
                    {p.github !== "#" && (
                      <a href={p.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] text-[var(--text-faint)] font-semibold">
                        <Github size={12} /> Code
                      </a>
                    )}
                    <a href={p.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: p.accent }}>
                      <ExternalLink size={12} /> Demo
                    </a>
                  </div>
                )}
              </div>
              {!isMobile && (
                <div className="flex flex-col gap-[9px] pt-[2px] min-w-[54px]">
                  {p.github !== "#" && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] text-[var(--text-faint)] font-semibold whitespace-nowrap transition-colors duration-200 hover:text-[var(--text-primary)]"
                    >
                      <Github size={12} /> Code
                    </a>
                  )}
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] font-semibold whitespace-nowrap transition-opacity duration-200 hover:opacity-70"
                    style={{ color: p.accent }}
                  >
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
        <div className="flex-1 overflow-y-auto p-[clamp(14px,3vw,40px)_clamp(14px,4vw,48px)]">
          {timeline.map((item, i) => (
            <div
              key={i}
              className="py-5 border-b border-[var(--border-default)] transition-opacity duration-200 hover:opacity-65"
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "88px 1fr",
                gap: isMobile ? 6 : 20,
                alignItems: "start",
              }}
            >
              <div className="pt-[3px] flex-shrink-0">
                <span
                  className="text-[11px] font-bold font-mono px-[9px] py-1 rounded-[4px] inline-block"
                  style={{ background: `${item.accent}18`, color: item.accent, border: `1px solid ${item.accent}30` }}
                >
                  {item.year}
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-[9px] tracking-[3px] uppercase text-white font-bold mb-[5px]">{item.company}</div>
                <h3 className="text-[clamp(13px,2vw,19px)] font-bold text-[var(--text-primary)] tracking-[-0.3px] m-0 mb-[7px] font-serif">{item.title}</h3>
                <p className="text-[clamp(11px,1.2vw,13px)] text-[var(--text-faint)] leading-[1.7] max-w-[480px]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Interests */}
      <Panel open={panel === "interests"} onClose={close}>
        <PanelHeader label="04 / Interests" title="Beyond the" italic="Code" onClose={close} />
        <div className="flex px-[clamp(14px,4vw,48px)] border-b border-[var(--border-default)] flex-shrink-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {interests.map((b, i) => (
            <button
              key={i}
              onClick={() => setActiveInterest(i)}
              className="bg-transparent border-none cursor-pointer font-sans text-[clamp(11px,1.3vw,12px)] font-semibold px-[clamp(10px,2vw,16px)] py-3 transition-colors duration-200 flex items-center gap-[6px] whitespace-nowrap"
              style={{
                color: activeInterest === i ? "var(--text-primary)" : "#fff",
                borderBottom: activeInterest === i ? `2px solid ${b.accent}` : "2px solid transparent",
              }}
            >
              <span
                className="flex transition-colors duration-200"
                style={{ color: activeInterest === i ? b.accent : "#fff" }}
              >
                {b.icon}
              </span>
              {b.category}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-[clamp(14px,3vw,40px)_clamp(14px,4vw,48px)]">
          {interests.map((b, i) => (
            <div
              key={i}
              className="items-start"
              style={{
                display: activeInterest === i ? "grid" : "none",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: isMobile ? 20 : 40,
              }}
            >
              <div>
                <div className="inline-flex items-center gap-[9px] mb-[18px]" style={{ color: b.accent }}>
                  {b.icon}
                  <span className="text-[10px] font-bold tracking-[3px] uppercase">{b.category}</span>
                </div>
                <p className="text-[clamp(12px,1.4vw,16px)] text-[var(--text-muted)] leading-[1.85]">{b.description}</p>
                <div className="font-serif text-[clamp(36px,7vw,80px)] font-bold text-[var(--text-muted)] leading-none mt-7 tracking-[-3px] select-none">
                  {b.category.split(" ")[0]}<span style={{ color: b.accent }}>.</span>
                </div>
              </div>
              <div>
                {b.items.map((item, j) => (
                  <div
                    key={j}
                    className="py-[14px] border-b border-[var(--border-default)] flex justify-between items-center gap-3 cursor-default transition-opacity duration-200 hover:opacity-55"
                  >
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-[var(--text-primary)] mb-[3px]">{item.label}</div>
                      <div className="text-[11px] text-white">{item.sub}</div>
                    </div>
                    <div className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: b.accent }} />
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