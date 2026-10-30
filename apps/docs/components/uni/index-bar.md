# IndexBar 索引栏（uni 端 / 移动端）

`sn-index-bar` 是 `@snui/uni`（移动端 / 小程序 / H5）的字母索引列表容器，`sn-index-anchor` 是单个索引分组。基于 easycom 自动注册，几何值走 `rpx`，跨设备等比缩放。

## 基础用法

每个 `sn-index-anchor` 的 `index` 会同时成为右侧索引项与该分组的标题，点击索引项即滚动到对应分组：

<Demo name="index-bar-mp-basic" description="sn-index-anchor 的 index 生成右侧索引项；点击索引项跳转到对应分组；sticky 开启吸顶。" />

## 自定义内容与 change 联动

分组内容完全自定义，`change` 事件给出当前激活索引：

<Demo name="index-bar-mp-custom" description="分组内容自定义；change 事件透出当前索引；不开启 sticky 时随列表滚动。" />

## scrollTo 方法与自定义样式

模板 ref 上的 `scrollTo(index)` 可从代码跳转到某个分组（同时 emit `change`）；`custom-class` / `custom-style` 落在根节点：

<Demo name="index-bar-mp-scrollto" description="scrollTo(index) 从代码跳转分组；custom-class / custom-style 自定义根节点。" />

## 整页通讯录

完整通讯录场景：顶部搜索栏按关键字过滤（空分组自动丢弃，索引栏随分组联动），每行联系人头像用 `sn-avatar` 文字头像（颜色由姓名哈希稳定映射到 token 色板）；`show-indicator` 在列表中央回显当前索引字母，`anchor-id` 给分组稳定的 DOM id 以便深链定位：

<Demo name="index-bar-mp-contacts" description="整页通讯录：内置 Search 图标 + 搜索过滤；sn-avatar 文字头像；show-indicator 中央索引气泡；anchor-id 稳定分组 id。" />

> **契约位**：`sticky` 当前只在根节点切换 `sn-index-bar--sticky` 类，没有配套的样式规则，因此页面上看不出差异。该 prop 保留以维持契约一致。

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<sn-index-bar sticky>
  <sn-index-anchor index="A">…</sn-index-anchor>
</sn-index-bar>
```

如需显式 import：

```ts
import { SnIndexBar } from '@snui/uni/components/sn-index-bar/sn-index-bar.vue';
import { SnIndexAnchor } from '@snui/uni/components/sn-index-bar/sn-index-anchor.vue';
```

## Props

### sn-index-bar

| 属性            | 类型      | 默认值  | 说明                                    |
| --------------- | --------- | ------- | --------------------------------------- |
| `sticky`        | `boolean` | `false` | 索引是否吸顶                            |
| `showIndicator` | `boolean` | `false` | 是否在列表视口中央显示当前索引提示气泡  |
| `customClass`   | `string`  | `''`    | 根节点自定义类名                        |
| `customStyle`   | `string`  | `''`    | 根节点自定义 inline style               |

### sn-index-anchor

| 属性          | 类型               | 默认值 | 说明                                    |
| ------------- | ------------------ | ------ | --------------------------------------- |
| `index`       | `string \| number` | `''`   | 索引字符                                |
| `anchorId`    | `string`           | `''`   | 自定义锚点 DOM id（为空时用内部生成值） |
| `customClass` | `string`           | `''`   | 根节点自定义类名                        |
| `customStyle` | `string`           | `''`   | 根节点自定义 inline style               |

## Events

| 事件名   | 说明               | 参数          |
| -------- | ------------------ | ------------- |
| `change` | 激活索引变化时触发 | `({ index })` |

## Slots

| 插槽名                 | 说明                                   |
| ---------------------- | -------------------------------------- |
| `default`（index-bar） | 索引列表内容（`sn-index-anchor` 集合） |
| `default`（anchor）    | 该索引下的条目内容                     |

## 主题变量

| 变量                                            | 用途                           |
| ----------------------------------------------- | ------------------------------ |
| `--sn-mp-color-background-surface`              | 列表与条目底色                 |
| `--sn-mp-color-background-soft`                 | 分组标题底色                   |
| `--sn-mp-color-action-primary-soft`             | 激活分组标题底色               |
| `--sn-mp-color-text-secondary`                  | 索引项与分组标题文字色         |
| `--sn-mp-color-action-primary`                  | 激活索引项底色与激活标题文字色 |
| `--sn-mp-color-text-on-primary`                 | 激活索引项文字色               |
| `--sn-mp-font-size-xs` / `--sn-mp-font-size-sm` | 索引项 / 分组标题字号          |
| `--sn-mp-font-weight-medium`                    | 分组标题字重                   |
| `--sn-mp-radius-full`                           | 索引项胶囊圆角                 |
| `--sn-mp-radius-lg`                             | 索引提示气泡圆角               |
| `--sn-mp-font-size-xl` / `--sn-mp-font-weight-semibold` | 索引提示气泡字号与字重 |
| `--sn-mp-spacing-1` / `--sn-mp-spacing-3`       | 索引项间距 / 分组标题内边距    |

## AI Patch Boundary

- AI 可通过 Patch 修改 `sticky` / `showIndicator` 等展示配置，以及各 `sn-index-anchor` 的 `index` / `anchorId`。
- `change` 事件与 `scrollTo()` 属于运行时行为，Patch 不应伪造索引变化事件或写死滚动目标。
- 分组条目内容（默认插槽）属于业务数据，Patch 只应调整容器配置，不应改写条目内部结构。

## 无障碍

- 索引侧栏 `role="tablist"` 且 `aria-orientation="vertical"`。
- 每个索引项 `role="tab"`，`aria-selected` 与激活索引同步，`aria-label` 为索引字符。
- 分组标题以 `aria-hidden` 之外的普通文本呈现，语义由所在分组承担。
- 移动端仅 `tap` 交互，小程序无键盘焦点概念。

## 暗色模式

`sn-index-bar` 的全部颜色来自 `--sn-mp-color-*`，没有浅色 `var()` 兜底，因此在 `.sn-theme-dark` 下自动适配：列表底色切到暗色表面，分组标题使用暗色 soft 底，激活索引项保持主色胶囊。

用 sn-config-provider 的 theme 设为 dark 包裹即可验证：

## 相关

- 侧边导航：[`sn-sidebar`](/components/uni/sidebar)
- 吸顶容器：[`sn-sticky`](/components/uni/sticky)
- 回到顶部：[`sn-backtop`](/components/uni/backtop)
