import { useState, useEffect, useCallback } from "react";
import { Award, Sparkles, Lock, ChevronLeft, ChevronRight, ExternalLink, ImageOff, Maximize2, Minimize2, X } from "lucide-react";

type CertStatus = "earned" | "active" | "locked";

interface Certification {
  title: string;
  issuer: string;
  status: CertStatus;
  accent: string;
  image?: string;
  date?: string;
  credentialId?: string;
  progress?: number;
  skills: string[];
  verifyUrl?: string;
}

const certifications: Certification[] = [
  {
    title: "Foundations of Python",
    issuer: "CodePath Academy",
    status: "earned",
    accent: "#5eead4",
    image: "/PythonCertificate.png",
    date: "Mar 2025",
    credentialId: "CP-PY-88214",
    skills: ["Syntax", "Data types", "Control flow"],
    verifyUrl: "#",
  },
  {
    title: "Data Structures & Algorithms",
    issuer: "CodePath Academy",
    status: "earned",
    accent: "#2dd4bf",
    image: "/JavascriptCertificate.png",
    date: "Jun 2025",
    credentialId: "CP-DSA-40913",
    skills: ["Trees", "Graphs", "Big O"],
    verifyUrl: "#",
  },
  {
    title: "Full-Stack Web Development",
    issuer: "CodePath Academy",
    status: "earned",
    accent: "#14b8a6",
    image: "/ProblemSolving.png",
    date: "Jun 2025",
    skills: ["React", "APIs", "Auth"],
  },
  {
    title: "Cloud Practitioner",
    issuer: "Vantage Cloud",
    status: "locked",
    accent: "#0d9488",
    skills: ["Compute", "Storage", "Networking"],
  },
  {
    title: "Systems Design",
    issuer: "CodePath Academy",
    status: "locked",
    accent: "#0f766e",
    skills: ["Scaling", "Caching", "Queues"],
  },
];

const statusMeta: Record<CertStatus, { label: string; icon: typeof Award }> = {
  earned: { label: "Earned", icon: Award },
  active: { label: "In progress", icon: Sparkles },
  locked: { label: "Locked", icon: Lock },
};

