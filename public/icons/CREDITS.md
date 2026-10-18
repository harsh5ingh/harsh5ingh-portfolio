# Brand logos

Local, unmodified SVGs from [Simple Icons](https://github.com/simple-icons/simple-icons),
under its CC0 license (included in LICENSE.md). Trademarks belong to their owners;
logos identify technologies/profiles, not endorsements or partnerships.

- Release 11.15.0: the base catalogue, including LinkedIn and Microsoft Azure.
- Release 15.0.0: Ollama, LangGraph, and n8n.
- Each upstream brand source and color is recorded in `src/content/brand-icons.json`.
- Rebuild with `node scripts/import-brand-icons.mjs`, then
  `node scripts/import-additional-icons.mjs`. Network access is needed only to regenerate.

Qdrant and general concepts use labelled neutral markers where this subset has no
logo. Logos are neutral by default; brand color is decorative hover/focus emphasis.
Text labels and focus rings retain the portfolio's accessible semantic colors.
Monochrome marks follow the foreground color in both themes.
