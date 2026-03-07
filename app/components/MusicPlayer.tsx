'use client';
import { useState, useEffect, useRef, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────
interface Track {
  id: number;
  title: string;
  artist: string;
  src: string;
  color: string;
  initials: string;
}

// ── Tracklist ─────────────────────────────────────────────────────
const TRACKS: Track[] = [
  { id: 1, title: "Ikigai", artist: "Dionela ft. Loonie", src: "/music/ikigai.mp3", color: "#f97316", initials: "DL" },
  { id: 2, title: "Malay Ko", artist: "Ralph Geo Santos (Cover)", src: "/music/malay-ko.mp4", color: "#ea580c", initials: "RGS" },
  { id: 3, title: "Pahintulot", artist: "Shirebound", src: "/music/pahintulot.mp3", color: "#f59e0b", initials: "SB" },
  { id: 4, title: "Estranghero", artist: "Cup of Joe", src: "/music/estranghero.mp3", color: "#34d399", initials: "CJ" },
  { id: 5, title: "Misteryoso", artist: "Cup of Joe", src: "/music/misteryoso.mp3", color: "#22c55e", initials: "CJ" },
  { id: 6, title: "Little Things", artist: "One Direction", src: "/music/little-things.mp3", color: "#60a5fa", initials: "1D" },
  { id: 7, title: "Luther", artist: "Kendrick Lamar", src: "/music/luther.mp3", color: "#a78bfa", initials: "KL" },
  { id: 8, title: "The Gift", artist: "Ralph Geo Santos (Cover)", src: "/music/the-gift.mp3", color: "#1c6a97", initials: "RGS" },
  { id: 9, title: "Naiilang", artist: "Ralph Geo Santos (Cover)", src: "/music/naiilang.mp4", color: "#959e17", initials: "RGS" },
];

// ── Helpers ────────────────────────────────────────────────────────
function fmt(s: number): string {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ── Icons ──────────────────────────────────────────────────────────
const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M8 5v14l11-7z" /></svg>
);
const IconPause = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
);
const IconPrev = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
);
const IconNext = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 3.93V8.07L8.5 12zM16 6h2v12h-2z" /></svg>
);
const IconMusic = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" /></svg>
);
const IconChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);
const IconVolume = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
  </svg>
);

// ── Component ──────────────────────────────────────────────────────
type PlayerState = "open" | "collapsed" | "hidden";

