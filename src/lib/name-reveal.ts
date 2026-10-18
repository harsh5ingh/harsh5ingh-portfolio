export type NameLanguage = "en" | "hi";
export type NameFrame = { language: NameLanguage; glyphs: string[] | null };
export const REVEAL_DURATION = 800;

export function nameGraphemes(name: string): { text: string; index: number }[] | null {
  // Never fall back to splitting UTF-16 code units or Hindi combining marks.
  if (typeof Intl.Segmenter !== "function") return null;
  return Array.from(new Intl.Segmenter("hi", { granularity: "grapheme" }).segment(name),
    part => ({ text: part.segment, index: part.index }));
}

const noise = {
  en: Array.from("ABCDEFGHJKLMNPQRSTUVWXYZ23456789#%&?"),
  hi: ["क", "ख", "ग", "च", "त", "न", "म", "र", "स", "कि", "कु", "मा", "र्ष", "#", "7"],
};

export function scrambleGraphemes(glyphs: readonly string[], language: NameLanguage, progress: number, random = Math.random): string[] {
  const count = glyphs.filter(glyph => !/^\s+$/u.test(glyph)).length;
  const resolved = Math.floor(Math.max(0, Math.min(1, progress)) * count);
  let position = 0;
  return glyphs.map(glyph => {
    if (/^\s+$/u.test(glyph)) return glyph;
    if (position++ < resolved) return glyph;
    return noise[language][Math.min(noise[language].length - 1, Math.floor(random() * noise[language].length))];
  });
}

type Clock = {
  now: () => number;
  requestFrame: (callback: () => void) => number;
  cancelFrame: (id: number) => void;
  setTimer: (callback: () => void, delay: number) => number;
  clearTimer: (id: number) => void;
};

/** One owner for the existing single 10s English → Hindi → English cycle. */
export function createNameReveal(names: Record<NameLanguage, string>, paint: (frame: NameFrame) => void, clock: Clock,
  initiallyReduced = false, initiallyHidden = false) {
  const parts = { en: nameGraphemes(names.en), hi: nameGraphemes(names.hi) };
  let origin = clock.now();
  let reduced = initiallyReduced;
  let hidden = initiallyHidden;
  let disposed = false;
  let raf = 0;
  let timer = 0;
  let lastPhase = -1;
  let lastBucket = -1;

  const cancel = () => {
    clock.cancelFrame(raf);
    clock.clearTimer(timer);
    raf = timer = 0;
  };
  function tick() {
    cancel();
    if (disposed || hidden) return;
    if (reduced || !parts.en || !parts.hi) {
      paint({ language: "en", glyphs: null });
      return;
    }
    const elapsed = Math.max(0, clock.now() - origin);
    const phase = elapsed >= 9000 ? 2 : elapsed >= 4000 ? 1 : 0;
    const language = phase === 1 ? "hi" : "en";
    const start = [0, 4000, 9000][phase];
    const local = elapsed - start;
    // ~14 glyph changes/second; no frame loop runs during the reading holds.
    const bucket = local >= REVEAL_DURATION ? -2 : Math.floor(local / 70);
    if (phase !== lastPhase || bucket !== lastBucket) {
      paint({ language, glyphs: local >= REVEAL_DURATION ? null
        : scrambleGraphemes(parts[language]!.map(part => part.text), language, local / REVEAL_DURATION) });
      lastPhase = phase;
      lastBucket = bucket;
    }
    if (local < REVEAL_DURATION) raf = clock.requestFrame(tick);
    else if (phase < 2) timer = clock.setTimer(tick, [4000, 9000][phase] - elapsed);
  }
  tick();
  return {
    setReducedMotion(value: boolean) {
      if (reduced === value) return;
      reduced = value;
      origin = clock.now();
      lastPhase = lastBucket = -1;
      tick();
    },
    setHidden(value: boolean) { hidden = value; tick(); },
    dispose() { disposed = true; cancel(); },
  };
}
