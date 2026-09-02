# Changelog

## [0.3.0] - 2026-09-02

### Added

- **Ten new React components aimed at AI/LLM app work**, each customizable, keyboard-operable, and axe-clean. They're the pieces I keep rebuilding by hand every time I start an assistant UI, so they belong in the system:
  - **RichTextEditor** — a contentEditable editor with a configurable toolbar (bold/italic/underline/heading/lists/code/link), Ctrl/Cmd+B/I/U shortcuts, and HTML emitted on every edit. It exposes the textbox/toolbar ARIA pattern so a screen reader treats it as a real multiline field.
  - **ChatMessage** — a chat bubble keyed by role (user/assistant/system), with avatar, name, timestamp, and a `pending` state that swaps in the typing indicator. Renders as an `article` so each turn is a landmark.
  - **ChatComposer** — an auto-growing prompt field: Enter sends, Shift+Enter adds a newline, empty messages don't send, and the whole control locks while `busy`.
  - **StreamingText** — reveals text a few characters at a time the way a streamed model reply arrives, with a caret, announced through a polite live region. Honours `prefers-reduced-motion` by showing the whole string at once — and reads the preference synchronously so a reduced-motion user never sees the animation begin.
  - **TypingDots** — the three-dot "assistant is typing" indicator. The animation is decorative and hidden from assistive tech; the label carries the meaning.
  - **CodeBlock** — a read-only code panel with a language label and a copy button that reports success back to assistive tech. Line numbers are decorative and kept out of the a11y tree so the code is what gets read.
  - **CommandPalette** — a ⌘K menu: type to filter (label + keywords), arrow keys to move, Enter to run, Escape to close, optional group headings. Follows the combobox/listbox pattern with `aria-activedescendant`, so the active option is announced without focus leaving the input.
  - **Combobox** — an accessible autocomplete for model/tool pickers, same `aria-activedescendant` approach, closing when focus leaves the control.
  - **Toast** — `ToastProvider` + `useToast()`. Toasts stack in a fixed live region, errors announce assertively and everything else politely, and they auto-dismiss unless `duration` is 0. Ids come from a ref counter, so there's no non-determinism in the render.
  - **TokenUsageMeter** — a budget bar for LLM token usage: prompt and completion tokens as two segments of a track sized against `maxTokens`, with the used total, percent, and an optional cost estimate. Progressbar semantics, and it shifts to a warning tone near the budget and an over-budget tone past it.
- Matching stylesheets in `@paul-portfolio/css` under the existing `components` layer, built entirely from the token custom properties — no new hardcoded colours or spacing.
- Storybook stories for all ten, with interaction `play` tests on the composer, palette, combobox and toast.
- Full test coverage: unit/behaviour tests per component plus an axe pass for each. `@paul-portfolio/react` 0.5.1 → 0.6.0, `@paul-portfolio/css` 0.8.1 → 0.9.0.
- Docs: all ten written up in the `@paul-portfolio/react` README, with a React-only AI/LLM section added to the root README. Also refreshed the React component counts, which had drifted (the root README still said "10 components" long after the charts landed).

### Known, and left alone

- **These land in React only.** The chart components mirror into `@paul-portfolio/angular` because their geometry is shared and unit-tested on both sides; these ten are interaction-heavy React components with no shared geometry, so an Angular port is its own piece of work rather than a copy. Noted here so the gap is deliberate, not forgotten.

## [0.2.40] - 2026-08-16

### Changed

- **The `test` job runs on Node 24 alone.** 0.2.37 put it on a 20/24 matrix and was explicit that this was a hedge: `chromatic.yml` builds on 20, `publish.yml` ships from 24, nothing in the repo said which was the real target, so the suite had to hold on both. Settled now, in favour of 24. `publish.yml` ships from 24, which makes 24 the version that actually decides whether a release works, and Node 20 reached end-of-life in April 2026 — the second leg was buying coverage for a runtime nothing should still be running. The 864 tests run once per push instead of twice.
- Three jobs become two, and the leg that went was not a passenger. `test (20)` took 55s against `test (24)`'s 38s and `build`'s 29s, so it was the slowest job in the run and set the wall clock every time. I am not claiming a fixed saving from that, because run-to-run variance and queue time on hosted runners are both wider than the gap between the two legs. What is certain is that the run no longer waits on a runtime we do not ship.
- Nothing else moves. Triggers, the concurrency rule, npm caching and the `test`/`build` split are all as 0.2.37 left them.

### Known, and left alone

- **`chromatic.yml` still builds Storybook on 20, and I aligned it to 24 on this branch before backing it out.** Not because aligning is wrong, but because I could not verify it. A Node bump underneath the snapshot builder is exactly the change that could move rendered output, so it wants a snapshot diff to justify it, and this account has been out of Chromatic snapshots for the month since before the branch existed. Those builds publish Storybook and compare nothing; the green check is `exitZeroOnChanges: true` rather than evidence of no change. `autoAcceptChanges` is set to `main`, so any drift it did introduce would be adopted as the new baseline on the release merge with nobody looking at it. It gets its own change when there is quota to prove it, which also keeps a visual risk out of a CI-config diff.
- The version stays written out per workflow rather than centralised. After this, 24 appears twice in `ci.yml` and once in `publish.yml`, with Chromatic still on 20. Sharing one value across workflows needs either a repo-level variable, which lives in settings where a diff cannot see it, or a composite action, and the repo has neither today. Both are more machinery than three numbers deserve. There is also no `engines` field in any `package.json` and no `.nvmrc`, so nothing in the repo asserts a lower floor that 24 would break, and `tag-release.yml` pins nothing because it only shells out to `node -p` on the runner default.

## [0.2.39] - 2026-08-16

### Fixed

- **The tokens suite was running every test twice, and only if I had built first.** A clean checkout reported 4 files and 42 tests; `npm run build` followed by the same command reported 8 and 84. `packages/tokens/tsconfig.json` compiled `src/__tests__` along with everything else, and vitest's default exclude list covers `dist/` but not `build/` — which is the directory this one package happens to emit into — so the compiled copies were collected as tests in their own right. `packages/react` has carried `"exclude": ["src/__tests__"]` since it was written and never had the problem; tokens was simply missing the line.
- **The doubled number was the least of it.** The second copy is compiled output, so it can pass while the source it came from would fail, and whether it ran at all depended on whether somebody had built recently. A suite whose result turns on the state of a gitignored directory has stopped reporting on the code. Both counts were green, which is why this survived as long as it did.
- **It was also shipping the tests to npm.** `@paul-portfolio/tokens` declares `files: ["build/"]`, so all ten compiled test artifacts went into the published tarball — 31 entries, 68 kB unpacked. Narrowing the vitest glob would have fixed the count and left that untouched, which is the reason the fix is in the tsconfig instead. The tarball is now 21 entries and 50 kB with no test files in it. Nothing else moves: the only importer of `palette-check` outside this package reaches for it in `src/`, not `build/`.
- Bumps `@paul-portfolio/tokens` 0.4.0 → 0.4.1. No token values move, but the published contents do.

### Added

- A guard that asks vitest what it collected — `vitest list --filesOnly --json` — and fails if any of it came from outside `src/`. Re-deriving the glob in the test would only have proved that two copies of my own guess agree, and the thing that went wrong here was a real default I had not read.

