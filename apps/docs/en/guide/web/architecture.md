# Architecture

snail-aui v3.1 is an end-aware AI-Native UI framework ecosystem. Web (PC) and uni (mobile) are fully independent — from source to build to npm. Zero source reuse across ends. Style Packs / AI Layer / docs are shared cross-end and filtered by `end`.

## Dual-end architecture

```text
┌──────────────────────────────────────────────────────────────────────┐
│  AI Ecosystem (shared cross-end, filtered by end)                      │
│  snail-ui.skill.md   MCP Server   ai-meta.json   llms.txt               │
│  (@snui/ai)                                                                │
└────────────┬──────────────────────────────────────────┬───────────────┘
             │                                          │
┌────────────▼──────────────┐            ┌───────────▼────────────────┐
│  Web end (desktop)              │            │  uni end (mobile)             │
│                                  │            │                              │
│  @snui/vue-web                   │            │  @snui/uni                    │
│    SnButton / SnForm /          │            │    sn-button / sn-list /     │
│    SnTable / SnTree / ...        │            │    sn-grid / sn-pull-...      │
│      ↓                           │            │      ↓                        │
│  @snui/tokens-web                │            │  @snui/tokens-mp             │
│    --sn-web-color-action-         │            │    --sn-mp-color-action-      │
│    primary → --aui-color-         │            │    primary → --aui-color-      │
│    action-primary                │            │    action-primary             │
└─────────────┬────────────────────┘            └──────────────┬───────────────┘
              │                                                  │
              └───────────────────┬──────────────────────────┘
                                  │
┌──────────────────────────────▼──────────────────────────────────────┐
│  Style Pack layer (shared cross-end, filtered by end)                  │
│  @snui/style-packs   default(both) / dark(both) / ios(both) /         │
│                      mp-taobao(mp) / mp-douyin(mp)                    │
│      ↓                                                                  │
│  @snui/tokens         Unified base layer → --aui-*                     │
│  Primitive  →  Semantic  →  Component  →  --aui-*                     │
│                       (Theme / Style / Density three independent axes) │
└──────────────────────────────────────────────────────────────────────┘
```

## Packages

| Package | Role | End |
|---|---|---|
| `@snui/tokens` | Unified three-layer Token cascade, outputs `--aui-*` | shared base |
| `@snui/tokens-web` | `--sn-web-*` alias layer | Web (independent) |
| `@snui/tokens-mp` | `--sn-mp-*` alias layer (with px → rpx conversion) | uni (independent) |
| `@snui/vue-web` | Web component library (SnButton / SnTable / ...) | Web (independent) |
| `@snui/uni` | uni component library (sn-button / sn-list / ...) | uni (independent) |
| `@snui/style-packs` | Style Pack descriptions (with `end` field) | shared cross-end |
| `@snui/ai` | Skill + MCP + ai-meta | shared cross-end |
| `@snui/cli` | resolver + llms.txt + token-check + pack-validate | shared cross-end |
| `@snui/docs` | VitePress docs site | shared cross-end |

## End-aware principle (v3.1, top priority)

> Each end is **fully independent** from source to publish.

- Independent source dir (`packages/vue-web/` / `packages/uni/`)
- Independent build (`dist/`) and independent npm publish
- Independent TypeScript types (`.d.ts`)
- Independent Token alias (`@snui/tokens-web` ≠ `@snui/tokens-mp`)
- **Zero source reuse across ends**
- Shared cross-end: metadata + tooling only (tokens / style-packs / ai / cli / docs)

Future end (React, Flutter, ...) follows the same pattern:

```
@snui/tokens-{end}/   --sn-{end}-* alias layer
@snui/{end}/          end component implementation (zero reuse)
```

## Three-layer Token (unified base @snui/tokens)

