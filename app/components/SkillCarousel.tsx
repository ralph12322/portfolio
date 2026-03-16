'use client';
import { useState, useRef } from "react";

interface Skill { label: string; icon: string; }
interface SkillsBubbleProps { skills?: Skill[]; }

const DEFAULT_SKILLS: Skill[] = [
  { label: "React",      icon: "⚛"  }, { label: "Next.js",    icon: "N"  },
  { label: "TypeScript", icon: "TS" }, { label: "Node.js",    icon: "🟢" },
  { label: "MongoDB",    icon: "🍃" }, { label: "Express",    icon: "EX" },
  { label: "Python",     icon: "🐍" }, { label: "Tailwind",   icon: "🌊" },
  { label: "Git",        icon: "G"  }, { label: "PostgreSQL", icon: "🐘" },
  { label: "Docker",     icon: "🐳" }, { label: "GraphQL",    icon: "◈"  },
  { label: "Redis",      icon: "R"  }, { label: "Figma",      icon: "F"  },
  { label: "AWS",        icon: "☁"  },
];

export default function SkillsBubble({ skills = DEFAULT_SKILLS }: SkillsBubbleProps) {
  const [open, setOpen]                 = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelOpen, setPanelOpen]       = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const togglePanel = () => {
    if (!open) {
      setOpen(true); setPanelVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setPanelOpen(true)));
    } else {
      setPanelOpen(false); setOpen(false);
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
        @keyframes sb-scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes sb-pulse{0%,100%{box-shadow:0 0 0 0 rgba(45,212,191,0.35)}50%{box-shadow:0 0 0 8px rgba(45,212,191,0)}}
        @keyframes sb-tag-pop{from{opacity:0;transform:scale(0.75) translateY(4px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .sb-track{animation:sb-scroll 18s linear infinite}
        .sb-track:hover{animation-play-state:paused}
        .sb-bubble-btn{animation:sb-pulse 3s ease-in-out infinite;transition:transform 0.18s,background 0.18s}
        .sb-bubble-btn:hover{transform:scale(1.07) !important;animation:none;box-shadow:none}
        .sb-bubble-btn:active{transform:scale(0.95) !important}
        .sb-pill{transition:border-color 0.2s,background 0.2s}
        .sb-pill:hover{border-color:var(--accent) !important;background:var(--bg-hover) !important}
        .sb-pill:hover .sb-pill-label{color:var(--accent) !important}
        .sb-panel-tag{transition:color 0.18s,border-color 0.18s,background 0.18s;animation:sb-tag-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) both}
        .sb-panel-tag:hover{color:var(--accent) !important;border-color:var(--accent) !important;background:var(--bg-hover) !important}
        .sb-close-btn{transition:background 0.18s,color 0.18s}
        .sb-close-btn:hover{background:var(--bg-hover) !important;color:var(--accent) !important}
      `}</style>

      {/* Main bar */}
      <div style={{
        background:"var(--bg-subtle)", border:"1px solid var(--border-default)",
        borderRadius:14, minHeight:72, width:"100%", maxWidth:"100%",
        padding:"0 14px", display:"flex", alignItems:"center", gap:12,
        position:"relative", overflow:"hidden", boxSizing:"border-box",
        fontFamily:"'Sora',sans-serif",
      }}>
        {/* Carousel wrapper */}
        <div style={{flex:"1 1 0",minWidth:0,overflow:"hidden",position:"relative",height:56,display:"flex",alignItems:"center"}}>
          {/* Fade edges */}
          <div style={{position:"absolute",top:0,left:0,bottom:0,width:28,background:"linear-gradient(to right,var(--bg-subtle),transparent)",zIndex:2,pointerEvents:"none"}}/>
          <div style={{position:"absolute",top:0,right:0,bottom:0,width:28,background:"linear-gradient(to left,var(--bg-subtle),transparent)",zIndex:2,pointerEvents:"none"}}/>
          {/* Track */}
          <div className="sb-track" style={{display:"flex",alignItems:"center",gap:8,willChange:"transform"}}>
            {doubled.map((s,i)=>(
              <div key={`${s.label}-${i}`} className="sb-pill" style={{
                display:"flex",alignItems:"center",gap:7,padding:"0 11px",height:36,
                borderRadius:8,background:"var(--bg-card)",border:"1px solid var(--border-subtle)",
                whiteSpace:"nowrap",cursor:"default",flexShrink:0,
              }}>
                <div style={{width:20,height:20,borderRadius:4,background:"var(--bg-card-inner)",border:"1px solid var(--border-strong)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,flexShrink:0}}>{s.icon}</div>
                <span className="sb-pill-label" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:500,color:"var(--text-muted)",letterSpacing:"0.02em"}}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{width:1,height:40,background:"var(--border-default)",flexShrink:0}}/>

        {/* Bubble button */}
        <button className="sb-bubble-btn" onClick={togglePanel} style={{
          width:46,height:46,borderRadius:"50%",
          background:open?"var(--bg-hover)":"var(--accent)",
          border:open?"1.5px solid var(--accent)":"none",
          cursor:"pointer",display:"flex",flexDirection:"column",
          alignItems:"center",justifyContent:"center",gap:3,
          flexShrink:0,animationPlayState:open?"paused":"running",
        }}>
          <svg width={16} height={16} viewBox="0 0 20 20" fill="none">
            <rect x={2} y={3}    width={16} height={2.5} rx={1.25} fill={open?"var(--accent)":"#0a0908"} opacity={0.9}/>
            <rect x={2} y={8.75} width={11} height={2.5} rx={1.25} fill={open?"var(--accent)":"#0a0908"} opacity={0.6}/>
            <rect x={2} y={14.5} width={7}  height={2.5} rx={1.25} fill={open?"var(--accent)":"#0a0908"} opacity={0.35}/>
          </svg>
        </button>
      </div>

      {/* Bottom sheet */}
      {panelVisible && (
        <div ref={overlayRef} onClick={handleOverlayClick} style={{position:"fixed",inset:0,zIndex:1200,display:"flex",alignItems:"flex-end",justifyContent:"center",background:"rgba(0,0,0,0.25)",backdropFilter:"blur(2px)",transition:"background 0.3s"}}>
          <div style={{background:"var(--bg-card)",border:"1px solid var(--border-default)",borderTop:"1px solid rgba(45,212,191,0.15)",borderRadius:"16px 16px 0 0",padding:"20px clamp(16px,5vw,32px) 36px",width:"100%",maxWidth:"min(520px,100vw)",maxHeight:"80vh",overflowY:"auto",transform:panelOpen?"translateY(0)":"translateY(100%)",transition:"transform 0.38s cubic-bezier(0.34,1.56,0.64,1)"}}>
            <div style={{width:36,height:3,borderRadius:99,background:"var(--border-strong)",margin:"0 auto 18px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--text-ghost)",fontFamily:"'Sora',sans-serif"}}>Full Stack</span>
              <span style={{fontSize:11,color:"var(--text-ghost)",fontFamily:"'JetBrains Mono',monospace"}}>{skills.length} skills</span>
              <button className="sb-close-btn" onClick={togglePanel} style={{width:28,height:28,borderRadius:"50%",background:"var(--bg-card-inner)",border:"1px solid var(--border-strong)",color:"var(--text-faint)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {skills.map((s,i)=>(
                <span key={s.label} className="sb-panel-tag" style={{padding:"5px 12px",background:"var(--bg-card-inner)",border:"1px solid var(--border-strong)",borderRadius:6,fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:"var(--text-faint)",cursor:"default",animationDelay:`${i*35}ms`}}>{s.label}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}