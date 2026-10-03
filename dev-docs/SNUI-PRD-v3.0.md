# snail-aui 产品需求文档 v3.0

**版本**：v3.0  
**状态**：Active（supersedes PRD v2.0）  
**架构依据**：ADR-0001（Component First）+ ADR-0002（Style Pack 三层 + AI Layer）  
**日期**：2026-10-03

---

## 0. 文档说明

### 0.1 与 v2.0 的关系

PRD v2.0 确立了「传统 Vue 组件库」底座。PRD v3.0 在此基础上新增 **Style Pack 系统**（Token + 皮肤 CSS + 资源三层）和 **AI Layer**（Skill + MCP + ai-meta）。组件库底层不变。

### 0.2 一句话定位

> snail-aui 是面向 Vue 3 / uni-app 多端的 AI-Native UI 框架生态。  
> 开发者直接 import Vue 组件；AI 可读懂组件、产出高保真原型；  
> 用户可在文档站一键切换涂鸦 / 便签 / iOS / 淘宝 / 抖音等风格，复制配置到项目即刻生效。

### 0.3 设计哲学

```text
Component First    每个组件是独立的 .vue 文件，开箱即用
Token First        CSS 变量三层级联驱动颜色/圆角/间距
Style Pack First   风格是一等公民：Token + 皮肤 CSS + 资源三层可组合
AI Native          AI 能读懂、能产出、能修改 UI
DX First           TS 类型完整 + 按需加载 + 真实渲染文档 + 一键复制配置
```

### 0.4 不做什么

- ❌ 不做运行时 Schema 解释器（ADR-0001 封锁）
- ❌ 不做 Low-code 可视化搭建
- ❌ 风格包不允许修改组件 DOM / Props / 行为（只操作视觉层）
- ❌ AI MCP Server 不提供业务数据访问，只读组件元数据

---

## 1. 产品定位

### 1.1 目标用户

| 用户 | 场景 |
|---|---|
| Vue 3 Web 开发者 | 参考 naive-ui 体验，直接 `import { SnButton }` |
| uni-app 多端开发者 | 参考 wot-ui 体验，easycom 自动注册 |
| AI 编程场景（Cursor / Claude Code / Mavis 等）| 通过 Skill + MCP 理解组件 API，产出规范代码 |
| 产品 / 设计师 | 在文档站切换风格包预览，复制配置给开发者 |

### 1.2 核心价值

| 维度 | 描述 |
|---|---|
| 组件易用 | `<SnButton type="primary">` 一行 import，TS 类型完整 |
| 多端一致 | web / uni 双端同名组件，Token 共享 |
| 风格替换 | Style Pack 三层覆盖，Token + 皮肤 CSS + 资源，涂鸦/便签/iOS/淘宝/抖音 |
| AI 友好 | Skill 文件 + MCP Server + ai-meta.json，AI 可理解并产出 |
| 高保真原型 | AI 从需求描述产出可运行的 Vue SFC 原型 |
| 配置复制 | ThemeCopier 一键复制风格包配置到项目 |

---

## 2. 包结构（v3.0）

```text
snail-aui/
├── packages/
│   ├── tokens/          # @snui/tokens     — Token 三层级联 + CSS 变量生成
│   ├── vue-web/         # @snui/vue-web    — Web 端组件库
│   ├── uni/             # @snui/uni         — uni-app 端组件库
│   ├── style-packs/     # @snui/style-packs — 官方风格包（新）
│   ├── ai/              # @snui/ai          — Skill + MCP Server + ai-meta（新）
│   └── cli/             # @snui/cli         — resolver + llms.txt + ai-meta 生成
├── apps/
│   ├── docs/            # @snui/docs        — VitePress 文档站
│   └── preview/         # 本地组件预览页
├── dev-docs/            # 产品 / 架构 / WBS / Spec 文档
└── .ai/
    ├── decisions/       # ADR
    └── archive/v1-runtime/
```

