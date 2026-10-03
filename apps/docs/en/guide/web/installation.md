# Installation

AUI is a monorepo of small packages. Pick what you need.

## For browser apps (Vue 3)

```bash
pnpm add @snui/vue-web @snui/runtime @snui/protocol
```

Peer dependencies:

```bash
pnpm add vue@^3.5 zod
```

## For multi-end apps (uni-app)

```bash
pnpm add @snui/uni @snui/runtime @snui/protocol
```

Peer dependencies depend on which uni-app target — see the [@dcloudio/uni-ui](https://uniapp.dcloud.net.cn/) docs.

## For tooling (Studio, AI Repair, Schema validation)

```bash
pnpm add @snui/schema @snui/protocol
```

## What's included where?

| Package | Size | Includes |
| --- | --- | --- |
| `@snui/protocol` | ~25 KB | All Zod schemas + types |
| `@snui/schema` | ~10 KB | Validator + Normalizer + Version |
| `@snui/tokens` | ~15 KB | Primitive / Semantic / Component + resolver |
| `@snui/runtime` | ~80 KB | AUIRuntime + Reactive + Binding + Action + AppBridge |
| `@snui/vue-web` | ~10 KB (+ Vue) | Renderer + Button |
| `@snui/uni` | ~5 KB | Renderer (Phase 3, placeholder for now) |

## Bundle example (web)

```ts
import { createVueRenderer, createComponentRegistry, Button } from '@snui/vue-web';
import { createRuntime } from '@snui/runtime';
import { LIGHT_THEME, MODERN_STYLE, COMFORTABLE_DENSITY } from '@snui/tokens';

const registry = createComponentRegistry();
registry.register('button', Button);

const runtime = createRuntime({
  schema: { /* your UISchema */ },
  registry,
  actionRegistry: createActionRegistry(),
  tokens: { theme: LIGHT_THEME, style: MODERN_STYLE, density: COMFORTABLE_DENSITY },
  platform: { id: 'web', capabilities: { supports: { dom: true } } },
});

const renderer = createVueRenderer({ registry });
renderer.mount(runtime.schema, document.getElementById('app')!);
```

## TypeScript

AUI is `strict: true` with `exactOptionalPropertyTypes: true`. All types are exported from `@snui/protocol` — import from there when you need them:

```ts
import type { UISchema, UINode, UIBinding, UIAction } from '@snui/protocol';
```

## Next

- [Quick start (Web)](/en/guide/web/quick-start)
- [Quick start (uni-app)](/en/guide/uni/quick-start)