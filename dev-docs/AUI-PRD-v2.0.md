# AUI 产品需求文档 v2.0

> ⚠️ **本文档已被 PRD v3.1 取代（Superseded by `dev-docs/SNUI-PRD-v3.1.md`）**  
> 请勿再据此做新功能决策。仅用于历史追溯。  
> 历史路径：v2.0 → v3.0 → v3.1。

**版本**：v2.0
**状态**：Superseded（被 SNUI-PRD-v3.1.md 取代）
**文档性质**：产品需求 + 系统架构 + 包边界
**目标**：作为 AUI 2.x 开发的唯一上游需求基线

---

## 0. 文档说明

### 0.1 与 v1.2 的关系

v1.2 PRD 定义的 "Schema First / Runtime First / Renderer" 架构已被 ADR-0001 推翻。本文是 v2.0 完整需求基线，v1.2 标为 Superseded。

### 0.2 一句话定位

> **AUI 是一套面向 Vue 3 / uni-app 多端的 AI-friendly UI 组件库。开发者用 `<SnButton>` 这种 Vue SFC 写法直接 import，无需理解 schema / runtime。**

### 0.3 设计哲学

```text
Component First    每个组件是一个独立的 .vue 文件
Token First        CSS 变量驱动主题与样式扩展
DX First           TS 类型推导 + 自动按需加载 + 真实渲染文档
AI-friendly        每个组件配 ai-description，CLI 自动生成 llms.txt
```

### 0.4 不做什么

- ❌ 不做运行时 schema 解释器
- ❌ 不做 Low-code 可视化搭建
- ❌ 不做 Action Registry / Binding 表达式（属于业务框架）
- ❌ 不强制依赖任何后端 / 状态管理库

---

## 1. 产品定位

### 1.1 目标用户

- Vue 3 web 开发者（参考 naive-ui 体验）
- uni-app 多端开发者（参考 wot-ui 体验）
- AI 辅助编程场景（Cursor / Copilot / Claude Code，组件 API 可被 AI 直接读懂）

### 1.2 核心价值

| 维度 | 价值 |
|---|---|
| 易用 | `<SnButton type="primary">点我</SnButton>`，一行 import |
| 一致 | web / uni 双端同名组件，token 共享 |
| 轻量 | 按需加载，无用组件不打包 |
| 主题 | CSS 变量驱动，暗色模式 / 品牌定制 |
| AI 友好 | 每个组件有人类 + AI 双视图文档 |

---

## 2. 包结构

### 2.1 Monorepo 布局

```text
snail-aui/
├── packages/
│   ├── vue-web/        # @snui/vue-web    ——  Web 端组件库（naive-ui 风格 API）
│   ├── uni/            # @snui/uni         ——  uni-app 端组件库（wot-ui 风格 API）
│   ├── tokens/         # @snui/tokens      ——  CSS 变量 token（web + uni 共用）
│   └── cli/            # @snui/cli         ——  unplugin resolver + docs + llms.txt
├── apps/
│   ├── docs/           # @snui/docs        ——  VitePress 文档站（Web + uni 双侧）
│   └── preview/        # 本地组件预览页
├── dev-docs/           # PRD / Master Plan / WBS
└── .ai/
    ├── decisions/      # ADR
    └── archive/
        └── v1-runtime/ # v1.x 归档代码
```

### 2.2 依赖方向

```text
@snui/tokens  ←  @snui/vue-web
              ←  @snui/uni
              ←  @snui/cli (生成 docs)

@snui/vue-web  ──┐
                 ├──→  @snui/cli (resolver)
@snui/uni       ──┘

@snui/docs    →  @snui/vue-web / @snui/uni（真实 import）
```

无循环依赖。`@snui/tokens` 是叶子节点，零运行时依赖。

### 2.3 包公共 API 规范

每个包必须：
- ESM 优先（`"type": "module"`）
- 同时提供 `types` + `import` exports
- 公共 API 命名遵循 §5 命名约定
- 不引入未声明依赖

---

## 3. 组件库设计

### 3.1 组件清单（参考 wot-ui 体系，目标 70+）

按用户使用场景分 6 类，每类按优先级 P0/P1/P2 排序：

