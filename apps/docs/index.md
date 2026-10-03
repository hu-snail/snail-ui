---
layout: home
title: AUI — AI-Native UI Framework
hero:
  name: AUI
  text: Schema-first · 框架无关 · UI 运行时
  tagline: 为 Vue 3 + uni-app 设计的声明式 UI 框架。Zod 作为唯一事实源，Token 三级级联（Primitive → Semantic → Component）。
  actions:
    - theme: brand
      text: 快速开始（Web）
      link: /guide/web/intro
    - theme: alt
      text: 快速开始（uni-app）
      link: /guide/uni/quick-start
    - theme: alt
      text: 在 GitHub 查看
      link: https://github.com/hu-snail/snail-ui
features:
  - title: Protocol 先行
    details: 每个 UI 都由 Zod 校验过的 UISchema 描述。运行时解析 schema，渲染器映射到 DOM / uni-app。Protocol 包永不引入 Vue。
  - title: 多端一致
    details: 一份 schema，两套渲染器（@snui/vue-web + @snui/uni）。顶栏切换端点；同一份 React 风格的组件，不同的平台特化 tokens + events。
  - title: Token 级联
    details: Primitive → Semantic → Component，Theme / Style / Density 三轴独立。Theme 改色板，Style 改组件形状，Density 改尺寸。三轴互不干扰。
  - title: 沙箱表达式
    details: Binding 表达式由 AST 解析求值。不用 eval，杜绝 new Function()。window / globalThis / document 求值为 undefined。
  - title: Action 注册表
    details: Schema 只引用 action id，ActionRegistry 把 id 映射到宿主处理器。AppBridge 暴露 Router / Storage / Notify / Analytics / Event / AbortSignal，不泄漏业务服务。
  - title: AI 修复边界
    details: 每个组件声明 ai.patchable（AI 可改）和 ai.readonly（不可改）。运行时状态 + 处理器 + role 都被保护。
---

<div class="vp-doc">

## 选择你的端

<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:24px">

<div style="border:1px solid var(--vp-c-divider);border-radius:12px;padding:24px">

### Web (Vue 3)

适用于基于 [Vue 3.5+](https://vuejs.org/) 构建的浏览器应用。

- 安装 `@snui/vue-web`
- 包体 ~526 KB minified IIFE（Vue + 框架）
- DOM 渲染器
- CSS 变量绑定系统

[Web 组件文档 →](/components/web/button) · [Web 快速开始 →](/guide/web/quick-start)

</div>

<div style="border:1px solid var(--vp-c-divider);border-radius:12px;padding:24px">

### uni-app

适用于基于 [uni-app](https://uniapp.dcloud.net.cn/) 的多端应用（iOS / Android / H5 / 小程序）。

- 安装 `@snui/uni`
- 与 Web 共享同一份 Protocol / Runtime 合同
- 平台能力感知（不支持时自动降级）
- 专属事件目录 + tokens

[uni-app 组件文档 →](/components/uni/button) · [uni-app 快速开始 →](/guide/uni/quick-start)

</div>

</div>

## 已交付能力（Phase 1 · 28 / 28 任务）

| 包 | 任务数 | 用途 |
| --- | --- | --- |
| `@snui/protocol` | 6 | Zod schemas：UISchema、UINode、UIBinding、UIAction、ComponentContract |
| `@snui/schema` | 4 | Validator + Normalizer + Version 兼容 |
| `@snui/tokens` | 4 | Primitive / Semantic / Component + 级联 |
| `@snui/runtime` | 4 | AUIRuntime + Context + Lifecycle + Error |
| `@snui/reactive` | 3 | ReactiveAdapter 封装 `@vue/reactivity` |
| `@snui/binding` | 3 | Resolver + 安全表达式引擎 + Event dispatch |
| `@snui/action` | 3 | ActionRegistry + ActionHandler + AppBridge |
| `@snui/vue-web` | 3 | Vue 3 渲染器 + Button |

</div>