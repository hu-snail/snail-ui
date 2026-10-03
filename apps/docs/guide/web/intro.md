# 介绍

snail-aui 是一个面向 Vue 3 + uni-app 多端的 **AI-Native UI 框架生态**。开发者用最普通的 Vue 组件写法直接 import；AI 能读懂组件、能产出高保真原型、能在线切换整体风格（涂鸦 / 便签 / iOS / 淘宝 / 抖音）；用户能复制一份配置就完成风格切换。

## 一句话定位

> 开发者：`<SnButton type="primary">提交</SnButton>`  
> AI：通过 Skill + MCP 拿到组件元数据，产出可运行的 Vue SFC 原型  
> 设计师：在文档站切换风格包预览效果，一键复制配置

## 30 秒看懂

```text
@snui/tokens        ── Token 三层级联 + --sn-* 别名层
        ↑
@snui/vue-web       ── Web 端组件库（naive-ui 风格 API）
@snui/uni           ── uni-app 端组件库（wot-ui 风格 API，easycom 注册）
        ↑
@snui/style-packs   ── 官方风格包（iOS / 暗色 / 涂鸦 / 抖音…）
        ↑
@snui/ai            ── Skill + MCP Server + ai-meta
        ↑
@snui/docs          ── VitePress 文档站（含 StyleSwitcher / ThemeCopier）
```

底层：
- 开发者写传统 Vue SFC，零 schema、零运行时
- AI 走 Skill + MCP 工具链理解组件、产出原型
- 风格包只动 Token，不动组件

## 与 v1.x 的区别

v1.x 的 Schema-Runtime 架构（UISchema + 解释器 + Action Registry + Binding 表达式）已被 ADR-0001 推翻。当前是 **Component First / Token First / Style Pack First / AI Native** 的组件库形态：

- **不做**：运行时 schema 解释器、Low-code Studio、Binding 表达式沙箱
- **保留**：Token 系统、TypeScript strict、按需加载、文档真实渲染
- **新增**：Style Pack 系统、AI Skill + MCP Server 生态

## 已交付（M0 + M0.5 + M1-FOUND）

- **M0（已完成）**：架构反转，Button demo 跑通，文档站建好
- **M0.5（已完成）**：PRD v3.0 / Architecture v3.0 / Spec-01~05 文档体系建立；ADR-0002 风格包 + AI 层设计
- **M1-FOUND（已完成）**：FOUND-001 Token 命名对齐、FOUND-002 ComponentPreview 重建、FOUND-003 SnConfigProvider + skin prop、FOUND-004 data-snui-component 钩子
- **M1 组件**：AUI-CORE/NAV/FORM/FB/DSP/API 共 ~50 个组件跟进中

## 三轴独立原则

Token 系统有三个独立维度，互不交叉：

| 轴 | 改什么 | 不允许改 |
|---|---|---|
| Theme | 颜色（primitive color + semantic color） | 圆角、间距、尺寸 |
| Style | 圆角 + 阴影 + Component Token | 颜色、间距、字号 |
| Density | 间距 + 尺寸 + 字号 | 颜色、圆角 |

风格包（如 iOS / 涂鸦）实际是 Theme + Style + Density 的组合配置。

## 下一步

- [Web 快速开始](/guide/web/quick-start)
- [uni-app 快速开始](/guide/uni/quick-start)
- [架构](/guide/web/architecture)
- [主题与 Token](/theme/overview)
- [风格包](/style-packs/overview)
- [AI 生态](/ai/overview)