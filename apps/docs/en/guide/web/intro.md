# Introduction

AUI is an **AI-native multi-end UI framework**. It treats the UI as a schema, not as code: every screen is described by a `UISchema` (a typed JSON document), and the runtime interprets it. Renderers map the schema to DOM (Vue 3) or uni-app components.

## Why schema-first?

Traditional UI frameworks describe the UI in code:

```vue
<template>
  <button class="btn btn--primary" @click="submit">Submit</button>
</template>
```

AUI describes the UI in data:

```ts
const schema: UISchema = {
  version: '1.0.0',
  root: {
    id: 'submit',
    type: 'button',
    props: { variant: 'primary', text: 'Submit' },
    events: { click: { kind: 'event', trigger: 'click' } },
  },
};
```

The benefits compound:
- An LLM can **generate** a schema; a renderer turns it into pixels.
- An LLM can **patch** a schema (JSON Patch); the runtime re-renders.
- The same schema runs on **Web** (Vue 3) and **uni-app** (iOS / Android / H5 / MP).
- Tokens, accessibility, and capabilities are **declared**, not hand-coded.

## Architecture in 30 seconds

```
@snui/protocol     ── Zod schemas (framework-agnostic)
       ↑
@snui/schema       ── Validator + Normalizer + Version
@snui/tokens       ── Primitive / Semantic / Component cascade
@snui/runtime      ── AUIRuntime + Reactive + Binding + Action + AppBridge
       ↑
@snui/vue-web      ── Vue 3 renderer + Button (Phase 2)
@snui/uni          ── uni-app renderer (Phase 3)
```

`@snui/protocol` never imports Vue. Renderers consume Runtime, not Protocol directly. The single-direction graph is enforced by package imports (AGENTS.md §67).

## What ships today

- **Phase 1**: all 8 internal packages (28 tasks) — see [Architecture](/en/guide/web/architecture).
- **Phase 2 starter**: `@snui/vue-web` ships a `Button` component as the first official contract.
- **Phase 3**: `@snui/uni` is a placeholder — same contracts, uni-app renderer to follow.

## Where to next

- [Installation](/en/guide/web/installation)
- [Quick start (Web)](/en/guide/web/quick-start)
- [Quick start (uni-app)](/en/guide/uni/quick-start)
- [Architecture](/en/guide/web/architecture)
- [Theme / Style / Density](/en/theme/overview)