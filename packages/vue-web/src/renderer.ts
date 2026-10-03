import { createApp, defineComponent, h, type App, type VNode } from 'vue';
import type { UINode, UISchema } from '@snui/protocol';
import type { ComponentRegistry } from './registry.js';

/**
 * AUI Vue Web Renderer — UISchema → Vue tree → DOM.
 *
 * Per AUI-WEB-001 acceptance: schema → runtime → ComponentRegistry → Vue → DOM.
 * Per AGENTS.md §32, the renderer is a thin mapping layer. Schema
 * validation, state, binding resolution, and action dispatch belong to
 * `packages/runtime` (separate concern). This module ships a minimal
 * `mount()` that demonstrates the mapping without taking on those concerns.
 *
 * Forward references (out of scope for AUI-WEB-001):
 *   - bindings / events / actions resolution → AUI-RUNTIME-001..006
 *   - capability fallback → AUI-UNI-001 (capability detection)
 */

export interface VueRenderer {
  mount(schema: UISchema, target: Element): App;
}

export interface VueRendererOptions {
  registry: ComponentRegistry;
}

export function createVueRenderer(options: VueRendererOptions): VueRenderer {
  const { registry } = options;

  const renderNode = (node: UINode): VNode => {
    const component = registry.resolve(node.type);
    if (!component) {
      const fallback = registry.resolve('card') ?? registry.resolve('div');
      if (!fallback) {
        throw new Error(
          `VueRenderer: unknown component type "${node.type}" and no "card" or "div" fallback registered`,
        );
      }
      return h(
        fallback,
        { 'data-unknown-type': node.type },
        (node.children ?? []).map(renderNode),
      );
    }
    return h(component, { ...node.props }, (node.children ?? []).map(renderNode));
  };

  return {
    mount(schema, target) {
      // AUI-PROTOCOL-001 still has root typed as `z.unknown()` forward ref to
      // AUI-PROTOCOL-002 UINode; cast at the boundary — replace when
      // AUI-PROTOCOL-CONSOLIDATE-001 lands and replaces the forward ref.
      const root = schema.root as UINode;
      const RootComponent = defineComponent({
        name: 'SnuiRoot',
        setup() {
          return () => renderNode(root);
        },
      });
      const app = createApp(RootComponent);
      app.mount(target);
      return app;
    },
  };
}