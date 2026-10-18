"use client";

import { skillGroups } from "@/content/portfolio";
import { BrandIcon, brandStyle } from "./brand-icon";

function TechnologyList({ items }: { items: readonly string[] }) {
  return (
    <ul className="technology-list">
      {items.map((name) => (
        <li key={name} tabIndex={0} style={brandStyle(name)}
          onPointerEnter={(event) => {
            // Use the actual input, not the device's primary-pointer classification.
            if (event.pointerType === "mouse" || (event.pointerType === "pen" && event.buttons === 0)) {
              event.currentTarget.dataset.hovered = "true";
            }
          }}
          onPointerLeave={(event) => { delete event.currentTarget.dataset.hovered; }}
          onPointerCancel={(event) => { delete event.currentTarget.dataset.hovered; }}
          onPointerDown={(event) => {
            if (event.pointerType !== "mouse") delete event.currentTarget.dataset.hovered;
          }}>
          <span className="technology-icon"><BrandIcon name={name} /></span>
          <span>{name}</span>
        </li>
      ))}
    </ul>
  );
}

export function TechnicalStack() {
  return (
    <div className="skills-grid">
      {skillGroups.map((group) => (
        <article key={group.name} className="skill-group">
          <h3>{group.name}</h3>
          <TechnologyList items={group.items.slice(0, 6)} />
          {group.items.length > 6 && (
            <details className="skill-more">
              <summary>More tools & concepts</summary>
              <TechnologyList items={group.items.slice(6)} />
            </details>
          )}
          {group.name === "AI & Data" && (
            <small>Ollama integration is planned for Halo.</small>
          )}
        </article>
      ))}
    </div>
  );
}