export default function MusicPlayer() {
  const [state, setState] = useState<PlayerState>("collapsed");
  const [trackIdx, setTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [dragging, setDragging] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  // Track whether this is the very first mount load
  const isFirstLoad = useRef(true);

  const track = TRACKS[trackIdx];

  // ── Audio setup — runs ONCE on mount ──────────────────────────
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (!dragging) setCurrentTime(audio.currentTime);
    };
    const onDuration = () => setDuration(audio.duration);
    const onEnded = () => {
      setTrackIdx((i) => (i + 1) % TRACKS.length);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onDuration);
    audio.addEventListener("ended", onEnded);

    // Load first track and attempt autoplay
    audio.src = TRACKS[0].src;
    audio.load();
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false)); // browsers will usually block this — that's fine

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onDuration);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load track when index changes (skip the very first mount) ──
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = TRACKS[trackIdx].src;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    if (isPlaying) audio.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIdx]);

  // ── Volume sync ───────────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleNext = useCallback(() => {
    setTrackIdx((i) => (i + 1) % TRACKS.length);
  }, []);

  const handlePrev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
    } else {
      setTrackIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length);
    }
  }, []);

  // ── Progress scrubbing ─────────────────────────────────────────
  const seek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const bar = progressRef.current;
      const audio = audioRef.current;
      if (!bar || !audio || !duration) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
      audio.currentTime = ratio * duration;
      setCurrentTime(ratio * duration);
    },
    [duration]
  );

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  // ── Select track from list ─────────────────────────────────────
  const selectTrack = useCallback(
    (i: number) => {
      setTrackIdx(i);
      if (!isPlaying) {
        setIsPlaying(true);
        setTimeout(() => audioRef.current?.play().catch(() => {}), 50);
      }
    },
    [isPlaying]
  );

  // ── Render ─────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes playerFadeUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 ${track.color}55; }
          70%  { box-shadow: 0 0 0 10px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }
        @keyframes equalizerBar0 { from { height: 6px; } to { height: 16px; } }
        @keyframes equalizerBar1 { from { height: 14px; } to { height: 5px; } }
        @keyframes equalizerBar2 { from { height: 10px; } to { height: 18px; } }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .player-btn {
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%; transition: background 0.15s, transform 0.15s, color 0.15s;
          color: #78716c; padding: 6px;
        }
        .player-btn:hover { background: rgba(0,0,0,0.06); transform: scale(1.1); color: #1c1917; }
        .progress-bar { cursor: pointer; }
        .progress-bar:hover .progress-fill { filter: brightness(1.15); }
        .volume-slider {
          -webkit-appearance: none; appearance: none;
          height: 3px; border-radius: 2px; outline: none; cursor: pointer;
          width: 80px;
        }
        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none; width: 10px; height: 10px;
          border-radius: 50%; background: ${track.color};
          cursor: pointer; transition: transform 0.15s;
        }
        .volume-slider::-webkit-slider-thumb:hover { transform: scale(1.3); }
        .track-name-wrap { overflow: hidden; white-space: nowrap; }
        .track-name-scroll { display: inline-block; }
        .track-name-scroll.scrolling { animation: marquee 8s linear infinite; }
      `}</style>

      {/* ── HIDDEN: floating note button ── */}
      {state === "hidden" && (
        <button
          onClick={() => setState("collapsed")}
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 300,
            width: 44, height: 44, borderRadius: "50%",
            background: "#1c1917", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: track.color,
            boxShadow: `0 4px 20px rgba(0,0,0,0.18), 0 0 0 2px ${track.color}30`,
            transition: "transform 0.2s, box-shadow 0.2s",
            animation: isPlaying ? "pulseRing 2s infinite" : "none",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          title="Open music player"
        >
          <IconMusic />
        </button>
      )}

      {/* ── COLLAPSED: mini pill ── */}
      {state === "collapsed" && (
        <div
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 300,
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 10px",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderRadius: 999,
            border: `1px solid ${track.color}22`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.10), 0 0 0 1px ${track.color}18`,
            animation: "playerFadeUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          {/* Album tile */}
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: `linear-gradient(135deg, ${track.color}, ${track.color}aa)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: 800, color: "#fff",
          }}>
            {isPlaying ? (
              <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 14 }}>
                {[0, 1, 2].map((b) => (
                  <div key={b} style={{
                    width: 2.5, background: "#fff", borderRadius: 1,
                    animation: `equalizerBar${b} 0.8s ease-in-out ${b * 0.15}s infinite alternate`,
                    height: b === 1 ? 10 : 6,
                  }} />
                ))}
              </div>
            ) : track.initials}
          </div>

          {/* Title */}
          <div style={{ minWidth: 0, maxWidth: 110 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#1c1917", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {track.title}
            </div>
            <div style={{ fontSize: 10, color: "#a8a29e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {track.artist}
            </div>
          </div>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            style={{
              width: 30, height: 30, borderRadius: "50%",
              background: track.color, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", flexShrink: 0,
              boxShadow: `0 3px 12px ${track.color}55`,
              transition: "background 0.3s, box-shadow 0.3s, transform 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            {isPlaying ? <IconPause /> : <IconPlay />}
          </button>

          {/* Expand */}
          <button
            onClick={() => setState("open")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "4px 2px", color: "#a8a29e", display: "flex",
              alignItems: "center", transition: "color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#1c1917"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#a8a29e"; }}
            title="Expand player"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13">
              <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Close */}
          <button
            onClick={() => setState("hidden")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "4px 2px", color: "#a8a29e", display: "flex",
              alignItems: "center", transition: "color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#a8a29e"; }}
            title="Close player"
          >
            <IconClose />
          </button>
        </div>
      )}

      {/* ── OPEN: full player card ── */}
      {state === "open" && (
        <div
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 300,
            width: 300,
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(28px) saturate(200%)",
            WebkitBackdropFilter: "blur(28px) saturate(200%)",
            borderRadius: 24,
            border: `1px solid ${track.color}20`,
            boxShadow: `0 24px 64px rgba(0,0,0,0.14), 0 0 0 1px ${track.color}15`,
            overflow: "hidden",
            animation: "playerFadeUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          {/* Header */}
          <div style={{
            padding: "20px 20px 16px",
            background: `linear-gradient(145deg, ${track.color}18 0%, ${track.color}06 100%)`,
            borderBottom: `1px solid ${track.color}12`,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>

              {/* Album art */}
              <div style={{
                width: 58, height: 58, borderRadius: 14, flexShrink: 0,
                background: `linear-gradient(135deg, ${track.color}, ${track.color}88)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 6px 20px ${track.color}40`,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", inset: 0,
                  background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 60%)",
                }} />
                {isPlaying ? (
                  <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 20, zIndex: 1 }}>
                    {[0, 1, 2, 3].map((b) => (
                      <div key={b} style={{
                        width: 3, background: "#fff", borderRadius: 2,
                        height: [10, 18, 14, 8][b],
                        animation: `equalizerBar${b % 3} 0.7s ease-in-out ${b * 0.12}s infinite alternate`,
                        opacity: 0.9,
                      }} />
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", zIndex: 1 }}>
                    {track.initials}
                  </span>
                )}
              </div>

              {/* Track info */}
              <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                <div className="track-name-wrap">
                  <div
                    className={`track-name-scroll ${track.title.length > 16 ? "scrolling" : ""}`}
                    style={{ fontSize: 15, fontWeight: 800, color: "#1c1917", letterSpacing: "-0.3px", lineHeight: 1.2 }}
                  >
                    {track.title.length > 16
                      ? `${track.title}   •   ${track.title}   •   `
                      : track.title}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "#a8a29e", marginTop: 3, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {track.artist}
                </div>
                <div style={{ fontSize: 9, color: track.color, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 5 }}>
                  {trackIdx + 1} / {TRACKS.length}
                </div>
              </div>

              {/* Collapse + Close */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                <button
                  onClick={() => setState("collapsed")}
                  style={{
                    background: "rgba(0,0,0,0.05)", border: "none", cursor: "pointer",
                    borderRadius: 8, padding: "5px 6px", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    color: "#78716c", transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.09)"; e.currentTarget.style.color = "#1c1917"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.05)"; e.currentTarget.style.color = "#78716c"; }}
                  title="Collapse"
                >
                  <IconChevronDown />
                </button>
                <button
                  onClick={() => setState("hidden")}
                  style={{
                    background: "rgba(0,0,0,0.05)", border: "none", cursor: "pointer",
                    borderRadius: 8, padding: "5px 6px", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    color: "#78716c", transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#ef4444"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.05)"; e.currentTarget.style.color = "#78716c"; }}
                  title="Close"
                >
                  <IconClose />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div
              ref={progressRef}
              className="progress-bar"
              onClick={seek}
              style={{
                width: "100%", height: 4, background: "#e7e5e4",
                borderRadius: 99, position: "relative", marginBottom: 6,
              }}
            >
              <div
                className="progress-fill"
                style={{
                  width: `${progressPct}%`, height: "100%",
                  background: `linear-gradient(90deg, ${track.color}, ${track.color}cc)`,
                  borderRadius: 99,
                  transition: dragging ? "none" : "width 0.1s linear",
                  position: "relative",
                }}
              >
                <div style={{
                  position: "absolute", right: -5, top: "50%",
                  transform: "translateY(-50%)",
                  width: 10, height: 10, borderRadius: "50%",
                  background: track.color,
                  boxShadow: `0 0 0 2px #fff, 0 0 0 3px ${track.color}`,
                  opacity: progressPct > 0 ? 1 : 0,
                }} />
              </div>
            </div>

            {/* Time */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#a8a29e", fontFamily: "monospace", fontWeight: 600 }}>
              <span>{fmt(currentTime)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div style={{ padding: "14px 20px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 14 }}>

              {/* Prev */}
              <button
                className="player-btn"
                onClick={handlePrev}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: 8, borderRadius: "50%", color: "#78716c",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s, transform 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; e.currentTarget.style.color = "#1c1917"; e.currentTarget.style.transform = "scale(1.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#78716c"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                <IconPrev />
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: track.color, border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", margin: "0 8px",
                  boxShadow: `0 6px 24px ${track.color}55`,
                  transition: "background 0.3s, box-shadow 0.3s, transform 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.filter = "brightness(1.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.filter = "none"; }}
              >
                {isPlaying ? <IconPause /> : <IconPlay />}
              </button>

              {/* Next */}
              <button
                className="player-btn"
                onClick={handleNext}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: 8, borderRadius: "50%", color: "#78716c",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s, transform 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; e.currentTarget.style.color = "#1c1917"; e.currentTarget.style.transform = "scale(1.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#78716c"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                <IconNext />
              </button>
            </div>

            {/* Volume */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
              <IconVolume />
              <input
                type="range"
                min={0} max={1} step={0.01}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="volume-slider"
                style={{
                  WebkitAppearance: "none", appearance: "none",
                  height: 3, borderRadius: 2, outline: "none", cursor: "pointer",
                  background: `linear-gradient(to right, ${track.color} 0%, ${track.color} ${volume * 100}%, #e7e5e4 ${volume * 100}%, #e7e5e4 100%)`,
                  width: 80,
                }}
              />
            </div>

            {/* Track list */}
            <div style={{
              display: "flex", gap: 5, flexWrap: "wrap",
              justifyContent: "center", marginTop: 14,
              maxHeight: 72, overflowY: "auto",
            }}>
              {TRACKS.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => selectTrack(i)}
                  style={{
                    padding: "3px 9px", borderRadius: 99,
                    border: `1px solid ${i === trackIdx ? t.color : "#e7e5e4"}`,
                    background: i === trackIdx ? `${t.color}15` : "transparent",
                    fontSize: 10, fontWeight: i === trackIdx ? 700 : 500,
                    color: i === trackIdx ? t.color : "#a8a29e",
                    cursor: "pointer", transition: "all 0.15s",
                    fontFamily: "inherit", whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => { if (i !== trackIdx) { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.color = t.color; } }}
                  onMouseLeave={(e) => { if (i !== trackIdx) { e.currentTarget.style.borderColor = "#e7e5e4"; e.currentTarget.style.color = "#a8a29e"; } }}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}