| 分类 | 组件 | 优先级 | 说明 |
|---|---|---|---|
| 基础 | Button | P0 | 按钮（type / size / disabled / loading / block / round） |
| 基础 | Icon | P0 | 图标（name / size / color / rotate） |
| 基础 | Text | P1 | 文本（type / size / color / weight / ellipsis） |
| 基础 | Layout | P1 | Flex 布局（direction / justify / align / wrap） |
| 基础 | Cell | P1 | 单元格（title / value / label / arrow / border） |
| 基础 | Transition | P1 | 过渡动画（fade / slide-up / slide-down / zoom） |
| 基础 | ConfigProvider | P0 | 全局配置（theme / locale / component map） |
| 导航 | Navbar | P0 | 导航栏（title / left / right / fixed） |
| 导航 | Tabbar | P0 | 标签栏（modelValue / items / safe-area） |
| 导航 | Tabs | P1 | 标签页（modelValue / items / sticky） |
| 导航 | Segmented | P2 | 分段器 |
| 导航 | Pagination | P1 | 分页 |
| 导航 | Backtop | P2 | 回到顶部 |
| 导航 | Tour | P3 | 漫游引导 |
| 录入 | Form | P0 | 表单（model / rules / validate） |
| 录入 | Input | P0 | 输入框（v-model / type / clearable） |
| 录入 | Textarea | P1 | 文本域 |
| 录入 | InputNumber | P1 | 计数器 |
| 录入 | Switch | P1 | 开关 |
| 录入 | Checkbox | P1 | 复选框 |
| 录入 | Radio | P1 | 单选框 |
| 录入 | Slider | P1 | 滑块 |
| 录入 | Rate | P2 | 评分 |
| 录入 | Search | P1 | 搜索框 |
| 录入 | Picker | P1 | 选择器（uni 强需求） |
| 录入 | Calendar | P2 | 日历选择器 |
| 录入 | DatetimePicker | P2 | 时间选择器 |
| 录入 | Upload | P2 | 上传 |
| 反馈 | Popup | P0 | 弹出层（v-model / position / overlay） |
| 反馈 | Dialog | P0 | 弹框（show / title / content） |
| 反馈 | Toast | P0 | 轻提示（show / message / type） |
| 反馈 | Notify | P1 | 消息通知 |
| 反馈 | Loading | P0 | 加载 |
| 反馈 | Overlay | P1 | 遮罩层 |
| 反馈 | ActionSheet | P1 | 动作面板 |
| 反馈 | DropMenu | P2 | 下拉菜单 |
| 反馈 | Popover | P2 | 气泡 |
| 反馈 | Tooltip | P1 | 文字提示 |
| 反馈 | Progress | P1 | 进度条 |
| 反馈 | Circle | P2 | 环形进度条 |
| 反馈 | Empty | P1 | 缺省提示 |
| 反馈 | Skeleton | P1 | 骨架屏 |
| 反馈 | SwipeAction | P2 | 滑动操作 |
| 反馈 | NoticeBar | P2 | 通知栏 |
| 反馈 | CountDown | P2 | 倒计时 |
| 反馈 | Loadmore | P2 | 加载更多 |
| 展示 | Avatar | P0 | 头像 |
| 展示 | Badge | P1 | 徽标 |
| 展示 | Tag | P1 | 标签 |
| 展示 | Card | P1 | 卡片 |
| 展示 | Divider | P1 | 分割线 |
| 展示 | Grid | P1 | 宫格 |
| 展示 | Collapse | P1 | 折叠面板 |
| 展示 | Steps | P2 | 步骤条 |
| 展示 | Sticky | P1 | 粘性布局 |
| 展示 | Img | P1 | 图片（懒加载 / 占位） |
| 展示 | ImagePreview | P1 | 图片预览 |
| 展示 | Swiper | P0 | 轮播图 |
| 展示 | Table | P2 | 表格 |
| 展示 | Watermark | P2 | 水印 |
| 展示 | QRCode | P2 | 二维码 |
| 组合式 | useToast | P0 | 命令式 Toast |
| 组合式 | useDialog | P0 | 命令式 Dialog |
| 组合式 | useNotify | P1 | 命令式 Notify |
| 组合式 | useCountDown | P2 | 倒计时 hook |
| 组合式 | useImagePreview | P1 | 命令式图片预览 |
| 组合式 | useConfigProvider | P1 | 配置上下文 |

