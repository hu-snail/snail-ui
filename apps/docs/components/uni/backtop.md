# Backtop 回到顶部（uni 端 / 移动端）

`sn-backtop` 是 `@snui/uni`（移动端 / 小程序 / H5）的浮动「回到顶部」按钮。基于 easycom 自动注册，几何值走 `rpx`，跨设备等比缩放。

## 何时使用

- 页面或滚动区域内容较长，用户需要一键回到顶部
- 需要滚动超过一定距离后才出现浮动按钮，避免干扰首屏阅读
- 需要与品牌色 / 语义色一致的操作入口（配合 `theme`）

## 基础用法

滚动距离由宿主传入 `scroll-top`（页面 `onPageScroll` 或 `scroll-view` 的 `@scroll`），超过 `top` 阈值后按钮淡入；点击按钮通过 `uni.pageScrollTo` 滚回顶部，宿主也可以监听 `click` 自己控制滚动容器：

<Demo name="backtop-mp-basic" description="scroll-view 真实滚动触发：滚动距离超过阈值后按钮淡入，点击真实滚回顶部。" />

## 形状、尺寸与内容形态

`shape` 切换圆形 / 方形，`size` 切换小 / 中 / 大三档（图标随档位取 `--sn-mp-icon-size-*` 令牌，比例协调），`bottom` / `right` 控制贴边距离；图标 + 文字的按钮宽度随内容自适应，长文案自动省略，不会溢出按钮：

<Demo name="backtop-mp-shape" description="圆形 / 方形 × 尺寸 × 内容形态：纯图标按钮保持正圆 / 正方，图标 + 文字按钮宽度自适应。" />

## 主题色

`theme` 提供语义填充档位：`default`（默认浅色表面）/ `primary` / `success` / `warning` / `danger` / `info`。填充与描边切换主题令牌，图标与文字自动反转为 on-primary 色，暗色模式下跟随主题令牌一起翻转：

<Demo name="backtop-mp-theme" description="theme 语义主题：primary / success / warning / danger / info 填充，内容自动反色。" />

## 显示阈值与图标样式

`top` 是显示阈值（px）；`icon-style` 追加在图标内联样式之后；`z-index` 参与根节点定位样式：

<Demo name="backtop-mp-threshold" description="top=120 显示阈值；icon-style 自定义图标颜色；z-index 层级。" />

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<sn-backtop :scroll-top="scrollTop" text="顶部" />
```

如需显式 import：

```ts
import { SnBacktop } from '@snui/uni/components/sn-backtop/sn-backtop.vue';
```

## Props

| 属性          | 类型                                                                             | 默认值     | 说明                                     |
| ------------- | -------------------------------------------------------------------------------- | ---------- | ---------------------------------------- |
| `scrollTop`   | `number`                                                                         | `0`        | 页面滚动距离（由宿主提供）               |
| `text`        | `string`                                                                         | `''`       | 按钮文字                                 |
| `top`         | `number`                                                                         | `300`      | 显示阈值（px）                           |
| `duration`    | `number`                                                                         | `100`      | 返回顶部滚动时长（ms）                   |
| `zIndex`      | `number`                                                                         | `10`       | 组件层级                                 |
| `iconStyle`   | `string`                                                                         | `''`       | 自定义图标样式（叠加在默认向上旋转之上） |
| `shape`       | `'circle' \| 'square'`                                                           | `'circle'` | 按钮形状                                 |
| `bottom`      | `number`                                                                         | `100`      | 距屏幕底部距离（px）                     |
| `right`       | `number`                                                                         | `20`       | 距屏幕右侧距离（px）                     |
| `customStyle` | `string`                                                                         | `''`       | 根节点自定义 inline style                |
| `customClass` | `string`                                                                         | `''`       | 根节点自定义类名                         |
| `size`        | `'small' \| 'medium' \| 'large'`                                                 | `'medium'` | 按钮尺寸档位，图标随档位取图标尺寸令牌   |
| `theme`       | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'`         | `'default'`| 按钮主题填充，内容色自动反转             |

