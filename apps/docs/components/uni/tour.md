# Tour 漫游式引导（uni 端 / 移动端）

`sn-tour` 是 `@snui/uni`（移动端 / 小程序 / H5）的分步功能引导。基于 easycom 自动注册，几何值走 `rpx`，跨设备等比缩放。

## 基础用法

`v-model` 控制显隐，`v-model:current` 控制当前步骤，`steps` 提供步骤内容：

<Demo name="tour-mp-basic" description="v-model 控制显隐；v-model:current 控制步骤索引；steps 提供步骤内容；最后一步按钮变为「完成」。" />

## 自定义文案与遮罩点击

`clickMaskNext` 让点击遮罩进入下一步；四个按钮文案均可自定义：

<Demo name="tour-mp-custom" description="clickMaskNext 点击遮罩前进；prev-text / next-text / skip-text / finish-text 自定义按钮文案；border-radius 调整面板圆角。" />

## 蒙版开关与自定义面板

`mask=false` 去掉蒙层，`mask-color` 覆盖蒙版色，`duration` 控制动画时长，`show-tour-buttons=false` 后改用 `footer` 插槽，默认插槽作用域可自定义面板正文：

<Demo name="tour-mp-mask" description="mask=false 无蒙层；mask-color / duration / z-index；show-tour-buttons=false + footer 插槽自定义操作区。" />

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<sn-tour v-model="visible" v-model:current="current" :steps="steps" />
```

如需显式 import：

```ts
import { SnTour } from '@snui/uni/components/sn-tour/sn-tour.vue';
```

## Props

| 属性                 | 类型                         | 默认值      | 说明                                 |
| -------------------- | ---------------------------- | ----------- | ------------------------------------ |
| `modelValue`         | `boolean`                    | `false`     | 是否显示引导组件                     |
| `steps`              | `TourStep[]`                 | `[]`        | 引导步骤列表                         |
| `current`            | `number`                     | `0`         | 当前步骤索引                         |
| `mask`               | `boolean`                    | `true`      | 是否显示蒙版                         |
| `maskColor`          | `string`                     | `''`        | 蒙版颜色（内联覆盖）                 |
| `offset`             | `number`                     | `20`        | 面板与高亮区域的间距（未实现，见下） |
| `duration`           | `number`                     | `300`       | 动画时长（ms）                       |
| `borderRadius`       | `number`                     | `4`         | 高亮区域圆角                         |
| `padding`            | `number`                     | `8`         | 高亮区域内边距（未实现，见下）       |
| `prevText`           | `string`                     | `'上一步'`  | 上一步按钮文案                       |
| `nextText`           | `string`                     | `'下一步'`  | 下一步按钮文案                       |
| `skipText`           | `string`                     | `'跳过'`    | 跳过按钮文案                         |
| `finishText`         | `string`                     | `'完成'`    | 完成按钮文案                         |
| `bottomSafetyOffset` | `number`                     | `100`       | 底部安全偏移量（未实现，见下）       |
| `topSafetyOffset`    | `number`                     | `0`         | 顶部安全偏移量（未实现，见下）       |
| `customNav`          | `boolean`                    | `false`     | 自定义导航栏模式（未实现，见下）     |
| `clickMaskNext`      | `boolean`                    | `false`     | 点击遮罩层是否进入下一步             |
| `highlightStyle`     | `Record<string, string>`     | `{}`        | 默认高亮区域样式（未实现，见下）     |
| `zIndex`             | `number`                     | `undefined` | 层级                                 |
| `showTourButtons`    | `boolean`                    | `true`      | 是否显示引导按钮                     |
| `missingStrategy`    | `'skip' \| 'stop' \| 'hide'` | `'stop'`    | 目标缺失策略（未实现，见下）         |
| `customClass`        | `string`                     | `''`        | 根节点自定义类名                     |
| `customStyle`        | `string`                     | `''`        | 根节点自定义 inline style            |

`TourStep` 结构：`{ element?: string, content?: string, padding?: number, offset?: number, placement?: 'auto' | 'top' | 'bottom' | 'left' | 'right' }`。

> **未实现**：`element` / `padding` / `offset` / `placement` / `highlightStyle` / `missingStrategy` / `topSafetyOffset` / `bottomSafetyOffset` / `customNav` 都依赖对目标 DOM 元素的同步测量（`getBoundingClientRect` / `uni.createSelectorQuery`）。uni 端各宿主没有统一可用的同步测量 API，测错会得到一个指向空处的挖孔，比不挖更糟。因此 uni 实现渲染蒙版 + 居中面板，并把步骤数据通过默认插槽交给宿主；能测量（H5 / App）的宿主可以自行定位高亮区。prop 保留以维持契约一致，文档标注「未实现」。

## Events

| 事件名              | 说明                   | 参数                                                |
| ------------------- | ---------------------- | --------------------------------------------------- |
| `update:modelValue` | 显隐状态变化时触发     | `(value: boolean)`                                  |
| `update:current`    | 当前步骤变化时触发     | `(value: number)`                                   |
| `change`            | 当前步骤变化时触发     | `({ current })`                                     |
| `prev`              | 点击上一步时触发       | `({ prevCurrent, current, total, isElementInTop })` |
| `next`              | 点击下一步时触发       | `({ prevCurrent, current, total, isElementInTop })` |
| `finish`            | 点击完成时触发         | `({ current, total })`                              |
| `skip`              | 点击跳过时触发         | `({ current, total })`                              |
| `error`             | 目标元素查询失败时触发 | `({ message, element })`                            |

## Slots

| 插槽名    | 说明                                              |
| --------- | ------------------------------------------------- |
| `default` | 自定义面板内容，作用域 `{ step, current, total }` |
| `footer`  | 自定义底部操作区，作用域同上                      |

## 主题变量

| 变量                                            | 用途                  |
| ----------------------------------------------- | --------------------- |
| `--sn-mp-color-background-overlay`              | 蒙版底色              |
| `--sn-mp-color-background-elevated`             | 面板底色              |
| `--sn-mp-color-background-surface`              | 按钮底色              |
| `--sn-mp-color-border-default`                  | 次要按钮描边          |
| `--sn-mp-color-text-primary`                    | 正文与次要按钮文字色  |
| `--sn-mp-color-text-secondary`                  | 跳过按钮文字色        |
| `--sn-mp-color-text-tertiary`                   | 进度文字色            |
| `--sn-mp-color-action-primary`                  | 主按钮底色            |
| `--sn-mp-color-text-on-primary`                 | 主按钮文字色          |
| `--sn-mp-shadow-lg`                             | 面板投影              |
| `--sn-mp-font-size-md` / `--sn-mp-font-size-sm` | 正文 / 按钮字号       |
| `--sn-mp-radius-md`                             | 按钮圆角              |
| `--sn-mp-spacing-3` / `--sn-mp-spacing-4`       | 面板间距 / 面板内边距 |

## 无障碍

- 根节点 `role="dialog"` 且 `aria-modal="true"`，带 `aria-label="Guide"`。
- 三个按钮均为 `role="button"`，`aria-label` 取对应文案；最后一步的按钮文案切为 `finishText`。
- 进度指示为 `aria-hidden="true"`，不参与朗读。
- 移动端仅 `tap` 交互，小程序无键盘焦点概念。

## 暗色模式

`sn-tour` 的全部颜色来自 `--sn-mp-color-*`，没有浅色 `var()` 兜底，因此在 `.sn-theme-dark` 下自动适配：面板底色切到暗色 elevated 表面，蒙版在暗色下保持半透明近黑，主按钮保持主色填充与白色文字。

用 sn-config-provider 的 theme 设为 dark 包裹即可验证：

## 相关

- 弹出层：[`sn-popup`](/components/uni/popup)
- 遮罩：[`sn-overlay`](/components/uni/overlay)
