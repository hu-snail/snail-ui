# Tabs 标签页（uni 端 / 移动端）

`sn-tabs` 是 `@snui/uni`（移动端 / 小程序 / H5）的横向页签导航容器，`sn-tab` 是单个页签面板。基于 easycom 自动注册，几何值走 `rpx`，跨设备等比缩放。

## 基础用法

`v-model` 绑定激活项的索引或名称，`sn-tab` 承载标题与面板内容：

<Demo name="tabs-mp-basic" description="v-model 绑定激活索引；sn-tab 的 title 渲染页签标题，默认插槽渲染面板内容。" />

## 底部条样式与禁用页签

`line-theme` 切换底部条形态，`sticky` 让页签条吸顶，`disabled` 阻止切换并 emit `disabled`：

<Demo name="tabs-mp-line" description="line-theme=underline 下划线；sticky 吸顶；disabled 页签点击只触发 disabled 事件。" />

## 滚动导航与颜色覆盖

`slidable-num` 是开启滚动的页签数量阈值，`slidable="always"` 强制滚动，`show-scrollbar` 显示滚动条；`color` / `inactive-color` 内联覆盖文案颜色；`custom-class` / `custom-style` 落在根节点：

<Demo name="tabs-mp-scroll" description="slidable-num 阈值触发滚动；slidable=always 强制滚动；show-scrollbar 与颜色覆盖。" />

## 动画 / 手势 / 底部条尺寸

`animated` + `duration` 控制底部条过渡，`swipeable` 打开面板手势切换，`line-width` / `line-height` 设置底部条尺寸，`sticky` + `offset-top` 控制吸顶：

<Demo name="tabs-mp-animate" description="animated / duration / swipeable；line-width / line-height；sticky + offset-top；line-theme=dot 的字符串尺寸。" />

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<sn-tabs v-model="active">
  <sn-tab title="全部" :name="0">内容</sn-tab>
</sn-tabs>
```

如需显式 import：

```ts
import { SnTabs } from '@snui/uni/components/sn-tabs/sn-tabs.vue'
import { SnTab } from '@snui/uni/components/sn-tabs/sn-tab.vue'
```

## Props

### sn-tabs

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number \| string` | `0` | 当前激活项（索引或名称） |
| `slidableNum` | `number` | `6` | 自动开启滚动的标签数量阈值 |
| `mapNum` | `number` | `10` | 导航地图阈值（未实现，见下） |
| `mapTitle` | `string` | `''` | 导航地图标题（未实现，见下） |
| `sticky` | `boolean` | `false` | 是否开启粘性布局 |
| `offsetTop` | `number` | `0` | 吸顶偏移量（px） |
| `swipeable` | `boolean` | `false` | 是否开启手势滑动切换 |
| `lineTheme` | `'normal' \| 'text' \| 'underline' \| 'dot'` | `'normal'` | 底部条样式 |
| `lineWidth` | `number \| string` | `undefined` | 底部条宽度（数字按 px） |
| `lineHeight` | `number \| string` | `undefined` | 底部条高度（数字按 px） |
| `color` | `string` | `''` | 激活项文字颜色（内联覆盖） |
| `inactiveColor` | `string` | `''` | 非激活项文字颜色（内联覆盖） |
| `animated` | `boolean` | `false` | 是否开启切换动画 |
| `duration` | `number` | `300` | 动画时长（ms） |
| `slidable` | `'auto' \| 'always'` | `'auto'` | 滚动导航模式 |
| `showScrollbar` | `boolean` | `false` | 滚动时是否显示滚动条 |
| `customClass` | `string` | `''` | 根节点自定义类名 |
| `customStyle` | `string` | `''` | 根节点自定义 inline style |

### sn-tab

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | `number \| string` | `undefined` | 标签唯一标识，默认取索引 |
| `title` | `string` | `''` | 标签标题 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `lazy` | `boolean` | `true` | 是否懒加载内容（首次激活后渲染） |
| `customClass` | `string` | `''` | 根节点自定义类名 |
| `customStyle` | `string` | `''` | 根节点自定义 inline style |

> **未实现**：`mapNum` / `mapTitle` 对应 wot-ui 的导航地图浮层（需要测量每个页签宽度并渲染浮层）。uni 端保留了 prop 以维持契约一致，但当前不渲染地图；如需该能力请用 `slidable="always"` + `scroll-view` 自行实现。

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 激活项变化时触发 | `(value: number \| string)` |
| `change` | 激活项变化时触发 | `({ index, name })` |
| `click` | 点击页签标题时触发（含重复点击当前项） | `({ index, name })` |
| `disabled` | 点击禁用页签时触发 | `({ index, name })` |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default`（tabs） | 页签列表（`sn-tab` 集合） |
| `default`（tab） | 面板内容 |

## 主题变量

| 变量 | 用途 |
| --- | --- |
| `--sn-mp-color-background-surface` | 页签条与面板背景 |
| `--sn-mp-color-text-secondary` | 非激活页签文字色 |
| `--sn-mp-color-text-disabled` | 禁用页签文字色 |
| `--sn-mp-color-action-primary` | 激活页签文字色与底部条 |
| `--sn-mp-color-text-primary` | 面板正文色 |
| `--sn-mp-font-size-md` | 页签文字字号 |
| `--sn-mp-font-weight-medium` | 激活页签字重 |
| `--sn-mp-spacing-2` / `--sn-mp-spacing-4` | 页签条内边距 / 页签内边距 |
| `--sn-mp-radius-full` | 点状底部条圆角 |

## 无障碍

- 页签条 `role="tablist"`，每个页签 `role="tab"`。
- `aria-selected` 与激活态同步，`aria-disabled` 与 `disabled` 同步，`aria-label` 取 `title`。
- 面板 `role="tabpanel"`，非激活面板 `aria-hidden="true"`。
- 移动端仅 `tap` 交互，小程序无键盘焦点概念。

## 暗色模式

`sn-tabs` 的全部颜色来自 `--sn-mp-color-*`，没有浅色 `var()` 兜底，因此在 `.sn-theme-dark` 下自动适配：页签条与面板背景切到暗色表面，非激活文字转为暗色次级文本，激活项保持主色。

用 sn-config-provider 的 theme 设为 dark 包裹即可验证：


## 相关

- 分段器：[`sn-segmented`](/components/uni/segmented)
- 底部标签栏：[`sn-tabbar`](/components/uni/tabbar)
- 折叠面板：[`sn-collapse`](/components/uni/collapse)
