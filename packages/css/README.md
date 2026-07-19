# @paul-portfolio/css

The stylesheet layer of the Paul Design System. Plain CSS, driven by the design
tokens in [`@paul-portfolio/tokens`](https://www.npmjs.com/package/@paul-portfolio/tokens).
Use it on its own with your own markup, or pair it with
[`@paul-portfolio/react`](https://www.npmjs.com/package/@paul-portfolio/react),
whose components render the class names this package styles.

## Install

```bash
npm install @paul-portfolio/css @paul-portfolio/tokens
```

## Entry points

Import the tokens first (they define the CSS custom properties everything else
reads), then one of the CSS entry points:

```ts
import "@paul-portfolio/tokens/tokens.css";

// Everything: reset + base element styles + components
import "@paul-portfolio/css/index.css";

// Or just the components, when you already have a reset
// (e.g. Tailwind's preflight):
import "@paul-portfolio/css/components.css";
```

| Entry | Contents |
|-------|----------|
| `index.css` | reset + base + components |
| `components.css` | component styles only (no reset/base) |
| `reset.css` | a minimal CSS reset |
| `base.css` | base element and typography styles |

## Using the classes

Every component is a base class plus modifiers. A few examples:

```html
<button class="btn btn--primary">Save</button>
<button class="icon-btn" aria-label="Close">✕</button>

<div class="input__wrapper">
  <label class="input__label" for="email">Email</label>
  <input id="email" class="input" />
</div>

<textarea class="textarea"></textarea>

<button class="switch switch--on" role="switch" aria-checked="true">
  <span class="switch__thumb"></span>
</button>

<span class="spinner" role="status" aria-label="Loading"></span>
<hr class="divider" />
```

### Component classes

`btn` · `icon-btn` · `input` · `textarea` · `chip` · `switch` · `badge` ·
`avatar` · `card` · `modal` · `tooltip` · `info-tip` · `skeleton` · `spinner` ·
`divider`

Each lives in its own file under `src/components/` and is bundled into
`components.css`. Variants follow a `block--modifier` convention (`btn--primary`,
`icon-btn--sm`, `divider--vertical`).

## Tokens

Colors, spacing, radii, typography, and motion all come from CSS custom
properties like `--paul-color-primary-600` and `--paul-spacing-2`, defined by
`@paul-portfolio/tokens`. Override those variables to theme the whole system.

## License

MIT © Paul Sumido
