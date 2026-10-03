---
layout: home
title: snail-aui — AI-Native UI Framework Ecosystem
hero:
  name: snail-aui
  text: Component First · Style Pack First · AI Native · End-aware
  tagline: An AI-Native UI framework ecosystem for Vue 3 (PC Web) and uni-app (mobile). The Web end targets desktop information density; the uni end targets mobile touch. Each end is fully independent — from source to build to npm package. Zero source reuse across ends. Future React end follows the same extension pattern.
  actions:
    - theme: brand
      text: Web (PC)
      link: /en/guide/web/intro
    - theme: alt
      text: uni-app (Mobile)
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
  - title: End-aware
    details: Web (PC) and uni (mobile) are fully independent — source, build, npm package, Token alias (--sn-web-* / --sn-mp-*). Future React end follows the same pattern. Zero source reuse.
  - title: Component First
    details: Web side — SnButton / SnForm / SnTable / SnTree for desktop. Uni side — sn-button / sn-list / sn-grid for mobile. Each end designs API per its scenario, not mirror copies.
  - title: Token First
    details: A shared base layer (@snui/tokens → --aui-*) + per-end alias packages (@snui/tokens-web → --sn-web-*, @snui/tokens-mp → --sn-mp-*). Components consume end-specific Tokens.
  - title: Style Pack First
    details: Cross-end shared style packs. Token + skin CSS + resources layered. Each Pack declares an end field (values web / mp / both). Web has enterprise brand themes; uni has mp-taobao / mp-douyin mobile brand themes.
  - title: AI Native
    details: AI can read every component, produce prototypes, modify UIs. snail-ui.skill.md is the behavior contract; MCP Server filters by end; ai-meta.json groups components by end.
---

<style scoped>
.sn-home-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
.sn-home-card .sn-home-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  background: var(--vp-c-brand-1);
  color: white;
  margin-bottom: 8px;
}
.sn-home-card .sn-home-tag-mp {
  background: #10b981;
}
.sn-home-card .sn-home-tag-both {
  background: #8b5cf6;
}
</style>

<div class="vp-doc">

## Choose your end

<div class="sn-home-grid">

<div class="sn-home-card">

<span class="sn-home-tag">PC</span>

### Web (Vue 3)

For desktop browser apps: admin dashboards, CRM, ERP, IDE-like tools.

- Install `@snui/vue-web`
- Namespace: `SnButton` / `SnForm` / `SnTable` / `SnTree` ...
- Consumes `--sn-web-*` Tokens
- Information density, keyboard + mouse

[Web components →](/en/components/web/button) · [Web quick start →](/en/guide/web/quick-start)

</div>

<div class="sn-home-card">

<span class="sn-home-tag sn-home-tag-mp">Mobile</span>

### uni-app

For mobile touch apps: e-commerce, O2O, content, enterprise apps.

- Install `@snui/uni`
- Namespace: `sn-button` / `sn-list` / `sn-grid` / `sn-pull-refresh` ...
- Consumes `--sn-mp-*` Tokens (px auto-converts to rpx)
- Touch gestures, mobile UX

[uni-app components →](/en/components/uni/button) · [uni-app quick start →](/en/guide/uni/quick-start)

</div>

</div>

## End-aware principle (v3.1, top priority)

```text
Each end is independent source + independent build + independent Token + independent npm package

@snui/vue-web        →  @snui/tokens-web  →  --sn-web-*   →  independent publish
@snui/uni            →  @snui/tokens-mp   →  --sn-mp-*    →  independent publish
@snui/react-web      →  @snui/tokens-react →  --sn-react-* → independent publish (future)

Cross-end shared (end-agnostic):
  - @snui/tokens         (unified --aui-* base)
  - @snui/style-packs    (style pack descriptions)
  - @snui/ai             (Skill / MCP / ai-meta)
  - @snui/cli            (resolver / llms.txt / token-check)
  - @snui/docs           (docs site)

Not shared across ends:
  - any component .vue source
  - any component test code
  - any Token alias layer
```

## Design philosophy

```text
Component First    Each component is a standalone .vue file
Token First        Three-layer cascade + per-end alias layer
Style Pack First   Cross-end shared style packs
AI Native          AI reads, produces, modifies UI
DX First           Full TS types + on-demand loading + real docs + one-click copy
End-aware          Web and uni target different scenarios → API differs → Token differs
```

## Where to next

- [Web Introduction](/en/guide/web/intro) — Web end in 30 seconds
- [Architecture](/en/guide/web/architecture) — dual-end package structure
- [Style Packs](/en/style-packs/overview) — cross-end shared
- [AI Ecosystem](/en/ai/overview) — Skill + MCP + hi-fi prototypes

</div>