**第一阶段交付**：P0 全量 + P1 全量（预估 35~40 个组件）
**第二阶段交付**：P2 + P3

### 3.2 web 端 API 风格（参考 naive-ui）

```vue
<script setup lang="ts">
import { SnButton, SnConfigProvider } from '@snui/vue-web'
import { ref } from 'vue'

const theme = ref(null)
</script>

<template>
  <SnConfigProvider :theme-overrides="theme">
    <SnButton
      type="primary"
      size="medium"
      :loading="isLoading"
      @click="handleSubmit"
    >
      提交
    </SnButton>
  </SnConfigProvider>
</template>
```

特征：
- Composition API + `<script setup>`
- 驼峰命名 props / events
- v-model 双向绑定
- 全局 theme overrides（`SnConfigProvider`）
- TS 类型完整推导

### 3.3 uni 端 API 风格（参考 wot-ui）

```vue
<!-- pages/index/index.vue -->
<template>
  <view class="container">
    <sn-button
      type="primary"
      size="medium"
      :loading="loading"
      @click="onSubmit"
    >
      提交
    </sn-button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const onSubmit = () => { /* ... */ }
</script>
```

特征：
- easycom 自动注册（`components/sn-button/sn-button.vue`）
- 移动端场景优化（safe-area / touch 反馈）
- 跨端 capability 兜底（小程序不支持的特性降级）
- API 与 web 端同名同形（用户切换端无感知）

### 3.4 命名规范

| 对象 | 命名 | 示例 |
|---|---|---|
| 组件 | PascalCase + `Sn` 前缀 | `SnButton` |
| uni 组件目录 | kebab-case + `sn-` 前缀 | `sn-button/` |
| uni 组件文件 | kebab-case + `sn-` 前缀 | `sn-button.vue` |
| props | camelCase | `modelValue`, `loadingIcon` |
| events | camelCase + `on` 前缀（TypeScript 中） | `onClick`, `onUpdate:value` |
| 事件名（Vue 中） | kebab-case | `@click`, `@update:value` |
| slots | camelCase | `default`, `icon`, `loading` |
| 类型 | PascalCase | `ButtonType`, `ButtonSize` |
| 变量 | camelCase | `buttonRef`, `isLoading` |
| 常量 | UPPER_SNAKE_CASE | `DEFAULT_LOADING_ICON` |
| 文件 | kebab-case | `sn-button.vue`, `use-button.ts` |

### 3.5 每个组件的强制文件结构

```text
packages/vue-web/src/button/
├── SnButton.vue              # 主组件
├── SnButton.test.ts          # 单元测试
└── ai-description.md         # AI 友好的组件说明（人类可读 + AI 可解析）

packages/uni/src/components/sn-button/
├── sn-button.vue             # 主组件
├── sn-button.test.ts         # 单元测试（vitest + happy-dom 或 jsdom）
└── ai-description.md         # AI 友好的组件说明
```

每个组件必须含：
- Props（TypeScript interface）
- Events（TypeScript type）
- Slots（TypeScript type）
- A11y 属性（role / aria-*）
- Token 接入（CSS 变量）
- 单元测试（props / events / slots / a11y 覆盖）

---

## 4. Token 系统

### 4.1 设计

```text
Primitive（原始值）  →  Semantic（语义令牌）  →  Component（组件令牌）
   颜色 / 间距 / 字号      action-primary 颜色        button-primary-bg
   圆角 / 阴影 / 动效      text-secondary 颜色         button-radius-md
```

### 4.2 CSS 变量规范

```css
:root {
  /* Primitive */
  --sn-color-blue-500: #1677ff;
  --sn-spacing-md: 12px;
  --sn-radius-md: 8px;

  /* Semantic */
  --sn-color-action-primary: var(--sn-color-blue-500);
  --sn-color-text-secondary: #666;

  /* Component */
  --sn-button-primary-bg: var(--sn-color-action-primary);
  --sn-button-radius-md: var(--sn-radius-md);
}
```

web 与 uni **共用同一套 CSS 变量名**（`--sn-*` 前缀），保证换端时样式一致。

### 4.3 主题切换

通过 `html[data-theme="dark"]` 切换：

