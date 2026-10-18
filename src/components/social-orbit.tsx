import { site } from "@/config/site";
import { BrandIcon, brandStyle } from "./brand-icon";

export function SocialOrbit() {
  return (
    <nav className="social-orbit" aria-label="Find me online">
      {site.profiles
        .filter((profile) => profile.url)
        .map((profile) => (
          <a
            key={profile.label}
            className="brand-interactive"
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            style={brandStyle(profile.label)}
            aria-label={`${profile.label} profile — opens in a new tab`}
          >
            <BrandIcon name={profile.label} />
            <span>{profile.label}</span>
          </a>
        ))}
    </nav>
  );
}
