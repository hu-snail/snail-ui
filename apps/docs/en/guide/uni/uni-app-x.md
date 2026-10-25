# uni-app x (Vapor Mode) Support

`@snui/uni` is the single component source for uni-app x (App side, vapor mode):
one codebase serves both uni-app (H5 / mini-programs / App) and uni-app x. The
`.uvue` artifacts consumed by uni-app x are produced by the deterministic
transform pipeline in `@snui/uni-x` (see `ADR-0004`) — there is no second
hand-maintained component codebase.

## When to use

- Your target is uni-app x **App** (Android / iOS / HarmonyOS, vapor mode,
  HBuilderX 5.21+).
- For uni-app x web / mini-program targets, keep using `@snui/uni` (more mature).

## Getting started

### 1. Build the artifacts

```bash
pnpm -F @snui/uni-x build
```

This produces `packages/uni-x/dist/uni_modules/snail-uix/`. Copy the whole
`snail-uix` folder into your uni-app x project's `uni_modules/` directory.

### 2. Configure easycom

In `pages.json`:

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^sn-(.*)": "@/uni_modules/snail-uix/components/sn-$1/sn-$1.uvue"
    }
  }
}
```

### 3. Import the theme tokens

Import the class-only token layer in `App.uvue` (App has no `:root`; variables
mount on `.sn-theme-root`, which `sn-config-provider` adds automatically):

```css
@import "uni_modules/snail-uix/theme/index.css";
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

| Item | Status |
| --- | --- |
| Components | All 82 components (95 `.uvue` files) + 29 ts helpers |
| Theme / dark mode | Class-only token layer generated |
| Style Packs (skin) | Missing: `.snui-skin-doodle` descendant rules cannot be expressed on App; pending the variable-based rework |
| sn-table | `<component :is>` dynamic component needs a manual port |
| Canvas components (qr-code / signature / watermark / img-cropper) | Pending uni-app x canvas API adaptation |
| Desktop H5 mouse gestures (picker-view) | Gated behind `#ifdef H5`; App stays touch-only |

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
yet — verify them first when adopting:

- [ ] `hover-class` press states (sn-button / sn-cell)
- [ ] `<image>` rendering SVG data URLs (sn-icon; fall back to the iconfont glyph path)
- [ ] CSS variables injected via `:style` (~80 sites, e.g. tabs animation duration)
- [ ] `gap` / `@keyframes` under the bytecode rendering pipeline
- [ ] `position: fixed` with safe-area variables (overlay components)
- [ ] `defineProps` / `withDefaults` / `defineSlots` macro coverage (sn-form-item
      consumes the `defineSlots` return value)

This section becomes the support matrix once verified.
