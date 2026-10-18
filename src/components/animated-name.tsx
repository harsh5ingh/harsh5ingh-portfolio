"use client";

import { useEffect, useRef } from "react";
import { site } from "@/config/site";
import { createNameReveal, type NameFrame } from "@/lib/name-reveal";

export function AnimatedName() {
  const displayRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const display = displayRef.current;
    if (!display) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const names = { en: site.name, hi: "हर्ष कुमार" };
    function paint(frame: NameFrame) {
      // One visible text node owns every frame, including the exact final string.
      // No retained noise layer or crossfade can leak the previous name.
      display!.lang = frame.language;
      display!.textContent = frame.glyphs?.join("") ?? names[frame.language];
    }
    const cycle = createNameReveal(names, paint, {
      now: () => performance.now(),
      requestFrame: (callback) => window.requestAnimationFrame(callback),
      cancelFrame: (id) => window.cancelAnimationFrame(id),
      setTimer: (callback, delay) => window.setTimeout(callback, delay),
      clearTimer: (id) => window.clearTimeout(id),
    }, media.matches, document.hidden);
    const motionChange = () => cycle.setReducedMotion(media.matches);
    const visibilityChange = () => cycle.setHidden(document.hidden);
    media.addEventListener("change", motionChange);
    document.addEventListener("visibilitychange", visibilityChange);
    return () => {
      cycle.dispose();
      media.removeEventListener("change", motionChange);
      document.removeEventListener("visibilitychange", visibilityChange);
      display.lang = "en";
      display.textContent = site.name;
    };
  }, []);
  return (
    <span className="animated-name">
      <span className="sr-only">{site.name}</span>
      {/* Inert measurements reserve both names' dimensions; never animated or visible. */}
      <span className="name-size" aria-hidden="true" style={{ visibility: "hidden" }}>{site.name}</span>
      <span className="name-size" lang="hi" aria-hidden="true" style={{ visibility: "hidden" }}>हर्ष कुमार</span>
      <span ref={displayRef} className="name-display" lang="en" aria-hidden="true">{site.name}</span>
    </span>
  );
}