依赖方向：`tokens` ← `style-packs`、`vue-web`、`uni`、`ai` ← `docs`。无循环依赖。

---

## 3. Style Pack 系统

### 3.1 为什么需要三层

纯 Token 覆盖（只改颜色 / 圆角 / 间距）无法实现涂鸦、便签、抖音风格：

- **涂鸦**：手绘感边框、手写字体、偏移阴影
- **便签**：纸张质感背景、倾斜阴影、手写字体感
- **抖音**：霓虹发光效果（`text-shadow` / `box-shadow`）、深色底

因此 Style Pack 由三层组成：

| 层 | 内容 | 必需 |
|---|---|---|
| Token 层 | 颜色 / 圆角 / 间距覆盖（`snCssVars()`）| 所有 Pack |
| 皮肤 CSS 层 | `.snui-skin-{name}` 作用域 CSS | 涂鸦 / 便签 / 淘宝 / 抖音 |
| 资源层 | 字体文件 / SVG 纹理 | 抖音等 M4 Pack |

**硬约束**：皮肤 CSS 只能操作视觉（颜色、背景、字体、阴影、动画、伪元素），不能改 DOM / Props / 行为。

### 3.2 官方风格包路线图

| Pack | 视觉特征 | 层 | 交付 |
|---|---|---|---|
| default | 6px 圆角，微妙阴影，蓝色主色 | Token | M2 |
| dark | 深色背景，低饱和度 | Token | M2 |
| ios | 大圆角，无阴影，苹果蓝 | Token | M2 |
| doodle | 手绘边框，手写字体，黑白主色 | Token + 皮肤 CSS | M3 |
| sticky-note | 暖黄背景，倾斜阴影 | Token + 皮肤 CSS | M3 |
| taobao | 橙红主色，圆润圆角 | Token + 皮肤 CSS | M4 |
| douyin | 深色底，红青主色，霓虹 glow | Token + 皮肤 CSS + 资源 | M4 |

### 3.3 Web 端激活

```ts
import { snCssVars } from '@snui/tokens'
import { iosPack } from '@snui/style-packs/ios'

// Token 层：注入 :root CSS 变量
const el = document.createElement('style')
el.id = 'snui-pack'
el.textContent = snCssVars({ theme: iosPack.theme, style: iosPack.style })
document.head.appendChild(el)

// 皮肤 CSS 层（iOS 无需，doodle 等需要）：
// document.body.classList.add('snui-skin-doodle')
// <link id="snui-skin" href="/packs/doodle.skin.css">
```

用户从 ThemeCopier 复制的代码片段即上面这段，粘贴到 `main.ts` 即可。

### 3.4 uni 端激活（小程序兼容）

小程序不支持 `:root`，通过 ConfigProvider `skin` prop 传递：

```vue
<sn-config-provider skin="doodle">
  <!-- 所有子组件在 .snui-skin-doodle 作用域内 -->
  <sn-button type="primary">按钮</sn-button>
</sn-config-provider>
```

### 3.5 文档站交互

- **StyleSwitcher**：右上角浮动面板，列出所有 Pack 缩略图，点击即时切换
- **ThemeCopier**：展示当前 Pack 对应的 `snCssVars(...)` 代码片段，一键复制
- **StylePackPreview**：组件文档页内嵌，横排展示该组件在各 Pack 下的渲染效果

---

## 4. AI Layer（@snui/ai）

### 4.1 三类产物

**A. snail-ui.skill.md**

AI 行为契约，规范 AI 使用 snail-aui 的方式：
- 组件引用规范（`Sn-` 前缀，easycom 路径）
- Token 引用规则（只用 `--sn-*`，禁止硬编码颜色）
- 高保真原型输出格式（三段式 SFC）
- 禁止事项（eval、裸 div、跨越 Token 层级）

**B. MCP Server（4 个工具）**

| 工具 | 说明 |
|---|---|
| `list_components` | 所有组件列表 + 简述 |
| `get_component_meta` | Props / Events / Slots / Tokens / A11y 完整元数据 |
| `get_style_pack` | Pack 定义 + `snCssVars(...)` 代码片段 |
| `render_preview` | 接受 Vue SFC 字符串，返回沙箱预览 URL |

