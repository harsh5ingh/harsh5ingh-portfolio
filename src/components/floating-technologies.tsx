"use client";
import { useEffect, useRef } from "react";
import { BrandIcon, brandStyle } from "./brand-icon";
import "./hero-marquee.css";
const technologies = [
  "React",
  "Next.js",
  "TypeScript",
  "Python",
  "Node.js",
  "PostgreSQL",
  "JavaScript",
  "Docker",
  "GitHub",
  "Rust",
  "Tauri",
  "Ollama",
];
export function FloatingTechnologies() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const area = root.current;
    const track = area?.querySelector<HTMLElement>("[data-marquee-track]");
    if (!area || !track || !Element.prototype.animate) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = matchMedia("(max-width: 640px)");
    let visible = false;
    let hovered = false;
    let ramp = 0;
    const animation = track.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-50%)" },
      ],
      { duration: 30000, iterations: Infinity, easing: "linear" },
    );
    const sync = () => {
      const staticLayout = reduced.matches || narrow.matches;
      area.dataset.moving = String(!staticLayout);
      if (staticLayout) animation.currentTime = 0;
      if (staticLayout || !visible || document.hidden)
        animation.pause();
      else animation.play();
    };
    const speed = () => {
      cancelAnimationFrame(ramp);
      const target = hovered ? 0.15 : 1;
      const initial = animation.playbackRate;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / 600);
        const eased = progress * progress * (3 - 2 * progress);
        animation.updatePlaybackRate(initial + (target - initial) * eased);
        if (progress < 1) ramp = requestAnimationFrame(tick);
      };
      ramp = requestAnimationFrame(tick);
    };
    const enter = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      hovered = true;
      speed();
    };
    const leave = () => {
      hovered = false;
      speed();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(area);
    reduced.addEventListener("change", sync);
    narrow.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    area.addEventListener("pointerenter", enter);
    area.addEventListener("pointerleave", leave);
    sync();
    return () => {
      animation.cancel();
      cancelAnimationFrame(ramp);
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      narrow.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      area.removeEventListener("pointerenter", enter);
      area.removeEventListener("pointerleave", leave);
      delete area.dataset.moving;
    };
  }, []);
  return (
    <div ref={root} className="hero-tech-viewport" data-moving="false" tabIndex={0} role="region" aria-label="Technology logos">
      <div className="hero-tech-track" data-marquee-track>
        {[false, true].map((duplicate) => (
          <ul
            key={String(duplicate)}
            className="hero-tech-group"
            aria-label={duplicate ? undefined : "Technologies behind the work"}
            aria-hidden={duplicate || undefined}
          >
            {technologies.map((name) => (
              <li key={name} className="hero-tech-item" style={brandStyle(name)}>
                <span role="img" aria-label={name} className="hero-tech-logo">
                  <BrandIcon name={name} />
                </span>
                <span className="hero-tech-name" aria-hidden="true">{name}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
