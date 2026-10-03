---
layout: home
title: snail-aui — AI-Native UI 框架生态
hero:
  name: snail-aui
  text: Component First · Style Pack First · AI Native · End-aware
  tagline: 面向 Vue 3（PC Web）+ uni-app（移动）的 AI-Native UI 框架生态。**Web 端面向桌面**，**uni 端面向移动**——两端从开发到打包完全独立，0 行源代码复用。未来 React 端按相同模式扩展。
  actions:
    - theme: brand
      text: Web（PC 端）
      link: /guide/web/intro
    - theme: alt
      text: uni-app（移动端）
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
  - title: 端独立（End-aware）
    details: Web 端（PC）和 uni 端（移动）从开发到打包完全独立 —— 独立源代码、独立构建、独立 npm 包、独立 Token 别名（--sn-web-* / --sn-mp-*）。未来 React 端按相同模式扩展，0 行跨端复用。
  - title: Component First
    details: Web 端 SnButton / SnTable / SnTree 等 PC 端组件。uni 端 sn-button / sn-list / sn-grid 等移动端组件。各端按场景独立设计 API，不追求跨端同名同形。
  - title: Token First
    details: 统一底层 @snui/tokens 输出 --aui-* 原始层；每端通过独立别名包 (@snui/tokens-web / @snui/tokens-mp) 映射到 --sn-{end}-*。组件消费端独立 Token。
  - title: Style Pack First
    details: 跨端共用风格包系统。Token + 皮肤 CSS + 资源三层。每个 Pack 标注 end: web / mp / both。Web 端有 web 品牌主题；uni 端有 mp-taobao / mp-douyin 等移动品牌主题。
  - title: AI Native
    details: AI 能读懂每个端组件、产出原型、修改 UI。snail-ui.skill.md 写 AI 行为契约；MCP Server 4 工具按 end 过滤；ai-meta.json 按端分组。
---

<style scoped>
.sn-home-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
.sn-home-card .sn-home-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  background: var(--vp-c-brand-1);
  color: white;
  margin-bottom: 8px;
}
.sn-home-card .sn-home-tag-mp {
  background: #10b981;
}
.sn-home-card .sn-home-tag-both {
  background: #8b5cf6;
}
</style>

<div class="vp-doc">

## 选择你的端

<div class="sn-home-grid">

<div class="sn-home-card">

<span class="sn-home-tag">PC 端</span>

### Web (Vue 3)

适用于桌面浏览器应用：管理后台、CRM、ERP、IDE-like 工具。

- 安装 `@snui/vue-web`
- 命名空间：`SnButton` / `SnForm` / `SnTable` / `SnTree` ...
- 消费 `--sn-web-*` Token 别名
- 信息密度高、键盘 + 鼠标混合操作

[Web 组件 →](/components/web/button) · [Web 快速开始 →](/guide/web/quick-start)

</div>

<div class="sn-home-card">

<span class="sn-home-tag sn-home-tag-mp">移动端</span>

### uni-app

适用于移动触屏应用：电商、O2O、内容、企业 App。

- 安装 `@snui/uni`
- 命名空间：`sn-button` / `sn-list` / `sn-grid` / `sn-pull-refresh` ...
- 消费 `--sn-mp-*` Token 别名（px 自动转 rpx）
- 触屏手势、移动端体验

[uni-app 组件 →](/components/uni/button) · [uni-app 快速开始 →](/guide/uni/quick-start)

</div>

</div>

## 端独立性原则（v3.1 最高优先级）

```text
每端独立源码 + 独立构建 + 独立 Token + 独立 npm 包

@snui/vue-web         →  @snui/tokens-web  →  --sn-web-*  →  独立发布
@snui/uni             →  @snui/tokens-mp   →  --sn-mp-*   →  独立发布
@snui/react-web       →  @snui/tokens-react →  --sn-react-* → 独立发布 (未来)

跨端共用（无关）：
  - @snui/tokens         (统一 --aui-* 底层)
  - @snui/style-packs    (风格包描述)
  - @snui/ai              (Skill / MCP / ai-meta)
  - @snui/cli            (resolver / llms.txt / token-check)
  - @snui/docs            (文档站)

跨端不共用：
  - 任何组件 .vue 源代码
  - 任何组件测试代码
  - 任何 Token 别名层
```

## 设计哲学

```text
Component First    每个组件是独立的 .vue 文件
Token First        三层级联 + 每端独立别名层
Style Pack First   跨端共用风格包
AI Native          AI 能读懂、能产出、能修改 UI
DX First           TS 类型 + 按需加载 + 真实文档 + 一键复制
End-aware          Web 和 uni 端定位场景不同 → API 不同 → Token 不同
```

## 下一步

- [Web 端介绍](/guide/web/intro) — 30 秒看懂 Web 端
- [架构](/guide/web/architecture) — 双端包结构
- [风格包](/style-packs/overview) — 跨端共用风格包
- [AI 生态](/ai/overview) — Skill + MCP + 高保真原型

</div>