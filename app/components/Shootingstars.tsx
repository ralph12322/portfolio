'use client';
import { useEffect, useRef, useState } from "react";

interface Star {
  x: number; y: number; size: number;
  opacity: number; twinkleSpeed: number; twinkleOffset: number;
}
interface Meteor {
  x: number; y: number; vx: number; vy: number;
  length: number; opacity: number; life: number; maxLife: number;
}

export default function ShootingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const read = () =>
      setIsLight(document.documentElement.getAttribute("data-theme") === "light");
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let t = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── DARK: white twinkling stars + meteor trails ── */
    const darkStars: Star[] = Array.from({ length: 500 }, () => ({
      x: Math.random(), y: Math.random(),
      size: Math.random() * 1.2 + 0.2,
      opacity: Math.random() * 0.5 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    const meteors: Meteor[] = [];
    let lastMeteor = 0;

    const spawnMeteor = () => {
      const angle = (Math.PI / 180) * (210 + Math.random() * 20);
      const speed = 0.0018 + Math.random() * 0.001;
      meteors.push({
        x: Math.random() * 0.7 + 0.2, y: Math.random() * 0.35,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        length: 0.06 + Math.random() * 0.07,
        opacity: 0, life: 0, maxLife: 80 + Math.random() * 40,
      });
    };

    /* ── LIGHT: teal twinkling stars + teal meteor trails ──
       Same structure as dark mode, just different colors.
       Stars are teal dots scattered across the full canvas,
       slowly twinkling — mirrors the dark mode feel exactly.   */
    const lightStars: Star[] = Array.from({ length: 500 }, () => ({
      x: Math.random(), y: Math.random(),
      size: Math.random() * 1.8 + 0.4,          /* slightly bigger than dark */
      opacity: Math.random() * 0.45 + 0.15,      /* more visible against light bg */
      twinkleSpeed: Math.random() * 0.018 + 0.004,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    const lightMeteors: Meteor[] = [];
    let lastLightMeteor = 0;

    const spawnLightMeteor = () => {
      const angle = (Math.PI / 180) * (210 + Math.random() * 20);
      const speed = 0.0015 + Math.random() * 0.001;
      lightMeteors.push({
        x: Math.random() * 0.7 + 0.2, y: Math.random() * 0.4,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        length: 0.05 + Math.random() * 0.06,
        opacity: 0, life: 0, maxLife: 90 + Math.random() * 50,
      });
    };

    const drawDark = (timestamp: number, W: number, H: number) => {
      for (const s of darkStars) {
        const tw = Math.sin(t * s.twinkleSpeed + s.twinkleOffset) * 0.25;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, s.opacity + tw)})`;
        ctx.fill();
      }
      if (timestamp - lastMeteor > 2200) { spawnMeteor(); lastMeteor = timestamp; }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life++; m.x += m.vx; m.y += m.vy;
        const p = m.life / m.maxLife;
        m.opacity = p < 0.2 ? p / 0.2 : p > 0.7 ? 1 - (p - 0.7) / 0.3 : 1;
        const hyp = Math.hypot(m.vx, m.vy);
        const tx = m.x - m.vx * (m.length / hyp);
        const ty = m.y - m.vy * (m.length / hyp);
        const g = ctx.createLinearGradient(tx * W, ty * H, m.x * W, m.y * H);
        g.addColorStop(0, `rgba(255,255,255,0)`);
        g.addColorStop(0.6, `rgba(180,255,240,${m.opacity * 0.35})`);
        g.addColorStop(1, `rgba(255,255,255,${m.opacity * 0.9})`);
        ctx.beginPath();
        ctx.moveTo(tx * W, ty * H); ctx.lineTo(m.x * W, m.y * H);
        ctx.strokeStyle = g; ctx.lineWidth = 1.2; ctx.lineCap = "round"; ctx.stroke();
        ctx.beginPath();
        ctx.arc(m.x * W, m.y * H, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${m.opacity * 0.95})`; ctx.fill();
        if (m.life >= m.maxLife || m.x < -0.1 || m.y > 1.1) meteors.splice(i, 1);
      }
    };

    const drawLight = (timestamp: number, W: number, H: number) => {
      /* Twinkling teal dots — same feel as dark stars */
      for (const s of lightStars) {
        const tw = Math.sin(t * s.twinkleSpeed + s.twinkleOffset) * 0.3;
        const op = Math.max(0, s.opacity + tw);
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(13,148,136,${op})`;
        ctx.fill();
      }

      /* Teal shooting stars — same rhythm as dark meteors */
      if (timestamp - lastLightMeteor > 2200) { spawnLightMeteor(); lastLightMeteor = timestamp; }
      for (let i = lightMeteors.length - 1; i >= 0; i--) {
        const m = lightMeteors[i];
        m.life++; m.x += m.vx; m.y += m.vy;
        const p = m.life / m.maxLife;
        m.opacity = p < 0.2 ? p / 0.2 : p > 0.7 ? 1 - (p - 0.7) / 0.3 : 1;
        const hyp = Math.hypot(m.vx, m.vy);
        const tx = m.x - m.vx * (m.length / hyp);
        const ty = m.y - m.vy * (m.length / hyp);
        const g = ctx.createLinearGradient(tx * W, ty * H, m.x * W, m.y * H);
        g.addColorStop(0, `rgba(13,148,136,0)`);
        g.addColorStop(0.6, `rgba(45,212,191,${m.opacity * 0.4})`);
        g.addColorStop(1, `rgba(13,148,136,${m.opacity * 0.85})`);
        ctx.beginPath();
        ctx.moveTo(tx * W, ty * H); ctx.lineTo(m.x * W, m.y * H);
        ctx.strokeStyle = g; ctx.lineWidth = 1.2; ctx.lineCap = "round"; ctx.stroke();
        ctx.beginPath();
        ctx.arc(m.x * W, m.y * H, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(13,148,136,${m.opacity * 0.9})`; ctx.fill();
        if (m.life >= m.maxLife || m.x < -0.1 || m.y > 1.1) lightMeteors.splice(i, 1);
      }
    };

    const draw = (timestamp: number) => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const light = document.documentElement.getAttribute("data-theme") === "light";
      if (light) drawLight(timestamp, W, H);
      else       drawDark(timestamp, W, H);
      t += 0.016;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      id="stars-canvas"
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: isLight ? 0.85 : 0.55,
        transition: "opacity 0.5s ease",
      }}
    />
  );
}