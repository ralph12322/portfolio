'use client';
import { useState, useEffect, useRef } from "react";
import { Music } from "lucide-react";
import { json } from "stream/consumers";

interface TrackData {
    isPlaying: boolean;
    title: string | null;
    artist?: string;
    album?: string;
    albumArt?: string | null;
    url?: string | null;
}

export default function SpotifyWidget() {
    const [data, setData] = useState<TrackData | null>(null);
    const [loading, setLoading] = useState(true);
    const [hovered, setHovered] = useState(false);
    const rotation = useRef<number>(0);
    const animRef = useRef<number | undefined>(undefined);
    const lastTime = useRef<number | undefined>(undefined);
    const discRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await fetch("/api/lastfm")
                const data = await res.json()
                setData(data)
            } catch (error) {
                console.log(error)
            } finally{
                setLoading(false)
            }
        }
        fetchData();
        const id = setInterval(fetchData, 3000);
        return () => clearInterval(id);
    }, []);

    // Rotate disc when playing
    useEffect(() => {
        if (!data?.isPlaying) {
            if (animRef.current) cancelAnimationFrame(animRef.current);
            return;
        }
        const animate = (time: number) => {
            if (lastTime.current) {
                rotation.current = (rotation.current + (time - lastTime.current) * 0.02) % 360;
                if (discRef.current) discRef.current.style.transform = `rotate(${rotation.current}deg)`;
            }
            lastTime.current = time;
            animRef.current = requestAnimationFrame(animate);
        };
        animRef.current = requestAnimationFrame(animate);
        return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
    }, [data?.isPlaying]);

    const hasArt = data?.albumArt && !data.albumArt.includes("2a96cbd8b46e442fc41c2b86b821562f");

    const content = (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: "var(--bg-card)",
                border: `1px solid ${hovered && data?.url ? "var(--accent)" : "var(--border-default)"}`,
                borderRadius: 14,
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                transition: "border-color 0.2s",
                cursor: data?.url ? "pointer" : "default",
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* Blurred bg from album art */}
            {hasArt && (
                <div style={{
                    position: "absolute", inset: 0, zIndex: 0,
                    backgroundImage: `url(${data!.albumArt})`,
                    backgroundSize: "cover", backgroundPosition: "center",
                    opacity: 0.07, filter: "blur(20px)",
                    transform: "scale(1.2)",
                    pointerEvents: "none",
                }} />
            )}

            {/* Spinning disc */}
            <div style={{ position: "relative", flexShrink: 0, zIndex: 1 }}>
                <div
                    ref={discRef}
                    style={{
                        width: 52, height: 52,
                        borderRadius: "50%",
                        overflow: "hidden",
                        background: "var(--bg-hover)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "3px solid var(--border-strong)",
                        boxSizing: "border-box",
                    }}
                >
                    {hasArt ? (
                        <img src={data!.albumArt!} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <Music size={18} color="var(--text-ghost)" />
                    )}
                </div>
                {/* Center hole */}
                <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: 10, height: 10, borderRadius: "50%",
                    background: "var(--bg-card)",
                    border: "2px solid var(--border-strong)",
                    zIndex: 2,
                }} />
                {/* Live indicator */}
                {data?.isPlaying && (
                    <div style={{
                        position: "absolute", bottom: 1, right: 1,
                        width: 10, height: 10, borderRadius: "50%",
                        background: "#1DB954",
                        border: "2px solid var(--bg-card)",
                        zIndex: 3,
                    }} />
                )}
            </div>

            {/* Track info */}
            <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
                {loading ? (
                    <>
                        <div style={{ height: 9, width: "55%", background: "var(--bg-hover)", borderRadius: 4, marginBottom: 7 }} />
                        <div style={{ height: 8, width: "35%", background: "var(--bg-hover)", borderRadius: 4, marginBottom: 6 }} />
                        <div style={{ height: 7, width: "45%", background: "var(--bg-hover)", borderRadius: 4 }} />
                    </>
                ) : data?.title ? (
                    <>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                            {data.isPlaying && (
                                <div style={{ display: "flex", alignItems: "flex-end", gap: 1.5, height: 11, flexShrink: 0 }}>
                                    {[0, 1, 2, 3].map(i => (
                                        <div key={i} style={{
                                            width: 2.5, borderRadius: 1.5,
                                            background: "#1DB954",
                                            animation: `bar 0.7s ease-in-out ${i * 0.12}s infinite alternate`,
                                            height: [7, 11, 8, 10][i],
                                        }} />
                                    ))}
                                </div>
                            )}
                            <span style={{
                                fontSize: 12, fontWeight: 700,
                                color: "var(--text-primary)",
                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            }}>
                                {data.title}
                            </span>
                        </div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {data.artist}
                        </div>
                        {data.album && (
                            <div style={{ fontSize: 9, color: "var(--text-ghost)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {data.album}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-faint)", marginBottom: 3 }}>Not playing</div>
                        <div style={{ fontSize: 9, color: "var(--text-dead)" }}>Quiet for now</div>
                    </>
                )}
            </div>

            {/* Right side: Last.fm logo + status */}
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, zIndex: 1 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={data?.isPlaying ? "#d51007" : "var(--text-dead)"} style={{ transition: "fill 0.3s" }}>
                    <path d="M10.599 1.011C4.759 1.421 0 6.33 0 12.299 0 18.49 5.01 23.5 11.2 23.5c4.93 0 9.14-3.17 10.66-7.58l-2.65-.9c-1.14 3.26-4.23 5.48-8.01 5.48-4.63 0-8.4-3.77-8.4-8.4 0-4.41 3.41-8.04 7.73-8.38L10.6 1.01zm4.56.47l-.93 3.03 1.85.57-.54 1.75-1.85-.57-1.97 6.41 1.85.57-.55 1.75-3.7-1.14 2.52-8.16-1.08-.33.54-1.75 1.08.33.93-3.03 1.85.57zM18.5 8.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5S22 13.93 22 12s-1.57-3.5-3.5-3.5zm0 1.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
                </svg>
                <span style={{
                    fontSize: 7, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase",
                    color: data?.isPlaying ? "#d51007" : data?.title ? "var(--text-ghost)" : "var(--text-dead)",
                    transition: "color 0.3s",
                }}>
                    {data?.isPlaying ? "live" : data?.title ? "recent" : "offline"}
                </span>
            </div>

            <style>{`
        @keyframes bar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
      `}</style>
        </div>
    );

    return data?.url ? (
        content
    ) : content;
}