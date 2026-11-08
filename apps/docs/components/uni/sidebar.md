# Sidebar 侧边导航（uni 端 / 移动端）

`sn-sidebar` 是 `@snui/uni`（移动端 / 小程序 / H5）的竖向侧边导航容器，`sn-sidebar-item` 是单个选项。基于 easycom 自动注册，几何值走 `rpx`，跨设备等比缩放。

## 基础用法

`v-model` 绑定激活项的值，右侧内容由宿主按 `change` 联动：

<Demo name="sidebar-mp-basic" description="v-model 绑定 value；sn-sidebar-item 的 label 渲染文案；右侧面板由 change 驱动。" />

## 图标与徽标

`icon` 经图标注册表解析，`badge` / `isDot` 渲染徽标，`disabled` 阻止切换：

<Demo name="sidebar-mp-badge" description="icon 图标；badge 数字徽标；is-dot 点状徽标；disabled 禁用选项。" />

## 切换拦截与 select 方法

`before-change` 在切换前调用，返回 `false` 阻止切换；模板 ref 上的 `select(value, label)` 可从代码驱动侧边栏；item 的 `max` 控制徽标上限：

<Demo name="sidebar-mp-guard" description="before-change 拦截前两次切换；ref.select() 从代码切换；max 控制徽标上限。" />

## 滚动联动（scroll-spy）

打开 `scroll-spy` 后，左侧高亮跟随右侧内容区的位置，而不只是用户的最近一次点击：宿主把滚动距离写进 `scroll-top`（`scroll-view` 的 `@scroll` 或页面 `onPageScroll`），每个条目用 `anchor` 声明它负责的内容区块 `id`，容器用 `anchor-selector` 一次量出这些区块的相对位置，解析出当前该高亮的条目。组件既不监听 `window`，也不持有滚动容器 —— 两端各自负责自己那半。

- 激活判定线 = `scroll-top` + `scroll-threshold`，偏移以「最高的关联区块」为 0 点；内容区若正好从第一个关联区块开始，两个坐标同一个原点。首个关联区块之前还有内容时（例如头部），用负的 `scroll-threshold` 把它扣掉。
- 滚动引发的切换不经过 `before-change`：该钩子只拦用户点击，内容位置才是当前区块的权威来源，拦截会让高亮与所见区块脱节。
- 内容变化（区块增删、高度变化）后调用 `refresh()` 重新测量；测量不可用时保留上一次结果，不会抛错。
- `scroll-top` 只作为联动输入，不驱动内容区滚动；「点左侧 → 右内容滚过去」由宿主实现。

<Demo name="sidebar-mp-scroll" description="滚动右侧内容区，左侧高亮自动跟随；点条目由 before-change 把内容区滚到目标区块。" />

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<sn-sidebar v-model="active">
  <sn-sidebar-item label="全部" :value="0" />
