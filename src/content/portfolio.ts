export type ProjectId = "halo" | "kaushaliq" | "geovista" | "agrozyro";
export interface Project {
  id: ProjectId;
  name: string;
  category: string;
  status: string;
  summary: string;
  stack: string[];
  stackLabel?: string;
  contribution: string;
  details: { label: string; text: string }[];
  /** Optional genuine screenshot supplied by the owner; use /assets/... for a public file. */
  image?: { src: string; alt: string; caption: string };
}
export const projects: Project[] = [
  {
    id: "geovista",
    name: "GeoVISTA",
    category: "SPATIAL · PROTOTYPE",
    status: "Prototype",
    summary:
      "Property intelligence with another dimension. Exploring buildings, terrain, and boundaries beyond a flat cadastral map.",
    stack: [
      "React",
      "TypeScript",
      "CesiumJS",
      "Node.js",
      "Python",
      "Azure Blob Storage",
    ],
    contribution:
      "Developed a 3D property-intelligence prototype and processed building, terrain, boundary, and elevation datasets using Python.",
    details: [
      {
        label: "Spatial architecture",
        text: "The resume describes CesiumJS visualization workflows, a Node.js REST API, a Groq-powered assistant, and Azure Blob Storage architecture. Open the actual prototype to inspect its current implementation and service availability.",
      },
      {
        label: "Questions to explore",
        text: "Dataset access, provenance, and boundaries around assistant inputs are useful review areas. The prototype’s records and access controls must be assessed in the original application; this portfolio adds no property or ownership records.",
      },
      {
        label: "Beyond the flat map",
        text: "Height and vertical representation change how a property is understood. The original application exposes its spatial interface directly; no replacement map is drawn in this portfolio.",
      },
    ],
  },
  {
    id: "kaushaliq",
    name: "KaushalIQ",
    category: "DATA · INTELLIGENCE",
    status: "Prototype",
    summary:
      "Making sense of a changing labour market. Connecting skill demand, workforce supply, gaps, trends, and forecasts.",
    stack: ["Python", "FastAPI", "React", "Machine Learning", "Data Analytics"],
    contribution:
      "Designed a modular analytics pipeline and FastAPI-based intelligence APIs for demand, supply, skill gaps, trends, and forecasting workflows.",
    details: [
      {
        label: "Inside the pipeline",
        text: "The pipeline design covers ingestion, validation, cleaning, normalization, feature engineering, analytics, and ML/forecasting workflows.",
      },
      {
        label: "Questions to explore",
        text: "Data provenance, validation, and access boundaries matter in a labour-market system. The original application exposes its own published-data coverage and error states; this portfolio makes no claim about production data controls.",
      },
      {
        label: "Information design",
        text: "Moving from a broad demand signal to a specific analytical question. The original application keeps published observations and unavailable dimensions distinct.",
      },
    ],
  },
  {
    id: "halo",
    name: "Halo",
    category: "AI · DESKTOP",
    status: "Desktop prototype · AI planned",
    summary:
      "An AI assistant that starts at home. A local-first desktop project with a replaceable companion called Spidey.",
    stackLabel: "Planned stack",
    stack: [
      "Tauri 2",
      "React",
      "TypeScript",
      "Vite",
      "Rust",
      "Python",
      "Ollama",
    ],
    contribution:
      "Exploring a desktop assistant with local inference and optional cloud providers. The native companion prototype exists; provider inference is still planned.",
    details: [
      {
        label: "Architecture direction",
        text: "Planned Tauri 2 desktop shell, React interface, Rust layer, and separate Python backend. Ollama and optional cloud providers are part of the proposed architecture.",
      },
      {
        label: "Questions to explore",
        text: "Where does local data end and a cloud request begin? Provider consent and desktop permissions are design questions here, not verified security guarantees.",
      },
      {
        label: "Interaction direction",
        text: "Spidey gives the assistant a companion presence. The concept separates the companion's identity from the underlying provider so the character can be replaced.",
      },
    ],
  },
  {
    id: "agrozyro",
    name: "AgroZyro",
    category: "COMMERCE · AGRICULTURE",
    status: "In development",
    summary:
      "A shared marketplace for agriculture. Designed to connect farmers, buyers, sellers, traders, and agricultural businesses.",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
      "Prisma",
      "Auth.js",
    ],
    contribution:
      "Designed buyer, seller, product, inventory, order, payment, and market-rate workflows, including commodity quantities in KG and Quintal.",
    details: [
      {
        label: "Application design",
        text: "A Next.js and TypeScript application in development, with PostgreSQL, Prisma, and Auth.js in the architecture. The available application currently has frontend marketplace pages; backend commerce flows are not verified.",
      },
      {
        label: "Design considerations",
        text: "The resume documents role-based access, validation, and secret-management design. These are architecture intentions, not a security audit or proof of deployed controls.",
      },
      {
        label: "A clearer exchange",
        text: "The proposed marketplace makes commodity, quantity, and intent explicit. The original frontend explores marketplace presentation; its static listings are not live inventory.",
      },
    ],
  },
];
export const experience = [
  {
    period: "May — Jun 2026",
    title: "Backend development intern",
    organization: "Pinnacle Labs · Remote",
    description:
      "Worked on backend development and problem-solving tasks involving C++, APIs, and scalable application workflows.",
  },
  {
    period: "Apr 2026 — Present",
    title: "Security research & bug hunting",
    organization: "HackerOne & Intigriti · Independent practice",
    description:
      "Developing practical skills in web security, vulnerability assessment, reconnaissance, and responsible disclosure workflows.",
  },
  {
    period: "Sep 2026 — Present",
    title: "Smart India Hackathon 2026",
    organization: "Internal round qualifier · Team Z-AXIS",
    description:
      "Worked on ideation, technical planning, and solution presentation at LNCT&S, Bhopal.",
  },
];
export const education = [
  {
    period: "2024 — 2028",
    title: "B.Tech · Computer Science Engineering in Cybersecurity",
    detail: "RGPV",
    institution: "Lakshmi Narain College of Technology & Science, Bhopal",
  },
  {
    period: "2024",
    title: "Senior Secondary Education",
    detail: "NIOS",
    institution: "Patna High School, Patna",
  },
  {
    period: "2012–2022",
    title: "Secondary Education",
    detail: "CBSE",
    institution: "Gyan Niketan, Patna",
  },
];
export const skillGroups = [
  {
    name: "Languages",
    items: [
      "Python",
      "C++",
      "JavaScript",
      "TypeScript",
      "SQL",
      "HTML",
      "CSS",
      "Rust",
    ],
  },
  {
    name: "Frontend",
    items: ["React", "Next.js", "Vite", "Tailwind CSS"],
  },
  {
    name: "Backend & APIs",
    items: ["FastAPI", "Node.js", "REST APIs", "JSON", "API Integration"],
  },
  {
    name: "AI & Data",
    items: [
      "LLM APIs",
      "AI Agents",
      "LangGraph",
      "RAG",
      "Prompt Engineering",
      "Ollama",
      "Machine Learning",
      "Data Analytics",
    ],
  },
  {
    name: "Databases & Infrastructure",
    items: [
      "PostgreSQL",
      "MySQL",
      "Redis",
      "Qdrant",
      "Prisma",
      "CesiumJS",
      "GeoJSON",
      "GIS Data Processing",
      "Azure",
      "Azure Blob Storage",
    ],
  },
  {
    name: "Security & Developer Tools",
    items: [
      "Cybersecurity Fundamentals",
      "Operating Systems",
      "Computer Networks",
      "Git",
      "GitHub",
      "Docker",
      "Postman",
      "VS Code",
      "n8n",
      "Zapier",
      "Tauri",
      "DSA",
      "OOP",
    ],
  },
];