```css
:root {
  --sn-color-action-primary: #1677ff;
}

html[data-theme="dark"] {
  --sn-color-action-primary: #1668dc;
}
```

### 4.4 包接口

```ts
// @snui/tokens
export const primitiveTokens: Record<string, string>
export const semanticTokens: Record<string, string | { light: string; dark: string }>
export const componentTokens: Record<string, string | { light: string; dark: string }>
export const cssVarName: (path: string) => string  // 'button.primary.bg' → '--sn-button-primary-bg'
```

---

## 5. 按需加载

### 5.1 unplugin-vue-components resolver

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { SnUIResolver } from '@snui/cli/resolver'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        SnUIResolver({ library: '@snui/vue-web' })
      ]
    })
  ]
})
```

### 5.2 显式 import 也支持

```ts
import { SnButton } from '@snui/vue-web'
```

ESM tree-shake 保证：未使用的组件不会进 bundle。

### 5.3 uni 端自动注册

通过 easycom 自动注册 `components/sn-*/sn-*.vue`，无需配置。

---

## 6. 文档站

### 6.1 VitePress 结构

```text
apps/docs/
├── guide/                 # 指南（介绍 / 快速开始 / 主题 / 国际化）
│   ├── index.md
│   ├── quick-start.md
│   ├── theme.md
│   └── ...
├── component/             # 组件文档
│   ├── button.md
│   ├── icon.md
│   └── ...
├── public/
├── theme/
├── .vitepress/
│   └── config.ts
└── package.json
```

### 6.2 组件文档模板（真实渲染）

每个 `component/<name>.md`：

```md
---
title: Button 按钮
---

# Button 按钮

按钮用于触发一个操作。

## 基础用法

<script setup>
import { SnButton } from '@snui/vue-web'
</script>

<SnButton>默认按钮</SnButton>
<SnButton type="primary">主要按钮</SnButton>
<SnButton type="danger">危险按钮</SnButton>

## API

### Props

| 名称 | 说明 | 类型 | 默认值 |
|---|---|---|---|
| type | 按钮类型 | `'primary' \| 'default' \| 'danger' \| 'ghost'` | `'default'` |
| size | 按钮尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| ... | ... | ... | ... |

### Events

| 名称 | 说明 | 回调参数 |
|---|---|---|
| click | 点击按钮时触发 | `(event: MouseEvent) => void` |

### Slots

| 名称 | 说明 |
|---|---|
| default | 按钮内容 |
| icon | 自定义图标 |
```

### 6.3 AI-friendly：llms.txt

参考 wot-ui 的 llms-txt 思路，CLI 工具自动生成：

```text
# /llms.txt
# AUI Web Components

## Button
- File: packages/vue-web/src/button/SnButton.vue
- Props: type ('primary'|'default'|'danger'|'ghost'), size ('small'|'medium'|'large'), disabled, loading, ...
- Events: click (event: MouseEvent)
- Slots: default, icon
- Tokens used: --sn-button-primary-bg, --sn-button-radius-md, ...
```

AI 可直接读这个文件理解组件 API。

---

## 7. uni-app 适配

### 7.1 跨端支持

| 平台 | 支持 |
|---|---|
| H5 | ✅ |
| 微信小程序 | ✅ |
| 支付宝小程序 | ✅ |
| 抖音小程序 | ✅ |
| App (Vue + uni-app x) | ✅ |

### 7.2 capability / fallback

web 端有的能力（如 `position: sticky`、`backdrop-filter`），小程序不支持时自动降级：

```vue
<!-- SnPopup.vue -->
<view
  :class="['sn-popup', position]"
  :style="popupStyle"
>
  <!-- 平台不支持 backdrop-filter 时降级为半透明黑色遮罩 -->
  <view v-if="hasBackdrop" class="sn-popup__overlay" :class="{ 'sn-popup__overlay--blur': supportsBackdropFilter }" />
  ...
