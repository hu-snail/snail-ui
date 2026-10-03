# Architecture

snail-aui is built from six npm packages. The component foundation (tokens / vue-web / uni) plus the Style Pack layer (style-packs), AI Layer (ai), CLI tool, and docs site. Single-direction dependencies, no cycles.

## Architecture overview

```text
┌─────────────────────────────────────────────────────────────────┐
│                       AI Ecosystem Layer                         │
│  snail-ui.skill.md   MCP Server   ai-meta.json   llms.txt       │
│  (@snui/ai)                         (@snui/cli)                   │
└─────────────────────┬───────────────────────────────────────────┘
                      │ reads metadata
┌─────────────────────▼───────────────────────────────────────────┐
│                      Docs / Preview Layer                        │
│  VitePress docs   StyleSwitcher   ThemeCopier   ComponentPreview │
│  (@snui/docs)     — Web: body.class + <style>                    │
│                   — uni: ConfigProvider skin prop                 │
└──────────┬──────────────────────────────┬────────────────────────┘
           │ import components           │ reads Packs
┌──────────▼──────────┐       ┌───────────▼──────────────────────┐
│    Component Layer    │       │         Style Pack Layer         │
│  @snui/vue-web        │       │  @snui/style-packs              │
│  @snui/uni            │       │                                  │
│                       │       │  Token + skin CSS + resources    │
│  Each root element    │       │  default / ios / dark /          │
│  carries              │       │  doodle / sticky-note /          │
│  data-snui-component  │       │  taobao / douyin                 │
└──────────┬────────────┘       └──────────────────────────────────┘
           │ consumes var(--sn-*)
┌──────────▼──────────────────────────────────────────────────────┐
│                      Token Layer (@snui/tokens)                  │
│                                                                  │
│  Primitive  →  Semantic  →  Component                           │
│  colors/spacing   action-primary   button-radius                 │
│  radius/shadow    text-secondary   card-shadow                    │
│                                input-height                      │
│                                                                  │
│  Theme (color) · Style (shape) · Density (size/spacing)         │
│  Output: --aui-* raw layer + --sn-* brand alias                  │
└──────────────────────────────────────────────────────────────────┘
```

## Packages

| Package | Role | Depends on |
|---|---|---|
| `@snui/tokens` | Three-layer Token cascade + parser | (leaf, zero deps) |
| `@snui/vue-web` | Web component library | `@snui/tokens` |
| `@snui/uni` | uni-app component library | `@snui/tokens` |
| `@snui/style-packs` | Official Style Pack collection | `@snui/tokens` (types) |
| `@snui/ai` | Skill + MCP + ai-meta | `@snui/cli` + `@snui/tokens` + `@snui/style-packs` |
| `@snui/cli` | resolver + llms.txt + token-check | `@snui/vue-web` + `@snui/tokens` |
| `@snui/docs` | VitePress docs site | `vue-web` + `uni` + `style-packs` + `ai` |

No circular imports.

## Three-layer Token cascade

```text
Primitive Tokens   Raw values, no semantics (colors / spacing / radius / shadow / fonts / motion / sizes)
      ↓
Semantic Tokens    Semantic names pointing at Primitive CSS vars (action-primary / text-primary)
      ↓
Component Tokens   Component-level (button-radius / card-shadow / input-height-medium)
      ↓
--sn-* aliases      Brand aliases — the only consumption entry for components
```

**Sole consumption rule**: components consume only `var(--sn-*)`. Fallback values are restricted to the keywords `transparent` / `inherit` / `currentColor`.

## Three independent axes

| Axis | What it changes | Forbidden |
|---|---|---|
| Theme | Color (Primitive + Semantic) | Radius, spacing, size |
| Style | Radius + shadow + Component Token | Color, spacing, font size |
| Density | Spacing + size + font size | Color, radius |

A Style Pack (iOS / doodle / etc.) is a combined configuration across all three axes.

## Style Pack three layers

| Layer | Content | Required |
|---|---|---|
| Token layer | Color / radius / spacing overrides (snCssVars()) | Every Pack |
| Skin CSS layer | `.snui-skin-{name}` scoped CSS (font / decoration / effects) | Only Packs needing visual personality (doodle / Douyin) |
| Resource layer | Font files / textures / SVG | A few Packs (Douyin / Taobao) |

**Hard constraints**: skin CSS only modifies visual layers (color, shadow, font, animation, pseudo-elements) — never component DOM / Props / behavior.

## uni / MP platform differences

| Capability | Web | uni H5 | WeChat / Alipay MP |
|---|---|---|---|
| `:root {}` CSS variables | ✅ | ✅ | ❌ (only page / component scoped) |
| `[data-theme="dark"]` | ✅ | ✅ | ❌ |
| `document.body.classList` | ✅ | ✅ (H5) | ❌ |
| Dynamic `<style>` injection | ✅ | ✅ (H5) | ❌ |
| Skin CSS (BEM class) | ✅ | ✅ | ✅ (component scoped only) |

**MP skin strategy**: ConfigProvider root class forwarding → component-scoped CSS overrides via `.snui-skin-{name}` → override scope is limited to the ConfigProvider subtree.

## Package boundary rules

- `tokens` is a leaf, zero runtime deps
- `style-packs` depends only on Token types, not runtime
- `vue-web` / `uni` consume Token via CSS vars only — no JS import
- `ai` does not modify `vue-web` / `uni`, reads metadata only
- Skin CSS never modifies component .vue (only the `data-snui-component` hook)
- No cyclic dependencies (turbo lint enforced)

## Data flow: docs StyleSwitcher

```text
Click StyleSwitcher → choose "ios" Pack
    ↓
Inject Token layer: snCssVars(pack) → <style id="snui-pack"> replaces :root vars
    ↓
Activate skin: document.body.classList.add('snui-skin-ios')
    ↓
Load skin CSS (if any): <link id="snui-skin" href="/packs/ios.skin.css">
    ↓
Component CSS:
  - colors / radius / spacing → Token layer takes effect
  - handwritten font / offset shadow → skin CSS takes effect
    ↓
ThemeCopier shows the snippet; user copies it.
```

## CI pipeline

```text
PR opened
  ↓
typecheck (turbo run typecheck, 0 error)
  ↓
lint (turbo run lint, 0 warning)
  ↓
test (turbo run test, 100% pass)
  ↓
build (turbo run build, 0 error)
  ↓
token check (snui token check, no literal color fallback)
  ↓
pack validate (when adding/modifying a Pack)
  ↓
Review Agent (§88 Checklist)
  ↓
Human Gate (architecture / Public API changes)
  ↓
merge main
```

## Where to next

- [Theme & Tokens](/en/theme/overview)
- [Style Packs](/en/style-packs/overview)
- [AI Ecosystem](/en/ai/overview)