</sn-sidebar>
```

如需显式 import：

```ts
import { SnSidebar } from '@snui/uni/components/sn-sidebar/sn-sidebar.vue';
import { SnSidebarItem } from '@snui/uni/components/sn-sidebar/sn-sidebar-item.vue';
```

## Props

### sn-sidebar

| 属性              | 类型                                     | 默认值      | 说明                                                              |
| ----------------- | ---------------------------------------- | ----------- | ----------------------------------------------------------------- |
| `modelValue`      | `string \| number`                       | `0`         | 当前激活项的值                                                    |
| `beforeChange`    | `(value) => boolean \| Promise<boolean>` | `undefined` | 切换前钩子，返回 `false` 可阻止切换（只拦点击，滚动联动不经过它） |
| `customClass`     | `string`                                 | `''`        | 根节点自定义类名                                                  |
| `customStyle`     | `string`                                 | `''`        | 根节点自定义 inline style                                         |
| `scrollSpy`       | `boolean`                                | `false`     | 打开内容区滚动联动，高亮跟随 `scrollTop`                          |
| `scrollTop`       | `number`                                 | `0`         | 内容区滚动距离（px），由宿主的 `@scroll` / `onPageScroll` 上报    |
| `anchorSelector`  | `string`                                 | `''`        | 内容区块的 CSS 选择器，区块 `id` 需与条目的 `anchor` 一致         |
| `scrollThreshold` | `number`                                 | `0`         | 激活判定线的额外偏移（px），用于预留吸顶头部等高度                |

### sn-sidebar-item

| 属性          | 类型                | 默认值      | 说明                                        |
| ------------- | ------------------- | ----------- | ------------------------------------------- |
| `label`       | `string`            | `''`        | 当前选项标题                                |
| `value`       | `string \| number`  | `undefined` | 当前选项值（不传时回退为 `label`）          |
| `badge`       | `string \| number`  | `undefined` | 徽标显示值                                  |
| `icon`        | `string`            | `''`        | 图标名称（经 `registerSnIcons()` 注册）     |
| `iconPrefix`  | `string`            | `''`        | 字体图标类名前缀                            |
| `cssIcon`     | `boolean \| string` | `false`     | 渲染字体图标；字符串值直接作为 class 前缀   |
| `isDot`       | `boolean`           | `false`     | 是否显示点状徽标                            |
| `max`         | `number`            | `99`        | 徽标最大值，超过显示 `{max}+`               |
| `disabled`    | `boolean`           | `false`     | 是否禁用当前选项                            |
| `customClass` | `string`            | `''`        | 根节点自定义类名                            |
| `customStyle` | `string`            | `''`        | 根节点自定义 inline style                   |
| `anchor`      | `string`            | `''`        | 负责的内容区块 `id`；不设置则不参与滚动联动 |

## Events

| 事件名              | 说明             | 参数                        |
| ------------------- | ---------------- | --------------------------- |
| `update:modelValue` | 激活值变化时触发 | `(value: string \| number)` |
| `change`            | 激活项切换时触发 | `({ value, label })`        |

## Slots

| 插槽名               | 说明             |
| -------------------- | ---------------- |
| `default`（sidebar） | SidebarItem 列表 |
| `icon`（item）       | 自定义图标内容   |

## Methods

| 方法名    | 类型                              | 说明                                                       |
| --------- | --------------------------------- | ---------------------------------------------------------- |
| `select`  | `(value, label) => Promise<void>` | 从代码切换激活项；走 `before-change`，滚动联动不经过该钩子 |
| `refresh` | `() => void`                      | 重新测量内容区块位置；`scroll-spy` 打开时生效              |

## 主题变量

| 变量                                        | 用途                     |
| ------------------------------------------- | ------------------------ |
| `--sn-mp-color-background-soft`             | 侧边栏底色               |
| `--sn-mp-color-background-surface`          | 激活项底色               |
| `--sn-mp-color-text-secondary`              | 非激活项文字色           |
| `--sn-mp-color-text-disabled`               | 禁用项文字色             |
| `--sn-mp-color-action-primary`              | 激活项文字色与左侧指示条 |
| `--sn-mp-color-feedback-danger`             | 徽标填充                 |
| `--sn-mp-color-text-on-primary`             | 徽标文字色               |
| `--sn-mp-font-size-md`                      | 选项文字字号             |
| `--sn-mp-font-weight-medium`                | 激活项字重               |
| `--sn-mp-radius-xs` / `--sn-mp-radius-full` | 指示条 / 徽标圆角        |
| `--sn-mp-spacing-3`                         | 选项内边距               |

## 无障碍

- 容器 `role="tablist"` 且 `aria-orientation="vertical"`。
- 每个选项 `role="tab"`，`aria-selected` 反映激活态，`aria-disabled` 反映禁用态，`aria-label` 取 `label`。
- 徽标是选项内的装饰文本，语义由 `label` 承担。
- 移动端仅 `tap` 交互，小程序无键盘焦点概念。

## AI Patch Boundary

- AI 可通过 Patch 修改展示配置：条目的 `label` / `icon` / `iconPrefix` / `cssIcon` / `badge` / `isDot` / `max` / `disabled` / `customClass` / `customStyle`，以及容器的 `customClass` / `customStyle`。
- `scroll-spy` / `scroll-top` / `anchor-selector` / `scroll-threshold` 与条目的 `anchor` 是联动配置：`anchor` 必须指向宿主内容区里真实存在的区块 `id`，Patch 不应凭空新增或改写内容区结构。
- `modelValue` 是受控状态，应通过 `update:modelValue` 回写，而不是直接改写内部状态；滚动联动同样以事件回写。
- `scroll-top` 是宿主滚动的运行时读数（`@scroll` 结果），Patch 不应试图直接写入。
- `before-change` 是运行期回调，属于宿主逻辑，不在 Patch 范围内。

完整契约见组件 `ai-description.md`。

## 暗色模式

`sn-sidebar` 的全部颜色来自 `--sn-mp-color-*`，没有浅色 `var()` 兜底，因此在 `.sn-theme-dark` 下自动适配：轨道底色切到暗色 soft 表面，激活项为暗色表面色，激活文字与指示条保持主色。

用 sn-config-provider 的 theme 设为 dark 包裹即可验证：

## 相关

- 标签页：[`sn-tabs`](/components/uni/tabs)
- 分段器：[`sn-segmented`](/components/uni/segmented)
- 索引栏：[`sn-index-bar`](/components/uni/index-bar)
