# snail-aui 产品需求文档 v3.1

**版本**：v3.1  
**状态**：Active（supersedes PRD v3.0）  
**架构依据**：ADR-0001（Component First）+ ADR-0002（Style Pack + AI Layer）  
**重大变更（vs v3.0）**：
1. 端定位拆分：**Web 端面向 PC 桌面**，**uni 端面向移动触屏**。两端不再要求 API 同名同形，而是各自按场景优化。
2. Token 命名空间拆分：`--sn-web-*`（PC 端消费）与 `--sn-mp-*`（移动端消费）双别名。底层 `--aui-*` 仍统一。
3. Style Pack 跨端共用：Pack 只描述 Token + 皮肤 CSS 覆盖，与端无关。

**端独立性原则（最高优先级）**：
> 每个端从**开发到打包发布完全独立**，包括源代码、构建产物、类型定义、npm 包安装方式、消费方式。
> 未来新增端（如 React 版本 `@snui/react-web`）按完全相同的扩展模式新增：
> - 独立源码目录 + 独立构建产物
> - 独立的 Token 别名包（如 `@snui/tokens-react`）
> - 独立的组件代码（不跨端复用 0 行组件源码）
> - 跨端共用：仅限 Style Pack / Skill / MCP / CLI（这些是元数据 + 配置工具，与组件实现无关）

**日期**：2026-10-03

---

## 0. 文档说明

### 0.1 与 v3.0 的关系

PRD v3.0 假设 Web / uni 两端共享 API 设计（naive-ui 风格 vs wot-ui 风格的"对齐"）。PRD v3.1 修正这个假设：两端定位场景不同 → API 不同 → Token 别名不同。组件库底座（@snui/tokens / @snui/style-packs / @snui/ai / @snui/cli）不变。

### 0.2 一句话定位

> snail-aui 是面向 Vue 3（PC Web）+ uni-app（移动）的 AI-Native UI 框架生态。  
> **Web 端**：面向桌面信息密度场景（管理后台 / 工具 / 数据密集应用）。  
> **uni 端**：面向移动触屏交互场景（电商 / 内容 / 工具 App）。  
> AI 可读懂组件、产出高保真原型；用户可一键切换涂鸦 / 便签 / iOS / 淘宝 / 抖音风格。

### 0.3 设计哲学

```text
Component First    每个组件是独立的 .vue 文件，开箱即用
Token First        CSS 变量三层级联（双端各自有 Primitive / Semantic / Component）
Style Pack First   风格是一等公民：Token + 皮肤 CSS + 资源三层可组合（跨端共用）
AI Native          AI 能读懂、能产出、能修改 UI
DX First           TS 类型完整 + 按需加载 + 真实渲染文档 + 一键复制
End-aware          Web 与 uni 端定位不同 → API 不同 → Token 别名不同
```

### 0.4 不做什么

- ❌ 不做运行时 Schema 解释器（ADR-0001 封锁）
- ❌ 不做 Low-code Studio / 可视化搭建
- ❌ 风格包不允许修改组件 .vue（只操作 Token + 皮肤 CSS）
- ❌ Web 端不强行塞移动端组件（PullRefresh / SwipeCell），uni 端不强行塞桌面端组件（Table / Tree）
- ❌ AI MCP Server 不提供业务数据访问（只读组件元数据）

---

## 1. 产品定位

### 1.1 目标用户

| 端 | 用户 | 场景 |
|---|---|---|
| Web (PC) | Vue 3 后台 / 工具 / SaaS 开发者 | 管理后台、CRM、低代码工具、IDE-like 应用 |
| uni (移动) | uni-app 多端开发者 | 电商、内容、O2O、企业内部 App |
| AI | Cursor / Claude Code / Mavis | 通过 Skill + MCP 读组件、产出代码 |
| 设计 / 产品 | 设计师 / PM | 在文档站切换风格包，对照最终 UI |

### 1.2 核心价值

| 维度 | Web (PC) | uni (移动) |
|---|---|---|
| 组件易用 | `<SnButton type="primary">` 一行 import | `<sn-button type="primary">` easycom |
| 场景定位 | 信息密度、键盘操作、桌面分辨率 | 触屏交互、移动端体验、平台原生感 |
| Token 命名 | `--sn-web-color-action-primary` | `--sn-mp-color-action-primary` |
| 风格替换 | Style Pack 系统（Token + 皮肤 CSS + 资源） | 同一套 Pack 系统 |
| AI 友好 | Skill + MCP Server + ai-meta | 同一套 AI 层 |

