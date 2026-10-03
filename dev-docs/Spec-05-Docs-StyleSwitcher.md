# Spec-05：文档站、StyleSwitcher、ThemeCopier 规范

**版本**：v1.0  
**状态**：Active  
**对应**：PRD v3.0 §7 / Architecture v3.0 §2.4  
**日期**：2026-10-03

---

## 1. 文档站整体结构（v3.0）

```text
apps/docs/
├── guide/
│   ├── web/
│   │   ├── intro.md
│   │   ├── quick-start.md
│   │   ├── installation.md
│   │   └── architecture.md
│   └── uni/
│       └── quick-start.md
├── components/
│   ├── web/
│   │   ├── button.md
│   │   ├── input.md
│   │   └── ...（每个 Web 组件一个 md）
│   └── uni/
│       ├── button.md
│       └── ...（每个 Uni 组件一个 md）
├── theme/
│   ├── overview.md
│   ├── style.md
│   ├── theme.md
│   ├── density.md
│   └── cascade.md
├── style-packs/                    # v3.0 新增
│   ├── overview.md                 # 风格包总览
│   ├── ios.md
│   ├── doodle.md
│   └── custom.md                   # 自定义 Pack 指南
├── ai/                             # v3.0 新增
│   ├── overview.md                 # AI 生态总览
│   ├── skill.md                    # Skill 文件使用说明
│   ├── mcp.md                      # MCP Server 接入指南
│   └── prototype.md                # 高保真原型产出指南
├── en/                             # 英文镜像（结构同上）
├── public/
│   ├── framework-web.js
│   ├── framework-uni.js
│   └── ai-meta.json                # v3.0 新增
├── .vitepress/
│   ├── config.ts
│   ├── theme/
│   │   ├── index.ts
│   │   └── custom.css
│   └── components/
│       ├── ComponentPreview.vue
│       ├── StyleSwitcher.vue       # v3.0 新增
│       └── ThemeCopier.vue        # v3.0 新增
└── package.json
```

---

## 2. 组件文档页规范

### 2.1 必须包含的内容（每个组件页强制）

```text
[ ] 组件用途说明（1-2 段）
[ ] 基础用法示例（ComponentPreview）
[ ] Props 表格（name / type / default / required / 说明）
[ ] Events 表格（如有）
[ ] Slots 表格（如有）
[ ] Tokens 表格（CSS 变量名 + 用途）
[ ] A11y 行为说明（role / keyboard）
[ ] Style Pack 风格预览面板（StylePackPreview，内嵌 StyleSwitcher）
[ ] ai-description.md 链接
```

### 2.2 组件文档模板

```md
---
title: {Component} {组件中文名}
---

# {Component} {组件中文名}

{一句话用途描述}

## 基础用法

<ComponentPreview name="{component}" variant="primary" text="按钮文字" />

## {场景示例标题}

<ComponentPreview name="{component}" ... />

## API

### Props

| 名称 | 说明 | 类型 | 默认值 |
|---|---|---|---|
| `type` | 按钮类型 | `'primary' \| 'default'` | `'default'` |

### Events

| 名称 | 说明 | 回调参数 |
|---|---|---|
| `click` | 点击时触发 | `(event: MouseEvent) => void` |

### Slots

| 名称 | 说明 |
|---|---|
| `default` | 按钮内容 |

### Tokens

| CSS 变量 | 说明 |
|---|---|
| `--sn-color-action-primary` | primary 背景色 |
| `--sn-radius-button` | 圆角 |

## 风格预览

<StylePackPreview name="{component}" />

## 无障碍

- ...

## AI 元数据

[查看 ai-description.md](./{path}/ai-description.md)
```

### 2.3 双语要求

- 每个组件页必须同时维护 `apps/docs/components/web/{name}.md`（中文）和 `apps/docs/en/components/web/{name}.md`（英文）
- 内容变更（Props / Events / Tokens）必须在同一 commit 中同步中英文两份
- 违反此规定的 PR Review Agent 拒绝合并

---

## 3. StyleSwitcher 组件规范

