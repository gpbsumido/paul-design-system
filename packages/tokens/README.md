# @paul-portfolio/tokens

Design tokens for the Paul Design System — the single source of truth for colors,
spacing, radii, typography, motion, shadows, and z-index. Everything else in the
system (the CSS and React packages) reads from these.

## Install

```bash
npm install @paul-portfolio/tokens
```

## Formats

The same tokens ship in several formats so you can use them however your project
consumes styles:

```ts
// CSS custom properties (:root { --paul-... })
import "@paul-portfolio/tokens/tokens.css";

// JS/TS objects
import { colors, spacing, radii } from "@paul-portfolio/tokens";
```

| Export | Format |
|--------|--------|
| `@paul-portfolio/tokens/tokens.css` | CSS custom properties |
| `@paul-portfolio/tokens/tokens.scss` | SCSS variables |
| `@paul-portfolio/tokens/tokens.json` | raw JSON |
| `@paul-portfolio/tokens` | JS/TS (ESM + CJS, typed) |

## Token groups

All CSS variables are namespaced `--paul-<group>-<name>`:

- `--paul-color-*` — palette + semantic colors (`--paul-color-primary-600`, `--paul-color-border`)
- `--paul-spacing-*` — spacing scale (`--paul-spacing-2`)
- `--paul-radius-*` — border radii (`--paul-radius-md`, `--paul-radius-full`)
- `--paul-font-*`, `--paul-line-*`, `--paul-letter-*` — typography
- `--paul-duration-*`, `--paul-easing-*` — motion
- `--paul-shadow-*` — elevation
- `--paul-z-*` — z-index scale

## Theming

Because everything downstream reads these variables, overriding them in your own
`:root` (or a scoped selector) re-themes the whole system without touching the
components.

## License

MIT © Paul Sumido
