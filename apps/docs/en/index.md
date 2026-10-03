---
layout: home
title: snail-aui — AI-Native UI Framework Ecosystem
hero:
  name: snail-aui
  text: Component First · Style Pack First · AI Native
  tagline: A multi-end UI framework ecosystem for Vue 3 + uni-app. Developers import Vue components directly. AI can read components, produce high-fidelity prototypes, and swap whole visual identities (doodle / sticky-note / iOS / Taobao / Douyin) with one click — then copy the config into your project.
  actions:
    - theme: brand
      text: Get started (Web)
      link: /en/guide/web/intro
    - theme: alt
      text: Get started (uni-app)
      link: /en/guide/uni/quick-start
    - theme: alt
      text: Style Packs
      link: /en/style-packs/overview
    - theme: alt
      text: AI Ecosystem
      link: /en/ai/overview
    - theme: alt
      text: GitHub
      link: https://github.com/hu-snail/snail-ui
features:
  - title: Component First
    details: Every component is a standalone .vue file — import and use. Web uses PascalCase (SnButton, SnConfigProvider). Uni uses kebab-case (sn-button, sn-config-provider) with easycom auto-registration. No schema language, no runtime, just familiar Vue.
  - title: Token First
    details: A three-layer CSS variable cascade (Primitive → Semantic → Component) drives color / radius / spacing. Components consume only var(--sn-*) — zero hardcoded color literals.
  - title: Style Pack First
    details: Style is a first-class concept. A Style Pack is Token + skin CSS + resources, layered. iOS / dark only need the Token layer; doodle / sticky-note / Douyin need skin CSS for visual personality. Packs never modify component .vue files.
  - title: AI Native
    details: AI reads, produces, modifies UIs. snail-ui.skill.md defines the AI behavior contract; the MCP Server exposes list / get / preview tools; ai-meta.json aggregates all metadata so an AI client can load context in one shot.
  - title: Multi-end parity
    details: Same component API on Web (Vue 3) and uni-app. Uni side handles capability detection (e.g. MP WXSS limitations) automatically with predictable fallbacks.
  - title: One-click theme copy
    details: The docs ThemeCopier renders a ready-to-paste snCssVars(...) snippet for the active Style Pack. Paste it into your main.ts — your whole app takes the new look instantly.
---

<style scoped>
.sn-home-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin: 32px 0;
}
.sn-home-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  background: var(--vp-c-bg-soft);
}
.sn-home-card h3 {
  margin-top: 0;
}
.sn-home-card a {
  font-weight: 500;
}
.sn-home-table {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
}
.sn-home-table th,
.sn-home-table td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.sn-home-table th {
  background: var(--vp-c-bg-soft);
  font-weight: 600;
}
</style>

<div class="vp-doc">

## Choose your end

<div class="sn-home-grid">

<div class="sn-home-card">

### Web (Vue 3)

For browser apps built on [Vue 3.5+](https://vuejs.org/).

- Install `@snui/vue-web`
- Namespace: `SnButton` / `SnConfigProvider`
- Real component rendering in docs
- TypeScript strict throughout

[Web component docs →](/en/components/web/button) · [Web quick start →](/en/guide/web/quick-start)

</div>

<div class="sn-home-card">

### uni-app

For multi-end apps (iOS / Android / H5 / MP) on [uni-app](https://uniapp.dcloud.net.cn/).

- Install `@snui/uni`
- Namespace: `sn-button` / `sn-config-provider` (easycom auto-registration)
- Platform capability fallbacks
- Shares the Token cascade with Web

[uni-app component docs →](/en/components/uni/button) · [uni-app quick start →](/en/guide/uni/quick-start)

</div>

</div>

## v3.0 shipped (Foundation + M1-FOUND)

| Package | Status | Purpose |
| --- | --- | --- |
| `@snui/tokens` | ✅ | Primitive / Semantic / Component three-layer cascade + `--sn-*` alias layer |
| `@snui/vue-web` | ✅ | Web component library (SnButton / SnConfigProvider) |
| `@snui/uni` | ✅ | uni-app component library (sn-button / sn-config-provider) |
| `@snui/style-packs` | ✅ | default / ios / dark official Style Packs |
| `@snui/ai` | ✅ | Skill file + MCP Server stub + ai-meta aggregator |
| `@snui/cli` | ✅ | unplugin resolver + llms.txt + token-check + pack-validate |

## Design philosophy

```text
Component First    Each component is a standalone .vue file
Token First        Three-layer CSS variable cascade
Style Pack First   Token + skin CSS + resources — style is configurable
AI Native          AI reads, produces, modifies UI — not just docs
DX First           Full type coverage + on-demand loading + real docs + one-click
```

## What we don't do

- ❌ Runtime schema interpreter (rejected by ADR-0001)
- ❌ Low-code Studio / drag-and-drop builder
- ❌ Style Packs that modify component .vue files (only Token layer)
- ❌ AI bypassing the Token system

## Where to next

- [Introduction](/en/guide/web/intro) — snail-aui in 30 seconds
- [Architecture](/en/guide/web/architecture) — packages and data flow
- [Style Packs](/en/style-packs/overview) — swap iOS / dark / doodle / Douyin with one click
- [AI Ecosystem](/en/ai/overview) — Skill + MCP + hi-fi prototypes

</div>