## Events

| 事件名  | 说明                                                 | 参数             |
| ------- | ---------------------------------------------------- | ---------------- |
| `click` | 点击按钮时触发（宿主可自行滚动自己的 `scroll-view`） | `(event: Event)` |

## Slots

| 插槽名    | 说明           |
| --------- | -------------- |
| `default` | 自定义按钮内容 |

## 主题变量

| 变量                                                             | 用途                       |
| ---------------------------------------------------------------- | -------------------------- |
| `--sn-mp-color-background-surface`                               | 默认按钮底色               |
| `--sn-mp-color-border-default`                                   | 默认按钮描边               |
| `--sn-mp-color-action-primary` / `--sn-mp-color-feedback-*`      | 各 `theme` 档位填充色      |
| `--sn-mp-color-text-on-primary`                                  | 主题档位图标与文字反色     |
| `--sn-mp-color-text-primary` / `--sn-mp-color-text-secondary`    | 默认档位图标 / 文字色      |
| `--sn-mp-icon-size-small` / `medium` / `large`                   | `size` 档位对应的图标尺寸  |
| `--sn-mp-shadow-sm`                                              | 按钮投影                   |
| `--sn-mp-radius-full` / `--sn-mp-radius-md`                      | 圆形 / 方形圆角            |
| `--sn-mp-font-size-xs`                                           | 文字字号                   |
| `--sn-mp-spacing-1` / `--sn-mp-spacing-3`                        | 图标与文字间距 / 水平内边距 |

组件内部通过 `--sn-backtop-bg` / `--sn-backtop-border` / `--sn-backtop-fg` / `--sn-backtop-label` 四个局部槽位变量承接主题，样式包（Style Pack）可整体覆盖。

## 无障碍

- 根节点 `role="button"`，`aria-label` 取 `text`（缺省为 `Back to top`）。
- 隐藏态同时带 `aria-hidden="true"` 且拦掉点击 —— 零尺寸的命中区域不能吞掉触摸。
- 长文案在 DOM 中保持完整（供读屏与检索），仅视觉上省略号截断。
- 滚动通过 `uni.pageScrollTo` 完成；宿主不提供该 API 时静默跳过，仍会 emit `click`。
- 移动端仅 `tap` 交互，小程序无键盘焦点概念。

## 暗色模式

`sn-backtop` 的全部颜色来自 `--sn-mp-color-*`，没有浅色 `var()` 兜底，因此在 `.sn-theme-dark` 下自动适配：按钮底色切到暗色表面，描边与投影使用暗色令牌，图标与文字转为暗色文本色；`theme` 填充档位通过主题令牌同步翻转。

用 sn-config-provider 的 theme 设为 dark 包裹即可验证。

## AI Patch Boundary

| 可安全由 AI 生成                                       | 需要人工确认                                       |
| ------------------------------------------------------- | --------------------------------------------------- |
| `scroll-top` / `top` / `duration` / `z-index` 等数值面  | 滚动容器与 `pageScrollTo` 的职责划分（页面 or 容器） |
| `text` / `icon-style` 等静态展示面                      | `default` 插槽内容与点击后的宿主路由 / 数据行为     |
| `shape` / `size` / `theme` 静态档位取值                 | `bottom` / `right` 与页面导航栏 / 安全区的叠加      |
| 文档、demo 中的静态组合用法                             | 把按钮放进另一个 `position: fixed` 容器的层级策略   |

- AI 生成的 JSON Patch 只允许修改以上静态与数值面，不得注入事件处理器、插槽内容或组件内部状态。

完整契约见组件 `ai-description.md`。

## 相关

- 吸顶容器：[`sn-sticky`](/components/uni/sticky)
- 分页：[`sn-pagination`](/components/uni/pagination)
