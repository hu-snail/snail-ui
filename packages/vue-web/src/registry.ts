import type { Component } from 'vue';

/**
 * AUI ComponentRegistry — runtime component registration surface for the Vue Web renderer.
 *
 * Per AUI-WEB-002: register / resolve / has / remove / list.
 * Per AGENTS.md §32, Vue components are responsible for Rendering / Interaction /
 * DOM / Platform Integration. Schema Validation belongs to the runtime
 * (ActionContract/ComponentContract); business logic lives outside.
 *
 * Renderer-agnostic shape — the renderer decides how a registered component is
 * used (Vue SFC, h() render function, lazy import, etc.). This module only
 * enforces lookup invariants.
 */

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