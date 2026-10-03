---
layout: home
title: AUI — AI-Native UI Framework
hero:
  name: AUI
  text: Schema-first, framework-agnostic UI runtime.
  tagline: Declarative UI for Vue 3 + uni-app. Zod source-of-truth. Tokens cascade from primitive → semantic → component.
  actions:
    - theme: brand
      text: Get started (Web)
      link: /en/guide/web/intro
    - theme: alt
      text: Get started (uni-app)
      link: /en/guide/uni/quick-start
    - theme: alt
      text: View on GitHub
      link: https://github.com/hu-snail/snail-ui
features:
  - title: Protocol first
    details: Every UI is described by a Zod-validated UISchema. The runtime interprets the schema; the renderer maps it to DOM / uni-app. The Protocol package never imports Vue.
  - title: Multi-end
    details: One schema. Two renderers (`@snui/vue-web` + `@snui/uni`). Switch end in the top nav; same React-style components, different platform-specific tokens + events.
  - title: Token cascade
    details: Primitive → Semantic → Component with Theme / Style / Density as independent axes. Theme changes the palette; Style changes component shape; Density changes size primitives. Three dimensions never implicitly affect each other.
  - title: Sandboxed expressions
    details: Binding expressions are parsed + AST-evaluated. No `eval()`, no `new Function()`. window / globalThis / document resolve to undefined.
  - title: Action registry
    details: Schema references action IDs; the ActionRegistry maps each to a host handler. AppBridge surfaces Router / Storage / Notify / Analytics / Event / AbortSignal without leaking business services.
  - title: AI Repair boundary
    details: Every component declares `ai.patchable` (what AI may modify) and `ai.readonly` (must not). Runtime state + handlers + role are protected.
---

<div class="vp-doc">

## Choose your end

<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:24px">

<div style="border:1px solid var(--vp-c-divider);border-radius:12px;padding:24px">

### Web (Vue 3)

For browser apps built on [Vue 3.5+](https://vuejs.org/).

- Install `@snui/vue-web`
- Bundle size: ~526 KB minified IIFE (Vue + framework)
- DOM-based renderer
- CSS variable binding system

[Web component docs →](/en/components/web/button) · [Web quick start →](/en/guide/web/quick-start)

</div>

<div style="border:1px solid var(--vp-c-divider);border-radius:12px;padding:24px">

### uni-app

For multi-end apps (iOS / Android / H5 / MP) on [uni-app](https://uniapp.dcloud.net.cn/).

- Install `@snui/uni`
- Same Protocol / Runtime contracts as Web
- Capability-aware (falls back when platform doesn't have a feature)
- Uni-specific event catalog + tokens

[uni-app component docs →](/en/components/uni/button) · [uni-app quick start →](/en/guide/uni/quick-start)

</div>

</div>

## What's in the box (28 / 28 Phase 1 tasks shipped)

| Package | Tasks | Purpose |
| --- | --- | --- |
| `@snui/protocol` | 6 | Zod schemas: UISchema, UINode, UIBinding, UIAction, ComponentContract |
| `@snui/schema` | 4 | Validator + Normalizer + Version compat |
| `@snui/tokens` | 4 | Primitive / Semantic / Component + Cascade |
| `@snui/runtime` | 4 | AUIRuntime + Context + Lifecycle + Error |
| `@snui/reactive` | 3 | ReactiveAdapter over `@vue/reactivity` |
| `@snui/binding` | 3 | Resolver + safe Expression engine + Event dispatch |
| `@snui/action` | 3 | ActionRegistry + ActionHandler + AppBridge |
| `@snui/vue-web` | 3 | Vue 3 renderer + Button |

</div>