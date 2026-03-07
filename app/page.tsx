'use client';
import { useState, useEffect, useRef, ReactNode } from "react";
import { Github, Linkedin, Mail, Facebook, ExternalLink, ChevronDown, Music, Film, Gamepad2, X, ArrowUpRight } from "lucide-react";
import Navbar from "./components/Navbar";
import MusicPlayer from "./components/MusicPlayer";

// ── Types ──────────────────────────────────────────────────────────
interface Project {
  title: string;
  tag: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
  accent: string;
  num: string;
}

interface TimelineItem {
  year: string;
  title: string;
  company: string;
  description: string;
  accent: string;
}

interface InterestItem {
  label: string;
  sub: string;
}

interface Interest {
  category: string;
  icon: ReactNode;
  accent: string;
  description: string;
  items: InterestItem[];
}

interface PanelProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface PanelHeaderProps {
  label: string;
  title: string;
  italic?: string;
  onClose: () => void;
}

// ── Hooks ──────────────────────────────────────────────────────────
function useInView(threshold = 0.15): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ── Components ──────────────────────────────────────────────────────
interface RevealProps {
  children: ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}

function Reveal({ children, delay = 0, style = {} }: RevealProps) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      ...style
    }}>{children}</div>
  );
}

function Panel({ open, onClose, children }: PanelProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 199,
          background: "rgba(0,0,0,0.55)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.4s ease",
          backdropFilter: open ? "blur(4px)" : "none"
        }}
      />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 200,
        width: "min(90vw, 1100px)",
        background: "#0c0b09",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.55s cubic-bezier(0.77,0,0.175,1)",
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
        {children}
      </div>
    </>
  );
}

