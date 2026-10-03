# 介绍

AUI 是一个 **AI-native 的多端 UI 框架**。它把 UI 当作 schema 而不是代码：每一个界面都由一个 `UISchema`（类型化的 JSON 文档）描述，运行时负责解释它。渲染器把 schema 映射到 DOM（Vue 3）或 uni-app 组件。

## 为什么选择 Schema 优先？

传统 UI 框架用代码描述 UI：

```vue
<template>
  <button class="btn btn--primary" @click="submit">Submit</button>
</template>
```

AUI 用数据描述 UI：

```ts
const schema: UISchema = {
  version: '1.0.0',
  root: {
    id: 'submit',
    type: 'button',
    props: { variant: 'primary', text: 'Submit' },
    events: { click: { kind: 'event', trigger: 'click' } },
  },
};
```

带来的好处是叠加的：
- LLM 可以 **生成** schema，渲染器再把它变成像素。
- LLM 可以 **patch** schema（JSON Patch），运行时重新渲染。
- 同一份 schema 可运行于 **Web**（Vue 3）和 **uni-app**（iOS / Android / H5 / MP）。
- Token、可访问性、能力是**自描述**的，不是手写出来的。

## 30 秒看懂架构

```
@snui/protocol     ── Zod schemas（框架无关）
       ↑
@snui/schema       ── Validator + Normalizer + Version
@snui/tokens       ── Primitive / Semantic / Component 级联
@snui/runtime      ── AUIRuntime + Reactive + Binding + Action + AppBridge
       ↑
@snui/vue-web      ── Vue 3 渲染器 + 4 个官方组件（Phase 2）
@snui/uni          ── uni-app 渲染器（Phase 3）
```

`@snui/protocol` 永不引入 Vue。渲染器消费 Runtime，不直接依赖 Protocol。这个层级关系由 package 的导入方向强制保证（AGENTS.md §67）。

## 当前已交付

- **Phase 1**: 全部 8 个内部包（28 个任务）— 详见 [架构](/guide/web/architecture)。
- **Phase 2**: `@snui/vue-web` 提供 4 个官方组件（`Button` / `Input` / `Form` / `Card`）+ Web E2E 测试。
- **Phase 3**: `@snui/uni` 占位中 — 同样的协议，uni-app 渲染器随后交付。

## 下一步

- [安装](/guide/web/installation)
- [Web 快速开始](/guide/web/quick-start)
- [uni-app 快速开始](/guide/uni/quick-start)
- [架构](/guide/web/architecture)
- [Theme / Style / Density](/theme/overview)