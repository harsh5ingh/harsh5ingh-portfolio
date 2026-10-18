"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ProjectShowcase, type ShowcaseProject } from "./project-showcase";
import { ProfileHero } from "./profile-hero";
import { ContactEarth } from "./contact-earth";
import { TechnicalStack } from "./technical-stack";
import { useTheme } from "next-themes";
import {
  ArrowUpRight,
  Check,
  Copy,
  Menu,
  Moon,
  Sun,
  X,
  ArrowRight,
} from "lucide-react";
import { site } from "@/config/site";
import {
  education,
  experience,
  projects,
} from "@/content/portfolio";

const subscribe = () => () => {};

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const dark = mounted && resolvedTheme === "dark";
  return (
    <button
      className="theme-switch"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label="Dark theme"
      aria-pressed={dark}
      disabled={!mounted}
    >
      <span className="theme-track" aria-hidden="true">
        <Sun className="theme-sun" size={20} strokeWidth={1.7} />
        <Moon className="theme-moon" size={19} strokeWidth={1.7} />
        <span className="theme-stars" />
      </span>
    </button>
  );
}

export function Portfolio({
  spideyAvailable,
  portraitAvailable,
  resumeAvailable,
}: {
  spideyAvailable: boolean;
  portraitAvailable: boolean;
  resumeAvailable: boolean;
}) {
  const showcaseProjects: ShowcaseProject[] = projects.map(project => ({
    ...project,
    repository: site.projects[project.id].repository,
    live: site.projects[project.id].live,
    artwork: project.id === "halo" && spideyAvailable
      ? { src: site.spideyAssetPath, alt: "User-supplied Spidey companion artwork" }
      : undefined,
  }));
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const desktop = window.matchMedia("(min-width: 961px)");
    const dismissOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const dismissOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    document.addEventListener("pointerdown", dismissOutside);
    desktop.addEventListener("change", dismissOnDesktop);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      desktop.removeEventListener("change", dismissOnDesktop);
    };
  }, [menuOpen]);
  const [copyState, setCopyState] = useState<"idle" | "copying" | "copied" | "error">(
    "idle",
  );
  async function copyEmail() {
    setCopyState("copying");
    try {
      await navigator.clipboard.writeText(site.email);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header" ref={headerRef}
        onKeyDown={(event) => {
          if (event.key === "Escape" && menuOpen) {
            setMenuOpen(false);
            menuButtonRef.current?.focus();
          }
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false);
        }}
      >
        <a href="#home" className="wordmark" aria-label={`${site.name}, home`}>
          harsh5ingh<span>.tech</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#work">Selected work</a>
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#contact">
            Let’s talk <ArrowUpRight size={13} />
          </a>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <button
            className="icon-button menu-toggle"
            ref={menuButtonRef}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Mobile navigation"
          hidden={!menuOpen}
        >
          {[
            ["work", "Selected work"],
            ["about", "About"],
            ["experience", "Experience"],
            ["contact", "Let’s talk"],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => { setMenuOpen(false); menuButtonRef.current?.focus(); }}>
              {label}
              <ArrowUpRight size={16} />
            </a>
          ))}
        </nav>
      </header>
      <main id="main">
        <ProfileHero
          portraitAvailable={portraitAvailable}
          resumeAvailable={resumeAvailable}
        />

        <section
          className="work-section container"
          id="work"
          aria-labelledby="work-title"
        >
          <div className="section-heading">
            <h2 id="work-title">Selected work.</h2>
            <p>
              Four projects across desktop, data, geospatial technology, and
              agriculture.
            </p>
          </div>
          <ProjectShowcase projects={showcaseProjects} />
        </section>

        <section
          id="about"
          className="container about-section"
          aria-labelledby="about-title"
        >
          <div className="two-column-section">
            <h2 id="about-title">Beyond the projects.</h2>
            <div className="about-copy">
              <p>
                My learning continues through open-source contributions with
                GSSoC, Hacktoberfest, and community-driven programs.
              </p>
              <p>
                Alongside those contributions, I study applied AI and
                responsible security research: understanding systems,
                documenting findings, and respecting disclosure boundaries.
              </p>
            </div>
          </div>
        </section>

        <section
          id="experience"
          className="container experience-section"
          aria-labelledby="experience-title"
        >
          <div className="two-column-section">
            <h2 id="experience-title">Experience.</h2>
            <div className="timeline">
              {experience.map((item) => (
                <article key={item.title} className="timeline-item">
                  <span className="micro-label">{item.period}</span>
                  <h3>{item.title}</h3>
                  <p className="organization">{item.organization}</p>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="skills"
          className="container skills-section"
          aria-labelledby="skills-title"
        >
          <div className="section-heading">
            <h2 id="skills-title">Technical skills.</h2>
            <p>Technologies I work with and concepts I study.</p>
          </div>
          <TechnicalStack />
        </section>

        <section
          id="education"
          className="container education-section"
          aria-labelledby="education-title"
        >
          <div className="two-column-section">
            <div>
              <h2 id="education-title">Education.</h2>
            </div>
            <div>
              {education.map((item) => (
                <article className="education-item" key={item.title}>
                  <span className="micro-label">{item.period}</span>
                  <h3>{item.title}</h3>
                  <span className="education-detail">{item.detail}</span>
                  <p>{item.institution}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="contact-section"
          aria-labelledby="contact-title"
        >
          <div className="container contact-grid">
            <div className="contact-copy">
              <h2 id="contact-title">Let’s build something thoughtful.</h2>
              <p>
                Projects, opportunities, or a good technical conversation.
                <br />
                I’d love to hear what you’re thinking.
              </p>
              <div className="contact-actions">
                <a className="email-link" href={`mailto:${site.email}`}>
                  {site.email}
                  <ArrowUpRight size={25} />
                </a>
                <button
                  className="icon-button"
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  disabled={copyState === "copying"}
                >
                  {copyState === "copied" ? (
                    <Check size={18} />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>
              </div>
              <span className="copy-status" role="status">
                {copyState === "copying"
                  ? "Copying email…"
                  : copyState === "copied"
                  ? "Email copied."
                  : copyState === "error"
                    ? "Could not copy. Select the email above or open your mail app."
                    : ""}
              </span>
            </div>
            <ContactEarth />
          </div>
        </section>
      </main>
      <footer className="container footer">
        <a href="#home" className="wordmark">
          {site.handle}
          <span>.</span>
        </a>
        <p>© 2026 Harsh Kumar. All rights reserved.</p>
        <a href="#home">
          Back to top <ArrowRight className="rotate-up" size={15} />
        </a>
      </footer>
    </>
  );
}
