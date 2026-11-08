# Tabs 标签页（uni 端 / 移动端）

`sn-tabs` 是 `@snui/uni`（移动端 / 小程序 / H5）的横向页签导航容器，`sn-tab` 是单个页签面板。基于 easycom 自动注册，几何值走 `rpx`，跨设备等比缩放。

## 何时使用

- 同一区域承载多组平级内容，需要横向切换（订单状态、频道、统计周期）。
- 页签数量超过一屏，需要横向滚动并让选中项自动滑入可视区。
- 需要卡片分段 / 胶囊标签等形态，或需要页签图标与角标。
- 需要在内容区用左右滑动手势切页。

## 基础用法

`v-model` 绑定激活项的索引或名称，`sn-tab` 承载标题与面板内容：

<Demo name="tabs-mp-basic" description="v-model 绑定索引或名称两种写法；sn-tab 的 title 渲染页签标题，默认插槽渲染面板内容。" />

## 导航形态与选中态

`type` 控制导航条形态（`line` 下划线 / `card` 卡片分段 / `tag` 独立胶囊），`active-theme` 控制选中项强调方式（`text` 仅文字 / `fill` 浅色圆角底 / `pill` 实心胶囊底），两者可自由组合：

<Demo name="tabs-mp-type" description="type=line/card/tag 三种形态；active-theme=text/fill/pill 三种选中态；形态与选中态可任意组合。" />

## 页签图标与角标

`sn-tab` 的 `icon` 接图标数据或已注册 / 内置图标名，`icon-image` 接图片地址且优先于 `icon`；`badge-props` 透传给 `sn-badge` 渲染数字 / 点状角标：

<Demo name="tabs-mp-icon" description="icon 传图标数据与图标名两种写法；badge-props 的数字角标、溢出上限、点状角标与语义色。" />

## 角标配置

`badge-props` 的完整配置：`value` / `max` / `isDot` / `type` / `showZero` / `hidden` / `shape` / `border` / `top` / `right`：

<Demo name="tabs-mp-badge" description="数字角标与语义色；点状角标、零值显示与隐藏；按钮可实时改配置验证联动。" />

## 底部条样式与禁用页签

`line-theme` 切换底部条形态，`line-width` / `line-height` 覆盖尺寸，`sticky` 让页签条吸顶，`disabled` 阻止切换并 emit `disabled`：

<Demo name="tabs-mp-line" description="line-theme=normal/underline/dot 三种底部条；line-width/line-height 覆盖尺寸；sticky + offset-top；disabled 页签点击只触发 disabled 事件。" />

## 滚动导航与自动滑出

`slidable-num` 是开启滚动的页签数量阈值，`slidable="always"` 强制滚动，`show-scrollbar` 显示滚动条；选中项（点击或外部改值）通过 `scroll-into-view` 自动滚进可视区，`animated` 时该滚动带过渡：

<Demo name="tabs-mp-scroll" description="slidable-num 阈值触发滚动；slidable=always 强制滚动；选中项自动滑入可视区（外部改值同样生效）。" />

## 内容区滑动

`swipeable` 把内容区换成原生 `swiper`：手势横滑切页，每个 `sn-tab` 渲染为 `swiper-item`；`duration` 同时是滑动时长，`swiper-easing` 配置缓动，`swiper-height` 给内容区定高。滑到禁用页签会弹回：

<Demo name="tabs-mp-swiper" description="swipeable 原生 swiper 内容区；duration / swiper-easing / swiper-height；滑到禁用页签弹回。" />

## 与分页列表组合

面板内容由宿主提供，`sn-tabs` 只渲染导航条与面板容器，所以面板里可以直接放 `sn-paging`；`sn-tab` 默认 `lazy`，首次激活才挂载面板，分页列表的首次请求也随之推迟到首次切页：

<Demo name="tabs-mp-paging" description="每个页签面板承载一个 sn-paging 列表；下拉刷新 / 触底翻页；懒加载面板让首次请求跟随首次切页。" />

## 切换动画与吸顶

`animated` + `duration` 控制底部条过渡与滚动动画，`sticky` + `offset-top` 控制吸顶：

<Demo name="tabs-mp-animate" description="animated / duration；sticky + offset-top；line-width / line-height 内联尺寸。" />

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<sn-tabs v-model="active">
  <sn-tab title="全部" :name="0">内容</sn-tab>