export default function CertificationSlideshow() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [maximized, setMaximized] = useState(false);

  const cert = certifications[index];
  const Icon = statusMeta[cert.status].icon;
  const earnedCount = certifications.filter((c) => c.status === "earned").length;

  const go = useCallback((next: number) => {
    setFlipped(false);
    setIndex((prev) => (next + certifications.length) % certifications.length);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "Escape") setMaximized(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, index]);

  useEffect(() => {
    if (maximized) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [maximized]);

  const stageMax = maximized ? 560 : 320;

  const card = (
    <div
      className="bg-[var(--bg-card,#141414)] border border-[var(--border-default,#262626)] rounded-xl overflow-hidden"
      style={{ padding: maximized ? "clamp(18px, 4vw, 28px)" : "clamp(12px, 4vw, 16px)" }}
    >
      <div className="flex flex-wrap justify-between items-center gap-y-1 mb-[14px]">
        <div className="text-[9px] font-bold tracking-[3px] uppercase text-[var(--text-faint,#6b6b6b)]">
          Certifications
        </div>
        <div className="flex items-center gap-[10px] flex-wrap justify-end">
          <span className="text-[9px] text-white italic font-serif flex-shrink-0">
            {earnedCount} of {certifications.length} earned
          </span>
          <button
            onClick={() => setMaximized((m) => !m)}
            aria-label={maximized ? "Exit expanded view" : "Expand"}
            className="text-[var(--text-faint,#6b6b6b)] hover:text-white transition-colors flex-shrink-0"
          >
            {maximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      <div className="py-2">
        <div
          className="relative mx-auto"
          style={{ width: "100%", maxWidth: stageMax, aspectRatio: "4 / 3" }}
        >
          <button
            onClick={() => go(index - 1)}
            aria-label="Previous certification"
            className="absolute z-10 left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
          >
            <ChevronLeft size={16} />
          </button>

          <div
            onClick={() => setFlipped((f) => !f)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setFlipped((f) => !f)}
            aria-label={flipped ? "Show certificate" : "Show credential details"}
            style={{ perspective: "1200px" }}
            className="w-full h-full cursor-pointer select-none"
          >
          <div
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.5s cubic-bezier(0.4, 0.2, 0.2, 1)",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
            className="relative w-full h-full"
          >
            {/* Front: certificate image */}
            <div
              style={{ backfaceVisibility: "hidden" }}
              className="absolute inset-0 flex flex-col"
            >
              <div
                className="relative flex-1 rounded-[6px] overflow-hidden"
                style={{
                  padding: "6px",
                  background:
                    cert.status === "locked"
                      ? "#1a1a1a"
                      : `linear-gradient(135deg, ${cert.accent}30, ${cert.accent}08)`,
                  border: `1px solid ${cert.status === "locked" ? "#333" : cert.accent + "50"}`,
                }}
              >
                <div className="relative w-full h-full rounded-[3px] overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
                  {cert.status === "locked" ? (
                    <div className="flex flex-col items-center gap-[6px] text-[#555]">
                      <Lock size={20} />
                      <span className="text-[9px]">Locked</span>
                    </div>
                  ) : cert.image ? (
                    <img
                      src={cert.image}
                      alt={`${cert.title} certificate`}
                      className="w-full h-full object-cover"
                      style={{ filter: cert.status === "active" ? "saturate(0.85)" : "none" }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-[6px] text-[#555]">
                      <ImageOff size={18} />
                      <span className="text-[9px] text-center px-4">Add certificate image</span>
                    </div>
                  )}

                  {cert.status === "active" && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[3px]"
                      style={{ background: "#222" }}
                    >
                      <div
                        className="h-full"
                        style={{ width: `${cert.progress}%`, background: cert.accent }}
                      />
                    </div>
                  )}
                </div>

                <div
                  className="absolute top-[10px] right-[10px] inline-flex items-center gap-[3px] rounded-[5px] text-[7px] font-bold px-[5px] py-[2px]"
                  style={{
                    background: cert.status === "locked" ? "#0009" : cert.accent + "e6",
                    color: cert.status === "locked" ? "#888" : "#00201c",
                  }}
                >
                  <Icon size={8} />
                  {statusMeta[cert.status].label}
                </div>
              </div>

              <div className="text-center pt-[8px] px-1">
                <div
                  className="font-bold leading-tight"
                  style={{
                    color: cert.status === "locked" ? "#666" : "var(--text-secondary,#ccc)",
                    fontSize: maximized ? "16px" : "12px",
                  }}
                >
                  {cert.title}
                </div>
                <div
                  className="text-[#888] mt-[1px]"
                  style={{ fontSize: maximized ? "13px" : "10px" }}
                >
                  {cert.issuer}
                </div>
              </div>
            </div>

            {/* Back: details */}
            <div
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                background: "#0f0f0f",
                border: "1px solid #262626",
              }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 rounded-[6px]"
            >
              <div
                className="inline-flex items-center gap-[4px] rounded-[6px] text-[8px] font-bold px-[6px] py-[2px]"
                style={{ background: cert.accent + "18", color: cert.accent }}
              >
                <Icon size={9} />
                {statusMeta[cert.status].label}
              </div>

              {cert.status === "earned" && (
                <>
                  <div className="text-[10px] font-mono text-[#999]">{cert.credentialId}</div>
                  <div className="text-[10px] text-[#777]">{cert.date}</div>
                </>
              )}

              {cert.status === "active" && (
                <div className="w-full max-w-[70%]">
                  <div className="text-[10px] text-[#999] text-center mb-1">{cert.progress}% complete</div>
                  <div className="h-[3px] rounded-full bg-[#333] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${cert.progress}%`, background: cert.accent }}
                    />
                  </div>
                </div>
              )}

              {cert.status === "locked" && (
                <div className="text-[10px] text-[#777] text-center max-w-[70%]">
                  Complete earlier steps to unlock
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-[4px] mt-1 max-w-[80%]">
                {cert.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[9px] px-[6px] py-[2px] rounded-[4px] text-[#aaa]"
                    style={{ border: "1px solid #333" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {cert.verifyUrl && (
                <a
                  href={cert.verifyUrl}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[9px] flex items-center gap-[3px] mt-1 hover:underline"
                  style={{ color: cert.accent }}
                >
                  Verify credential <ExternalLink size={9} />
                </a>
              )}
            </div>
          </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              go(index + 1);
            }}
            aria-label="Next certification"
            className="absolute z-10 right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-[6px] mt-1">
        {certifications.map((c, i) => (
          <button
            key={c.title}
            onClick={() => go(i)}
            aria-label={`Go to ${c.title}`}
            className="rounded-full transition-all"
            style={{
              width: i === index ? "14px" : "5px",
              height: "5px",
              background: i === index ? c.accent : "#3a3a3a",
            }}
          />
        ))}
      </div>
    </div>
  );

  if (!maximized) return card;

  return (
    <div
      onClick={() => setMaximized(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(0,0,0,0.75)" }}
    >W
      <button
        onClick={() => setMaximized(false)}
        aria-label="Close expanded view"
        className="absolute top-4 right-4 sm:top-5 sm:right-5 text-[#999] hover:text-white transition-colors"
      >
        <X size={22} />
      </button>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(640px, 94vw)" }}>
        {card}
      </div>
    </div>
  );
}