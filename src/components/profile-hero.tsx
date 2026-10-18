"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, UserRound } from "lucide-react";
import { site } from "@/config/site";
import { AnimatedName } from "./animated-name";
import { FloatingTechnologies } from "./floating-technologies";

export function ProfileHero({
  portraitAvailable,
  resumeAvailable,
}: {
  portraitAvailable: boolean;
  resumeAvailable: boolean;
}) {
  const [portraitFailed, setPortraitFailed] = useState(false);
  return (
    <section
      className="profile-hero container"
      id="home"
      aria-labelledby="hero-heading"
    >
      <div className="profile-hero-grid">
        <div className="profile-hero-copy">
          <h1 id="hero-heading">
            <span className="hero-greeting">Hi, I’m</span> <AnimatedName />
          </h1>
          <p>
            A Computer Science student specializing in Cybersecurity, with a
            strong interest in building real-world solutions at the intersection
            of software engineering, AI and security.
          </p>
          <div className="profile-hero-actions">
            {resumeAvailable ? (
              <a className="editorial-button" href={site.resumePath} download>
                Download Resume <ArrowRight size={16} />
              </a>
            ) : (
              <span className="resume-unavailable">
                Resume download coming soon
              </span>
            )}
            <a className="hero-contact-button" href="#contact">
              Contact Me
            </a>
          </div>
          <FloatingTechnologies />
        </div>
        <div className="portrait-frame">
          {portraitAvailable && !portraitFailed ? (
            <Image
              src={site.portraitPath}
              alt={`Portrait of ${site.name}`}
              fill
              sizes="(max-width: 360px) calc(100vw - 44px), (max-width: 640px) 280px, (max-width: 1000px) 34vw, 340px"
              onError={() => setPortraitFailed(true)}
              preload
            />
          ) : (
            <div className="portrait-placeholder">
              <UserRound size={54} strokeWidth={0.8} aria-hidden="true" />
              <span>Portrait to come</span>
              <small>{site.name}</small>
            </div>
          )}
        </div>
      </div>
      <dl className="hero-facts">
        {[
          ["LNCT&S, Bhopal", "College"],
          ["2024–2028", "B.Tech studies"],
          ["Development · AI · Security", "Interests"],
        ].map(([value, label]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
