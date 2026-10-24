# uni-app 组件开发契约（`@snui/uni`）

本文件是 `packages/uni/src/components/sn-*/` 下每个组件的**强制交付标准**。
`AGENTS.md` §112 规定 uni 端 1:1 对齐 wot-ui；本文件把那条规则落到可执行的
文件清单、命名与验收动作上。

机器可读的 wot-ui 规格在 `.ai/reference/wot-ui-api-spec.json`。
**写任何 prop 之前先读它**，不要凭记忆。

---

## 1. 每个组件必须交付的文件

```text
packages/uni/src/components/sn-<name>/
  sn-<name>.vue              # 组件本体（SFC）
  sn-<name>.test.ts          # 行为测试
  ai-description.md          # AI 可解析描述（end: mp 标记）

apps/docs/.vitepress/demo/
  <name>-mp-<场景>.vue       # 中文 demo，每个文档章节一个

apps/docs/.vitepress/demo-en/
  <name>-mp-<场景>.vue       # 英文影子 demo（文件名必须与中文一致）

apps/docs/components/uni/
  <name>.md                  # 中文文档页

apps/docs/en/components/uni/
  <name>.md                  # 英文文档页
```

缺任意一项 = 未完成（`AGENTS.md` §110）。

---

## 2. SFC 硬性要求

### 2.1 文件头注释

```vue
<script setup lang="ts">
/**
 * sn-<name> (uni-end) — <一句话职责>.
 *
 * Reference library: wot-ui `wd-<name>`
 *   (https://wot-ui.cn/component/<name>.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-<name> 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-<name>/sn-<name>.vue
 * → auto-registered as `<sn-<name>>` in any .vue that uses it.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction + DOM
 * bridge only. No schema validation; no business logic.
 *
 * Not responsible for:
 *   - <相邻职责，指向正确的兄弟组件>
 */
```

### 2.2 props

- 名字、默认值、可选值集合 **全部** 来自 `.ai/reference/wot-ui-api-spec.json`
- kebab-case 的 upstream 名在 Vue 里用 camelCase 声明
  （`custom-class` → `customClass`，`bg-color` → `bgColor`）
- 每个 prop 必须有 `/** … */` 注释（`AGENTS.md` §69）
- 不实现的能力不要出现在 props 里；确实需要占位时写
  `// TODO(AUI-XXXX): …`，并在文档里标注"未实现"
- **禁止** web-only prop（`attrType` / `tag` / `focusable` /
  `iconPlacement` / `showIcon` …）—— §112.1 Stop-the-Line

### 2.3 模板

```vue
<template>
  <view
    :class="rootClass"
    :style="rootStyle"
    role="…"
    :aria-*="…"
  >
    <slot />
  </view>
</template>
```

- uni 端只能用跨端元素：`<view>` / `<text>` / `<image>` / `<scroll-view>` /
  `<input>` / `<textarea>` / `<swiper>`。**禁止** `<div>` / `<span>`
- 有交互语义的元素补 `role` / `aria-*`（§52）
- 根节点统一挂 `:class` + `:style`（`customClass` / `customStyle` 直接转发）

### 2.4 样式

- **只**用 `var(--sn-mp-*)`，禁止 `var(--sn-web-*)` / `var(--aui-*)`（§112）
- 几何值用 `rpx`（750 设计稿，1px = 2rpx）
- **禁止**写死颜色字面量。需要新色值时先在
  `packages/tokens-mp/src/variables.ts` + `packages/tokens-mp/styles/index.css`
  声明 `--sn-mp-color-*`（含暗色块），再引用
- **禁止** `var(--sn-mp-x, #fff)` 这类浅色兜底 —— 变量必须真实存在，
  否则暗色模式会漏出浅色（已有回归测试守着，见 §5）
- 圆角 / 间距优先走 `--sn-mp-radius-*` / `--sn-mp-spacing-*`
- Doodle skin 覆盖块：`.snui-skin-doodle .sn-<name> { … }`（可选，若组件
  有视觉皮肤价值）

### 2.5 事件

- uni 端用 `@tap`，不是 `@click`（小程序没有 click）
- 受控语义必须与 wot-ui 一致：`v-model` 类组件声明
  `update:modelValue` + `change`；受控 / 非受控都要工作
- disabled / readonly / loading 状态下必须真的拦住事件

---

## 3. 测试要求（`sn-<name>.test.ts`）

- 用 `vitest` + `@vue/test-utils` + happy-dom
- 测**行为**，不测实现细节（§46）
- 每个非平凡 prop 至少一条断言（§112.2d）
- 事件：触发 → 断言 emit；禁用态 → 断言不 emit
- **不要**在断言里用 `rpx` 数值：happy-dom 会丢弃无法解析的 CSS 长度，
  用 `px` 或断言 class / 属性

最小骨架：

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnName from './sn-name.vue'

