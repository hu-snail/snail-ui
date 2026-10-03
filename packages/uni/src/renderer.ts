import { createApp, defineComponent, h, type App, type VNode } from 'vue';
import type { UINode, UISchema } from '@snui/protocol';
import type { ComponentRegistry } from './registry.js';

/**
 * AUI Uni Renderer — UISchema → uni-app component → DOM.
 *
 * Phase 1: same shape as the Vue Web renderer. Phase 3 will swap the inner
 * `createApp` for uni-app's component model and add capability-gated event
 * mapping. Per AGENTS.md §59 we do NOT re-implement uni-app's H5 /
 * MiniProgram / App runtime — we hand the schema to it.
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
          `UniRenderer: unknown component type "${node.type}" and no "card" or "div" fallback registered`,
        );
      }
      return h(fallback as never, node.props as never, childrenToVNodes(node));
    }
    return h(component as never, node.props as never, childrenToVNodes(node));
  };

  const childrenToVNodes = (node: UINode): VNode[] | undefined => {
    if (!node.children || node.children.length === 0) return undefined;
    return node.children.map((child) => renderNode(child));
  };

  return {
    mount(schema, target): App {
      const root = schema.root as UINode;
      const RootComponent = defineComponent({
        name: 'SnuiUniRoot',
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