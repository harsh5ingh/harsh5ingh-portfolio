import { Portfolio } from "@/components/portfolio";
import { existsSync } from "node:fs";
import path from "node:path";
import { site } from "@/config/site";

export default function Home() {
  return (
    <Portfolio
      spideyAvailable={existsSync(
        path.join(process.cwd(), "public", site.spideyAssetPath),
      )}
      portraitAvailable={existsSync(
        path.join(process.cwd(), "public", site.portraitPath),
      )}
      resumeAvailable={existsSync(
        path.join(process.cwd(), "public", site.resumePath),
      )}
    />
  );
}
