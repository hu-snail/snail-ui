# Collapse 折叠面板（uni 端 / 移动端）

`sn-collapse` 是 `@snui/uni`（移动端 / 小程序 / H5）的折叠面板容器，`sn-collapse-item` 是单个面板。基于 easycom 自动注册，几何值走 `rpx`，跨设备等比缩放。

## 基础用法

普通模式下 `v-model` 为 `string[]`，可同时展开多个面板：

<Demo name="collapse-mp-basic" description="v-model 绑定展开的 name 数组；多个面板可同时展开。" />

## 手风琴模式

`accordion` 下 `v-model` 为 `string`，同时只展开一项；`disabled` 阻止切换：

<Demo name="collapse-mp-accordion" description="accordion 手风琴模式，v-model 为字符串；disabled 面板无法展开。" />

## 查看更多模式

`viewmore` 下 `v-model` 为 `boolean`，内容按 `line-num` 行数收起：

<Demo name="collapse-mp-viewmore" description="viewmore 查看更多模式，v-model 为布尔值；line-num 控制收起显示行数；底部渲染展开 / 收起按钮。" />

## more 插槽、item 边框与 before-expend

`more` 插槽替换 viewmore 模式的展开 / 收起区域，`custom-more-slot-class` 给它追加类名；item 的 `border=false` 去掉下边框；`before-expend` 在展开前拦截：

<Demo name="collapse-mp-slots" description="more 插槽 + custom-more-slot-class；item border=false；before-expend 拦截展开；title 插槽。" />

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<sn-collapse v-model="open">
  <sn-collapse-item name="a" title="标题">内容</sn-collapse-item>
</sn-collapse>
```

如需显式 import：

```ts
import { SnCollapse } from '@snui/uni/components/sn-collapse/sn-collapse.vue'
import { SnCollapseItem } from '@snui/uni/components/sn-collapse/sn-collapse-item.vue'
```

## Props

### sn-collapse

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| string[] \| boolean` | `[]` | 绑定值；普通模式 `string[]`，手风琴模式 `string`，查看更多模式 `boolean` |
| `accordion` | `boolean` | `false` | 是否开启手风琴模式 |
| `viewmore` | `boolean` | `false` | 是否开启查看更多模式 |
| `useMoreSlot` | `boolean` | `false` | 查看更多模式下是否启用 `more` 插槽 |
| `lineNum` | `number` | `2` | 查看更多模式下收起显示行数 |
| `customMoreSlotClass` | `string` | `''` | `more` 插槽外部自定义类名 |
| `customClass` | `string` | `''` | 根节点自定义类名 |
| `customStyle` | `string` | `''` | 根节点自定义 inline style |

### sn-collapse-item

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | `string` | `''` | 折叠栏唯一标识符 |
| `title` | `string` | `''` | 折叠栏标题 |
| `disabled` | `boolean` | `false` | 是否禁用该折叠栏 |
| `beforeExpend` | `(name) => boolean \| Promise<boolean>` | `undefined` | 打开前拦截函数 |
| `border` | `boolean` | `true` | 是否显示边框 |
| `customBodyClass` | `string` | `''` | 内容容器自定义类名 |
| `customBodyStyle` | `string` | `''` | 内容容器自定义样式 |
| `customClass` | `string` | `''` | 根节点自定义类名 |
| `customStyle` | `string` | `''` | 根节点自定义 inline style |

> `beforeExpend` 拼写沿用 wot-ui 原名（上游笔误），以保持 prop 面 1:1。它只在**展开**时生效；收起不询问。Promise reject 视为「不展开」，不会抛出未处理异常。

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 绑定值变化时触发 | `(value: string \| string[] \| boolean)` |
| `change` | 绑定值变化时触发 | `({ value })` |
| `change`（item） | 单个面板展开状态变化 | `({ name, expanded })` |

## 方法

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| `toggleAll` | 切换所有面板。传 `{ expanded: true }` 全部展开，`{ expanded: false }` 全部收起，不传则整体翻转 | `(options?: { expanded?: boolean; skipDisabled?: boolean })` |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default`（collapse） | 面板项列表 |
| `more`（collapse） | 查看更多模式下自定义展开 / 收起区域，作用域 `{ expanded }` |
| `title`（item） | 自定义标题区域，作用域 `{ expanded, disabled, isFirst }` |
| `default`（item） | 折叠栏内容 |

## 主题变量

| 变量 | 用途 |
| --- | --- |
| `--sn-mp-color-background-surface` | 面板底色 |
| `--sn-mp-color-background-soft` | 标题点击态底色 |
| `--sn-mp-color-border-subtle` | 面板分割线 |
| `--sn-mp-color-text-primary` | 标题文字色 |
| `--sn-mp-color-text-secondary` | 内容与箭头文字色 |
| `--sn-mp-color-action-primary` | 展开 / 收起按钮文字色 |
| `--sn-mp-font-size-md` / `--sn-mp-font-size-sm` | 标题 / 内容字号 |
| `--sn-mp-font-line-height-normal` | 内容行高（`line-num` 收起按此计算） |
| `--sn-mp-spacing-3` / `--sn-mp-spacing-4` | 头部内边距 / 内容内边距 |

## 无障碍

- 面板头部 `role="button"`，`aria-expanded` 反映展开态，`aria-disabled` 反映禁用态，`aria-label` 取 `title`。
- 内容区 `role="region"`；收起时通过 `v-show` 隐藏，不参与朗读。
- 展开 / 收起按钮 `role="button"` 且带 `aria-expanded`。
- 移动端仅 `tap` 交互，小程序无键盘焦点概念。

## 暗色模式

`sn-collapse` 的全部颜色来自 `--sn-mp-color-*`，没有浅色 `var()` 兜底，因此在 `.sn-theme-dark` 下自动适配：面板底色切到暗色表面，分割线使用暗色边框令牌，标题转为暗色主文本、内容转为暗色次级文本。

用 sn-config-provider 的 theme 设为 dark 包裹即可验证：


## 相关

- 单元格：[`sn-cell`](/components/uni/cell)
- 标签页：[`sn-tabs`](/components/uni/tabs)
- 步骤条：[`sn-steps`](/components/uni/steps)