## [0.2.38] - 2026-08-16

### Fixed

- **The gel button was the last known AA failure, and the recorded figure was understating it.** 0.2.36 logged `.btn--gel` as known-and-unfixed at 3.45:1 — white on the `primary-500` stop of its gradient. That number reproduces exactly and it is the wrong measurement: the stop sits *underneath* a 55% white gloss, and the gloss is on top. Composited, the floor was **1.69:1 at rest and 1.52:1 on hover**, not 3.45:1. The gloss peaks at the top of the fill, which is also where the gradient's lighter stop is, so the two worst things land on the same pixel.
- **The gloss was the binding constraint, not the ramp.** A 55% white gloss caps a fill at 3.35:1 even over pure black, so no retoning of the gradient could have reached AA while it stayed. Once it comes down, `primary-700` is the lightest anchor that can still carry a visible gloss — its ceiling is 0.16, where `primary-600` could only have carried 0.02, which is no gloss at all. So the fill runs `primary-700` → `primary-900` under a 14% gloss, and measures **5.12:1 at rest and 4.73:1 on hover** at its worst stop, climbing to 11.39:1 at the foot. The fade length turned out not to matter: the floor is always the top edge, where the gloss is at peak. The hard offset shadow and the 1px specular hairline are untouched — that hairline is most of what still reads as gel, and no text reaches it through 8px of padding.
- Bumps `@paul-portfolio/css` 0.8.0 → 0.8.1. No token values move, so `@paul-portfolio/tokens` stays at 0.4.0 and `@paul-portfolio/react` at 0.5.1.

### Added

- **The contrast suite learned to measure paint instead of declarations.** Its sampler read the discrete stops a background names and took the worst, which is correct for the starburst badge because its stops are opaque — but it cannot see an interpolated midpoint and it cannot see a translucent layer on top, and gel does both. The new sampler walks every `background-image` layer, interpolates with premultiplied alpha the way CSS does, composites the stack, and checks every half-percent of the fill. Hover carries its `brightness()` filter through, which matters more than it sounds: brightness lightens the fill while a white label just clamps at white, so hover is the *worse* state for gel, not the safer one. Six new pairs — rest, hover and active across both themes — taking the suite to 35.
- A guard on the instrument itself. A white gloss can only ever lighten a fill, so the composited floor must stay strictly below the bare-stop reading. Without it, a refactor that quietly stopped compositing would make every ratio improve while the button got worse, and the suite would stay green through it.
- `contrast-notes.css` records gel as measured rather than deferred, with the ceiling maths for why 700/0.14 and not something brighter. The disabled state stays exempt under WCAG 2.1 SC 1.4.3 and stays stated rather than skipped in silence.
## [0.2.37] - 2026-08-16

### Added

- **CI actually runs the tests now.** There were three workflows in `.github/workflows` and not one of them ran `npm test`. The suite is 857 tests across tokens, css, react and angular, and it included the palette contrast and deuteranopia gates plus the 28 component contrast pairs that caught real AA failures this week. All of it was green only because I remembered to run it before pushing. That is not a guard, it is a habit, and habits do not survive a busy week. `ci.yml` runs on pull requests into `develop` and `main` and on pushes to both, so the branch that publishes to npm cannot take an untested merge.
- Two jobs, deliberately split. `test` runs `npm test` on a Node matrix of 20 and 24, because `chromatic.yml` builds on 20 and `publish.yml` ships from 24 and nothing in the repo says which one is the real target; until those agree the suite has to hold on both. `build` runs `npm run build` on 24 alone, matching `publish.yml`, since its whole job is to prove the artifacts that get published still compile. They run in parallel, so the wall clock is the slower of the two rather than the sum. Locally the suite is 9s and a clean build of all three publishable packages is 3s, so this costs the runner setup and little else.
- Superseded pull request runs get cancelled. Pushes to `develop` and `main` do not, because `publish.yml` gates on `main` and a cancelled run there would read as "never tested" rather than "tested and passed".

### Known, and left alone

- Storybook is not in this workflow. `chromatic.yml` already builds it on every pull request into `develop` and `main`, so adding a second build buys a slower pipeline and no new signal. It is not even the expensive part, which I had assumed it would be: it builds in about 5s here. If Chromatic ever stops running per-PR, this is the first thing that needs to move.
- The tokens build emits compiled copies of its own tests into `packages/tokens/build/__tests__`, and vitest discovers them. Build that workspace before testing it and its suite runs twice, 42 tests becoming 84. Harmless today because the copies are identical, misleading the day a stale `build/` outlives a source change. The `test` job sidesteps it by never building, and `build` gets its own clean checkout, so CI is honest either way. The discovery glob wants narrowing to `src/`, but that is a change to the test config and not to CI, so it gets its own.

## [0.2.36] - 2026-08-16

### Added

- **A label layer, because component labels were unreachable.** `.btn--primary` wrote `color: #fff` straight into the stylesheet. That is not a default — it is a decision taken on the consumer's behalf in the one place they cannot reach, and it assumes the primary is dark enough to carry white. ketsup's primary is a light gold, so its most-used control measured **2.02:1**, and the only fix available was scoped CSS that forks the component's own selectors (gpbsumido/ketsup#70). Seven `--paul-color-on-*` tokens now carry those labels: `on-primary`, `on-primary-tint`, `on-error`, `on-error-tint`, `on-success-tint`, `on-warning-tint`, `on-inverse`. Every default reproduces exactly what the components painted before, and every reference carries an inline fallback, so a consumer still on an older tokens build renders identically too. Nothing moves until someone sets one.
- **`on-primary-tint` is the half that could not be fixed by a literal.** The pale-fill family — secondary button, info badge, avatar fallback — took its label from `primary-700`, which is also the primary button's hover fill. One step has to stay a saturated brand fill and be dark enough to read on a `50` tint; on a light brand colour those pull apart and no value satisfies both, which is why ketsup could not fix it by retoning the ramp. The label gets a name of its own and the fill keeps the ramp step. `error-700` had the identical collision between `.badge--error` and `.btn--danger:hover`, so it gets the same treatment.
- **`label-tokens.test.ts`, which measures something the ratio tests structurally cannot.** `tinted-contrast.test.ts` checks whether the pairs this package ships are readable; it passes right up until someone changes the values. The new file checks whether a consumer who re-points the palette *can* keep them readable: no label is a literal, no label token is ever painted as a fill, every reference carries a fallback, and every fallback equals the token's shipped default. That last one is what makes "this change is visually inert" a check rather than a claim. 38 assertions.
- The contrast suite grows 18 pairs to 28. Solid fills were never measured — only the tinted family was — so `.btn--primary` and `.btn--danger` had no guard at all in either theme, and neither did the tooltip. White on primary-600 is 5.09:1, on primary-700 (hover) 7.12:1; white on error-600 is 4.83:1, on error-700 6.47:1; the tooltip is 16.04:1 light and 13.97:1 dark. Its resolver also now reads the token a declaration names rather than the fallback inside it, which was green either way today and wrong the moment the two are allowed to differ.
- `contrast-notes.css` gains the pair table a consumer needs: which token to set, which fill it lands on, and the ratio this palette ships. Storybook's Tokens/Colors page gains the same, with a worked example of a light brand colour taking a dark label.
- Bumps `@paul-portfolio/tokens` 0.3.0 → 0.4.0 and `@paul-portfolio/css` 0.7.1 → 0.8.0.

