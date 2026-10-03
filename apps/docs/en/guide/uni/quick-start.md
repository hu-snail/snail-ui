# Quick start (uni-app)

AUI's uni-app renderer (Phase 3) shares the same Protocol / Runtime contracts as the Web renderer. The renderer maps `UINode.type` to a uni-app component rather than a DOM element.

> ⚠️ `@snui/uni` is currently a placeholder package. The contract surface is finalized (see `/guide/web/architecture`), and component docs under `/components/uni/` will light up as the implementation lands in Phase 3.

## 1. Install

```bash
pnpm add @snui/uni @snui/runtime @snui/protocol @snui/tokens
```

Uni-app target peer is `@dcloudio/uni-app` (see uni-app docs).

## 2. Same UISchema, different renderer

```ts
// main.ts (uni-app entry)
import { createUniRenderer, createUniRegistry } from '@snui/uni';
import { Button as UniButton } from '@snui/uni/components/button';

const registry = createUniRegistry();
registry.register('button', UniButton);

const renderer = createUniRenderer({ registry });

const schema = {
  version: '1.0.0',
  root: {
    id: 'submit',
    type: 'button',
    props: { variant: 'primary', size: 'medium', text: 'Submit' },
  },
};

// In a uni-app page:
export default {
  setup() {
    onMounted(() => {
      renderer.mount(schema, /* uni-app page ref */);
    });
  },
};
```

## 3. Capability fallback

uni-app's API varies across platforms (WeChat MP / iOS / Android / H5). The renderer detects capabilities and falls back:

```ts
import { UICapabilitySchema } from '@snui/protocol';

const capability: UICapability = {
  platform: 'mp-weixin',          // mini-program WeChat
  feature: 'clipboard.write',
  // Renderer picks the best API for the current platform, falling back when unsupported.
};
```

See [Capabilities](/en/guide/web/architecture) for the full capability negotiation system.

## What's the same vs different?

| Concern | Web | uni-app |
| --- | --- | --- |
| Schema | UISchema | Same |
| Runtime | AUIRuntime | Same |
| Tokens | Theme / Style / Density | Same |
| Actions | ActionRegistry + AppBridge | Same AppBridge, host services differ |
| Event catalog | DOM events (`click`, `change`, …) | Uni events + DOM events on H5 |
| Renderer | `createVueRenderer()` | `createUniRenderer()` |

The component contract's `events` and `capabilities` keys differ by end. Check `/components/uni/` for the uni-specific event catalog per component.

## Next

- [Button (uni)](/en/components/uni/button)
- [Architecture](/en/guide/web/architecture)
- [Web quick start](/en/guide/web/quick-start)