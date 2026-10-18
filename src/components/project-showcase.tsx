"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useId, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/portfolio";
import "./project-showcase.css";
import { ProjectConcept } from "./project-concepts";

export type ShowcaseProject = Omit<Project, "id"> & {
  id: string;
  repository?: string;
  live?: string;
  image?: { src: string; alt: string; caption: string };
  artwork?: { src: string; alt: string };
};

// Adapted from the supplied ProjectShowcase: layered visuals, active-item
// transitions and manual navigation. CSS replaces JS viewport measurement;
// deterministic rotations replace random values generated during rendering.
export function ProjectShowcase({ projects }: { projects: readonly ShowcaseProject[] }) {
  const [selectedId, setSelectedId] = useState<string | undefined>(projects[0]?.id);
  const reducedMotion = useReducedMotion();
  const regionId = useId();
  const active = Math.max(0, projects.findIndex(project => project.id === selectedId));
  const project = projects[active];
  if (!project) return null;

  function move(direction: number) {
    setSelectedId(projects[(active + direction + projects.length) % projects.length].id);
  }

  return (
    <div className="project-showcase" role="region" aria-roledescription="carousel" aria-label="Selected projects">
      <div className="showcase-picker" role="group" aria-label="Choose a project">
        {projects.map(item => (
          <button key={item.id} type="button" aria-pressed={item.id === project.id}
            aria-controls={regionId} onClick={() => setSelectedId(item.id)}>{item.name}</button>
        ))}
      </div>
      <div className="showcase-grid" id={regionId}>
        <div className="showcase-stage">
          {/* Decorative backing sheets keep the supplied layered composition
              without duplicating images, text or keyboard targets. */}
          {!reducedMotion && projects.length > 1 && <div className="showcase-sheets" aria-hidden="true" />}
          <AnimatePresence initial={false} mode="sync">
            <motion.div key={project.id} className="showcase-visual"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.97, rotate: active % 2 ? 2 : -2, y: 8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeInOut" }}
            >
              <ProjectVisual key={`${project.id}:${project.image?.src ?? ""}:${project.artwork?.src ?? ""}`} project={project} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="showcase-details">
          <AnimatePresence initial={false}>
          <motion.div key={project.id} initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.25 }}>
            <h3>{project.name}</h3>
            <p className="showcase-status">{project.status}</p>
            <p className="showcase-description">{project.summary}</p>
            <p className="showcase-contribution">{project.contribution}</p>
            <ul className="showcase-technologies" aria-label={`${project.name} key technologies`}>
              {project.stack.slice(0, 3).map(technology => <li key={technology}>{technology}</li>)}
            </ul>
            <details className="showcase-technical">
              <summary>{project.stackLabel ?? "Technical details"}</summary>
              {project.details.map(detail => <p key={detail.label}><strong>{detail.label}.</strong> {detail.text}</p>)}
              <ul className="showcase-technologies" aria-label={`${project.name} full technology stack`}>
                {project.stack.map(technology => <li key={technology}>{technology}</li>)}
              </ul>
            </details>
          </motion.div>
          </AnimatePresence>
          <div className="showcase-links">
            {([ ["Source code", project.repository], ["Live site", project.live] ] as const).map(([label, url]) =>
              url ? <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                aria-label={`${project.name} ${label} — opens in a new tab`}>
                {label}<ArrowUpRight size={16} aria-hidden="true" />
              </a> : <span key={label} aria-disabled="true">{label}<small>Not available</small></span>
            )}
          </div>
        </div>
      </div>
      <div className="showcase-navigation" role="group" aria-label="Project navigation">
        <button type="button" disabled={projects.length < 2} aria-label="Previous project" aria-controls={regionId} onClick={() => move(-1)}>
          <ArrowLeft size={17} aria-hidden="true" />Previous
        </button>
        <p role="status" aria-live="polite" aria-atomic="true">{active + 1} / {projects.length}<span className="sr-only"> — {project.name}, {project.status}</span></p>
        <button type="button" disabled={projects.length < 2} aria-label="Next project" aria-controls={regionId} onClick={() => move(1)}>
          Next<ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function ProjectVisual({ project }: { project: ShowcaseProject }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [artworkFailed, setArtworkFailed] = useState(false);
  if (project.image && !imageFailed) return (
    <figure className="showcase-capture">
      <div className="showcase-image">
        <Image src={project.image.src} alt={project.image.alt} fill sizes="(max-width: 800px) 90vw, 45vw"
          style={{ objectFit: "contain" }} draggable={false} onError={() => setImageFailed(true)} />
      </div>
      <figcaption>{project.image.caption}</figcaption>
    </figure>
  );
  const companion = project.id === "halo" && !artworkFailed ? (
    <Image src={project.artwork?.src ?? "/assets/project-previews/spidey-prototype.png"}
      alt={project.artwork?.alt ?? "Spidey artwork from the Halo desktop prototype"}
      width={88} height={88} unoptimized draggable={false} onError={() => setArtworkFailed(true)} />
  ) : undefined;
  return <ProjectConcept id={project.id} name={project.name} companion={companion} />;
}
