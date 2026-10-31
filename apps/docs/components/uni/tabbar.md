# Tabbar 标签栏（uni 端 / 移动端）

`sn-tabbar` 是 `@snui/uni`（移动端 / 小程序 / H5）的底部标签栏，`sn-tabbar-item` 是单个标签项。基于 easycom 自动注册，几何值走 `rpx`，跨设备等比缩放。

## 基础用法

`v-model` 绑定激活项的索引或名称，`sn-tabbar-item` 承载图标与文案：

<Demo name="tabbar-mp-basic" description="v-model 绑定索引；icon 经图标注册表解析；bordered 顶部边框。" />

## 徽标与形状

`value` 显示数字徽标（超过 `max` 显示 `99+`），`is-dot` 显示点状徽标，`shape="round"` 切换圆形样式：

<Demo name="tabbar-mp-badge" description="value 数字徽标；is-dot 点状徽标；max 上限；shape=round 圆形标签栏。" />

## 固定底部与安全区

`fixed` 把标签栏贴到页面底部，`placeholder` 生成等高占位，`safe-area-inset-bottom` 补底部安全区，`z-index` 决定层级：

<Demo name="tabbar-mp-fixed" description="fixed + placeholder + safe-area-inset-bottom + z-index 的固定底部标签栏。" />

## 颜色覆盖与 name 取值

`active-color` / `inactive-color` 内联覆盖整项颜色（图标描边经 `currentColor` 与文字一并解析）；子项传 `name` 时以 `name` 为值，否则用注册索引：

<Demo name="tabbar-mp-color" description="active-color / inactive-color 颜色覆盖；索引取值与 name 取值两种 v-model 写法。" />

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<sn-tabbar v-model="active">
  <sn-tabbar-item title="首页" icon="Home" />
</sn-tabbar>
```

如需显式 import：

```ts
import { SnTabbar } from '@snui/uni/components/sn-tabbar/sn-tabbar.vue';
import { SnTabbarItem } from '@snui/uni/components/sn-tabbar/sn-tabbar-item.vue';
```

## Props

### sn-tabbar

| 属性                  | 类型                                     | 默认值      | 说明                                |
| --------------------- | ---------------------------------------- | ----------- | ----------------------------------- |
| `modelValue`          | `number \| string`                       | `0`         | 选中标签的索引值或名称              |
| `fixed`               | `boolean`                                | `false`     | 是否固定在底部                      |
| `bordered`            | `boolean`                                | `false`     | 是否显示顶部边框                    |
| `safeAreaInsetBottom` | `boolean`                                | `false`     | 是否设置底部安全区                  |
| `shape`               | `'default' \| 'round'`                   | `'default'` | 标签栏形状                          |
| `activeColor`         | `string`                                 | `''`        | 激活标签颜色（图标 + 文字，空 = 令牌默认） |
| `inactiveColor`       | `string`                                 | `''`        | 未激活标签颜色（图标 + 文字，空 = 令牌默认） |
| `placeholder`         | `boolean`                                | `false`     | 固定时是否生成等高占位元素          |
| `zIndex`              | `number`                                 | `10`        | 组件层级（仅在 `fixed` 时写入）     |
| `beforeChange`        | `(value) => boolean \| Promise<boolean>` | `undefined` | 切换前钩子，返回 `false` 可阻止切换 |
| `customClass`         | `string`                                 | `''`        | 根节点自定义类名                    |
| `customStyle`         | `string`                                 | `''`        | 根节点自定义 inline style           |

### sn-tabbar-item

| 属性          | 类型                | 默认值      | 说明                                      |
| ------------- | ------------------- | ----------- | ----------------------------------------- |
| `title`       | `string`            | `''`        | 标签页标题                                |
| `name`        | `number \| string`  | `undefined` | 唯一标识符，不传时使用索引值              |
| `icon`        | `string`            | `''`        | 图标名称（经 `registerSnIcons()` 注册）   |
| `iconPrefix`  | `string`            | `''`        | 字体图标类名前缀                          |
| `cssIcon`     | `boolean \| string` | `false`     | 渲染字体图标；字符串值直接作为 class 前缀 |
| `value`       | `number \| string`  | `undefined` | 徽标显示值                                |
| `isDot`       | `boolean`           | `false`     | 是否显示点状徽标                          |
| `max`         | `number`            | `99`        | 徽标最大值，超过显示 `{max}+`             |
| `customClass` | `string`            | `''`        | 根节点自定义类名                          |
| `customStyle` | `string`            | `''`        | 根节点自定义 inline style                 |

## Events

| 事件名              | 说明             | 参数                        |
| ------------------- | ---------------- | --------------------------- |
| `update:modelValue` | 激活值变化时触发 | `(value: number \| string)` |
| `change`            | 激活值变化时触发 | `({ value })`               |

## Slots

| 插槽名              | 说明                                      |
| ------------------- | ----------------------------------------- |
| `default`（tabbar） | TabbarItem 列表                           |
| `default`（item）   | 自定义整个标签项内容，作用域 `{ active }` |
| `icon`（item）      | 自定义图标，作用域 `{ active }`           |

## 主题变量

| 变量                                        | 用途                |
| ------------------------------------------- | ------------------- |
| `--sn-mp-color-background-surface`          | 标签栏背景          |
| `--sn-mp-color-border-subtle`               | 顶部边框            |
| `--sn-mp-color-text-secondary`              | 未激活文字色        |
| `--sn-mp-color-action-primary`              | 激活文字色          |
| `--sn-mp-color-feedback-danger`             | 徽标填充            |
| `--sn-mp-color-text-on-primary`             | 徽标文字色          |
| `--sn-mp-icon-size-large`                   | 字体图标尺寸        |
| `--sn-mp-font-size-xs`                      | 文案 / 徽标字号     |
| `--sn-mp-radius-full` / `--sn-mp-spacing-1` | 胶囊圆角 / 图标间距 |
| `--sn-mp-shadow-md`                         | `round` 形状阴影    |

## 无障碍

- 标签栏根节点 `role="tablist"`，每个标签项 `role="tab"`。
- `aria-selected` 与激活态同步，`aria-label` 取 `title`。
- 徽标是标签内的装饰文本，语义由标签文案承担。
- 移动端仅 `tap` 交互，小程序无键盘焦点概念。

## 暗色模式

`sn-tabbar` 的全部颜色来自 `--sn-mp-color-*`，没有浅色 `var()` 兜底，因此在 `.sn-theme-dark` 下自动适配：背景与顶部边框切到暗色令牌，激活 / 未激活文字色保持主色与次级文本色，徽标红在暗色下依旧可识别。

用 sn-config-provider 的 theme 设为 dark 包裹即可验证：

## 相关

- 顶部导航：[`sn-navbar`](/components/uni/navbar)
- 分段器：[`sn-segmented`](/components/uni/segmented)