### Fixed

- The busy spinner was a fourth copy of `#fff`, laundered through `border-color`. It is the label by another name — the label is hidden with `color: transparent` while it spins — so a consumer darkening `on-primary` for a pale fill would have got a white ring on it. It follows the label token now, which meant splitting the shared rule so `.btn--danger` reads `on-error` rather than the primary's.
- `.tooltip` set `color: white` in light while its dark override was already tokenised — one branch correct, its mirror not.

### Known, and left alone

- **`.btn--gel` puts white on a `primary-500` → `primary-700` gradient under a 55% white gloss, and white on the 500 stop is 3.45:1.** Under AA before the gloss lightens it further, and true of the variant as it shipped. Found by extending the measurement to solid fills. Not asserted here: the fix is to retone the gradient or drop the gloss, which moves pixels, and this change is meant to move none. Its label is tokenised, so a consumer can already fix it without forking the selector.
- `.badge--starburst` takes its label from the 900/950 of its own ramp over a gradient of the same ramp. Self-consistent, so it survives re-pointing as long as the ramp stays monotonic in lightness — which is already the contract. No collision, so no token.
- `.select`'s chevron is a data-URI SVG with the stroke baked in. A data-URI cannot read a custom property, so it is the one place an icon cannot follow the theme. Fixing it means switching to `mask-image` — a change of technique, not of colour.
- `.switch__thumb` is a hard `#fff` puck on the primary fill. A figure rather than a label, with no text on it, so it waits for the switch to be looked at properly.

## [0.2.35] - 2026-08-16

### Fixed

- **The error starburst badge printed a 10px bold label at 3.62:1.** The starburst seals fill with a radial gradient running the ramp's 100 to its 400 and set the label to the 900 of the same ramp. That clears AA on primary (4.57:1), success (5.23:1) and warning (5.43:1), but the error ramp's 400 is `#f87171` — materially darker than the other ramps' 400s — so the same 900 label lands at 3.62:1 against the outer stop. The label drops to `error-950`, which measures 5.84:1. I moved the label rather than lightening the fill because the saturated red is what makes the seal read as an error at 44px, and at 10px bold the text is under the large-text cut, so it carries the full 4.5:1 rather than 3:1. Nothing else about the seal changes, and it still has no dark override, so the new ratio holds in both themes.
- Bumps `@paul-portfolio/css` 0.7.0 → 0.7.1.

### Added

- **A contrast guard over the tinted-fill family, which had none.** `contrast()` existed in this repo but was only ever pointed at the chart palette, so every component that paints a pale fill and a same-ramp label — badge, avatar, the secondary button — was unmeasured. A ramp edit could push any of their labels under AA with the whole suite still green, which is exactly how the starburst shipped. `tinted-contrast.test.ts` reads the declarations out of the real stylesheets rather than restating the colours, folds each variant's cascade down to the label and the fill actually behind it, and asserts 4.5:1. Gradient fills contribute every stop, so the label has to clear the worst one. 18 pairs across variant, state and theme.
- The starburst investigation started somewhere else: the report was that the secondary button's ember label sat at about 3.2:1 on its ember fill. It does not. `.btn--secondary` tracks the **primary** ramp, not `secondary` — verdigris `700` on `50` in light, `200` on `950` in dark — and measures 6.66:1, 6.06:1, 11.68:1 and 8.19:1 across rest and hover in both themes. It measured comfortably over AA before the palette change too, in the old blue. There is no `color-mix()` or alpha tint anywhere in the package; every fill in this family is a flat ramp step. So the ember ramp is untouched: retoning it would have changed every consumer's brand to fix a button that was never failing.
- `contrast-notes.css` gains the component section it was missing. It documented ramp-on-surface pairs only, which is the layer this defect was invisible at. Every ratio already in the file was re-measured and none had drifted.

## [0.2.34] - 2026-08-15

### Changed

- **The design system hands down Verdigris & Ember, instead of receiving it from a consumer.** paul-explore has been shipping this palette by overriding `--paul-color-*` in its own stylesheet and feeding the values back into the package primitives. That works, and it is backwards — the whole point of the tokens package is to be the place the palette is decided. `primary` is now verdigris, `secondary` is ember, and `neutral` is a warm ink-on-paper gray rather than a true one. The values are taken verbatim from what paul-explore already ships, so the two stay in lockstep and its parity test keeps passing.
- The semantic aliases move with them: light is warm paper (`#fbfaf7`) rather than `#ffffff`, dark is warm ink (`#131110`) rather than near-black. A warm neutral ramp on a pure white page loses the only thing that made it warm. Light `muted` sits between neutral-500 and 600 because 500 measured under 4.5:1 on the new surface, and `warning-700` moves `#b45309` → `#ae4f08` for the same reason.
- `--paul-font-family-display`, led by Bricolage Grotesque and falling back to the whole sans stack rather than to a bare `sans-serif` — a consumer that doesn't load the face gets Inter, not whatever the platform picks. The sans and mono stacks do not move; the Angular app resolves those and changing them is a separate decision.
- The Spotlight glow's default is verdigris at 25% instead of stock Tailwind blue. It's a `var()` fallback, which means it is what most consumers actually get.
- Bumps `@paul-portfolio/tokens` 0.2.0 → 0.3.0 and `@paul-portfolio/css` 0.6.0 → 0.7.0.

### Fixed

- **The chart palette had to be redesigned, not recoloured.** Dropping ember into `secondary` puts it beside amber in the slot order, and that pair measures ΔE **1.3** under deuteranopia — the identical number to the blue/purple collision `chart-palette.test.ts` was written to catch. Amber leaves the categorical set, a `violet` supporting ramp joins it at slot 3, and verdigris leads at `primary-500` rather than 600 because 600 sits at chroma 0.092, under the floor, and reads gray as a series. I searched every slot order against every viable step: with ember in `secondary`, nothing passes using only the ramps that existed before, so the new ramp is the finding rather than a preference.
- Light and dark now hold the same six values, where they used to differ. The dark lightness band is tighter than the light one, so the set satisfying both is the intersection, and once the two brand hues are anchored exactly one combination clears it. Both arrays stay declared, so the day a ramp moves they can diverge again.
- The warmer surface also caught something that had nothing to do with ember: `success-600` (2.95:1) and `warning-600` (2.85:1) fall under the 3:1 floor against `#f4f2ed`. The palette shipping before this change would have failed the moment the semantic tokens moved, regardless of which hues replaced them.
- `contrast-notes.css` documented ratios for colours that no longer exist, against a white page that no longer exists. Rewritten from measurements against the real semantic surfaces.
- **The textarea's character count and the InfoTip glyph fell just under AA on the warm neutrals.** Storybook's a11y check flagged the count: both render tiny text in `neutral-500`, which measured about 4.2:1 once the ramp warmed — the old cool gray sat at 4.7:1, so the recolour is what tipped them. Both move to `neutral-600` on light with a `neutral-400` dark override, following the dark-theme pattern the inputs already use. The other `neutral-500` consumers stay: disabled controls are exempt, borders and icons carry the 3:1 rule and clear it.

### Added

