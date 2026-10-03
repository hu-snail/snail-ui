# Button · uni-app

Same contract as [Button · Web](/en/components/web/button) — different renderer. Phase 3 will land the actual uni-app implementation; this page documents the contract and the renderer expectations.

<script setup>
import ComponentPreview from '../../../.vitepress/components/ComponentPreview.vue';
</script>

> ⚠️ `@snui/uni` is a Phase 3 placeholder. The contract surface documented here is what the implementation will satisfy. The previews below mount via `createUniRenderer()` against the Phase 3 stub.

## Live render · contract preview

The previews below call `createUniRenderer().mount()` against the Phase 3 stub renderer (currently delegates to a real `<button>` DOM element). The schema shape and prop names match the contract.

<ComponentPreview end="uni" name="button" variant="primary" text="Primary (uni)" />

<ComponentPreview end="uni" name="button" variant="secondary" text="Secondary (uni)" />

<ComponentPreview end="uni" name="button" variant="danger" text="Danger (uni)" />

<ComponentPreview end="uni" name="button" variant="ghost" text="Ghost (uni)" />

<ComponentPreview end="uni" name="button" :disabled="true" text="Disabled (uni)" />

## Props

Same as Web Button — see [Web Props](/en/components/web/button#props) for the canonical table. Contract invariants that MUST hold for the uni renderer:

| Invariant | Reason |
| --- | --- |
| Prop names are identical | Schema portability across ends |
| `variant` enum values are identical | Same 4 visual styles |
| `size` enum values are identical | Same 3 sizes |
| `text` min length 1 | No empty labels on mobile |

## Events · uni-app catalog

The uni-app event catalog is a superset of Web's, plus uni-specific touch + lifecycle events:

<table class="props">
  <thead>
    <tr><th>Event id</th><th>Uni / H5 equivalent</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td><code>click</code></td><td><code>@click</code> (H5) / <code>@tap</code> (MP + app)</td><td>Unified via renderer's event mapping layer.</td></tr>
    <tr><td><code>touchstart</code></td><td>Uni touch event</td><td>Mobile-only — capability gate.</td></tr>
    <tr><td><code>touchend</code></td><td>Uni touch event</td><td>Mobile-only.</td></tr>
    <tr><td><code>getuserinfo</code></td><td>WeChat MP only</td><td>Capability-gated; falls back to nothing on other ends.</td></tr>
  </tbody>
</table>

## Capability-aware fallback

The uni-app renderer reads `platform.capabilities` before attaching a touch listener. On H5 build, `@touchstart` maps to a native DOM event. On WeChat MP, it uses uni-app's touch polyfill. On unsupported ends (e.g. Alipay mini-program for some events), the renderer skips the binding — never silently fails (AGENTS.md §85).

## Tokens

The same logical token names as Web — but the **CSS variable bindings** are resolved against uni-app's host stylesheet scope. Theme / Style / Density axes are identical; the renderer mounts the resolved bindings onto the page container instead of `:root`.

## AI Patch Boundary

Identical to Web. `ai.patchable` and `ai.readonly` are part of the component contract, not the renderer.

## Source

`packages/protocol/src/button-contract.ts` · `packages/uni/src/button.ts` (Phase 3 stub)

## Web equivalent

See [Button · Web](/en/components/web/button) for the Web rendering surface and the canonical contract source.