</sn-tabs>
```

如需显式 import：

```ts
import { SnTabs } from '@snui/uni/components/sn-tabs/sn-tabs.vue';
import { SnTab } from '@snui/uni/components/sn-tabs/sn-tab.vue';
```

## Props

### sn-tabs

| 属性            | 类型                                                                           | 默认值      | 说明                                                        |
| --------------- | ------------------------------------------------------------------------------ | ----------- | ----------------------------------------------------------- |
| `modelValue`    | `number \| string`                                                             | `0`         | 当前激活项（索引或名称）                                    |
| `slidableNum`   | `number`                                                                       | `6`         | 自动开启滚动的标签数量阈值                                  |
| `mapNum`        | `number`                                                                       | `10`        | 导航地图阈值（未实现，见下）                                |
| `mapTitle`      | `string`                                                                       | `''`        | 导航地图标题（未实现，见下）                                |
| `sticky`        | `boolean`                                                                      | `false`     | 是否开启粘性布局                                            |
| `offsetTop`     | `number`                                                                       | `0`         | 吸顶偏移量（px）                                            |
| `swipeable`     | `boolean`                                                                      | `false`     | 是否开启手势滑动切换（内容区渲染为原生 `swiper`）           |
| `lineTheme`     | `'normal' \| 'text' \| 'underline' \| 'dot'`                                   | `'normal'`  | 底部条样式                                                  |
| `lineWidth`     | `number \| string`                                                             | `undefined` | 底部条宽度（数字按 px）                                     |
| `lineHeight`    | `number \| string`                                                             | `undefined` | 底部条高度（数字按 px）                                     |
| `color`         | `string`                                                                       | `''`        | 激活项文字颜色（内联覆盖）                                  |
| `inactiveColor` | `string`                                                                       | `''`        | 非激活项文字颜色（内联覆盖）                                |
| `animated`      | `boolean`                                                                      | `false`     | 是否开启切换动画（同时打开导航条滚动过渡）                  |
| `duration`      | `number`                                                                       | `300`       | 动画时长（ms）；swiper 模式下同时是内容区滑动时长           |
| `slidable`      | `'auto' \| 'always'`                                                           | `'auto'`    | 滚动导航模式                                                |
| `showScrollbar` | `boolean`                                                                      | `false`     | 滚动时是否显示滚动条                                        |
| `type`          | `'line' \| 'card' \| 'tag'`                                                    | `'line'`    | 导航形态：下划线 / 卡片分段 / 独立胶囊                      |
| `activeTheme`   | `'text' \| 'fill' \| 'pill'`                                                   | `'text'`    | 选中态强调：仅文字 / 浅色圆角底 / 实心胶囊底                |
| `swiperEasing`  | `'default' \| 'linear' \| 'easeInCubic' \| 'easeOutCubic' \| 'easeInOutCubic'` | `'default'` | 内容区 swiper 缓动（仅 `swipeable` 生效，`default` 不下发） |
| `swiperHeight`  | `number \| string`                                                             | `''`        | 内容区 swiper 高度（数字按 px，字符串原样转发）             |
| `customClass`   | `string`                                                                       | `''`        | 根节点自定义类名                                            |
| `customStyle`   | `string`                                                                       | `''`        | 根节点自定义 inline style                                   |

### sn-tab

| 属性          | 类型                 | 默认值      | 说明                                                |
| ------------- | -------------------- | ----------- | --------------------------------------------------- |
| `name`        | `number \| string`   | `undefined` | 标签唯一标识，默认取索引                            |
| `title`       | `string`             | `''`        | 标签标题                                            |
| `disabled`    | `boolean`            | `false`     | 是否禁用                                            |
| `lazy`        | `boolean`            | `true`      | 是否懒加载内容（首次激活后渲染）                    |
| `icon`        | `IconData \| string` | `undefined` | 标题左侧图标：图标数据或已注册 / 内置图标名         |
| `iconImage`   | `string`             | `''`        | 标题左侧图标图片地址（URL / base64），优先于 `icon` |
| `badgeProps`  | `object`             | `undefined` | 标题角标配置，透传 `sn-badge`（见下表）             |
| `customClass` | `string`             | `''`        | 根节点自定义类名                                    |
| `customStyle` | `string`             | `''`        | 根节点自定义 inline style                           |

`badgeProps` 支持的字段：

| 字段                          | 类型                                                        | 说明                                   |
| ----------------------------- | ----------------------------------------------------------- | -------------------------------------- |
| `value`                       | `string \| number`                                          | 显示值；数字超过 `max` 时显示 `{max}+` |
| `max`                         | `number`                                                    | 数字上限                               |
| `isDot`                       | `boolean`                                                   | 只画点，不显示数值                     |
| `hidden`                      | `boolean`                                                   | 隐藏角标（内容照常渲染）               |
| `type`                        | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | 语义色，缺省为危险红                   |
| `bgColor`                     | `string`                                                    | 背景色内联覆盖                         |
| `showZero`                    | `boolean`                                                   | `0` 也渲染（默认不显示）               |
| `shape`                       | `'circle' \| 'square' \| 'bubble'`                          | 角标形状                               |
| `border`                      | `boolean`                                                   | 显示与背景同色的分隔环                 |
| `top`                         | `string \| number`                                          | 纵向偏移（数字按 px）                  |
| `right`                       | `string \| number`                                          | 横向偏移（数字按 px）                  |
| `customClass` / `customStyle` | `string`                                                    | 角标根节点转发                         |

> **未实现**：`mapNum` / `mapTitle` 对应导航地图浮层（需要测量每个页签宽度并渲染浮层）。uni 端保留了 prop 以维持契约一致，但当前不渲染地图；如需该能力请用 `slidable="always"` + `scroll-view` 自行实现。

## Events

| 事件名              | 说明                                   | 参数                        |
| ------------------- | -------------------------------------- | --------------------------- |
| `update:modelValue` | 激活项变化时触发                       | `(value: number \| string)` |
| `change`            | 激活项变化时触发                       | `({ index, name })`         |
| `click`             | 点击页签标题时触发（含重复点击当前项） | `({ index, name })`         |
| `disabled`          | 点击禁用页签时触发                     | `({ index, name })`         |

## Methods

| 方法名        | 类型                                | 说明                     |
| ------------- | ----------------------------------- | ------------------------ |
| `setActive`   | `(value: number \| string) => void` | 设置激活项（不触发事件） |
| `activeIndex` | `number`                            | 当前激活项索引           |

## Slots

| 插槽名            | 说明                      |
| ----------------- | ------------------------- |
| `default`（tabs） | 页签列表（`sn-tab` 集合） |
| `default`（tab）  | 面板内容                  |

## 主题变量

| 变量                                                              | 用途                             |
| ----------------------------------------------------------------- | -------------------------------- |
| `--sn-mp-color-background-surface`                                | 页签条与面板背景                 |
| `--sn-mp-color-background-subtle`                                 | 卡片分段的容器底色               |
| `--sn-mp-color-border-default`                                    | 卡片分段 / 胶囊标签描边          |
| `--sn-mp-color-text-secondary`                                    | 非激活页签文字色                 |
| `--sn-mp-color-text-disabled`                                     | 禁用页签文字色                   |
| `--sn-mp-color-text-on-primary`                                   | 胶囊选中态文字反色               |
| `--sn-mp-color-action-primary`                                    | 激活页签文字色与底部条           |
| `--sn-mp-color-action-primary-soft`                               | 浅色选中底（`activeTheme=fill`） |
| `--sn-mp-color-text-primary`                                      | 面板正文色                       |
| `--sn-mp-font-size-md`                                            | 页签文字字号                     |
| `--sn-mp-font-weight-medium`                                      | 激活页签字重                     |
| `--sn-mp-spacing-1` ~ `--sn-mp-spacing-4`                         | 页签内边距与图标间距             |
| `--sn-mp-radius-sm` / `--sn-mp-radius-md` / `--sn-mp-radius-full` | 卡片 / 胶囊圆角，点状底部条      |
| `--sn-mp-icon-size-small`                                         | 页签图标尺寸                     |

## 无障碍

- 页签条 `role="tablist"`，每个页签 `role="tab"`。
- `aria-selected` 与激活态同步，`aria-disabled` 与 `disabled` 同步，`aria-label` 取 `title`。
- 面板 `role="tabpanel"`，非激活面板 `aria-hidden="true"`。
- 图标与角标标记 `aria-hidden`，不进入可访问名称。
- 移动端仅 `tap` 交互，小程序无键盘焦点概念。

## 暗色模式

`sn-tabs` 的全部颜色来自 `--sn-mp-color-*`，没有浅色 `var()` 兜底，因此在 `.sn-theme-dark` 下自动适配：页签条与面板背景切到暗色表面，非激活文字转为暗色次级文本，激活项保持主色，卡片分段容器与胶囊描边跟随暗色边框。

用 `sn-config-provider` 的 `theme` 设为 `dark` 包裹即可验证。

## 相关

- 分段器：[`sn-segmented`](/components/uni/segmented)
- 底部标签栏：[`sn-tabbar`](/components/uni/tabbar)
- 折叠面板：[`sn-collapse`](/components/uni/collapse)