- A sync guard over `build.mjs`. It re-declares every ramp as its own literal with a `keep in sync` comment and nothing enforcing it, and that copy is what generates `tokens.css` — so a missed edit means TypeScript consumers get verdigris while every CSS consumer keeps stock blue, with both halves still building green. The test compares the two directly. De-duplicating the two into one source is the better fix and gets its own change; a build refactor does not belong in a recolour.
- Storybook's token pages restate every hex by hand, so Colors, Chart palette, Typography and Spacing are updated alongside — including the new violet ramp and the measured separation figures for the new slots.

## [0.2.33] - 2026-08-10

### Added

- **Every interactive component now meets a finger-sized minimum on a coarse pointer, by default.** This was previously the consumer's problem, and the result was predictable: an app auditing its own pages found 129 undersized targets on one route and 69 on another, then invented its own two utilities to fix them. A design system that leaves this to each consumer is asking every consumer to solve it, and they will solve it differently or not at all.
- Which treatment a component gets is the actual decision, and each stylesheet says why. `.btn`, `.input`, `.select`, `.textarea` and `.chip` **grow**, because they have room and a short one is genuinely awkward to hit. `.icon-btn` and `.switch` **keep their size and grow only the hit area** — a toolbar of chunky circles is worse than a toolbar of small ones, and a switch stretched to 44px stops reading as a switch.
- Two utilities for the cases the package cannot decide: `.paul-touch-min` grows a control that has room, `.paul-touch-target` leaves a control's appearance untouched and centres an invisible 44px box on it. The second is for things that genuinely cannot grow — a colour swatch, a control floating over a canvas where every pixel of chrome costs a pixel of the thing it controls.
- Everything keys on `pointer: coarse` rather than a width breakpoint, because this is about fingers rather than screen size. A touch laptop wants it and a narrow desktop window does not, so nothing moves on a mouse-driven screen however narrow it gets. The size is `var(--paul-touch-target, 44px)`, so a consumer with a genuine reason can raise or lower it in one place.
- A guard test in the shape of the existing reduced-motion one: every stylesheet on the interactive list must answer `pointer: coarse` with a real size, and the list must stay complete. Adding an interactive component is now a deliberate decision to answer this or not, rather than shipping with whatever looked right on a desktop.
- Bumps `@paul-portfolio/css` 0.5.1 → 0.6.0.

## [0.2.32] - 2026-08-10

### Fixed

- **Half the items in a `Ticker` silently ignored clicks.** The scroll-mode strip duplicates its children so the loop looks seamless, and the clone carried `inert`. That was the right instinct aimed one notch too broadly: `inert` removes a subtree from the accessibility tree *and* from the pointer. The loop wraps at half the scroll width, so roughly half of what is on screen at any moment is the clone — meaning roughly half the strip did nothing when clicked, at random from the reader's point of view. The clone is now `aria-hidden` with its focusables dropped to `tabIndex = -1` in a layout effect, which runs before paint: hidden from assistive tech, out of the tab order, still clickable. Both copies render the same children, so clicking either runs the same handler and it does not matter which one you hit.
- Bumps `@paul-portfolio/react` 0.5.0 → 0.5.1.

### Added

- A test asserting the clone never carries `inert`. Written as an attribute assertion rather than by dispatching a click, because jsdom does not implement `inert` — a click test passes whether or not the bug is present, which is exactly how this regression got through the first time.

## [0.2.31] - 2026-08-03

### Fixed

- The spinner kept rotating under `prefers-reduced-motion`. The reduced branch only slowed it from 0.6s to 1.5s, which is not answering the preference — rotation is the vestibular trigger, and a slower spin is still a spin. It now swaps to a slow opacity pulse and drops the rotation entirely. Both `Spinner` components already render `role="status"` with an accessible name, so the loading state reaches assistive tech regardless; the animation is for sighted users, and a spinner frozen solid would be indistinguishable from one that has hung.
- `packages/css` had 21 test files, a vitest config, and no `test` script — so `npm test` had never run a single one of them. Wired up; all 139 existing assertions pass.

### Added

- A reduced-motion guard over every component stylesheet: any file that animates must answer `prefers-reduced-motion` with a non-empty block, and no component may keep a rotating keyframe inside that block. Confirmed it fails on the old spinner before trusting it.
- Bumps `@paul-portfolio/css` 0.5.0 → 0.5.1.

## [0.2.30] - 2026-08-03

### Added

- Storybook coverage for the eight specialty chart forms — `FunnelChart`, `RadarChart`, `ScatterPlot`, `HeatmapChart`, `ParetoChart`, `GaugeChart`, `WordCloud`, `StackedLineChart` — each with controls and its empty state, plus a multi-series `Sparkline` story.
- `Charts/Gallery`, a single story putting all eleven chart forms on one page. It is the story to look at after a palette or geometry change: one Chromatic snapshot that catches a regression across the whole set, where the per-chart stories localise it. Switching the theme toolbar to dark is also the first rendered look at the dark palette steps.
- `Tokens/Chart palette`, documenting the six categorical slots and the five sequential steps in both modes, the validated numbers behind them, and the rules that keep them honest: slot order is the contract, past six series fold into "Other", colour follows the entity rather than its rank, and status colours are not series colours.

### Changed

- `HeatmapChart` / `PaulHeatmapChart` take `rows: { label, values }[]` instead of parallel `matrix` and `rowLabels`. As separate arrays a length mismatch was representable and degraded quietly — the label for the missing row just vanished and every other row still looked right. A row and its label now travel together.
- `paretoLayout` takes `{ gap, threshold }` and reports `cutIndex` against the given threshold. Both components were re-deriving the crossing locally for any threshold other than 80, which meant the geometry core and the chart disagreed about what a threshold is.
- `RadarChart` / `PaulRadarChart` warn in development when they drop series past the cap of three. Truncating is right — a fourth overlapping polygon is unreadable — but doing it silently left a caller with no way to find out why two of their five series vanished.

### Fixed

