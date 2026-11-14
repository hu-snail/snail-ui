# uni-app x (Vapor Mode) Support

`@snui/uni` is the single component source for uni-app x (App side, vapor mode):
one codebase serves both classic uni-app (H5 / mini-programs / App-vue) and
uni-app x. The `.uvue` artifacts consumed by uni-app x are produced by the
deterministic transform pipeline in `@snui/uni-x` (see `ADR-0004`) — there is
no second hand-maintained component codebase.

## When to use

- Your target is uni-app x **App** (Android / iOS / HarmonyOS, vapor mode,
  HBuilderX 5.21+).
- For uni-app x web / mini-program targets, keep using `@snui/uni` (more mature).

## Getting started

### 1. Install

```bash
pnpm add @snui/uni-x
```

The artifacts (`.uvue` components + theme) are **shipped with the package**
(under `dist/components/…` inside it) — nothing to generate or copy on your
side. Before the first release, run `pnpm -F @snui/uni-x pack` in this repo
and install the resulting tarball (the `prepack` hook regenerates `dist/`
automatically, so the tarball always carries the latest transform output).

### 2. Configure easycom

In `pages.json`:

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^sn-(.*)": "@snui/uni-x/components/sn-$1/sn-$1.uvue"
    }
  }
}
```

### 3. Import the theme tokens

Import the class-only token layer in `App.uvue` (App has no `:root`; variables
mount on `.sn-theme-root`, which `sn-config-provider` adds automatically):

```css
@import '@snui/uni-x/theme/index.css';
```

Pages that do not use `sn-config-provider` should add `class="sn-theme-root"`
to their root view.

### 4. Enable vapor mode

Check "vapor mode" in the `manifest.json` visual editor (HBuilderX 5.21+;
5.31+ recommended).

### 5. Dark mode

Same as the uni end: wrap with `<sn-config-provider theme="dark">`, or add the
`sn-theme-dark` class on the root node manually.

## Current status

> uni-app x is DCloud's next-generation framework; **vapor mode is the
> officially maintained direction** going forward, and it is the primary
> target of this end's compatibility work.

| Item                                    | Status                                                                                                                                                                                                                                                                                 |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Components                              | All 98 components (113 `.uvue` files) + 55 ts helpers (shared utils included)                                                                                                                                                                                                          |
| Theme / dark mode                       | Class-only token layer generated; shared utils (`outside-close` / `sn-lunar` / `sn-size` / `uid`) ship inside the package and resolve via `@snui/uni-x/utils/*`                                                                                                                        |
| Selector compliance                     | **Zero drops**: `pseudo-class: 0`, `combinator-unsupported: 0`, `attribute-selector: 0` — sn-slider-bar (`:not` → `--filled` class), sn-code-input (3-level skin rules → mirrored `__box` state classes) and sn-form-item (`[data-status]` → native modifier classes) were rewritten at the source |
| Style Packs (skin)                      | **Supported via variable injection**: skin descendant rules flatten into single-class `--snx-*` var blocks (measured: 59 components, 1097 injected vars, 434 consumers); only 9 interactive-state (`:hover`/`:active`) rules are dropped — unrepresentable on App (see PORTING-REPORT) |
| sn-table                                | uvue officially supports `<component :is>` on App; the slot-function value shape used here needs compile verification                                                                                                                                                                  |
| sn-sticky                               | Degrades to normal flow on App (vapor has no `position: sticky`; built-in sticky-section works only inside list-view) — use list-view + sticky-section for list pinning                                                                                                                |
| sn-rich-text                            | Transforms with zero drops (type-only defineSlots strip only); media control / anchor positioning rely on platform APIs — treat as unverified until device-tested                                                                                                                      |
| Canvas components                       | Only sn-qr-code actually uses canvas — adapted to the uni-app x API (W3C 2d context + bitmap DPR sizing + `toDataURL` export); sn-signature / sn-watermark / sn-img-cropper were designed canvas-free (view strokes / view tiling / geometry reporting), nothing to change             |
| Desktop H5 mouse gestures (picker-view) | Gated behind `#ifdef H5`; App stays touch-only                                                                                                                                                                                                                                         |
| In-repo example                         | `apps/uni-demo-x` — the full uni-demo (100 pages / 353 zh + 360 en scenarios) generated onto the `.uvue` artifacts; reproducible via `pnpm -F @snui/uni-demo-x gen && pnpm -F @snui/uni-demo-x check`                                                                                   |

Every transform decision (dropped rules, wrapped text, renamed events) is
listed in `packages/uni-x/PORTING-REPORT.md`.

## Platform differences

The uni-app x App CSS engine accepts a subset; the pipeline handles it:

- Class selectors only (compound `.a.b` allowed); descendant selectors degrade
  to CSS custom-property context injection
- No pseudo-classes / pseudo-elements: press feedback goes through
  `hover-class` (the officially recommended approach), hairlines become real elements
- Bare text nodes are wrapped in `<text>`; text styles do not inherit
- `@tap` is normalized to `@click`; `data-*` attributes are stripped (uni-x output)
- Properties without a native equivalent (`cursor`, `user-select`, …) are stripped

## Device verification checklist (not yet verified)

The following have **not been compiled through HBuilderX on a real device**
yet — verify them first when adopting (status: **NOT RUN**; uni-app x has no
CLI, so compilation verification requires HBuilderX):

- [ ] `hover-class` press states (sn-button / sn-cell)
- [ ] `<image>` rendering SVG data URLs (sn-icon; fall back to the iconfont glyph path)
- [ ] CSS variables injected via `:style` (~80 sites, e.g. tabs animation duration)
- [ ] `gap` / `@keyframes` under the bytecode rendering pipeline
- [ ] `position: fixed` with safe-area variables (overlay components)
- [ ] `uni.getSystemInfoSync` (28 call sites) and the remaining `uni.*` API surface on App
- [ ] sn-rich-text `<video>` / audio button / anchor selector queries (`createSelectorQuery` / `pageScrollTo`)
- [ ] `defineProps` / `withDefaults` / `defineSlots` macro coverage (sn-form-item
      consumes the `defineSlots` return value)

- [ ] `hover-class` press states (sn-button / sn-cell)
- [ ] `<image>` rendering SVG data URLs (sn-icon; fall back to the iconfont glyph path)
- [ ] CSS variables injected via `:style` (~80 sites, e.g. tabs animation duration)
- [ ] `gap` / `@keyframes` under the bytecode rendering pipeline
- [ ] `position: fixed` with safe-area variables (overlay components)
- [ ] sn-rich-text `<video>` / audio button / anchor selector queries (`createSelectorQuery` / `pageScrollTo`)
- [ ] `defineProps` / `withDefaults` / `defineSlots` macro coverage (sn-form-item
      consumes the `defineSlots` return value)

This section becomes the support matrix once verified.
