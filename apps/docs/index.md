---
layout: home
title: snail-aui — AI-Native UI 框架生态
hero:
  name: snail-aui
  text: Component First · Style Pack First · AI Native
  tagline: 面向 Vue 3 + uni-app 多端的 UI 框架生态。开发者直接 import Vue 组件；AI 可读懂组件、产出高保真原型；用户在文档站一键切换涂鸦 / 便签 / iOS / 淘宝 / 抖音风格，复制配置到项目即刻生效。
  actions:
    - theme: brand
      text: Web 快速开始
      link: /guide/web/intro
    - theme: alt
      text: uni-app 快速开始
      link: /guide/uni/quick-start
    - theme: alt
      text: 风格包
      link: /style-packs/overview
    - theme: alt
      text: AI 生态
      link: /ai/overview
    - theme: alt
      text: GitHub
      link: https://github.com/hu-snail/snail-ui
features:
  - title: Component First
    details: 每个组件是独立的 .vue 文件，直接 import 即可使用。Web 端 SnButton / SnConfigProvider 等，uni 端 sn-button / sn-config-provider 等。开发者不用学 schema、不用学 runtime，只用熟悉的 Vue 写法。
  - title: Token First
    details: CSS 变量三层级联驱动颜色 / 圆角 / 间距。Primitive（原始值）→ Semantic（语义名）→ Component（组件级）。组件只能用 var(--sn-*) 变量，零硬编码。
  - title: Style Pack First
    details: 风格是一等公民。Style Pack = Token 层 + 皮肤 CSS 层 + 资源层三层组合。iOS / 暗色只需 Token 层即可；涂鸦 / 便签 / 抖音 需要皮肤 CSS 实现视觉人格。Pack 不允许修改组件 .vue。
  - title: AI Native
    details: AI 能读懂组件、产出原型、修改 UI。snail-ui.skill.md 写给 AI 的行为契约；MCP Server 暴露 list / get / preview 工具；ai-meta.json 聚合所有元数据，AI 一次性加载上下文。
  - title: 多端一致
    details: Web (Vue 3) + uni-app 双端同名组件。API 语义一致，token 共享。uni 端走 easycom 自动注册，小程序不支持的能力自动降级。
  - title: 一键复制配置
    details: 文档站 ThemeCopier 展示当前 Style Pack 的 snCssVars(...) 代码片段，用户一键复制粘贴到 main.ts 即生效风格。无须手工调参。
---

<style scoped>
.sn-home-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin: 32px 0;
}
.sn-home-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  background: var(--vp-c-bg-soft);
}
.sn-home-card h3 {
  margin-top: 0;
}
.sn-home-card a {
  font-weight: 500;
}
.sn-home-table {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
}
.sn-home-table th,
.sn-home-table td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.sn-home-table th {
  background: var(--vp-c-bg-soft);
  font-weight: 600;
}
</style>

<div class="vp-doc">

## 选择你的端

<div class="sn-home-grid">

<div class="sn-home-card">

### Web (Vue 3)

适用于基于 [Vue 3.5+](https://vuejs.org/) 构建的浏览器应用。

- 安装 `@snui/vue-web`
- 命名空间：`SnButton` / `SnConfigProvider`
- 真实渲染的 VitePress 文档
- TypeScript strict 全推导

[Web 组件文档 →](/components/web/button) · [Web 快速开始 →](/guide/web/quick-start)

</div>

<div class="sn-home-card">

### uni-app

适用于基于 [uni-app](https://uniapp.dcloud.net.cn/) 的多端应用（iOS / Android / H5 / 小程序）。

- 安装 `@snui/uni`
- 命名空间：`sn-button` / `sn-config-provider`（easycom 自动注册）
- 平台 capability 兜底（不支持的能力自动降级）
- 与 Web 共享 Token 系统

[uni-app 组件文档 →](/components/uni/button) · [uni-app 快速开始 →](/guide/uni/quick-start)

</div>

</div>

## v3.0 已交付（Foundation + M1-FOUND）

| 包 | 状态 | 作用 |
| --- | --- | --- |
| `@snui/tokens` | ✅ | Primitive / Semantic / Component 三层级联 + `--sn-*` 别名层 |
| `@snui/vue-web` | ✅ | Web 端组件库（SnButton / SnConfigProvider） |
| `@snui/uni` | ✅ | uni-app 端组件库（sn-button / sn-config-provider） |
| `@snui/style-packs` | ✅ | default / ios / dark 官方风格包 |
| `@snui/ai` | ✅ | Skill 文件 + MCP Server stub + ai-meta 生成器 |
| `@snui/cli` | ✅ | unplugin resolver + llms.txt + token-check + pack-validate |

## 设计哲学

```text
Component First    每个组件是独立的 .vue 文件，开箱即用
Token First        CSS 变量三层级联驱动主题、风格、密度
Style Pack First   风格是一等公民：Token + 皮肤 CSS + 资源三层可组合
AI Native          AI 能读懂、能产出、能修改 UI，不是单纯的文档工具
DX First           TS 类型完整推导 + 按需加载 + 真实渲染文档 + 一键复制
```

## 不做什么

- ❌ 不做运行时 Schema 解释器（v1.x 已被 ADR-0001 推翻）
- ❌ 不做 Low-code Studio / 可视化搭建
- ❌ 风格包不允许修改组件 .vue 逻辑（只操作 Token 层）
- ❌ AI 不能绕过 Token 系统直接修改组件样式

## 下一步

- [介绍](/guide/web/intro) — 30 秒看懂 snail-aui
- [架构](/guide/web/architecture) — 包结构与数据流
- [风格包](/style-packs/overview) — iOS / 暗色 / 涂鸦 / 抖音 一键切换
- [AI 生态](/ai/overview) — Skill + MCP + 高保真原型

</div>