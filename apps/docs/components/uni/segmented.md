# Segmented 分段器（uni 端 / 移动端）

`sn-segmented` 是 `@snui/uni`（移动端 / 小程序 / H5）的分段控制器，用于在少量互斥选项间切换。基于 easycom 自动注册，几何值走 `rpx`，跨设备等比缩放。

## 基础用法

`v-model` 绑定选中值，`options` 接受 `string[]` / `number[]` / 对象数组：

<Demo name="segmented-mp-basic" description="v-model 绑定选中值；options 传字符串数组，标签自动取 String(value)。" />

## 主题与禁用

`theme="outline"` 切换轮廓风格；选项级 `disabled` 与整体 `disabled` 都会拦住点击：

<Demo name="segmented-mp-theme" description="theme=outline 轮廓风格；对象选项自定义 label；整体 disabled 禁用整个分段器。" />

## wot-ui `value` 写法

`value` 是 wot-ui 的选中值叫法，本组件叫 `modelValue`；两者都接受，同时传入时 `value` 优先，方便从 wd-segmented 直接迁移。事件名保持 `update:modelValue`：

<Demo name="segmented-mp-value" description="`:value` 别名 + `@update:model-value` 展开写法；value 优先于 model-value；vibrate-short 短振动。" />

## 事件名差异与根节点样式

**prop 名对齐了，事件名没有**：`value` 别名接受 wot-ui 的写法，但组件只 emit `update:modelValue`，wot-ui 风格的 `@update:value` 永远不会被调用 —— 标签会切换（组件内部状态），父组件的 ref 不会更新。迁移时把 `@update:value` 改成 `@update:model-value`（或直接用 `v-model`）。`customClass` / `customStyle` 都落在根节点，后者会覆盖组件自己的底色 / 圆角。

<Demo name="segmented-mp-value-alias" description="`:value` + `@update:value`（不同步）与 `@update:model-value`（同步）对比；customClass 外框；customStyle 覆盖底色与圆角。" />

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<sn-segmented v-model="period" :options="['day', 'week', 'month']" />
```

如需显式 import：

```ts
import { SnSegmented } from '@snui/uni/components/sn-segmented/sn-segmented.vue';
```

## Props

| 属性           | 类型                                        | 默认值      | 说明                                                    |
| -------------- | ------------------------------------------- | ----------- | ------------------------------------------------------- |
| `modelValue`   | `string \| number`                          | `undefined` | 当前选中的值                                            |
| `value`        | `string \| number`                          | `undefined` | wot-ui 写法的选中值别名；与 `modelValue` 同时传入时优先 |
| `disabled`     | `boolean`                                   | `false`     | 是否禁用分段器                                          |
| `options`      | `string[] \| number[] \| SegmentedOption[]` | `[]`        | 数据集合                                                |
| `theme`        | `'card' \| 'outline'`                       | `'card'`    | 分段器主题                                              |
| `vibrateShort` | `boolean`                                   | `false`     | 切换时是否触发短振动                                    |
| `customClass`  | `string`                                    | `''`        | 根节点自定义类名                                        |
| `customStyle`  | `string`                                    | `''`        | 根节点自定义 inline style                               |

`SegmentedOption` 结构：`{ value: string | number, label?: string, disabled?: boolean, payload?: unknown }`。

## Events

| 事件名              | 说明                               | 参数                        |
| ------------------- | ---------------------------------- | --------------------------- |
| `update:modelValue` | 选中值变化时触发                   | `(value: string \| number)` |
| `change`            | 选项切换时触发                     | `(option: SegmentedOption)` |
| `click`             | 选项点击时触发（含重复点击当前项） | `(option: SegmentedOption)` |

## Slots

| 插槽名  | 说明                                    |
| ------- | --------------------------------------- |
| `label` | 自定义选项标签内容，作用域 `{ option }` |

## 主题变量

| 变量                                      | 用途                          |
| ----------------------------------------- | ----------------------------- |
| `--sn-mp-color-background-subtle`         | `card` 主题的轨道底色         |
| `--sn-mp-color-background-surface`        | 滑块与 `card` 选项底色        |
| `--sn-mp-color-border-default`            | `outline` 主题的边框与分隔线  |
| `--sn-mp-color-text-secondary`            | 非选中项文字色                |
| `--sn-mp-color-text-disabled`             | 禁用项文字色                  |
| `--sn-mp-color-action-primary`            | 选中项文字色与 `outline` 填充 |
| `--sn-mp-color-text-on-primary`           | `outline` 选中项文字色        |
| `--sn-mp-font-size-md`                    | 选项文字字号                  |
| `--sn-mp-font-weight-medium`              | 选中项字重                    |
| `--sn-mp-radius-md` / `--sn-mp-radius-sm` | 轨道 / 滑块圆角               |
| `--sn-mp-spacing-1` / `--sn-mp-spacing-3` | 轨道内边距 / 选项内边距       |

## 无障碍

- 根节点 `role="group"`，每个选项 `role="button"`。
- `aria-pressed` 反映选中态，`aria-disabled` 反映禁用态（选项级与整体级合并）。
- 短振动调用 `uni.vibrateShort`，H5 与部分宿主不支持时静默跳过，不影响点击。
- 移动端仅 `tap` 交互，小程序无键盘焦点概念。

## 暗色模式

`sn-segmented` 的全部颜色来自 `--sn-mp-color-*`，没有浅色 `var()` 兜底，因此在 `.sn-theme-dark` 下自动适配：轨道底色切换为暗色 subtle 表面，滑块为暗色 elevated 表面，选中文字保持主色，`outline` 主题的填充色不变（主色本身在暗色下仍可识别）。

用 sn-config-provider 的 theme 设为 dark 包裹即可验证：

## 相关

- 标签页：[`sn-tabs`](/components/uni/tabs)
- 侧边导航：[`sn-sidebar`](/components/uni/sidebar)
- 单选组：[`sn-radio`](/components/uni/radio)
