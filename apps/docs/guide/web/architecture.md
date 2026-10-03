# 架构

AUI 由 7 个 package 组成单向依赖图。本页描述各层、它们之间的契约，以及保证彼此隔离的规则。

## Package 依赖图

```
                          ┌──────────────────────────┐
                          │   @snui/protocol         │   ← Foundation
                          │   (Zod schemas + types)  │     （无 Vue，无 DOM）
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
                                  │   Vue 3 渲染器 +         │         │   uni-app 渲染器 +       │
                                  │   4 个官方组件           │         │   UniButton               │
                                  └──────────────────────────┘         └──────────────────────────┘
```

## 各层职责

### Foundation — `@snui/protocol`

- **契约**: `UISchema`, `UINode`, `UIBinding`, `UIAction`, `UIEventBinding`, `UIAccessibility`, `UICapability`, `ComponentContract`。
- **不依赖**: Vue、DOM、Node、浏览器全局对象。
- **输出**: 纯 TS 类型 + Zod schemas。事实源（AGENTS.md §25）。

### Schema 工具 — `@snui/schema`

- Validator 携带稳定的错误码（`SCHEMA_*`）。
- Normalizer 处理规范化的键顺序（deterministic + idempotent）。
- Version 兼容检查（`parseSchemaVersion`, `isCompatible`）。

### Design tokens — `@snui/tokens`

- Primitive 尺度（color、spacing、radius、font、shadow、motion、size）。
- Semantic 别名（text/background/border tokens 引用 primitive CSS 变量）。
- Component shape tokens（button/input/card）。
- Resolver 输出扁平的 `TokenBinding[]`，可直接用于 `:root` 注入。

### Runtime — `@snui/runtime`

- `AUIRuntime` 外观，生命周期（create / mount / update / unmount / dispose）。
- `RuntimeContext` 聚合每个 runtime 的工作集。
- `ReactiveAdapter` 包装 `@vue/reactivity`（按 §19 不重新实现引擎）。
- `BindingResolver` + 沙箱化 Expression DSL（parser，不用 eval）。
- `ActionRegistry` + `ActionHandler` + `AppBridge`。
- `LifecycleTracker` + `AUIError`。

### Renderer — `@snui/vue-web` / `@snui/uni`

- 把 `UINode.type` 映射到平台组件。
- DOM / uni-app 事件绑定。
- Capability 感知降级（缺失平台能力时）。
- 自带首批官方组件契约（`Button` / `Input` / `Form` / `Card`）。

## 边界规则（AGENTS.md §67）

| 规则 | 来源 | 原因 |
| --- | --- | --- |
| `protocol` 不得 import Vue / DOM | §17 | 框架无关契约 |
| `runtime` 不得 import renderer | §18 / §57 | 业务分离 |
| Renderer 消费 Runtime，不直接依赖 Protocol | §67 | Renderer 关注点留在 renderer |
| Schema 不直接调用业务服务 | §21 | 只允许 Schema → action id → Registry → Host Service |
| Capability + Fallback，禁止静默行为变更 | §84–85 | 显式、可预测、可测试 |

## Capability 协商

组件通过 `UICapability` 声明所需能力：

```ts
const capability: UICapability = {
  platform: 'web',
  framework: 'vue3',
  feature: 'pointer-events',
  fallback: 'touch-events',
};
```

运行时查询 `platform.capabilities`，渲染器选择最佳匹配。不支持的能力走降级——永不静默失败。

## Action 流程

```
Schema（声明）             Runtime（解释）               Host（服务）
   action id  ───────►  ActionRegistry.resolve(id)  ───────►  handler(context, params)
                                                       ▲
                                                       │
                              AppBridge.{router, storage, notify, analytics, event, abortSignal}
                                                       ▲
                                                       │
                              Host 应用实现 AppBridge
```

Schema 永远不直接看到 host 服务，只看到 action id。

## 测试覆盖（306 个测试）

| Package | 测试数 |
| --- | --- |
| `@snui/protocol` | 145（含 4 个 Component Contract） |
| `@snui/schema` | 24 |
| `@snui/tokens` | 20 |
| `@snui/runtime` | 81 |
| `@snui/vue-web` | 38（含 4 个 Web E2E） |
| `@snui/uni` / `@snui/ai` | placeholder |

每个新组件 / package 都随测试 + 文档一起落地（AGENTS.md §110）。

## 下一步

- [Web 快速开始](/guide/web/quick-start)
- [Theme / Style / Density](/theme/overview)
- [组件](/components/web/button)