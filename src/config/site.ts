/** Public values only. Never import credentials or server secrets into this module. */
function publicUrl(
  value: string | undefined,
  fallback?: string,
): string | undefined {
  const candidate = value?.trim() || fallback;
  if (!candidate) return undefined;
  try {
    const url = new URL(candidate);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
}

function projectLinks(repository: string | undefined, live: string | undefined) {
  return {
    repository: publicUrl(repository),
    live: publicUrl(live),
  };
}

export interface PublicSiteConfig {
  name: string;
  handle: string;
  url: string;
  description: string;
  email: string;
  portraitPath: string;
  resumePath: string;
  spideyAssetPath: string;
  profiles: { label: string; url: string | undefined }[];
  projects: Record<
    "halo" | "kaushaliq" | "geovista" | "agrozyro",
    { repository?: string; live?: string }
  >;
}

// Identity/profile defaults were supplied in the resume. Project URLs are env-only.
export const site: PublicSiteConfig = {
  name: "Harsh Kumar",
  spideyAssetPath: "/assets/spidey.svg",
  portraitPath: "/assets/photo.jpeg",
  resumePath: "/assets/harsh-kumar-resume.pdf",
  handle: "harsh5ingh",
  url:
    publicUrl(process.env.NEXT_PUBLIC_SITE_URL, "https://harsh5ingh.tech") ||
    "https://harsh5ingh.tech",
  description:
    "Harsh Kumar — Computer Science Engineering (Cybersecurity) student exploring full-stack development, AI engineering, and security. Selected projects, experiments, and experience.",
  email:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "harrshdev52@gmail.com",
  profiles: [
    {
      label: "GitHub",
      url: publicUrl(
        process.env.NEXT_PUBLIC_GITHUB_URL,
        "https://github.com/harsh5ingh",
      ),
    },
    {
      label: "LinkedIn",
      url: publicUrl(
        process.env.NEXT_PUBLIC_LINKEDIN_URL,
        "https://linkedin.com/in/harsh5ingh",
      ),
    },
    { label: "LeetCode", url: "https://leetcode.com/u/harsh5ingh/" },
    { label: "Codeforces", url: "https://codeforces.com/profile/harrshdev52" },
  ],
  projects: {
    halo: projectLinks(process.env.NEXT_PUBLIC_HALO_REPOSITORY_URL, process.env.NEXT_PUBLIC_HALO_LIVE_URL),
    kaushaliq: projectLinks(process.env.NEXT_PUBLIC_KAUSHALIQ_REPOSITORY_URL, process.env.NEXT_PUBLIC_KAUSHALIQ_LIVE_URL),
    geovista: projectLinks(process.env.NEXT_PUBLIC_GEOVISTA_REPOSITORY_URL, process.env.NEXT_PUBLIC_GEOVISTA_LIVE_URL),
    agrozyro: projectLinks(process.env.NEXT_PUBLIC_AGROZYRO_REPOSITORY_URL, process.env.NEXT_PUBLIC_AGROZYRO_LIVE_URL),
  },
};
