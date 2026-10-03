/**
 * AUI Vue Web Renderer — Vue 3 mapping for Runtime nodes to DOM.
 *
 * Per AGENTS.md §59 Web/Uni share Protocol / Runtime / Contract / Token.
 * Platform differences resolve via Capability + Fallback, not by copy-pasting.
 */

export const AUI_VUE_WEB_VERSION = '0.1.0';

export { createComponentRegistry, type ComponentRegistry } from './registry.js';

export { Button } from './button.js';

export { Input } from './input.js';

export { Form, FormItem, type FormContext, type FormFieldDescriptor, type FormFields, type ValidateResult } from './form.js';

export { Card } from './card.js';

export { createVueRenderer, type VueRenderer, type VueRendererOptions } from './renderer.js';