### 3.1 交互规范

- 位置：文档站右上角固定浮动面板（或侧边栏顶部，具体由文档站 layout 决定）
- 展示：所有 `@snui/style-packs` 中的 Pack，含 label + previewImage 缩略图
- 交互：点击 Pack 卡片 → 即时替换当前页面 CSS 变量（不刷新）
- 当前激活的 Pack 有选中态（border 高亮）
- 初始状态：`default` Pack

### 3.2 实现规范

```vue
<!-- apps/docs/.vitepress/components/StyleSwitcher.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { snCssVars } from '@snui/tokens'
import { allPacks } from '@snui/style-packs'
import type { StylePackDefinition } from '@snui/style-packs'

const activePack = ref<string>('default')

function applyPack(pack: StylePackDefinition) {
  activePack.value = pack.name
  let el = document.getElementById('snui-pack') as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = 'snui-pack'
    document.head.appendChild(el)
  }
  el.textContent = snCssVars({
    theme: pack.theme,
    style: pack.style,
    density: pack.density,
  })
}
</script>
```

### 3.3 与 ComponentPreview 的联动

StyleSwitcher 切换 Pack 后，ComponentPreview 不需要任何代码变更——CSS 变量替换后渲染的 iframe 会自动继承新的 Token 值（前提是 iframe 与父页面同域）。

---

## 4. ThemeCopier 组件规范

### 4.1 功能

展示当前激活 Pack 对应的 `snCssVars(...)` 代码片段，用户一键复制到项目。

### 4.2 代码片段格式

**main.ts 格式**（默认）：

```ts
// 粘贴到 main.ts
import { snCssVars } from '@snui/tokens'
import { iosPack } from '@snui/style-packs/ios'

const el = document.createElement('style')
el.id = 'snui-pack'
el.textContent = snCssVars({
  theme: iosPack.theme,
  style: iosPack.style,
  density: iosPack.density,
})
document.head.appendChild(el)
```

**ConfigProvider 格式**（可选切换）：

```ts
// 粘贴到需要主题覆盖的组件
import { snCssVars } from '@snui/tokens'
import { iosPack } from '@snui/style-packs/ios'

const packCss = snCssVars({
  theme: iosPack.theme,
  style: iosPack.style,
})
```

### 4.3 实现约束

- ThemeCopier 展示的代码片段必须与当前 StyleSwitcher 激活的 Pack 保持同步（响应式）
- 复制成功后显示 1.5 秒的 "已复制 ✓" 反馈
- 复制失败时（不支持 Clipboard API 的浏览器）提供 fallback 选中框

---

## 5. StylePackPreview 组件（组件页内嵌）

每个组件文档页在 API 文档下方嵌入 StylePackPreview，展示该组件在不同 Pack 下的外观。

```vue
<!-- 用法（在 .md 文件中） -->
<StylePackPreview name="button" />
```

功能：
- 横向排列展示所有官方 Pack 下该组件的渲染效果
- 每个 Pack 下方展示 Pack label
- 点击任意 Pack 格子 → 切换全局 StyleSwitcher（两者响应式联动）

---

## 6. 导航结构（v3.0 更新）

```ts
// apps/docs/.vitepress/config.ts 侧边栏新增
{
  '/style-packs/': [
    {
      text: '风格包',
      items: [
        { text: '风格包总览', link: '/style-packs/overview' },
        { text: 'iOS 风格', link: '/style-packs/ios' },
        { text: '涂鸦风格', link: '/style-packs/doodle' },
        { text: '自定义风格包', link: '/style-packs/custom' },
      ],
    },
  ],
  '/ai/': [
    {
      text: 'AI 生态',
      items: [
        { text: 'AI 生态总览', link: '/ai/overview' },
        { text: 'Skill 文件', link: '/ai/skill' },
        { text: 'MCP Server', link: '/ai/mcp' },
        { text: '高保真原型', link: '/ai/prototype' },
      ],
    },
  ],
}
```

---

## 7. 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-10-03 | 初始版本（Active） |
