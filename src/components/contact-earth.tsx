"use client";

import { useEffect, useRef, useState } from "react";
import { SocialOrbit } from "./social-orbit";
import {
  advanceRotation,
  geographicPoint,
  INDIA,
  INITIAL_VIEW,
  normalizeLongitude,
  projectPoint,
  type Vector3,
} from "@/lib/globe";

const indiaPoint = geographicPoint(INDIA.latitude, INDIA.longitude);
const initialIndia = projectPoint(
  indiaPoint,
  INITIAL_VIEW.longitude,
  INITIAL_VIEW.latitude,
);

export function ContactEarth() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const surface = surfaceRef.current;
    if (!canvas || !surface) return;
    let context: CanvasRenderingContext2D | null;
    try {
      context = canvas.getContext("2d");
    } catch {
      return;
    }
    if (!context) return; // The theme-aware static map remains visible.
    const ctx = context;
    const abort = new AbortController();
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let points: Vector3[] = [];
    let longitude = INITIAL_VIEW.longitude;
    let latitude = INITIAL_VIEW.latitude;
    let speed = 1;
    let frame = 0;
    let lastTime = 0;
    let visible = false;
    let loaded = false;
    let focused = false;
    let width = 400;
    let pointer: { id: number; x: number; y: number; touch: boolean } | null =
      null;
    let colors = { sea: "", land: "", border: "", accent: "", contrast: "" };

    function readColors() {
      const style = getComputedStyle(surface!);
      colors = {
        sea: style.getPropertyValue("--globe-background").trim(),
        land: style.getPropertyValue("--globe-land").trim(),
        border: style.getPropertyValue("--globe-border").trim(),
        accent: style.getPropertyValue("--globe-accent").trim(),
        contrast: style.getPropertyValue("--globe-background").trim(),
      };
      draw();
    }
    function draw() {
      if (!loaded) return;
      const radius = width * 0.4425;
      const center = width / 2;
      ctx.clearRect(0, 0, width, width);
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = colors.sea;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.border;
      ctx.stroke();
      ctx.fillStyle = colors.land;
      ctx.beginPath();
      for (const point of points) {
        const [x, y, depth] = projectPoint(point, longitude, latitude);
        if (depth <= 0.015) continue;
        const dot = (width / 400) * (0.65 + 0.7 * depth);
        ctx.moveTo(center + x * radius + dot, center - y * radius);
        ctx.arc(center + x * radius, center - y * radius, dot, 0, Math.PI * 2);
      }
      ctx.fill();
      const [x, y, depth] = projectPoint(indiaPoint, longitude, latitude);
      // Hide the marker on the far hemisphere; never draw it through the Earth.
      if (depth > 0.04) {
        const px = center + x * radius;
        const py = center - y * radius;
        ctx.beginPath();
        ctx.arc(px, py, width * 0.013, 0, Math.PI * 2);
        ctx.fillStyle = colors.accent;
        ctx.fill();
        ctx.strokeStyle = colors.contrast;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      describeView();
    }
    function shouldRotate() {
      return (
        loaded &&
        visible &&
        !document.hidden &&
        !media.matches &&
        !focused &&
        !pointer
      );
    }
    function tick(time: number) {
      frame = 0;
      if (!shouldRotate()) return;
      // A 30fps cap keeps the small illustration inexpensive on high-refresh screens.
      if (!lastTime) lastTime = time;
      const elapsed = time - lastTime;
      if (elapsed >= 1000 / 30) {
        const next = advanceRotation(longitude, speed, elapsed);
        longitude = next.longitude;
        speed = next.speed;
        lastTime = time;
        draw();
      }
      frame = requestAnimationFrame(tick);
    }
    function syncAnimation() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      if (shouldRotate()) frame = requestAnimationFrame(tick);
    }
    function describeView() {
      surface!.setAttribute(
        "aria-valuenow",
        String(Math.round(normalizeLongitude(longitude))),
      );
      surface!.setAttribute(
        "aria-valuetext",
        `View centred at ${Math.round(normalizeLongitude(longitude))} degrees east`,
      );
    }
    function endDrag(event: PointerEvent) {
      if (pointer?.id !== event.pointerId) return;
      pointer = null;
      if (surface!.hasPointerCapture(event.pointerId))
        surface!.releasePointerCapture(event.pointerId);
      surface!.removeAttribute("data-dragging");
      speed = 0;
      describeView();
      syncAnimation();
    }
    function beginDrag(event: PointerEvent) {
      if (!loaded || pointer || !event.isPrimary || event.button !== 0) return;
      focused = false;
      pointer = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        touch: event.pointerType === "touch",
      };
      surface!.setPointerCapture(event.pointerId);
      surface!.setAttribute("data-dragging", "true");
      syncAnimation();
    }
    function moveDrag(event: PointerEvent) {
      if (pointer?.id !== event.pointerId) return;
      longitude = normalizeLongitude(
        longitude - ((event.clientX - pointer.x) * 180) / width,
      );
      if (!pointer.touch)
        latitude = Math.max(
          -60,
          Math.min(60, latitude + ((event.clientY - pointer.y) * 120) / width),
        );
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      draw();
    }
    function keyDown(event: KeyboardEvent) {
      if (
        !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
      )
        return;
      event.preventDefault();
      {
        longitude = normalizeLongitude(
          longitude +
            (event.key === "ArrowLeft"
              ? 10
              : event.key === "ArrowRight"
                ? -10
                : 0),
        );
        latitude = Math.max(
          -60,
          Math.min(
            60,
            latitude +
              (event.key === "ArrowDown"
                ? 10
                : event.key === "ArrowUp"
                  ? -10
                  : 0),
          ),
        );
        describeView();
        draw();
      }
    }
    function focus() {
      // Pause for keyboard users; a pointer click must still resume on release.
      focused = surface!.matches(":focus-visible");
      describeView();
      syncAnimation();
    }
    function blur() {
      focused = false;
      speed = 0;
      syncAnimation();
    }
    function motionChange() {
      syncAnimation();
    }
    function resize() {
      width = surface!.getBoundingClientRect().width;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(width * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    }
    function contextLost() {
      loaded = false;
      setReady(false);
      syncAnimation();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(surface);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncAnimation();
    });
    intersection.observe(surface);
    readColors();
    media.addEventListener("change", motionChange);
    document.addEventListener("visibilitychange", syncAnimation);
    surface.addEventListener("pointerdown", beginDrag);
    surface.addEventListener("pointermove", moveDrag);
    surface.addEventListener("pointerup", endDrag);
    surface.addEventListener("pointercancel", endDrag);
    surface.addEventListener("lostpointercapture", endDrag);
    surface.addEventListener("keydown", keyDown);
    surface.addEventListener("focus", focus);
    surface.addEventListener("blur", blur);
    canvas.addEventListener("contextlost", contextLost);
    fetch("/maps/land-points.json", { signal: abort.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Map unavailable");
        return response.json();
      })
      .then((coordinates: [number, number][]) => {
        if (abort.signal.aborted) return;
        points = coordinates.map(([lat, lon]) => geographicPoint(lat, lon));
        loaded = true;
        setReady(true);
        resize();
        syncAnimation();
      })
      .catch(() => {
        /* Keep the local static map on network failure or unmount. */
      });
    return () => {
      abort.abort();
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      media.removeEventListener("change", motionChange);
      document.removeEventListener("visibilitychange", syncAnimation);
      surface.removeEventListener("pointerdown", beginDrag);
      surface.removeEventListener("pointermove", moveDrag);
      surface.removeEventListener("pointerup", endDrag);
      surface.removeEventListener("pointercancel", endDrag);
      surface.removeEventListener("lostpointercapture", endDrag);
      surface.removeEventListener("keydown", keyDown);
      surface.removeEventListener("focus", focus);
      surface.removeEventListener("blur", blur);
      canvas.removeEventListener("contextlost", contextLost);
      if (pointer && surface.hasPointerCapture(pointer.id))
        surface.releasePointerCapture(pointer.id);
    };
  }, []);

  return (
    <figure className="contact-earth">
      <SocialOrbit />
      <div
        ref={surfaceRef}
        className="earth-surface"
        data-ready={ready}
        role={ready ? "slider" : "img"}
        tabIndex={ready ? 0 : undefined}
        aria-label="Earth, with India marked"
        aria-valuemin={ready ? 0 : undefined}
        aria-valuemax={ready ? 360 : undefined}
        aria-valuenow={ready ? INITIAL_VIEW.longitude : undefined}
      >
        <div className="earth-fallback" aria-hidden="true">
          <div className="earth-ocean" />
          <div className="earth-land" />
          <span
            className="earth-india"
            style={{
              left: `${50 + initialIndia[0] * 44.25}%`,
              top: `${50 - initialIndia[1] * 44.25}%`,
            }}
          />
        </div>
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
      <figcaption>
        <span className="earth-legend">
          <span /> India
        </span>
      </figcaption>
    </figure>
  );
}
