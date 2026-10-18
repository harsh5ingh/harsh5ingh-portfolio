import type { CSSProperties } from "react";
import catalog from "@/content/brand-icons.json";

export function brandStyle(name: string): CSSProperties {
  const icon = catalog[name as keyof typeof catalog];
  return icon
    ? ({
        "--brand-color": [
          "#000000",
          "#FFFFFF",
          "#181717",
          "#000",
          "#fff",
        ].includes(icon.color)
          ? "var(--foreground)"
          : icon.color,
      } as CSSProperties)
    : {};
}

export function BrandIcon({ name }: { name: string }) {
  const icon = catalog[name as keyof typeof catalog];
  // Concepts and unsupported brands remain clearly labelled, without invented logos.
  if (!icon) return <span className="concept-mark" aria-hidden="true" />;
  return (
    <span
      className="brand-icon"
      aria-hidden="true"
      style={{ maskImage: `url(/icons/${icon.slug}.svg)` }}
    />
  );
}