describe('sn-name', () => {
  it('renders default slot content', () => {
    const w = mount(SnName, { slots: { default: 'text' } })
    expect(w.text()).toContain('text')
  })

  it('emits tap when tapped', async () => {
    const w = mount(SnName, { slots: { default: 'x' } })
    await w.trigger('tap')
    expect(w.emitted('tap')).toHaveLength(1)
  })

  it('does not emit when disabled', async () => {
    const w = mount(SnName, { props: { disabled: true }, slots: { default: 'x' } })
    await w.trigger('tap')
    expect(w.emitted('tap')).toBeUndefined()
  })
})
```

---

## 4. demo 要求

### 4.1 必须从源码路径 import（§111.2）

```ts
import SnName from '@snui/uni-src/components/sn-name/sn-name.vue'
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry'
import type { X } from '@snui/uni-src/components/sn-name/sn-name-types'
```

**禁止** `from '@snui/uni'`（dist 入口，scoped CSS 拿不到 rpx 转换）。

### 4.2 文件命名

`<name>-mp-<场景>.vue`，例如 `tag-mp-types.vue` / `tag-mp-closable.vue`。
`-mp-` 标记同时驱动文档站的手机模拟预览（`Demo.vue` → `PhoneFrame`）。

### 4.3 中英双语

- `demo-en/` 下**同名**文件是英文影子；文案翻译，代码结构保持一致
- 英文版不要只改注释，可见文本（按钮文案、label）必须也翻

### 4.4 demo 结构

```vue
<script setup lang="ts">
import SnName from '@snui/uni-src/components/sn-name/sn-name.vue'
</script>

<template>
  <view class="sn-demo">
    <SnName … />
  </view>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
</style>
```

- 根容器用 `class="sn-demo"`（`PhoneFrame` 提供 flex 基线样式）
- 需要纵向排列时用 `sn-demo--stack` / `sn-demo--column`
- 不要给 demo 加自己的外框 / 背景（手机壳已经提供）

---

### 2.6 可选 prop 的默认值（`exactOptionalPropertyTypes`）

仓库开了 `exactOptionalPropertyTypes: true`。可选 prop **不能**在
`withDefaults` 里写 `undefined`：

```ts
// ❌ TS2379: Argument of type '{ type: undefined; … }' is not assignable
//    to InferDefaults<…> with 'exactOptionalPropertyTypes: true'
type?: string
…withDefaults(defineProps<…>(), { type: undefined })
```

两种正确写法，按语义选一种：

```ts
// 1. 有明确"空值"语义 → 用具体默认值，并把 undefined 纳入类型
type?: string
…withDefaults(defineProps<…>(), { type: '' })          // 空串代表"未指定"

// 2. 真的需要区分"未传"和"传了空" → 类型里显式加 undefined，不给默认值
type?: string | undefined
…defineProps<{ type?: string | undefined }>()            // 不写 withDefaults
```

写 `Record` / 对象类默认值用工厂函数：`themeVars: () => ({})`。

## 5. 文档页要求（`apps/docs/components/uni/<name>.md`）

章节顺序固定，缺章节视为未完成：

```md
# <Name> <中文名>（uni 端 / 移动端）

<一句话说明 + easycom 注册说明 + rpx 单位说明>


## 基础用法
<Demo name="<name>-mp-basic" description="…" />

## <各能力章节，每节一个 Demo>

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
…

## Events

| 事件名 | 说明 | 参数 |
…

## Slots

| 插槽名 | 说明 |

## 主题变量

列出组件消费的 `--sn-mp-*` 变量（表格：变量 / 用途）

## 无障碍

role / aria / 键盘行为

## 暗色模式

说明该组件在 `.sn-theme-dark` 下自动适配（或指出需要主题变量的地方）
```

英文页 `apps/docs/en/components/uni/<name>.md` 同结构，标题用
`# <Name> · uni-app`，正文英文。

---

## 6. 暗色模式（强制）

uni 端暗色由 `.sn-theme-dark` class 驱动（`@snui/tokens-mp/styles`）。
组件必须满足：

1. 所有颜色都走 `--sn-mp-color-*`，不写死
2. 没有浅色 `var()` 兜底
3. 文档页给出"暗色模式"小节，说明可用
   `<sn-config-provider theme="dark">` 包裹验证

`packages/tokens-mp/src/variables.test.ts` 里有回归测试：新增的
`--sn-mp-color-*` 变量若没在暗色块里覆盖，测试会失败。

---

## 7. 验收命令

```bash
pnpm --filter @snui/tokens-mp test    # token 层（含暗色覆盖检查）
pnpm --filter @snui/uni test          # 组件行为
pnpm --filter @snui/uni typecheck     # 类型
pnpm --filter @snui/uni lint          # lint
```

四项全过才算完成。没跑过的不要写成 PASS（§95）。

---

## 8. 文档站接线（每个组件都要）

三处集中配置需要追加条目，缺一即文档站里点不到：

1. `apps/docs/.vitepress/config.ts` → `sidebar['/components/uni/']`（中文）
   与 `enSidebar['/en/components/uni/']`（英文）
2. 分类归属按 wot-ui 的导航分组：
   `基础 / 导航 / 录入 / 反馈 / 展示 / 组合式API`
3. 中文条目文案：`sn-<name> <中文名>`；英文条目：`<Name>`

---

## 9. 不要做的事

- 不要为了"看起来完整"实现半成品 prop：没实现的就不声明
- 不要给组件加业务逻辑（§18）
- 不要用 `eval` / `new Function`（§23）
- 不要删除或 `skip` 失败的测试（§48）
- 不要改 `packages/vue-web`（web 端参考库是 naive-ui，与本次任务无关）
