import type { Component } from 'vue';

/**
 * AUI Uni ComponentRegistry — runtime component registration surface for the
 * uni-app renderer. Mirrors `@snui/vue-web` so the same schema runs on both
 * ends with only the renderer swapped. The actual uni-app-specific event
 * catalog + capability gating lives in the renderer (Phase 3).
 *
 * Per AUI-WEB-002: register / resolve / has / remove / list.
 */

export type { Component };

export interface ComponentRegistry {
  register(type: string, component: Component): void;
  resolve(type: string): Component | undefined;
  has(type: string): boolean;
  remove(type: string): boolean;
  list(): readonly string[];
}

export function createComponentRegistry(
  initial: ReadonlyMap<string, Component> = new Map(),
): ComponentRegistry {
  const components = new Map<string, Component>(initial);

  return {
    register(type, component) {
      if (typeof type !== 'string' || type.length === 0) {
        throw new Error(`ComponentRegistry.register: type must be a non-empty string (got ${String(type)})`);
      }
      if (components.has(type)) {
        throw new Error(`ComponentRegistry.register: type "${type}" is already registered`);
      }
      components.set(type, component);
    },

    resolve(type) {
      return components.get(type);
    },

    has(type) {
      return components.has(type);
    },

    remove(type) {
      return components.delete(type);
    },

    list() {
      return Object.freeze([...components.keys()]);
    },
  };
}