- `Ticker` marks its duplicated clone `inert` in the markup rather than sweeping `tabIndex` in an effect. An effect runs after the DOM exists, so between render and that sweep the aria-hidden duplicate held tabbable controls — axe rates that serious, and a keyboard user landing on a control a screen reader insists is absent is worse than not hiding it at all. The effect stays as a fallback for browsers without `inert`.
- `GaugeChart` / `PaulGaugeChart` captioned a gauge with `of {max}`, ignoring `min`. A dial running 20–60 showing 41.5 read "of 60", inviting the reader to compute 69% where the arc means 54%. It now names both ends of the range whenever `min` isn't zero, in the caption and in the accessible name.
- Chromatic reported inconsistent renders between runs. Rendering all 132 stories twice and comparing pixels found the cause: animated components (Skeleton, Spinner, Button's loading state, GradientBackground, the marquee Ticker) are mid-animation when the screenshot is taken. CSS animations are now frozen at their end state for Chromatic; the scroll Ticker, whose position comes from a requestAnimationFrame loop that cannot be frozen that way, is excluded from snapshots and stays covered by its unit tests. No chart story was unstable.
- Markdown tables in every Storybook docs page rendered as a paragraph of literal pipe characters. The MDX pipeline had no GFM plugin, and the docs options only reach `@storybook/addon-docs` when it is configured directly rather than through `addon-essentials`. This had been broken for the Colors, Spacing and Typography pages the whole time.
- `DonutChart`'s stories hardcoded hex colours in their default args, which bypassed the token palette — a bad example to set, and after the 0.2.29 recolour it also rendered the old colours beside components using the new ones.
- Documents the new `cyan` ramp on the Colors page.
- Bumps `@paul-portfolio/storybook` 0.1.19 → 0.2.0.

## [0.2.29] - 2026-08-03

### Fixed

- The chart palette failed its colour checks, and had since it shipped. `--paul-chart-1` (blue) and `--paul-chart-2` (purple) — the first two series of every multi-series chart — were ΔE **1.3** apart under deuteranopia and **12.0** for normal vision, below the hard floor of 15; `--paul-chart-6` sat outside the lightness band and below the chroma floor, reading gray. New slot order, drawn from the token ramps plus a new `cyan` ramp (slot 5 needed a hue the system didn't have), passes all six checks. Light and dark are separately chosen steps rather than a flip, because the dark lightness band is tighter. **This recolours the charts shipped in 0.2.27.** The checks now live in `packages/tokens/src/__tests__/chart-palette.test.ts`, so the next colour edit can't quietly regress them.

### Added

- Eight specialty chart forms, React and Angular, from one shared geometry core: `FunnelChart`, `RadarChart`, `ScatterPlot`, `HeatmapChart`, `ParetoChart`, `GaugeChart`, `WordCloud`, `StackedLineChart` (and their `Paul*` twins). Same contract as the first three: pure SVG, zero JS at runtime, `role="img"` with a data summary as the accessible name.
- `Sparkline` gains `series?: number[][]` — several trends on one shared y-domain. Independently scaled sparklines look comparable and aren't. `data` is unchanged.
- `--paul-chart-seq-1..5`, a single-hue sequential ramp for the forms that encode magnitude rather than identity (heatmap cells, funnel stages). A categorical palette on ordered data double-encodes the value as hue.
- Two encoding decisions worth knowing, both documented in the source. `ParetoChart` has **one** y-axis: bars are percent-of-total and the cumulative line is cumulative percent, on the same 0–100 scale. The textbook two-axis version invents a correlation, because the alignment between the scales is arbitrary. `WordCloud` ships with its own objection in its doc comment: glyph area is not a comparable encoding and a long word reads as bigger at equal weight — `BarChart` shows the same data honestly.
- `wordCloudLayout` is deterministic — spiral packing, no RNG — so the server and the client can't disagree and visual regression can settle.
- axe coverage extended to all eight new charts in both frameworks, and the Angular consumer type-check now binds every one of them.
- Bumps `@paul-portfolio/tokens` 0.1.10 → 0.2.0, `@paul-portfolio/css` 0.4.7 → 0.5.0, `@paul-portfolio/react` 0.4.6 → 0.5.0, `@paul-portfolio/angular` 0.2.0 → 0.3.0.

## [0.2.28] - 2026-08-03

### Fixed

- `@paul-portfolio/angular` was built with plain `tsc`, so what shipped to npm was raw decorators: no `ɵcmp`/`ɵfac` in the JavaScript, no `ɵɵComponentDeclaration` in the typings. Every component uses signal `input()`, which needs the Angular compiler, so a consumer binding an input got nothing back. The package now builds with `ng-packagr` in partial compilation mode. Two consequences worth knowing: the peer range moves to `@angular/core >=21` (that's the truth about partial-compiled output), and publishing now happens from `packages/angular/dist`, where `ng-packagr` writes the real manifest.

### Added

- Angular render tests. The package had one test file — the pure-TS geometry suite on `node` — and had never rendered a template in CI. `vitest` now runs two projects: the geometry suite stays on `node`, and a new `jsdom` project drives components through `TestBed`, zoneless, with the Angular compiler plugin doing the AOT transform. A shared `renderComponent` helper owns fixture setup.
- The last eight React → Angular ports, each with a render test mirroring its React counterpart: `PaulTextarea`, `PaulSelect`, `PaulFilterBar`, `PaulInfoTip`, `PaulTicker`, `PaulTiltCard`, `PaulGradientBackground`, `PaulSpotlight`. None adds a stylesheet — all eight reuse CSS that already ships in `@paul-portfolio/css`.
- `PaulReducedMotion`, the Angular twin of the React `usePrefersReducedMotion` hook, so `PaulTicker`, `PaulTiltCard`, and `PaulSpotlight` share one `matchMedia` listener instead of each attaching its own.
- Two disclosed API differences from React, both forced by the Angular side: `PaulInfoTip` takes string `content` (React accepts rich nodes) because `PaulTooltip` takes a string, and `PaulTicker` takes its content as an `<ng-template>` rather than projection, because the seamless loop renders the same content twice.
- axe-core a11y tests for the Angular package (15 audits over the eight ports and the three chart components), held to the same bar as the React suite.
- `npm run verify:consumer` in `packages/angular` — builds the package, then type-checks a stand-in consumer against `dist/` with `strictTemplates` on. This is the check that would have caught the packaging bug: nothing else in the repo consumed the built artifact.
- Bumps `@paul-portfolio/angular` 0.1.22 → 0.2.0.

## [0.2.27] - 2026-08-02

### Added

- Framework-agnostic chart primitives, so the charts I keep re-drawing in paul-explore (operator dashboard, web-vitals sparklines, the work-portfolio gallery) can be reused everywhere instead of living as one-off recharts/unovis components. They compute all their geometry in a pure, dependency-free `chartGeometry` core and render plain SVG, so React and Angular draw identical output and neither published package gains a charting runtime dependency:
  - `Sparkline` — a compact, axis-free trend line, `line` or `area` variant. Backs the vitals sparklines and KPI trend cards.
  - `BarChart` — a categorical bar chart, vertical or horizontal, with an optional per-bar palette. Backs retention/session/region bars and the operator inventory comparison.
  - `DonutChart` — a ring chart with an optional legend. Backs fleet-health and revenue-mix breakdowns.
  - All three render `role="img"` with a data summary as the accessible name (colour is never the only signal), and ship with unit tests for the geometry, Testing Library tests, and axe a11y tests. New CSS lives in `@paul-portfolio/css` as `.paul-chart*` with a token-driven `--paul-chart-1..6` palette a consumer can override.
- Started closing the React → Angular parity gap: `PaulSparkline`, `PaulBarChart`, and `PaulDonutChart`, plus Angular twins of four existing React components whose CSS already shipped — `PaulDivider`, `PaulSpinner`, `PaulIconButton`, `PaulSwitch`. Added a `vitest` config to the Angular package and unit tests for its copy of `chartGeometry`, which guard the two copies against drifting.
- Deferred (follow-ups): the specialty chart types from the 17-type gallery (funnel, radar, scatter, cohort heatmap, pareto, radial gauge, word cloud, stacked/multi-series line); multi-series line for `Sparkline`; the remaining React → Angular ports (Textarea, Select, FilterBar, InfoTip, Ticker, TiltCard, GradientBackground, Spotlight); and Angular TestBed render tests (the package has no TestBed infra yet — the shared geometry is unit-tested and React is the tested reference for the rendered contract).
- Bumps `@paul-portfolio/css` 0.4.6 → 0.4.7, `@paul-portfolio/react` 0.4.5 → 0.4.6, and `@paul-portfolio/angular` 0.1.21 → 0.1.22.

## [0.2.26] - 2026-07-26

### Added

- Three motion-driven "showcase" components in `@paul-portfolio/css` and `@paul-portfolio/react`, all decorative wrappers that stay content-agnostic (take `children`), are SSR-stable, and honour `prefers-reduced-motion`:
  - `TiltCard` — a surface that tilts in 3D toward the pointer with a cursor-tracking glare. Pointer-driven only (keyboard users are unaffected) and it collapses to a flat, static card under reduced motion. Configurable via `maxTilt` and `glare`. CSS: `.tilt-card`, `.tilt-card__inner`, `.tilt-card__glare`, driven by the `--paul-tilt-x` / `--paul-tilt-y` / `--paul-glare-x` / `--paul-glare-y` custom properties.
  - `GradientBackground` — a flowing multi-stop gradient surface. The ambient flow is pure CSS gated behind `prefers-reduced-motion`, so it goes static with no JS. Configurable via `colors`, `angle`, `speed`, and `animate`, falling back to the token brand palette. CSS: `.gradient-bg` with the `paul-gradient-flow` keyframe.
  - `Spotlight` — an interactive background with a soft radial glow that follows the cursor; under reduced motion the glow is pinned to the centre and stops tracking. Configurable via `size` and `color`. CSS: `.spotlight`, `.spotlight__glow`, `.spotlight__content`, driven by the `--paul-spotlight-x` / `--paul-spotlight-y` / `--paul-spotlight-size` / `--paul-spotlight-color` custom properties.
- Extracted `usePrefersReducedMotion` into a shared hook (now exported from `@paul-portfolio/react`) and refactored `Ticker` to use it, so every motion component reads the preference identically.
- Each component ships with CSS + React tests, an axe a11y test, and Storybook stories. Angular deferred, same as Select/FilterBar/Ticker. Bumps `@paul-portfolio/css` 0.4.5 → 0.4.6 and `@paul-portfolio/react` 0.4.4 → 0.4.5.

## [0.2.25] - 2026-07-24

### Added

- `Ticker`, a horizontal ticker strip, generalized from the tickers in paul-explore and ketsup (which had grown their own). It has two modes: `scroll` (default) is an accessible, real scroll container with an ambient JS auto-scroll that pauses on hover/touch and keeps every item reachable by wheel/trackpad/drag/touch (the trailing copy is aria-hidden and pulled out of the tab order); `marquee` is a decorative, aria-hidden CSS loop for pure flavour. It's content-agnostic (takes children), configurable via `edge`/`direction`/`speed`, and both modes honour `prefers-reduced-motion` — scroll collapses to a plain scrollable row, marquee goes static. Added to `@paul-portfolio/css` (`.ticker`, `.ticker--marquee`, `.ticker--top`/`--bottom`) and the React package, with CSS + React tests and Storybook stories. Angular deferred, same as Select/FilterBar. Bumps `@paul-portfolio/css` 0.4.4 → 0.4.5 and `@paul-portfolio/react` 0.4.3 → 0.4.4.

## [0.2.24] - 2026-07-24

### Added

- Hard offset elevation on `@paul-portfolio/tokens`: `--paul-shadow-offset-sm`, `--paul-shadow-offset-md`, and `--paul-shadow-offset-lg` — solid, un-blurred drop shadows (2/6/9px) for retro / neo-brutalist surfaces that want a crisp edge instead of a soft blur. Harvested from ketsup's Kinetic x Dusk theme. Also adds the tokens package's first vitest test. Bumps `@paul-portfolio/tokens` 0.1.9 → 0.1.10.

## [0.2.23] - 2026-07-24

### Added

- `starburst` variant on `Badge`, harvested from the BETA seal in ketsup. It's a spiky seal shape (a fixed square clipped to a burst with a light-to-saturated radial fill) for "new"/"beta" flags, and it composes with the existing colour variants (`starburst` + `warning`, etc.), defaulting to primary. It reads the same in light and dark, so it needs no dark-mode override. Added to `@paul-portfolio/css` (`.badge--starburst`), the React package (`starburst` prop), and Angular (`starburst` input), with CSS + React tests and Storybook stories. Bumps `@paul-portfolio/css` 0.4.3 → 0.4.4, `@paul-portfolio/react` 0.4.2 → 0.4.3, and `@paul-portfolio/angular` 0.1.20 → 0.1.21.

## [0.2.22] - 2026-07-23

### Added

- `Select` and `FilterBar` components, generalized from the fantasy filter rows in paul-explore (PR #204). `Select` is a labelled, accessible `<select>` that shares the input field styling, hides the native chevron and paints its own (inlined, asset-free, with a dark-mode variant), and supports `sm`/`md` sizes, `error`/`helper` text, and a `horizontal` orientation for inline filter rows. `FilterBar` is a labelled `<section>` landmark wrapping a centered, wrapping row of controls, so the region + accessible name are built in rather than copy-pasted per page. Added to `@paul-portfolio/css` (`.select`, `.filter-bar`) and the React package, with CSS + React tests (including axe-core a11y) and Storybook stories. Bumps `@paul-portfolio/css` 0.4.2 → 0.4.3 and `@paul-portfolio/react` 0.4.1 → 0.4.2.

## [0.2.21] - 2026-07-23

### Added

- New `gel` button variant: a glossy gradient fill with a hard offset shadow, harvested from the ketsup redesign. It is theme-agnostic — the gradient is built from the primary tokens and the gloss is a background layer (not a pseudo-element), so it takes on whatever palette the consumer themes and never sits over the label. Added to `@paul-portfolio/css` (`.btn--gel`) and the React `Button` variant union, with a Storybook story and CSS + React tests. Bumps `@paul-portfolio/css` 0.4.1 → 0.4.2 and `@paul-portfolio/react` 0.4.0 → 0.4.1.

## [0.2.20] - 2026-07-20

### Fixed

- Ghost button label vanished on hover in dark mode. `.btn--ghost:hover` filled with a light neutral that never flipped for dark mode, so the foreground-colored label washed out against it. Added a dark-mode hover background (matching the outline variant) so the label keeps contrast. Bumps `@paul-portfolio/css` 0.4.0 → 0.4.1.

## [0.2.19] - 2026-07-19

### Changed

- Bumped the publishable packages so the enhancement work can actually ship: `@paul-portfolio/react` 0.3.0 → 0.4.0 and `@paul-portfolio/css` 0.3.1 → 0.4.0. Those exact versions were already on npm, so the component enhancements and audit fixes (Modal, Avatar, Chip, Skeleton, Input, Button, Badge, Tooltip, etc.) had no new version to publish under. `@paul-portfolio/tokens` is unchanged at 0.1.9.

## [0.2.18] - 2026-07-19

### Fixed

- Disabled Input and Textarea were indistinguishable from the enabled state — there were no disabled styles at all, so they kept the normal surface background and full-strength text. They now use a grayer fill, muted text, and a `not-allowed` cursor, in both light and dark themes.

### Changed

- Input stories now render at a realistic field width (20rem) instead of stretching edge to edge. A full-bleed input made the focus ring look like a line across the top rather than a ring around the field.

## [0.2.17] - 2026-07-19

### Fixed

- Skeleton circle rendered enormous — `.skeleton--circle` set `aspect-ratio: 1` but no width, so a block-level skeleton filled its container and the aspect ratio turned that full width into a giant circle. It now defaults to 40px, and the React `width`/`height` props apply to the circle (and any variant), not just `rect`.

## [0.2.16] - 2026-07-19

### Fixed

- Removable Chip had no visible close affordance — the React `.chip__remove` button rendered empty (the "×" was never in the markup, unlike the Angular component), so it was a blank clickable square. It now renders an `aria-hidden` "×" glyph, sized up a little so it reads clearly.

## [0.2.15] - 2026-07-19

### Changed

- Avatar "WithImage" story now renders at `lg`. With the new `md` size default an unsized image avatar dropped from its old raw-image dimensions to 32px, which looked cramped in the showcase; `lg` shows the image avatar clearly.

## [0.2.14] - 2026-07-19

### Fixed

- Modal panel rendered with no surface: the React component put the dialog styles on `.modal` and the title on `.modal__title`, but the CSS (and the Angular component) style `.modal__content` and `.modal__header`. The panel is now `.modal__content` and the title renders in `.modal__header`, so the dialog gets its background, radius, shadow, and header divider.
- Avatar collapsed when no `size` was given — the size only came from a modifier class, so an unsized avatar had no dimensions. `size` now defaults to `md`. The fallback initials also fill the whole circle instead of hugging the text.

## [0.2.13] - 2026-07-19

### Fixed

- Button loading spinner was invisible: `aria-busy` sets `color: transparent` to hide the label, which also zeroed out the `currentColor` the spinner border relied on. The spinner now uses an explicit color — the foreground on light fills, white on the solid primary/danger variants.
- Badge dot was washed out — the 8px dot reused the pale text-badge background (e.g. `success-100`), which is nearly invisible at that size. Dots now use the saturated `-500` fills.

## [0.2.12] - 2026-07-19

### Changed

- Spinner story: replaced the "CustomLabel" story (visually identical to Default, since `label` is only the accessible name) with a "WithText" story that pairs the spinner with matching visible text, so there's something distinct to see and it shows the real usage.

## [0.2.11] - 2026-07-19

### Fixed

- Storybook was never importing `@paul-portfolio/tokens/tokens.css`, so every `--paul-*` custom property resolved to empty and all component styles fell back to nothing (backgrounds transparent, borders gone). Components with literal text colors looked "sort of there"; token-only ones like Tooltip (white text on white) and Spinner were invisible. The preview now imports the tokens before the css, so everything renders styled — and Chromatic baselines are finally meaningful.

## [0.2.10] - 2026-07-19

### Fixed

- `index.css` was missing the newer components (icon-button, textarea, switch, spinner, info-tip, divider) — it kept its own duplicate import list that never got the additions, so consumers of the full entry point (and Storybook) got no styles for those. `index.css` now imports `components.css` directly, so the two entry points can't drift again.

## [0.2.9] - 2026-07-19

### Fixed

- Tooltip and InfoTip stories now hover to reveal the bubble before Chromatic snapshots, so the baselines actually show the tooltip/popover instead of just the bare trigger. Added an explicit trigger-only InfoTip story for the resting state.

## [0.2.8] - 2026-07-19

### Added

- Storybook stories for Textarea, InfoTip, Switch, Spinner, and Divider, which had none, so the whole component set is documented and covered by Chromatic.

### Fixed

- IconButton story now renders the real IconButton component instead of a Button with a non-existent `btn--icon` class.

## [0.2.7] - 2026-07-19

### Fixed

- Tooltip Storybook interaction test: waits for the tooltip with `findByRole` now that it appears after a show-delay, instead of reading it synchronously right after hover (which failed to render under Chromatic UI Tests).

## [0.2.6] - 2026-07-19

### Added

- Modal: `aria-label`, `aria-labelledby`, and `aria-describedby` passthrough (so it can be labelled without a visible title), a `className`, and a focus trap that moves focus into the dialog on open, cycles Tab within it, and restores focus to the opener on close.

### Notes

- With this, `@paul-portfolio/react` and `/css` are cut to 0.3.0 for the Textarea / Tooltip / InfoTip / Chip / Modal enhancements in this batch.

## [0.2.5] - 2026-07-19

### Added

- Chip: a `color` prop (background color with white text), `fullWidth` to stretch inside a container, and a `title`. When given an `onClick` the label becomes a real focusable button (with the remove button as a sibling, so no button-in-button), and the remove button now names itself "Remove <label>".

## [0.2.4] - 2026-07-19

### Changed

- Tooltip now renders at a fixed screen position instead of absolute, so it's never clipped by an `overflow:hidden` ancestor (grids, cards, chips) and needs no portal. Shows on hover and focus after a `delay`, dismissible with Escape. `content` now accepts rich nodes, plus a `maxWidth`.

### Added

- InfoTip accepts rich `ReactNode` content and a `maxWidth`, built on the fixed-position Tooltip. Brings it to parity with the hand-rolled popover in consuming apps.

## [0.2.3] - 2026-07-19

### Added

- Textarea: `hideLabel` (visually hide the label but keep it accessible), a `required` marker, and an optional live character counter (`showCount` with `maxLength`). Brings it to parity with the richer hand-rolled Textarea in consuming apps so they can back onto it.

## [0.2.2] - 2026-07-16

### Fixed

- Upgrade publish workflow to Node 24 (npm 11.5.1+) required for OIDC trusted publishing
- Remove `registry-url` from setup-node to prevent `.npmrc` `_authToken` line from overriding OIDC

## [0.2.1] - 2026-07-16

### Fixed

- Added job-level `id-token: write` permission to publish workflow for reliable OIDC token minting
- Normalized `repository.url` format with `git+https://` prefix across all packages

## [0.2.0] - 2026-07-16

- testing auto publish

## [0.1.29] - 2026-07-16

- update the publish workflow

## [0.1.28] - 2026-07-16

### Added

- `repository.url` field to all package.json files pointing to `https://github.com/gpbsumido/paul-design-system.git` with per-package `directory` paths

## [0.1.26] - 2026-07-15

### Fixed

- CSS component spacing tokens were referencing the old dot-based names (`--paul-spacing-1\.5`) while the tokens package had already renamed them to underscores (`--paul-spacing-1_5`). This caused missing padding on buttons (sm), chips (sm), badges, tooltips, and missing gap on input wrappers.
- Affected files: button.css, input.css, chip.css, badge.css, tooltip.css

### Added

- `components.css` entry point for `@paul-portfolio/css` — imports all component and utility styles without the reset/base layers. Tailwind consumers use this instead of `index.css` to avoid CSS reset conflicts with preflight.
- New package.json export: `"./components.css": "./src/components.css"`

## [0.1.23] - 2026-07-14

- Updating version to test auto-publish to NPM

## [0.1.23] - 2026-07-14

- Added Chromatic as dependency

## [0.1.23] - 2026-07-14

### Fixed

- Storybook stories now import from `@paul-portfolio/react` package instead of relative paths into `../../react/src/` — relative imports broke in CI where the react package hadn't been built yet
- Storybook preview imports `@paul-portfolio/css` by package name instead of relative path
- Added `@paul-portfolio/css` and `@paul-portfolio/react` as storybook devDependencies so workspace resolution works

## [0.1.22] - 2026-07-14

### Changed

- Renamed npm scope from `@paul/*` to `@paul-portfolio/*` across all packages
- Fixed spacing token CSS custom property names: dots replaced with underscores (`--paul-spacing-0_5` instead of `--paul-spacing-0.5`) to avoid CSS parsing errors in Next.js/SWC and other strict parsers
- Fixed React and Angular package builds: excluded `__tests__` from tsconfig compilation so dist/ contains actual component output
- Added `disabled` to React Button's `BaseProps` to fix TypeScript union type error
- Bumped tokens to 0.1.4, css to 0.1.10, react to 0.1.13, angular to 0.1.16

### Lessons learned

- CSS custom property names cannot contain dots — they break SWC's CSS parser even though some browsers tolerate them. Always use underscores or hyphens for fractional token names
- Test files must be excluded from tsconfig when the build script is `tsc` — otherwise `__tests__/` directories end up in dist/ and test-only type augmentations (vitest matchers) cause compilation errors
- Discriminated union types in React components (ButtonAsButton | ButtonAsAnchor) require shared props to be in the base type, not just in one branch of the union

## [0.1.21] - 2026-07-13

### Changed

- Comprehensive README with full documentation, component table, architecture decisions
- Updated CLAUDE.md to reflect final project state and all package details

## [0.1.20] - 2026-07-13

### Added

- axe-core accessibility tests for all React components (10 tests, zero violations)
- prefers-reduced-motion support for button, modal, and card transitions
- prefers-contrast (high contrast) support for focus rings, buttons, and inputs
- WCAG 2.1 AA contrast ratio documentation for all token color combinations

## [0.1.19] - 2026-07-13

### Added

- Storybook interaction tests for Button (click, keyboard), Modal (open/close/escape), Input (typing), Tooltip (hover)
- test-storybook script for headless interaction test running
- CI workflow step for interaction tests (commented, requires running Storybook)

## [0.1.18] - 2026-07-13

### Added

- Chromatic visual regression testing integration
- GitHub Actions workflow for automated Chromatic on PRs
- Viewport coverage: 320px (mobile), 768px (tablet), 1280px (desktop)
- Storybook README with development and Chromatic setup docs

## [0.1.17] - 2026-07-13

### Added

- Storybook stories for all React components: Button, Input, Chip, Card, Modal, Tooltip, Avatar, Badge, Skeleton, IconButton
- CSF3 format with autodocs, argTypes controls, and args-based stories
- Modal story with interactive open/close demo
- Skeleton CardSkeleton composed example

## [0.1.16] - 2026-07-13

### Added

- Storybook 8 setup with React Vite framework
- Theme switcher addon (light/dark via data-theme)
- Accessibility addon for inline a11y checks
- Token documentation: Colors, Spacing, Typography MDX pages

## [0.1.15] - 2026-07-13

### Added

- Modal Angular component with backdrop dismiss, Escape key, aria-modal
- Tooltip Angular component with hover trigger and side positioning
- Avatar Angular component with image/fallback and size variants
- Badge Angular component with variant colors and dot mode
- Skeleton Angular component with CSS variable sizing
- VisuallyHidden Angular component

## [0.1.14] - 2026-07-13

### Added

- Input Angular component with label, error, helper, size, aria-describedby
- Chip Angular component with clickable/removable modes
- Card Angular compound components (card, card-header, card-body, card-footer)

## [0.1.13] - 2026-07-13

### Added

- Angular package scaffold with standalone components
- Button Angular component with signal inputs, variant/size/disabled/loading/href

## [0.1.12] - 2026-07-13

### Added

- Modal React component with portal, backdrop click, Escape key, focus trap, aria-modal
- Tooltip React component with hover trigger, side positioning, aria-describedby
- Avatar React component with image/fallback modes and size variants
- Badge React component with success/warning/error/info variants and dot mode
- Skeleton React component with text/circle/rect variants and CSS variable sizing
- VisuallyHidden React component wrapping .visually-hidden

## [0.1.11] - 2026-07-13

### Added

- Input React component with label, error, helper text, size variants, and aria-describedby
- Chip React component with clickable/removable modes
- Card React compound component (Card.Header, Card.Body, Card.Footer)

## [0.1.10] - 2026-07-13

### Added

- React package scaffold with vitest + Testing Library + jsdom
- Button React component with variant/size/loading/disabled/href props
- forwardRef support on Button
- Polymorphic rendering (button or anchor) based on href prop
- cx() classname utility
- Vitest workspace config for monorepo-wide testing

## [0.1.9] - 2026-07-13

### Added

- Tooltip CSS component with top/bottom/left/right positioning
- CSS triangle arrows via pseudo-elements
- prefers-reduced-motion support for tooltip transitions
- Dark mode tooltip color inversion

## [0.1.8] - 2026-07-13

### Added

- Skeleton loader CSS component with shimmer animation and text/circle/rect variants
- Custom skeleton sizing via --skeleton-w and --skeleton-h CSS variables
- Modal CSS component with backdrop blur, content panel, header/body/footer sections
- prefers-reduced-motion support for skeleton animation
- Body scroll lock via .modal--open class

## [0.1.7] - 2026-07-13

### Added

- Chip CSS component with sizes, clickable, and removable variants
- Badge CSS component with success/warning/error/info variants and dot indicator
- Avatar CSS component with sizes (sm/md/lg/xl) and fallback initials
- Card CSS component with elevated/interactive variants and header/body/footer sections

## [0.1.6] - 2026-07-13

### Added

- Input CSS component with validation states (error via aria-invalid)
- Input sizes (sm, md) and wrapper/label/helper layout
- Textarea component extending input styles
- Dark mode input adjustments

## [0.1.5] - 2026-07-13

### Added

- Button CSS component with variants (primary, secondary, outline, ghost, danger)
- Button sizes (xs, sm, md, lg) and icon-only variant
- Button states: disabled, loading (aria-busy), focus-visible ring
- Dark mode button adjustments

## [0.1.4] - 2026-07-13

### Added

- CSS reset with modern defaults
- Base typography styles using design tokens
- Focus ring utility (.focus-ring, .focus-ring-inset) with dark mode support
- Screen-reader-only utility (.sr-only)
- Visually hidden utility (.visually-hidden)
- CSS layer ordering: reset < tokens < base < components < utilities

## [0.1.3] - 2026-07-13

### Added

- SCSS variable output (build/tokens.scss) with $paul-tokens map
- JSON structured output (build/tokens.json)
- Package exports for CSS, SCSS, and JSON token files
- prepublishOnly script for automated builds

## [0.1.2] - 2026-07-13

### Added

- Spacing tokens (4px base scale, 0-24)
- Typography tokens: fontSize, lineHeight, fontWeight, letterSpacing, fontFamily
- Border radius tokens (sm-full)
- Shadow tokens (xs-2xl)
- Motion tokens: duration and easing
- Z-index tokens (base-toast)
- CSS custom properties for all new token categories

## [0.1.1] - 2026-07-13

### Added

- Full color palette: primary, secondary, neutral, error, success, warning (50-950 shades)
- Semantic color aliases with light/dark mode support
- CSS custom property output in build/tokens.css

## [0.1.0] - 2026-07-13

### Added

- Initial monorepo scaffold with workspace config
- Four package stubs: @paul-portfolio/tokens, @paul-portfolio/css, @paul-portfolio/react, @paul-portfolio/angular