</view>
```

`supportsBackdropFilter` 通过 runtime 检测（不是 schema 解释器，只是简单的 `typeof window !== 'undefined'` + CSS feature query）。

### 7.3 easycom 注册

`packages/uni/src/components/sn-*/sn-*.vue` 按 easycom 规范自动注册，无需配置。

---

## 8. CLI 工具

### 8.1 包能力

- `SnUIResolver()` —— unplugin-vue-components resolver
- `generateDocs()` —— 从 .vue 文件提取 props/events/slots，生成组件文档
- `generateLlmsTxt()` —— 生成 llms.txt（AI 友好）
- `createComponent()` —— 脚手架生成新组件目录结构
- `lintToken()` —— 检查组件 CSS 是否走 token 系统（禁止硬编码颜色 / 间距）

### 8.2 命令

```bash
# 添加到项目
pnpm add -D @snui/cli

# 生成组件文档
pnpm snui docs

# 生成 llms.txt
pnpm snui llms

# 创建新组件脚手架
pnpm snui new SnCard
```

---

## 9. 测试

### 9.1 单元测试

`vitest` + `@vue/test-utils`：

```ts
import { mount } from '@vue/test-utils'
import { SnButton } from '@snui/vue-web'

describe('SnButton', () => {
  it('renders default slot', () => {
    const wrapper = mount(SnButton, { slots: { default: 'Click me' } })
    expect(wrapper.text()).toBe('Click me')
  })

  it('emits click event', async () => {
    const wrapper = mount(SnButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('disables click when loading', async () => {
    const wrapper = mount(SnButton, { props: { loading: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
```

### 9.2 A11y 测试

```ts
it('has accessible role', () => {
  const wrapper = mount(SnButton, { props: { type: 'primary' } })
  expect(wrapper.attributes('role')).toBe('button')
})
```

### 9.3 视觉回归（可选，Phase 2）

`@vue/test-utils` + 截图比对（仅关键组件如 Button / Popup / Dialog）。

---

## 10. CI / 发布

### 10.1 CI 流水线

```text
PR 提交
  ↓
typecheck (turbo run typecheck)
  ↓
lint (turbo run lint)
  ↓
test (turbo run test)
  ↓
build (turbo run build)
  ↓
视觉回归（可选）
  ↓
Review Agent 评审
  ↓
Human Gate（架构变更时）
  ↓
merge main
```

### 10.2 发布

changesets 管理版本：

```bash
pnpm changeset           # 写变更说明
pnpm version-packages    # 生成新版本
pnpm release             # 构建并发布
```

每个包独立版本号，breaking change 升 major。

---

## 11. 迁移策略（v1 → v2）

v1.x schema-driven 用户（理论上存在）迁移路径：

| v1 用法 | v2 等价物 |
|---|---|
| `<AUI :schema="..." />` | `<SnContainer>...children</SnContainer>` |
| `createAuiRuntime(schema)` | Vue 组件树直接写 |
| `ComponentContract` | 组件的 `ai-description.md`（自动生成） |

不再提供 schema 解释器，强制迁移到 Vue SFC 写法。

---

## 12. 范围外（Out of Scope）

- ❌ 运行时 schema 解释器
- ❌ JSON Patch / AI Repair
- ❌ Low-code Studio
- ❌ Action Registry / Binding 表达式
- ❌ 服务端渲染（SSR）适配（Phase 1 不做）
- ❌ 国际化内置（仅预留 i18n slot，组件文案由用户管理）
- ❌ 单元测试覆盖率 100% 目标（关键路径 ≥80%，其余尽力）

---

## 13. 里程碑

| 里程碑 | 时间 | 交付 |
|---|---|---|
| **M0** 架构反转 | 2026-10 | ADR-0001 + PRD v2.0 + 归档旧包 + Button demo |
| **M1** 核心组件 | 2026-11 | P0 + P1 组件全量（35~40 个）+ docs 站 + cli |
| **M2** 主题与生态 | 2026-12 | 暗色模式 / 国际化 / VS Code 插件 / 模板 starter |
| **M3** 长期 | 2027 | 剩余 P2 组件 / 视觉回归 / 性能优化 |

---

## 附录 A. 参考

- naive-ui：https://www.naiveui.com/
- wot-ui：https://wot-ui.cn/
- Element Plus：https://element-plus.org/
- Vant：https://vant-ui.github.io/vant/

## 附录 B. 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.2 | 2026-09 | 初始 PRD，schema-driven 架构 |
| v2.0 | 2026-10-03 | 整体推翻，定位改为 AI-friendly 组件库（ADR-0001） |