```text
Primitive  →  Semantic  →  Component  →  --aui-* raw layer
raw values      semantics       component-level   cross-end unified
                       ↓
        ┌─────────────────┴─────────────────┐
        ↓                                   ↓
@snui/tokens-web                  @snui/tokens-mp
--sn-web-* alias                  --sn-mp-* alias (with rpx conversion)
        ↓                                   ↓
   @snui/vue-web                       @snui/uni
   consumed by Web                   consumed by uni
```

## Per-end Component Token differences

Different ends have different Component Token fields, per scenario:

| Field | Web (`--sn-web-*`) | uni (`--sn-mp-*`) |
|---|---|---|
| button-radius | ✅ 6px | ✅ 24rpx |
| button-height-medium | ✅ 36px | ✅ 72rpx |
| table-row-height | ✅ 32px | ❌ |
| list-item-height | ❌ | ✅ 88rpx |
| sidebar-item-height | ❌ | ✅ 100rpx |
| dropdown-item-padding | ✅ 8px 16px | ❌ |

`tokens-web` and `tokens-mp` independently maintain field maps; they don't interfere.

## Three independent axes

| Axis | What | Forbidden |
|---|---|---|
| Theme | Color | Radius, spacing, size |
| Style | Radius + shadow + Component Token | Color, spacing, font size |
| Density | Spacing + size + font size | Color, radius |

Style Pack is a combination of all three.

## Style Pack three layers

| Layer | Content | Required |
|---|---|---|
| Token | Color / radius / spacing overrides | every Pack |
| Skin CSS | `.snui-skin-{name}` scoped CSS | only Packs needing visual personality |
| Resources | Fonts / textures | a few Packs |

Skin CSS only modifies visual layers (color, shadow, font, animation, pseudo-elements) — never DOM / Props / behavior.

## uni / MP platform differences

| Capability | Web | uni H5 | WeChat / Alipay MP |
|---|---|---|---|
| `:root {}` CSS variables | ✅ | ✅ | ❌ (only page / component scoped) |
| `[data-theme="dark"]` | ✅ | ✅ | ❌ |
| `document.body.classList` | ✅ | ✅ (H5) | ❌ |
| Dynamic `<style>` injection | ✅ | ✅ (H5) | ❌ |
| Skin CSS (BEM class) | ✅ | ✅ | ✅ (component scoped) |

MP uses `ConfigProvider` root class forwarding + component-scoped CSS overrides.

## End-aware implementation

```ts
// tokens-web/src/variables.ts (Web alias map)
export const snWebAliasMap = [
  ['--sn-web-color-action-primary', '--aui-color-action-primary'],
  // ...
]

// tokens-mp/src/variables.ts (uni alias map, with px → rpx)
export const snMpAliasMap = [
  ['--sn-mp-color-action-primary', '--aui-color-action-primary'],
  // note: px auto-converts to rpx
  // ...
]
```

Component consumption:

```css
/* Web */
.sn-button { background: var(--sn-web-color-action-primary); }

/* uni */
.sn-button { background: var(--sn-mp-color-action-primary); }
```

## Cross-end shared layers

| Layer | How end is filtered |
|---|---|
| `@snui/style-packs` | Pack's `end: 'web' \| 'mp' \| 'both'` field |
| `@snui/ai` Skill file | per-end component list |
| `@snui/ai` MCP `list_components` | `end` input parameter |
| `@snui/ai` ai-meta.json | components array grouped by end |
| `@snui/docs` | nav split by Web / uni |

## CI pipeline

```text
PR opened
  ↓
typecheck (per-end independent)
  ↓
lint (per-end independent)
  ↓
test (per-end independent)
  ↓
build (per-end produces dist/)
  ↓
token check (per-end: validate alias prefix correctness)
  ↓
pack validate (cross-end Style Pack)
  ↓
ai-meta generate (grouped by end)
  ↓
Review Agent
  ↓
Human Gate (end-aware breakage / Public API change)
  ↓
merge main
```

## Where to next

- [Token cascade](/en/theme/cascade)
- [Style Packs](/en/style-packs/overview)
- [AI Ecosystem](/en/ai/overview)