安全约束：只读，沙箱隔离，无网络副作用，15 秒超时。

**C. ai-meta.json**

聚合所有组件元数据 + Token + Style Pack 信息，供 AI 一次性加载。由 `pnpm snui ai-meta` 生成。

### 4.2 ai-description.md 维护策略

**不手工维护 Props / Events / Slots 表格**，避免与 `.vue` 文件漂移：
- Props / Events / Slots 由 `pnpm snui docs` 从 `defineProps` / `defineEmits` / `defineSlots` 自动抽取
- 需要手工维护的内容：组件用途描述、使用场景、不适用场景、代码示例
- CLI 合并两部分生成最终 `ai-description.md`，Props 以自动抽取为准

### 4.3 高保真原型产出流程

```text
需求描述（自然语言）
    ↓
AI 读取 snail-ui.skill.md（规则契约）
    ↓
MCP list_components → 确认组件存在
    ↓
MCP get_component_meta → 获取 Props / Events / Tokens
    ↓
AI 生成 Vue SFC 代码（符合 Skill 规范）
    ↓
MCP render_preview → 沙箱验证渲染
    ↓
输出可运行的高保真原型
```

---

## 5. 地基任务（M1 前，不做则 v3.0 核心功能无法工作）

| ID | 任务 | 阻塞点 |
|---|---|---|
| AUI-FOUND-001 | Token 命名对齐：组件消费变量名与 `@snui/tokens` 输出一致 | 风格切换无效 |
| AUI-FOUND-002 | 重建 ComponentPreview.vue（移除 schema renderer） | 文档预览不可用 |
| AUI-FOUND-003 | ConfigProvider 双端 `skin` prop | uni 无风格切换路径 |
| AUI-FOUND-004 | 组件根元素 `data-snui-component` 皮肤钩子 | 皮肤 CSS 无选择器 |

---

## 6. 组件库（延续 v2.0，~40 个 P0+P1 组件）

详见 WBS v3.0。每个组件：

- `Sn{Name}.vue` + 单元测试 + `ai-description.md`（Web）
- `sn-{name}.vue` + 单元测试 + `ai-description.md`（Uni）
- 根元素带 `data-snui-component="{name}"` 钩子（AUI-FOUND-004）
- 只用 `var(--sn-*)` 样式变量

---

## 7. 里程碑

| 里程碑 | 时间 | 交付 |
|---|---|---|
| **M0** 架构反转 | 2026-10 | ADR-0001 + 文档 v2.0 + Button demo ✅ |
| **M0.5** 文档重写 | 2026-10 | ADR-0002 + PRD/架构/Spec/WBS v3.0 ✅ |
| **M1** 核心组件 + 地基 | 2026-11 | FOUND-001~004 + P0+P1 ~40 组件 + docs |
| **M2** Style Pack + AI | 2026-12 | default/dark/ios Pack + MCP + StyleSwitcher + ThemeCopier |
| **M3** 风格扩展 | 2027 Q1 | doodle + sticky-note + 原型流程验证 |
| **M4** 生态打磨 | 2027 Q2 | taobao + douyin + P2 组件 + VSCode 插件 |

---

## 8. 非目标

- ❌ 运行时 Schema 解释器
- ❌ Low-code Studio
- ❌ 皮肤 CSS 修改组件 Props / 行为 / DOM 结构
- ❌ MCP Server 访问业务数据
- ❌ SSR 适配（Phase 1 不做）
- ❌ 国际化内置（预留接口，文案由用户管理）

---

## 9. 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.2 | 2026-09 | Schema-driven 架构（Superseded） |
| v2.0 | 2026-10-03 | 传统组件库 + 简单 AI 友好（Superseded） |
| v3.0 | 2026-10-03 | Style Pack 三层 + AI Layer + 地基任务（Active） |
