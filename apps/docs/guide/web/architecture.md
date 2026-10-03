# Architecture

AUI is structured as 7 packages in a single-direction dependency graph. This page documents the layers, the contracts between them, and the rules that keep them isolated.

## Package graph

```
                          ┌──────────────────────────┐
                          │   @snui/protocol         │   ← Foundation
                          │   (Zod schemas + types)  │     (no Vue, no DOM)
                          └──────────────────────────┘
                                  ▲        ▲        ▲
                                  │        │        │
            ┌─────────────────────┘        │        └────────────────────┐
            │                              │                             │
   ┌────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
   │  @snui/schema      │    │  @snui/tokens         │    │  @snui/runtime       │
   │  Validator +      │    │  Primitive /         │    │  AUIRuntime +        │
   │  Normalizer +     │    │  Semantic /          │    │  Reactive + Binding  │
   │  Version          │    │  Component +         │    │  + Action +          │
   │                   │    │  Cascade              │    │  AppBridge           │
   └────────────────────┘    └──────────────────────┘    └──────────────────────┘
                                                                   ▲
                                                                   │
                                              ┌────────────────────┴────────────────────┐
                                              │                                         │
                                  ┌──────────────────────────┐         ┌──────────────────────────┐
                                  │   @snui/vue-web          │         │   @snui/uni              │
                                  │   Vue 3 renderer +      │         │   uni-app renderer +     │
                                  │   Button                │         │   UniButton               │
                                  └──────────────────────────┘         └──────────────────────────┘
```

## Layer responsibilities

### Foundation — `@snui/protocol`

- **Contracts**: `UISchema`, `UINode`, `UIBinding`, `UIAction`, `UIEventBinding`, `UIAccessibility`, `UICapability`, `ComponentContract`.
- **No**: Vue, DOM, Node, browser globals.
- **Output**: pure TS types + Zod schemas. The single source of truth (AGENTS.md §25).

### Schema tools — `@snui/schema`

- Validator with stable error codes (`SCHEMA_*`).
- Normalizer for canonical key order (deterministic + idempotent).
- Version compat checker (`parseSchemaVersion`, `isCompatible`).

### Design tokens — `@snui/tokens`

- Primitive scale (color, spacing, radius, font, shadow, motion, size).
- Semantic aliases (text/background/border tokens reference primitive CSS vars).
- Component shape tokens (button/input/card).
- Resolver produces a flat `TokenBinding[]` ready for `:root` injection.

### Runtime — `@snui/runtime`

- `AUIRuntime` facade with lifecycle (create / mount / update / unmount / dispose).
- `RuntimeContext` bundles the per-runtime working set.
- `ReactiveAdapter` over `@vue/reactivity` (no engine re-implementation per §19).
- `BindingResolver` + sandboxed Expression DSL (parser, no `eval`).
- `ActionRegistry` + `ActionHandler` + `AppBridge`.
- `LifecycleTracker` + `AUIError`.

### Renderer — `@snui/vue-web` / `@snui/uni`

- Mapping from `UINode.type` to platform component.
- DOM / uni-app event attachment.
- Capability-aware fallback for missing platform features.
- Ships the first official component contract (`Button`).

## Boundary rules (AGENTS.md §67)

| Rule | Source | Reason |
| --- | --- | --- |
| `protocol` must not import Vue / DOM | §17 | Framework-agnostic contracts |
| `runtime` must not import a renderer | §18 / §57 | Business separation |
| Renderers consume Runtime, not Protocol directly | §67 | Renderer concerns stay in renderer |
| Schemas do not call business services | §21 | Only Schema → action id → Registry → Host Service |
| Capabilities + Fallback over silent behavior change | §84–85 | Explicit, predictable, testable |

## Capability negotiation

Components declare what they need via `UICapability`:

```ts
const capability: UICapability = {
  platform: 'web',
  framework: 'vue3',
  feature: 'pointer-events',
  fallback: 'touch-events',
};
```

The runtime asks `platform.capabilities` and the renderer picks the best match. Unsupported features degrade with a test path — never silently fail.

## Action flow

```
Schema (declarative)         Runtime (interpreter)             Host (services)
   action id  ───────►  ActionRegistry.resolve(id)  ───────►  handler(context, params)
                                                       ▲
                                                       │
                              AppBridge.{router, storage, notify, analytics, event, abortSignal}
                                                       ▲
                                                       │
                              Host application implements AppBridge
```

The schema never sees the host services directly. It only sees action IDs.

## Test coverage snapshot (248 tests)

| Package | Tests |
| --- | --- |
| `@snui/protocol` | 111 |
| `@snui/schema` | 24 |
| `@snui/tokens` | 20 |
| `@snui/runtime` | 81 |
| `@snui/vue-web` | 13 (incl. 4 end-to-end smoke tests) |
| `@snui/uni` / `@snui/ai` | placeholder |

Every new component / package lands with tests + docs (AGENTS.md #110).

## Next

- [Web quick start](/guide/web/quick-start)
- [Theme / Style / Density](/theme/overview)
- [Components](/components/web/button)