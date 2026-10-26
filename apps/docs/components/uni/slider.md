# Slider 滑块（uni 端 / 移动端）

`sn-slider` 是 `@snui/uni` 的滑块：单滑块或双向区间，支持竖向、胶囊主题、刻度与气泡。easycom 自动注册（`components/sn-slider/sn-slider.vue` → `<sn-slider>`），几何值使用 `rpx`，颜色全部走 `--sn-mp-*` token。轨道长度在挂载时测量一次（`onMounted` → 一次 `getBoundingClientRect`），布局变化后调用暴露的 `initSlider()` 重新测量；没有注册任何观察器或定时器，因此无需清理。

## 基础用法

sn-slider 单滑块：min / max / step 控制范围与步长，showExtremeValue 显示两端文案。

<Demo name="slider-mp-basic" description="sn-slider 单滑块：min / max / step 控制范围与步长，showExtremeValue 显示两端文案。" />

## 双向、刻度与主题（`range` / `marks` / `theme` / `disabled`）

range 双滑块返回 [start, end]；marks 支持对象形式；theme="capsule" 加粗轨道；disabled 拦掉拖动。

<Demo name="slider-mp-range-theme" description="range 双滑块返回 [start, end]；marks 支持对象形式；theme=capsule 加粗轨道；disabled 拦掉拖动。" />

## 竖排、数值气泡、轨道配色与根节点样式（`vertical` / `popoverVisible` / `activeColor` / `inactiveColor` / `customClass` / `customStyle`）

`vertical` 把轨道竖起来；`popover-visible` 取 `always` / `normal` / `never` 控制数值气泡；`active-color` / `inactive-color` 覆盖已填充 / 未填充轨道色；`custom-class` / `custom-style` 落在根节点。

<Demo name="slider-mp-vertical-popover-color" description="vertical 竖排轨道；popoverVisible 取 always / normal / never；activeColor / inactiveColor 覆盖轨道配色；customClass / customStyle 落在根节点。" />

## Props

| 属性                            | 类型                              | 默认值      | 说明                                  |
| ------------------------------- | --------------------------------- | ----------- | ------------------------------------- |
| `modelValue`                    | `number \| number[]`              | `0`         | 当前值；`range` 模式为 `[start, end]` |
| `min` / `max`                   | `number`                          | `0` / `100` | 最小 / 最大值                         |
| `step`                          | `number`                          | `1`         | 步长                                  |
| `range`                         | `boolean`                         | `false`     | 双向滑块模式                          |
| `vertical`                      | `boolean`                         | `false`     | 垂直展示                              |
| `theme`                         | `'default' \| 'capsule'`          | `'default'` | 滑块风格                              |
| `disabled`                      | `boolean`                         | `false`     | 禁用                                  |
| `showExtremeValue`              | `boolean`                         | `false`     | 显示两端极值文案                      |
| `popoverVisible`                | `'always' \| 'normal' \| 'never'` | `'normal'`  | 气泡显示模式                          |
| `marks`                         | `SliderMarks`                     | `undefined` | 刻度标记（数组或 `{ value: label }`） |
| `activeColor` / `inactiveColor` | `string`                          | `''`        | 进度条激活 / 未激活颜色               |
| `customClass` / `customStyle`   | `string`                          | `''`        | 根节点自定义类名 / 样式               |

## Events

| 事件名                               | 说明                | 参数                   |
| ------------------------------------ | ------------------- | ---------------------- |
| `update:modelValue`                  | 值变化时            | `(value: SliderValue)` |
| `change`                             | 值变化时（同 tick） | `(value: SliderValue)` |
| `dragstart` / `dragmove` / `dragend` | 拖动生命周期        | `{ value }`            |

## Exposed API

| 成员         | 签名         | 说明                       |
| ------------ | ------------ | -------------------------- |
| `initSlider` | `() => void` | 布局变化后重新测量轨道长度 |

## Slots

本组件不提供插槽。

## 主题变量

| 变量                                | 用途            |
| ----------------------------------- | --------------- |
| `--sn-mp-color-background-sunken`   | 未激活轨道      |
| `--sn-mp-color-action-primary`      | 激活轨道 / 刻度 |
| `--sn-mp-color-background-elevated` | 滑块底板        |
| `--sn-mp-color-text-primary`        | 气泡底色        |
| `--sn-mp-color-text-on-primary`     | 气泡文字        |
| `--sn-mp-color-text-tertiary`       | 极值 / 刻度文案 |
| `--sn-mp-color-border-default`      | 未激活刻度点    |
| `--sn-mp-radius-full`               | 轨道 / 滑块圆角 |
| `--sn-mp-shadow-sm`                 | 滑块阴影        |

## 无障碍

- 轨道 `role="slider"`，带 `aria-valuemin` / `aria-valuemax` / `aria-valuenow` / `aria-orientation` / `aria-disabled`。
- 每个滑块为 `role="button"`，`aria-label` 携带当前值；禁用时 `tabindex="-1"`。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` / `page.sn-theme-dark` 下文字、底板、边框与状态色自动翻转。验证方式：
