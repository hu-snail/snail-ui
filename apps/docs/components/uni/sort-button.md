# SortButton 排序按钮（uni 端 / 移动端）

`sn-sort-button` 是 `@snui/uni` 的三态排序按钮：`1` 升序 / `0` 重置 / `-1` 降序。easycom 自动注册（`components/sn-sort-button/sn-sort-button.vue` → `<sn-sort-button>`），几何值使用 `rpx`。默认在升序与降序之间切换；`allowReset` 把重置纳入循环，`descFirst` 让首次点击进入降序。

## 基础用法

sn-sort-button 三态排序：1 升序 / 0 重置 / -1 降序；默认在升序与降序之间切换。

<Demo name="sort-button-mp-basic" description="sn-sort-button 三态排序：1 升序 / 0 重置 / -1 降序；默认在升序与降序之间切换。" />

## 允许重置、降序优先与下划线（`allowReset` / `descFirst` / `line`）

allowReset 把 0 纳入循环；descFirst 首次点击进入降序；line 加下划线。

<Demo name="sort-button-mp-reset-line" description="allowReset 把 0 纳入循环；descFirst 首次点击进入降序；line 加下划线。" />

## 根节点自定义类名与样式（`customClass` / `customStyle`）

`custom-class` 追加在根节点上（与 `sn-sort-button` 并列），`custom-style` 是根节点的内联样式，两者可以覆盖内边距 / 底色 / 圆角。

<Demo name="sort-button-mp-custom-style" description="customClass 追加在根节点上；customStyle 是根节点内联样式，可覆盖内边距 / 底色 / 圆角。" />

## Props

| 属性                          | 类型           | 默认值  | 说明                    |
| ----------------------------- | -------------- | ------- | ----------------------- |
| `modelValue`                  | `1 \| 0 \| -1` | `0`     | 当前排序方向            |
| `title`                       | `string`       | `''`    | 按钮文案                |
| `allowReset`                  | `boolean`      | `false` | 循环是否包含重置态      |
| `descFirst`                   | `boolean`      | `false` | 优先切换到降序          |
| `line`                        | `boolean`      | `false` | 显示下划线              |
| `customClass` / `customStyle` | `string`       | `''`    | 根节点自定义类名 / 样式 |

## Events

| 事件名              | 说明                  | 参数                    |
| ------------------- | --------------------- | ----------------------- |
| `update:modelValue` | 方向变化时            | `(value: 1 \| 0 \| -1)` |
| `change`            | 方向变化时（同 tick） | `{ value }`             |

## Slots

本组件不提供插槽。

## 主题变量

| 变量                           | 用途                     |
| ------------------------------ | ------------------------ |
| `--sn-mp-color-text-secondary` | 未激活文案               |
| `--sn-mp-color-text-tertiary`  | 未激活箭头               |
| `--sn-mp-color-action-primary` | 激活文案 / 箭头 / 下划线 |
| `--sn-mp-color-border-default` | `line` 下划线            |
| `--sn-mp-radius-md`            | 圆角                     |
| `--sn-mp-font-size-md`         | 文案字号                 |

## 无障碍

- 根节点 `role="button"`，`aria-sort` 映射为 `ascending` / `descending` / `none`，并带可聚焦的 `tabindex="0"`。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` 下文字、底板、边框与状态色自动翻转。验证方式：