---

## 2. 包结构（v3.1）

```text
snail-aui/
├── packages/
│   ├── tokens/          # @snui/tokens       — Token 三层级联（统一 --aui-* 原始层）
│   ├── tokens-web/      # @snui/tokens-web   — Web 端 --sn-web-* 别名层
│   ├── tokens-mp/       # @snui/tokens-mp    — uni 端 --sn-mp-* 别名层（NEW）
│   ├── vue-web/         # @snui/vue-web      — PC 端组件库
│   ├── uni/             # @snui/uni           — 移动端组件库
│   ├── style-packs/     # @snui/style-packs   — 官方风格包（跨端共用）
│   ├── ai/              # @snui/ai            — Skill + MCP Server + ai-meta
│   └── cli/             # @snui/cli           — resolver + llms.txt + token-check + pack-validate
├── apps/docs/           # VitePress 文档站
├── dev-docs/            # 产品 / 架构 / Spec / WBS
└── .ai/decisions/       # ADR
```

依赖方向：
```
@snui/tokens (统一底层)
   ├── @snui/tokens-web  (生成 --sn-web-* 别名层)
   ├── @snui/tokens-mp   (生成 --sn-mp-* 别名层)
   ├── @snui/style-packs (引用 tokens 类型)
   └── @snui/cli / @snui/ai

@snui/vue-web  →  @snui/tokens-web (消费 --sn-web-*)
@snui/uni      →  @snui/tokens-mp  (消费 --sn-mp-*)
@snui/docs     →  vue-web + uni + style-packs
```

无循环依赖。

---

## 3. 双端定位差异

### 3.1 Web 端：PC 桌面场景

**典型应用**：管理后台、CRM、ERP、IDE-like、低代码工具、数据可视化、文档协作。

**特征**：
- 信息密度高，单屏多区域
- 鼠标 + 键盘混合操作
- 分辨率 1280×720+，自适应到 4K
- 组件以**配置驱动**为主（Table columns / Form rules / Tree data）
- 事件偏向 `click` / `change` / `submit`
- Token 偏向小尺寸（紧凑）+ 微阴影 + 圆角适中（4-8px）

**Web 端组件路线图**：
- 基础：Button / Icon / Text / ConfigProvider
- 表单：Form / FormItem / Input / Textarea / InputNumber / Select / DatePicker / TimePicker / Cascader / TreeSelect
- 数据：Table / Tree / VirtualList / DataPicker / Pagination / FilterPanel
- 反馈：Dialog / Drawer / Tooltip / Popover / Message / Notification / Loading / Skeleton / Empty
- 导航：Menu / SubMenu / Tabs / Breadcrumb / Dropdown / Pagination / Steps
- 布局：Card / Row / Col / Grid / Splitter / Layout

### 3.2 uni 端：移动触屏场景

**典型应用**：电商、O2O、内容平台、企业内部移动 App、工具类小程序。

**特征**：
- 单列流式布局
- 纯触屏操作（含手势）
- 分辨率 320-414 宽度优先
- 组件以**事件驱动**为主（tap / swipe / pull）
- 事件偏向 `tap` / `swipe` / `longpress` / `reachBottom`
- Token 偏向大尺寸（舒适）+ 无阴影 / 微阴影 + 大圆角（8-16px）

**uni 端组件路线图**：
- 基础：sn-button / sn-icon / sn-config-provider / sn-cell
- 表单：sn-input / sn-form / sn-search / sn-switch / sn-checkbox / sn-radio / sn-slider / sn-picker / sn-stepper
- 反馈：sn-dialog / sn-action-sheet / sn-toast / sn-notify / sn-loading / sn-empty / sn-skeleton
- 导航：sn-navbar / sn-tabbar / sn-tabs / sn-sidebar / sn-index-bar / sn-back-top
- 列表：sn-list / sn-grid / swiper / sticky-tabs / pull-refresh / lazy-image / swiper-indicator
- 业务：sn-card / sn-divider / sn-tag / sn-avatar / sn-badge / swiper / waterfall / notice-bar / countdown