function PanelHeader({ label, title, italic, onClose }: PanelHeaderProps) {
  return (
    <div style={{
      padding: "clamp(24px,4vw,40px) clamp(20px,4vw,52px) 28px",
      borderBottom: "1px solid #1f1e1b",
      flexShrink: 0,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }}>
      <div>
        <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#57534e", fontWeight: 700, marginBottom: 10 }}>{label}</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px,3.5vw,48px)", fontWeight: 700, color: "#fafaf9", letterSpacing: "-1.5px", margin: 0, lineHeight: 1.1 }}>
          {title}{italic && <span style={{ color: "#f97316", fontStyle: "italic" }}> {italic}</span>}
        </h2>
      </div>
      <button
        onClick={onClose}
        style={{
          background: "#1a1916", border: "1px solid #2a2825", cursor: "pointer",
          borderRadius: "50%", width: 42, height: 42,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, marginLeft: 16,
          transition: "background 0.2s, transform 0.3s"
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#2a2825"; e.currentTarget.style.transform = "rotate(90deg)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1916"; e.currentTarget.style.transform = "rotate(0)"; }}
      >
        <X style={{ width: 17, height: 17, color: "#78716c" }} />
      </button>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────
const projects: Project[] = [
  {
    title: "TrackTag",
    tag: "Thesis Project",
    description: "Full-stack price tracking platform monitoring apparel prices and reviews from Amazon and Lazada via automated web scraping. Includes a dashboard to visualize price history and trends.",
    tech: ["Next.js", "TypeScript", "Node.js", "MongoDB"],
    github: "https://github.com/ralph12322/tracktag",
    demo: "https://tracktag-production.up.railway.app/",
    accent: "#f97316",
    num: "01"
  },
  {
    title: "Spotify Clone",
    tag: "Hubby Project",
    description: "Responsive music streaming app inspired by Spotify's UI. Full audio upload, playback controls, playlist management, and cloud-hosted media via Cloudinary.",
    tech: ["React", "Node.js", "JavaScript", "Tailwind CSS", "Cloudinary", "MongoDB"],
    github: "https://github.com/ralph12322/Spotify-Clone",
    demo: "https://lindsaaayspoti.vercel.app/",
    accent: "#22c55e",
    num: "02"
  },
  {
    title: "EmoVOX",
    tag: "Baby-Thesis Project",
    description: "Emotion-aware translation app integrating speech-to-text, text-to-speech, and real-time emotion detection to enhance how people communicate.",
    tech: ["React", "Node.js", "Express", "Tailwind CSS"],
    github: "#",
    demo: "https://emovox.vercel.app/",
    accent: "#a78bfa",
    num: "03"
  }
];

const timeline: TimelineItem[] = [
  { year: "2026", title: "Fullstack Web Developer Intern", company: "Jurisprudence Application Services", description: "Built Paysync — a payroll automation system designed for accountants.", accent: "#f97316" },
  { year: "2025", title: "Thesis Defense", company: "University", description: "Defended TrackTag successfully. Earned commendation from the panel.", accent: "#fbbf24" },
  { year: "2024", title: "Baby-Thesis Completion", company: "University Lab", description: "Shipped EmoVOX as a collaborative AI + speech processing research project.", accent: "#a78bfa" },
  { year: "2023", title: "Went Deep into Full-Stack", company: "Self-taught", description: "Immersed in the MERN stack, built multiple personal projects, sharpened TypeScript skills.", accent: "#34d399" },
  { year: "2022", title: "CS Journey Begins", company: "University", description: "First lines of Python and JavaScript. Fell in love with programming from day one.", accent: "#60a5fa" },
];

const interests: Interest[] = [
  {
    category: "Music",
    icon: <Music style={{ width: 20, height: 20 }} />,
    accent: "#ec4899",
    description: "Music is woven into my day — OPM when I need to feel something, lo-fi when I need to focus.",
    items: [
      { label: "OPM / Filipino Music", sub: "Ben&Ben, IV of Spades, Cup of Joe, SB19" },
      { label: "Lo-fi / Chill", sub: "Late-night coding sessions and deep focus" },
      { label: "Bedroom Pop", sub: "Soft, dreamy vibes for any mood" },
      { label: "Acoustic Sets", sub: "Raw, stripped-back and emotional" }
    ]
  },
  {
    category: "Film & Shows",
    icon: <Film style={{ width: 20, height: 20 }} />,
    accent: "#818cf8",
    description: "A good story gets me every time — emotional anime arcs, slow-burn romances, high-stakes thrillers.",
    items: [
      { label: "Anime", sub: "AOT, Haikyuu, Vinland Saga, Demon Slayer" },
      { label: "Romance / Drama", sub: "Kilig moments and emotional gut punches" },
      { label: "Action / Thriller", sub: "Edge-of-seat tension and satisfying payoffs" },
      { label: "Slice of Life", sub: "Calm, relatable, oddly comforting" }
    ]
  },
  {
    category: "Gaming",
    icon: <Gamepad2 style={{ width: 20, height: 20 }} />,
    accent: "#fbbf24",
    description: "My go-to unwind — anything with a great story or competitive depth, mobile or PC.",
    items: [
      { label: "Story-Driven RPGs", sub: "Deep lore and memorable characters" },
      { label: "Battle Royale / FPS", sub: "When it's time to go sweaty mode" },
      { label: "Indie Gems", sub: "Surprising, creative, underrated finds" },
      { label: "Mobile Games", sub: "Quick sessions on the go" }
    ]
  }
];

const skills: Record<string, string[]> = {
  "Languages": ["Python", "JavaScript", "TypeScript"],
  "Web": ["React", "Next.js", "Node.js", "Express"],
  "Database": ["MongoDB"],
  "Tools": ["Git", "GitHub", "Vercel", "Railway"]
};

// ── MAIN ──────────────────────────────────────────────────────────
export default function Portfolio() {
  const [panel, setPanel] = useState<string | null>(null);
  const [activeInterest, setActiveInterest] = useState(0);
  const [activeNav, setActiveNav] = useState<string | null>(null);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveNav("Contact");
  };
  const open = (name: string) => {
    setPanel(name);
    setActiveNav(name.charAt(0).toUpperCase() + name.slice(1));
  };
  const close = () => { setPanel(null); setActiveNav(null); };

  const navItems: { label: string; action: () => void }[] = [
    { label: "About", action: () => open("about") },
    { label: "Projects", action: () => open("projects") },
    { label: "Experience", action: () => open("experience") },
    { label: "Interests", action: () => open("interests") },
    { label: "Contact", action: () => scrollTo("#contact") },
  ];

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: "#faf9f7", color: "#1c1917", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,600&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; text-align: center; }
          .hero-photo-wrap { width: min(320px, 80vw) !important; height: min(360px, 90vw) !important; margin: 0 auto; }
          .hero-deco-br { bottom: -10px !important; right: -10px !important; width: 80px !important; height: 80px !important; }
          .hero-deco-tl { top: -8px !important; left: -8px !important; width: 55px !important; height: 55px !important; }
          .hero-socials { justify-content: center !important; }
          .hero-btns { justify-content: center !important; }
          .hero-badge { margin: 0 auto 20px !important; }
          .cards-grid { grid-template-columns: repeat(2,1fr) !important; }
          .panel-body-pad { padding: 28px 20px !important; }
          .panel-header-pad { padding: 24px 20px 22px !important; }
          .project-row { grid-template-columns: 1fr !important; gap: 12px !important; }
          .project-row-num { display: none !important; }
          .project-row-links { flex-direction: row !important; gap: 16px; }
          .exp-row { grid-template-columns: 1fr !important; gap: 8px !important; }
          .about-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .interests-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .contact-btns { flex-direction: column !important; align-items: center !important; }
        }
        @media (max-width: 480px) {
          .cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── NAVBAR COMPONENT ── */}
      <Navbar navItems={navItems} activeNav={activeNav} />

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        background: "linear-gradient(145deg, #fff7ed 0%, #faf9f7 55%, #fef3c7 100%)",
        padding: "0 24px", paddingTop: 80, position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: "15%", right: "3%", width: 500, height: 500, background: "radial-gradient(circle, rgba(251,146,60,0.12) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

        <div className="hero-grid" style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          {/* Left text */}
          <div style={{ animation: "fadeIn 0.8s ease both" }}>
            <div className="hero-badge" style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#ea580c", fontWeight: 700, marginBottom: 20, display: "inline-block", background: "#fff7ed", padding: "6px 14px", borderRadius: 30, border: "1px solid #fed7aa" }}>
              4th Year CS Student · Full-Stack Developer
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 700, lineHeight: 1.06, letterSpacing: "-2px", marginBottom: 20, marginTop: 0 }}>
              Hi, I&apos;m<br /><span style={{ color: "#ea580c", fontStyle: "italic" }}>Ralph Geo<br />Santos</span>
            </h1>
            <p style={{ fontSize: "clamp(15px, 1.6vw, 17px)", color: "#78716c", lineHeight: 1.8, marginBottom: 32, maxWidth: 420 }}>
              Building scalable web experiences — from price trackers to music apps. Currently hunting for internship opportunities.
            </p>
            <div className="hero-socials" style={{ display: "flex", gap: 10, marginBottom: 28 }}>
              {[
                { href: "https://github.com/ralph12322", bg: "#1c1917", icon: <Github style={{ width: 18, height: 18, color: "#fff" }} /> },
                { href: "https://www.linkedin.com/in/ralph-geo-santos-49226b281/", bg: "#0077b5", icon: <Linkedin style={{ width: 18, height: 18, color: "#fff" }} /> },
                { href: "mailto:gjcshs.santos.ralphgeo@gmail.com", bg: "#ea580c", icon: <Mail style={{ width: 18, height: 18, color: "#fff" }} /> },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  style={{ padding: 11, background: s.bg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity 0.2s, transform 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
                >{s.icon}</a>
              ))}
            </div>
            <div className="hero-btns" style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => open("projects")}
                style={{ background: "#ea580c", color: "#fff", padding: "13px 28px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 24px rgba(234,88,12,0.3)", transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(234,88,12,0.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(234,88,12,0.3)"; }}
              >View Projects</button>
              <button
                onClick={() => open("about")}
                style={{ background: "#fff", color: "#1c1917", padding: "13px 28px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", border: "2px solid #e7e5e4", fontFamily: "inherit", transition: "border-color 0.2s, transform 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ea580c"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e7e5e4"; e.currentTarget.style.transform = "translateY(0)"; }}
              >About Me</button>
            </div>
          </div>

          {/* Right — Photo */}
          <div style={{ display: "flex", justifyContent: "center", animation: "fadeIn 0.8s ease 0.2s both" }}>
            <div className="hero-photo-wrap" style={{ position: "relative", width: 420, height: 500 }}>
              <div style={{
                width: "100%", height: "100%", borderRadius: 24, overflow: "hidden",
                position: "relative", zIndex: 1,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.12), 0 40px 80px rgba(0,0,0,0.1)"
              }}>
                <img
                  src="./heroMe.jfif"
                  alt="Ralph Geo Santos"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
                />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
                  background: "linear-gradient(to top, rgba(250,249,247,0.25), transparent)",
                  pointerEvents: "none"
                }} />
              </div>
              <div className="hero-deco-br" style={{ position: "absolute", bottom: -16, right: -16, width: 110, height: 110, background: "linear-gradient(135deg, #ea580c, #f59e0b)", borderRadius: 18, zIndex: 0, opacity: 0.85 }} />
              <div className="hero-deco-tl" style={{ position: "absolute", top: -12, left: -12, width: 76, height: 76, border: "2.5px solid #ea580c", borderRadius: 14, zIndex: 0, opacity: 0.5 }} />
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)" }}>
          <ChevronDown style={{ width: 26, height: 26, color: "#a8a29e", animation: "bounce 2s infinite" }} />
        </div>
      </section>

      {/* ── EXPLORE CARDS ── */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 52 }}>
              <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#a8a29e", fontWeight: 700, marginBottom: 12 }}>EXPLORE</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,4vw,46px)", fontWeight: 700, letterSpacing: "-1px", margin: 0 }}>Get to Know Me</h2>
            </div>
          </Reveal>
          <div className="cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {[
              { label: "About", num: "01", desc: "Background & skills", action: () => open("about"), color: "#ea580c" },
              { label: "Projects", num: "02", desc: "Things I've shipped", action: () => open("projects"), color: "#22c55e" },
              { label: "Experience", num: "03", desc: "Journey & milestones", action: () => open("experience"), color: "#818cf8" },
              { label: "Interests", num: "04", desc: "Beyond the code", action: () => open("interests"), color: "#ec4899" },
            ].map((card, i) => (
              <Reveal key={card.label} delay={i * 0.08}>
                <button
                  onClick={card.action}
                  style={{ background: "#faf9f7", border: "1px solid #e7e5e4", borderRadius: 14, padding: "24px 20px", textAlign: "left", cursor: "pointer", width: "100%", fontFamily: "inherit", transition: "transform 0.25s, border-color 0.25s, box-shadow 0.25s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = card.color; e.currentTarget.style.boxShadow = `0 12px 36px ${card.color}14`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e7e5e4"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ fontSize: 11, color: "#d4d0cb", fontWeight: 700, marginBottom: 14, fontFamily: "monospace" }}>{card.num}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#1c1917", marginBottom: 6 }}>{card.label}</div>
                  <div style={{ fontSize: 12, color: "#a8a29e", marginBottom: 20 }}>{card.desc}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: card.color }}>
                    Open <ArrowUpRight style={{ width: 12, height: 12 }} />
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "80px 24px", background: "#0c0b09" }}>
        <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#57534e", fontWeight: 700, marginBottom: 18 }}>CONTACT</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px,5vw,52px)", fontWeight: 700, color: "#fafaf9", letterSpacing: "-1.5px", marginBottom: 18, lineHeight: 1.1 }}>
              Let&apos;s build<br /><span style={{ color: "#f97316", fontStyle: "italic" }}>something together</span>
            </h2>
            <p style={{ fontSize: 15, color: "#57534e", lineHeight: 1.8, marginBottom: 44 }}>
              Open to internship opportunities, collaborations, and interesting conversations.
            </p>
            <div className="contact-btns" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
              <a
                href="https://mail.google.com/mail/?view=cm&to=gjcshs.santos.ralphgeo@gmail.com&su=Hello&body=I%20would%20like%20to%20connect%20with%20you."
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#f97316", color: "#fff", padding: "13px 28px", borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none", fontFamily: "inherit" }}
              >
                <Mail style={{ width: 16, height: 16 }} /> Send a message
              </a>
              <a
                href="https://www.facebook.com/ralph.santos.620659/"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "#78716c", padding: "13px 28px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none", border: "1px solid #2a2825", fontFamily: "inherit" }}
              >
                <Facebook style={{ width: 16, height: 16 }} /> Facebook
              </a>
            </div>
            <p style={{ color: "#3a3733", fontSize: 12, borderTop: "1px solid #1f1e1b", paddingTop: 28, margin: 0 }}>gjcshs.santos.ralphgeo@gmail.com</p>
          </Reveal>
        </div>
      </section>

      <footer style={{ background: "#080706", padding: "18px 24px", textAlign: "center" }}>
        <p style={{ color: "#2a2825", fontSize: 12, margin: 0 }}>© 2025 Ralph Geo Santos</p>
      </footer>

      {/* ══ PANEL: ABOUT ══ */}
      <Panel open={panel === "about"} onClose={close}>
        <PanelHeader label="01 / About" title="Who I" italic="Am" onClose={close} />
        <div className="panel-body-pad about-grid" style={{ flex: 1, overflowY: "auto", padding: "40px 52px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>
          <div>
            <p style={{ fontSize: 17, color: "#a8a29e", lineHeight: 1.9, marginBottom: 32 }}>
              I&apos;m a <span style={{ color: "#fafaf9", fontWeight: 600 }}>fourth-year CS student</span> who loves building things that work well and look clean. I specialize in full-stack development — REST APIs, MVC architecture, and modern JS frameworks are my comfort zone.
            </p>
            <p style={{ fontSize: 15, color: "#57534e", lineHeight: 1.85, marginBottom: 0 }}>
              Currently looking for an internship where I can contribute to real engineering problems and keep growing as a developer.
            </p>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(56px,8vw,96px)", fontWeight: 700, color: "#1a1916", lineHeight: 1, marginTop: 40, letterSpacing: "-4px", userSelect: "none" }}>
              CS<span style={{ color: "#f97316" }}>.</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {Object.entries(skills).map(([cat, items]) => (
              <div key={cat}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#3a3733", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 14, height: 1, background: "#3a3733" }} /> {cat}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {items.map((s) => (
                    <span
                      key={s}
                      style={{ padding: "5px 13px", background: "#1a1916", borderRadius: 6, fontSize: 13, color: "#a8a29e", fontWeight: 500, border: "1px solid #2a2825", cursor: "default", transition: "color 0.2s, border-color 0.2s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#fafaf9"; e.currentTarget.style.borderColor = "#f97316"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#a8a29e"; e.currentTarget.style.borderColor = "#2a2825"; }}
                    >{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* ══ PANEL: PROJECTS ══ */}
      <Panel open={panel === "projects"} onClose={close}>
        <PanelHeader label="02 / Projects" title="Things I've" italic="Shipped" onClose={close} />
        <div className="panel-body-pad" style={{ flex: 1, overflowY: "auto", padding: "40px 52px" }}>
          {projects.map((p, i) => (
            <div
              key={i}
              className="project-row"
              style={{ display: "grid", gridTemplateColumns: "64px 1fr auto", gap: 28, padding: "28px 0", borderBottom: "1px solid #1f1e1b", alignItems: "start", transition: "opacity 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.65")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <div className="project-row-num" style={{ fontFamily: "monospace", fontSize: 12, color: "#3a3733", fontWeight: 700, paddingTop: 2 }}>{p.num}</div>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: p.accent, fontWeight: 700, marginBottom: 6 }}>{p.tag}</div>
                <h3 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "#fafaf9", letterSpacing: "-0.5px", margin: "0 0 10px", fontFamily: "'Playfair Display', serif" }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: "#57534e", lineHeight: 1.75, margin: "0 0 14px", maxWidth: 500 }}>{p.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {p.tech.map((t) => (
                    <span key={t} style={{ padding: "3px 9px", borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: "monospace", background: "#1a1916", color: "#57534e", border: "1px solid #2a2825" }}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="project-row-links" style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 2 }}>
                {p.github !== "#" && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#57534e", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fafaf9")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#57534e")}
                  >
                    <Github style={{ width: 13, height: 13 }} /> Code
                  </a>
                )}
                <a
                  href={p.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: p.accent, textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap", transition: "opacity 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  <ExternalLink style={{ width: 13, height: 13 }} /> Demo
                </a>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* ══ PANEL: EXPERIENCE ══ */}
      <Panel open={panel === "experience"} onClose={close}>
        <PanelHeader label="03 / Experience" title="The" italic="Journey" onClose={close} />
        <div className="panel-body-pad" style={{ flex: 1, overflowY: "auto", padding: "40px 52px" }}>
          {timeline.map((item, i) => (
            <div
              key={i}
              className="exp-row"
              style={{ display: "grid", gridTemplateColumns: "96px 1fr", gap: 28, padding: "28px 0", borderBottom: "1px solid #1f1e1b", transition: "opacity 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.65")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <div style={{ paddingTop: 3 }}>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", padding: "4px 10px", background: `${item.accent}18`, color: item.accent, borderRadius: 5, border: `1px solid ${item.accent}30` }}>{item.year}</span>
              </div>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#3a3733", fontWeight: 700, marginBottom: 6 }}>{item.company}</div>
                <h3 style={{ fontSize: "clamp(16px,2vw,20px)", fontWeight: 700, color: "#fafaf9", letterSpacing: "-0.3px", margin: "0 0 8px", fontFamily: "'Playfair Display', serif" }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: "#57534e", lineHeight: 1.75, margin: 0, maxWidth: 500 }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <MusicPlayer />

      {/* ══ PANEL: INTERESTS ══ */}
      <Panel open={panel === "interests"} onClose={close}>
        <PanelHeader label="04 / Interests" title="Beyond the" italic="Code" onClose={close} />
        <div style={{ display: "flex", padding: "0 clamp(20px,4vw,52px)", borderBottom: "1px solid #1f1e1b", flexShrink: 0, overflowX: "auto" }}>
          {interests.map((b, i) => (
            <button
              key={i}
              onClick={() => setActiveInterest(i)}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, padding: "14px 20px", color: activeInterest === i ? "#fafaf9" : "#3a3733", borderBottom: activeInterest === i ? `2px solid ${b.accent}` : "2px solid transparent", transition: "color 0.2s", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}
            >
              <span style={{ color: activeInterest === i ? b.accent : "#3a3733", transition: "color 0.2s", display: "flex" }}>{b.icon}</span>
              {b.category}
            </button>
          ))}
        </div>
        <div className="panel-body-pad" style={{ flex: 1, overflowY: "auto", padding: "40px 52px" }}>
          {interests.map((b, i) => (
            <div
              key={i}
              className="interests-grid"
              style={{ display: activeInterest === i ? "grid" : "none", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}
            >
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24, color: b.accent }}>
                  {b.icon}
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>{b.category}</span>
                </div>
                <p style={{ fontSize: 17, color: "#a8a29e", lineHeight: 1.85 }}>{b.description}</p>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(56px,8vw,88px)", fontWeight: 700, color: "#141310", lineHeight: 1, marginTop: 40, letterSpacing: "-3px", userSelect: "none" }}>
                  {b.category.split(" ")[0]}<span style={{ color: b.accent }}>.</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {b.items.map((item, j) => (
                  <div
                    key={j}
                    style={{ padding: "18px 0", borderBottom: "1px solid #1f1e1b", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "opacity 0.2s", cursor: "default" }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.55")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#e7e5e4", marginBottom: 3 }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: "#3a3733" }}>{item.sub}</div>
                    </div>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: b.accent, flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}