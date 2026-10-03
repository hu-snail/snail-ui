# Quick start (Web)

Mount a Button into a DOM target in under 60 seconds.

## 1. Install

```bash
pnpm add @snui/vue-web @snui/runtime @snui/protocol @snui/tokens
pnpm add vue@^3.5 zod
```

## 2. Mount a Button

```ts
// main.ts
import { createVueRenderer, createComponentRegistry, Button } from '@snui/vue-web';

const registry = createComponentRegistry();
registry.register('button', Button);

const renderer = createVueRenderer({ registry });

const schema = {
  version: '1.0.0',
  root: {
    id: 'submit',
    type: 'button',
    props: { variant: 'primary', size: 'medium', text: 'Submit' },
  },
};

renderer.mount(schema, document.getElementById('app')!);
```

That's the smallest possible AUI app. The button is real DOM, the renderer is real Vue, and the schema is the source of truth.

## 3. Layer in state + actions

For stateful behavior, add the Runtime:

```ts
import { createRuntime, createActionRegistry } from '@snui/runtime';
import { LIGHT_THEME, MODERN_STYLE, COMFORTABLE_DENSITY } from '@snui/tokens';

const actions = createActionRegistry();
actions.register('submit-form', async (_ctx, params) => {
  await fetch('/api/submit', { method: 'POST', body: JSON.stringify(params) });
});

const runtime = createRuntime({
  schema,
  registry,
  actionRegistry: actions,
  tokens: { theme: LIGHT_THEME, style: MODERN_STYLE, density: COMFORTABLE_DENSITY },
  platform: { id: 'web', capabilities: { supports: { dom: true } } },
});

// Click triggers the action:
const schemaWithEvent = {
  version: '1.0.0',
  root: {
    id: 'submit',
    type: 'button',
    props: { variant: 'primary', text: 'Submit' },
    events: {
      submit: { kind: 'event', trigger: 'click' },
    },
  },
};
```

## 4. Bind state to props

State bindings reference dotted paths into the runtime's `state` object:

```ts
const schema = {
  version: '1.0.0',
  root: {
    id: 'submit',
    type: 'button',
    props: {
      disabled: { kind: 'expression', expr: 'state.form.isSubmitting' },
      text: {
        kind: 'expression',
        expr: 'state.form.isSubmitting ? "Submitting..." : "Submit"',
      },
    },
  },
};
```

The expression engine (AGENTS.md §23) is sandboxed — no `eval`, no `new Function`.

## What's next?

- [Button component docs](/en/components/web/button)
- [Theme / Style / Density](/en/theme/overview)
- [Architecture](/en/guide/web/architecture)