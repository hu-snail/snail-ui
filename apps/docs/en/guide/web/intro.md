# Introduction

snail-aui is an **AI-Native UI framework ecosystem** for Vue 3 + uni-app. Developers use plain Vue components (`<SnButton type="primary">Submit</SnButton>`). AI can read every component, produce high-fidelity prototypes, and swap whole visual identities (doodle / sticky-note / iOS / Taobao / Douyin) in the docs site — then hand you a snippet to paste.

## One-liner

> Developers: `<SnButton type="primary">Submit</SnButton>`  
> AI: read meta via Skill + MCP, output a runnable Vue SFC prototype  
> Designers: flip the Style Pack in the docs site, copy the config

## Architecture in 30 seconds

```text
@snui/tokens        ── Three-layer Token cascade + --sn-* brand alias
        ↑
@snui/vue-web       ── Web component library (naive-ui style API)
@snui/uni           ── uni-app component library (wot-ui style API, easycom)
        ↑
@snui/style-packs   ── Official Style Packs (iOS / dark / doodle / Douyin…)
        ↑
@snui/ai            ── Skill + MCP Server + ai-meta
        ↑
@snui/docs          ── VitePress docs site (with StyleSwitcher / ThemeCopier)
```

What stays underneath:
- Plain Vue SFC authoring (no schema, no runtime)
- AI uses Skill + MCP tools to understand components
- Style Packs touch Tokens, never component source

## What changed from v1.x

v1.x's Schema-Runtime architecture (UISchema + interpreter + ActionRegistry + Binding expressions) was rejected by ADR-0001. The current direction is **Component First / Token First / Style Pack First / AI Native**:

- ❌ No runtime schema interpreter
- ❌ No low-code Studio / drag-and-drop builder
- ❌ No Binding expression sandbox
- ✅ Token cascade preserved
- ✅ TypeScript strict + on-demand loading
- ✅ Docs render real components
- ✅ Style Pack system + AI Layer (Skill + MCP)

## Three independent axes

Token system has three independent dimensions:

| Axis | What it changes | Forbidden |
|---|---|---|
| Theme | Color (primitive + semantic) | Radius, spacing, size |
| Style | Radius + shadow + Component Token | Color, spacing, font size |
| Density | Spacing + size + font size | Color, radius |

A Style Pack (iOS / doodle / etc.) is a combination of all three axes.

## Where to next

- [Web quick start](/en/guide/web/quick-start)
- [uni-app quick start](/en/guide/uni/quick-start)
- [Architecture](/en/guide/web/architecture)
- [Theme & Tokens](/en/theme/overview)
- [Style Packs](/en/style-packs/overview)
- [AI Ecosystem](/en/ai/overview)