### 3.3 共享层（少量）

只有**最基础的几个组件**在两端同名同 API（因为他们一致）：
- Button / sn-button（基础交互）
- ConfigProvider / sn-config-provider（全局配置 + skin）
- Icon / sn-icon（图标）

其余组件各自独立 API。

---

## 4. Token 双命名空间

### 4.1 双别名设计

底层 `@snui/tokens` 输出 `--aui-*` 原始层（不变）。新增两个映射包：

```
@snui/tokens-web  生成 --sn-web-color-action-primary     → var(--aui-color-action-primary)
@snui/tokens-mp   生成 --sn-mp-color-action-primary      → var(--aui-color-action-primary)
```

Web 端组件 CSS：

```css
.sn-button {
  background-color: var(--sn-web-color-action-primary);
  border-radius: var(--sn-web-button-radius);
}
```

uni 端组件 CSS：

```css
.sn-button {
  background-color: var(--sn-mp-color-action-primary);
  border-radius: var(--sn-mp-button-radius);
}
```

### 4.2 优势

- 两端可有完全不同的 Component Token 字段（如 Web 有 `table-row-height`，mp 有 `list-item-height`）
- 两端可有完全不同的 Density 预设（Web Comfortable vs mp Comfortable 尺寸基准不同）
- 风格包（Style Pack）可以只覆盖一端，例如 `mp-ios` 只改 `--sn-mp-*`，不影响 Web 端
- 不需要在 `data-snui-component` 钩子上区分端（Web 组件只出现 Web 命名空间）

### 4.3 主题

| 主题 | Web | uni |
|---|---|---|
| 浅色 | `--sn-web-theme-light` | `--sn-mp-theme-light` |
| 暗色 | `--sn-web-theme-dark` | `--sn-mp-theme-dark` |
| 移动品牌主题 | — | `--sn-mp-theme-taobao` / `douyin` |

---

## 5. Style Pack 系统（跨端共用）

Style Pack 由三层组成：Token 层 + 皮肤 CSS 层 + 资源层，与端无关。

但实际应用时需指定端：

```ts
// Web 端应用 iOS Pack
snCssVars({
  end: 'web',
  theme: iosPack.theme,
  style: iosPack.style,
})

// uni 端应用 iOS Pack
snCssVars({
  end: 'mp',
  theme: iosPack.theme,
  style: iosPack.style,
})
```

Pack 在 `StylePackDefinition` 中标注可用端（`end: 'web' | 'mp' | 'both'`），默认 `'both'`。`mp-taobao`、`mp-douyin` 只在移动端可用。

---

## 6. AI Layer（不变）

`@snui/ai` 三类产物跨端共用：
- Skill 文件：标注组件按 `end` 分类
- MCP Server：list / get 工具按 `end` 过滤
- ai-meta.json：聚合 components / tokens / stylePacks（含 `end` 字段）

---

## 7. 里程碑（v3.1）

| 里程碑 | 时间 | 交付 |
|---|---|---|
| M0 | 2026-10 | ADR-0001 + PRD v2.0 + Button demo ✅ |
| M0.5 | 2026-10 | ADR-0002 + PRD v3.0 ✅ |
| **M0.6** | 2026-10 | **PRD v3.1 + 双端拆分定位 + Token 双命名空间**（本次） |
| M1 | 2026-11 | @snui/tokens-web + @snui/tokens-mp + Web/uni 端组件 M1（~40 个，按各自场景） |
| M2 | 2026-12 | Style Pack 默认 3 Pack + AI Layer + StyleSwitcher / ThemeCopier |
| M3 | 2027 Q1 | 移动端专项风格包（mp-taobao / mp-douyin）+ 高保真原型 |
| M4 | 2027 Q2 | P2 组件 + VSCode 插件 + 视觉回归 |

---

## 8. 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.2 | 2026-09 | Schema-driven 架构（Superseded） |
| v2.0 | 2026-10-03 | 传统 Vue 组件库（Superseded） |
| v3.0 | 2026-10-03 | Style Pack + AI Layer（Superseded） |
| **v3.1** | 2026-10-03 | **双端定位拆分 + Token 双命名空间（Active）** |