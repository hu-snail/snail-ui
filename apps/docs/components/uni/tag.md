# Tag 标签（uni 端 / 移动端）

`sn-tag` 是 `@snui/uni`（移动端 / 小程序 / H5）的紧凑标签组件，用于承载状态词、分类、已应用的筛选条件。基于 easycom 自动注册，几何值走 `rpx`，跨设备等比缩放。

## 基础用法

十种语义色，覆盖状态与分类两类常见场景：

<Demo name="tag-mp-basic" description="十种语义色：default / primary / success / warning / danger / volcano / lightblue / cyan / pink / purple。" />

## 尺寸与形态

五档尺寸（`default` 为基准档），配合 `round` 胶囊形与 `mark` 标记形：

<Demo name="tag-mp-size" description="尺寸 small / medium / large / extra-large；round 胶囊形；mark 非对称圆角标记形。" />

## 变体

`variant` 控制填充与描边，同一 `type` 下可切换五种视觉强度：

<Demo name="tag-mp-variant" description="variant 五档：dark 实心填充、light 浅色底、plain 描边、dashed 虚线描边、text 纯文字。" />

## 可关闭 / 图标 / 新增标签

`closable` 渲染关闭按钮并 emit `close`；`icon` 经图标注册表解析；`dynamic` 渲染行内输入框，确认后 emit `confirm`：

<Demo name="tag-mp-closable" description="closable 关闭；icon 图标（Check / Star）；dynamic 行内输入新增标签。" />

## 自定义颜色、字体图标与根节点样式

`color` 只改文字色（内联 `color`）；`bgColor` 同时改底色与边框色（内联 `background-color` + `border-color`）。`iconPrefix` 与 `cssIcon` 配合拼出 `{iconPrefix}-{icon}` 的字体图标类，`cssIcon` 传字符串时该值直接当类前缀。`customClass` 追加根节点类名，`customStyle` 追加根节点 inline style。

<Demo name="tag-mp-color-custom" description="color / bgColor 内联覆盖；iconPrefix + cssIcon 拼出的字体图标类；cssIcon 字符串前缀；customClass 与 customStyle。" />

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<sn-tag type="primary">主要</sn-tag>
```

如需显式 import：

```ts
import { SnTag } from '@snui/uni/components/sn-tag/sn-tag.vue'
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `size` | `'small' \| 'medium' \| 'large' \| 'extra-large' \| 'default'` | `'default'` | 标签尺寸，驱动内边距与字号 |
| `type` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'volcano' \| 'lightblue' \| 'cyan' \| 'pink' \| 'purple'` | `'default'` | 语义色 |
| `icon` | `string` | `''` | 左侧图标名（经 `registerSnIcons()` 注册） |
| `iconPrefix` | `string` | `''` | 字体图标类名前缀，`cssIcon` 开启时使用 |
| `cssIcon` | `boolean \| string` | `false` | 渲染字体图标；字符串值直接作为 class 前缀 |
| `closable` | `boolean` | `false` | 是否可关闭 |
| `dynamic` | `boolean` | `false` | 是否为新增标签（渲染行内输入） |
| `color` | `string` | `''` | 文字颜色（内联覆盖） |
| `bgColor` | `string` | `''` | 背景色与边框色（内联覆盖） |
| `round` | `boolean` | `false` | 是否圆角（胶囊形） |
| `mark` | `boolean` | `false` | 是否标记样式（非对称圆角） |
| `variant` | `'light' \| 'dark' \| 'plain' \| 'dashed' \| 'text'` | `'dark'` | 标签变体 |
| `customClass` | `string` | `''` | 根节点自定义类名 |
| `customStyle` | `string` | `''` | 根节点自定义 inline style |

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `click` | 点击标签时触发 | `(event: Event)` |
| `close` | 点击关闭按钮时触发（不会冒泡到 `click`） | `(event: Event)` |
| `confirm` | 新增标签输入确认后触发 | `({ value: string })` |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 标签内容 |
| `icon` | 自定义图标，覆盖 `icon` prop |
| `add` | 自定义新增标签内容，`dynamic` 为 true 时生效 |

## 主题变量

| 变量 | 用途 |
| --- | --- |
| `--sn-mp-color-action-primary` / `--sn-mp-color-action-primary-soft` | `primary` 类型的填充与浅色底 |
| `--sn-mp-color-feedback-success` / `-soft` | `success` 类型 |
| `--sn-mp-color-feedback-warning` / `-soft` | `warning` 类型 |
| `--sn-mp-color-feedback-danger` / `-soft` | `danger` 类型 |
| `--sn-mp-color-feedback-info` | `default` 类型的填充 |
| `--sn-mp-color-volcano` / `-soft` | `volcano` 类型 |
| `--sn-mp-color-lightblue` / `-soft` | `lightblue` 类型 |
| `--sn-mp-color-cyan` / `-soft` | `cyan` 类型 |
| `--sn-mp-color-pink` / `-soft` | `pink` 类型 |
| `--sn-mp-color-purple` / `-soft` | `purple` 类型 |
| `--sn-mp-color-background-subtle` | `default` 类型的浅色底 |
| `--sn-mp-color-text-on-primary` | 实心变体的文字色 |
| `--sn-mp-color-text-secondary` | `default` 类型的文字色 |
| `--sn-mp-font-size-{xs,sm,md,lg}` | 各档尺寸的字号 |
| `--sn-mp-font-weight-bold` | Doodle 皮肤字重 |
| `--sn-mp-radius-{sm,md,lg,full}` | 圆角 / 胶囊 / 标记形态 |
| `--sn-mp-spacing-1` | 图标与文字间距 |

## 无障碍

- 根节点 `role="button"`：标签在任意变体下都可点击。
- 关闭按钮是独立的 `role="button"` 且带 `aria-label="Close"`，辅助技术可直接定位，不会误触标签本身的动作。
- 字体图标容器为 `aria-hidden="true"`，语义由文字标签承担。
- 移动端仅 `tap` 交互，小程序无键盘焦点概念。

## 暗色模式

`sn-tag` 的全部颜色来自 `--sn-mp-color-*`，没有浅色 `var()` 兜底，因此在 `.sn-theme-dark` 下自动适配：

- 实心变体（`dark`）的填充色在暗色下保持不变，文字仍为白色，对比度不受影响。
- 浅色变体（`light`）的底色是带 alpha 的 tint，暗色块中该 tint 的 alpha 从 12% 提升到 22%，避免在近黑背景上不可见。
- 描边变体（`plain` / `dashed` / `text`）直接使用语义色本身，暗色下依旧是可识别的主色。

用 sn-config-provider 的 theme 设为 dark 包裹即可验证：


## 相关

- Web 端：[`SnTag`](/components/web/tag)
- 徽标计数：[`sn-badge`](/components/uni/badge)
