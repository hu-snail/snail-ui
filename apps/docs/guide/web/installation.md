# 安装

AUI 是一个由小型 package 组成的 monorepo，按需引入即可。

## 浏览器端应用（Vue 3）

```bash
pnpm add @snui/vue-web @snui/runtime @snui/protocol
```

Peer 依赖：

```bash
pnpm add vue@^3.5 zod
```

## 多端应用（uni-app）

```bash
pnpm add @snui/uni @snui/runtime @snui/protocol
```

Peer 依赖取决于 uni-app 编译目标，详见 [@dcloudio/uni-ui](https://uniapp.dcloud.net.cn/) 文档。

## 工具链（Studio / AI Repair / Schema 校验）

```bash
pnpm add @snui/schema @snui/protocol
```

## 各包内容一览

| Package | 体积 | 包含 |
| --- | --- | --- |
| `@snui/protocol` | ~25 KB | 全部 Zod schemas + types |
| `@snui/schema` | ~10 KB | Validator + Normalizer + Version |
| `@snui/tokens` | ~15 KB | Primitive / Semantic / Component + resolver |
| `@snui/runtime` | ~80 KB | AUIRuntime + Reactive + Binding + Action + AppBridge |
| `@snui/vue-web` | ~10 KB（+ Vue）| 渲染器 + 4 个官方组件（Phase 2） |
| `@snui/uni` | ~5 KB | 渲染器（Phase 3，占位） |

## Bundle 示例（Web）

```ts
import { createVueRenderer, createComponentRegistry, Button } from '@snui/vue-web';
import { createRuntime } from '@snui/runtime';
import { LIGHT_THEME, MODERN_STYLE, COMFORTABLE_DENSITY } from '@snui/tokens';

const registry = createComponentRegistry();
registry.register('button', Button);

const runtime = createRuntime({
  schema: { /* 你的 UISchema */ },
  registry,
  actionRegistry: createActionRegistry(),
  tokens: { theme: LIGHT_THEME, style: MODERN_STYLE, density: COMFORTABLE_DENSITY },
  platform: { id: 'web', capabilities: { supports: { dom: true } } },
});

const renderer = createVueRenderer({ registry });
renderer.mount(runtime.schema, document.getElementById('app')!);
```

## TypeScript

AUI 使用 `strict: true` 配合 `exactOptionalPropertyTypes: true`。所有类型都从 `@snui/protocol` 导出，需要时从那里 import：

```ts
import type { UISchema, UINode, UIBinding, UIAction } from '@snui/protocol';
```

## 下一步

- [Web 快速开始](/guide/web/quick-start)
- [uni-app 快速开始](/guide/uni/quick-start)