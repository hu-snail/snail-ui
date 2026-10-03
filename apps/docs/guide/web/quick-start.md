# Web 快速开始

60 秒内把一个 Button 挂到 DOM 节点上。

## 1. 安装

```bash
pnpm add @snui/vue-web @snui/runtime @snui/protocol @snui/tokens
pnpm add vue@^3.5 zod
```

## 2. 挂载 Button

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

这就是最小可用的 AUI 应用。Button 是真实 DOM，渲染器是真实 Vue，schema 是事实源。

## 3. 加上 State + Action

想要带状态的行为，加上 Runtime：

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

// 点击触发 action：
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

## 4. 把 State 绑定到 Props

State 绑定用点路径引用运行时 `state` 对象：

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

表达式引擎（AGENTS.md §23）是沙箱化的——没有 `eval`，没有 `new Function`。

## 下一步

- [Button 组件文档](/components/web/button)
- [Theme / Style / Density](/theme/overview)
- [架构](/guide/web/architecture)