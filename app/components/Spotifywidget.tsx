'use client';
import { useState, useEffect } from "react";
import { Music } from "lucide-react";

interface SpotifyData {
  isPlaying: boolean;
  title: string | null;
  artist?: string;
  album?: string;
  albumArt?: string | null;
  url?: string | null;
}

export default function SpotifyWidget() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () =>
      fetch("/api/spotify")
        .then(r => r.json())
        .then(setData)
        .catch(() => {})
        .finally(() => setLoading(false));

    fetchData();
    // Poll every 30s
    const id = setInterval(fetchData, 30000);
    return () => clearInterval(id);
  }, []);

  const inner = (
    <div
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${data?.isPlaying ? "#1DB95440" : "var(--border-default)"}`,
        borderRadius: 12, padding: "11px 13px",
        display: "flex", alignItems: "center", gap: 10,
        transition: "border-color 0.3s",
        cursor: data?.isPlaying ? "pointer" : "default",
      }}
      onMouseEnter={e => { if (data?.isPlaying) e.currentTarget.style.borderColor = "#1DB954"; }}
      onMouseLeave={e => { if (data?.isPlaying) e.currentTarget.style.borderColor = "#1DB95440"; }}
    >
      {/* Album art / icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 7, overflow: "hidden",
        flexShrink: 0, background: "var(--bg-hover)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        {data?.isPlaying && data.albumArt ? (
          <img src={data.albumArt} alt={data.album} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Music size={14} color="var(--text-ghost)" />
        )}
        {data?.isPlaying && (
          <div style={{ position: "absolute", bottom: 2, right: 2, width: 8, height: 8, borderRadius: "50%", background: "#1DB954", border: "1.5px solid var(--bg-card)" }} />
        )}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {loading ? (
          <>
            <div style={{ height: 8, width: "60%", background: "var(--bg-hover)", borderRadius: 4, marginBottom: 6 }} />
            <div style={{ height: 7, width: "40%", background: "var(--bg-hover)", borderRadius: 4 }} />
          </>
        ) : data?.isPlaying ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
              {/* Animated bars */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 1.5, height: 10, flexShrink: 0 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 2, background: "#1DB954", borderRadius: 1,
                    animation: `spotifyBar 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
                    height: i === 1 ? 10 : 6,
                  }} />
                ))}
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {data.title}
              </span>
            </div>
            <div style={{ fontSize: 9, color: "var(--text-ghost)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {data.artist}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-faint)", marginBottom: 2 }}>Not playing</div>
            <div style={{ fontSize: 9, color: "var(--text-dead)" }}>Spotify is quiet right now</div>
          </>
        )}
      </div>

      {/* Spotify logo + status */}
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill={data?.isPlaying ? "#1DB954" : "var(--text-dead)"}>
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
        <span style={{ fontSize: 8, color: data?.isPlaying ? "#1DB954" : "var(--text-dead)", fontWeight: 700, letterSpacing: 0.5 }}>
          {data?.isPlaying ? "LIVE" : "OFFLINE"}
        </span>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes spotifyBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
      {data?.isPlaying && data.url ? (
        <a href={data.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
          {inner}
        </a>
      ) : inner}
    </>
  );
}