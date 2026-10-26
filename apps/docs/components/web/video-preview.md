# 视频预览 VideoPreview · Web（PC 端）

视频媒体框：封面 + 居中播放按钮，点击后原位内联播放；右上角的「放大」按钮可打开全屏预览浮层（Esc 或点击遮罩关闭）。

播放器 UI **始终是我们自己的控制条**（`SnVideoControls`），默认 **绝不渲染浏览器原生控件**：原生 `<video controls>` 的按钮由浏览器绘制，无法用 CSS 美化，且不同浏览器 / 系统长相各不相同。需要时可以用 `native-controls` 显式退回原生控件，用 `background` 把视频降级为纯装饰的横幅 / 区块背景视频。

> naive-ui 没有视频组件（`src/components.ts` 中不存在），因此本组件**不遵循 §112 的一比一对照**，而是对齐本仓库 `SnImage` 的预览模型：缩略图 + 点击打开浮层，`preview-disabled` / `show-toolbar` / `showPreview()` 与 SnImage 同名同义。浮层是独立内部组件 `SnVideoPreviewOverlay.vue`，控制条是独立内部组件 `SnVideoControls.vue`，两者都不对外导出（对应 SnImage / SnImagePreview 的拆分方式）。

## 何时使用

- 在列表、卡片或图文内容中展示视频缩略图
- 希望点击后在原位播放，同时提供全屏预览入口
- 需要自定义封面、播放按钮样式或预览入口
- 需要页面顶部 Hero 横幅、区块背景这类**不能出现任何播放控件**的装饰性视频（`background`）

## 代码演示

### 基础用法

<Demo name="video-preview-web-basic" description="默认即为自定义控制条；width / height / aspect-ratio 控制媒体框尺寸，object-fit 控制填充方式。" />

### 自定义控制条 vs 原生控制条

<Demo name="video-preview-web-controls" description="左侧是默认的自定义控制条（播放 / 暂停、静音、进度条、时间、全屏）；右侧用 native-controls 退回浏览器原生控件，可直观看到它无法美化、跨端不一致。" />

### 背景 / 横幅视频

<Demo name="video-preview-web-background" description="background 让视频成为纯装饰层：无控件、无播放按钮、无悬浮工具栏，强制静音 + 自动播放 + 循环，铺满 position: relative 的父容器。" />

### 全屏预览

<Demo name="video-preview-web-overlay" description="右上角放大按钮打开全屏浮层，Esc 或点击遮罩关闭；浮层内复用同一套控制条；preview-disabled 关闭该能力。" />

### 自定义封面与插槽

<Demo name="video-preview-web-custom-poster" description="placeholder 替换封面区域，play-icon 替换播放图标，toolbar 替换放大入口。" />

## API

### SnVideoPreview Props

| 名称                | 类型                             | 默认值       | 说明                                                                                                                                                                                         |
| ------------------- | -------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| src                 | `string`                         | —            | 视频地址（必填）                                                                                                                                                                             |
| poster              | `string`                         | `undefined`  | 播放前显示的封面（`background` 下不生效）                                                                                                                                                    |
| preview-src         | `string`                         | `undefined`  | 浮层内使用的大尺寸地址，缺省回退到 `src`                                                                                                                                                     |
| width               | `string \| number`               | `320`        | 媒体框宽度（数字按 px）；`background` 下不生效                                                                                                                                               |
| height              | `string \| number`               | `undefined`  | 媒体框高度（数字按 px）                                                                                                                                                                      |
| aspect-ratio        | `string`                         | `undefined`  | 媒体框宽高比，如 `'16 / 9'`；仅在未显式给出 height 时生效                                                                                                                                    |
| object-fit          | `'contain' \| 'cover' \| 'fill'` | `'cover'`    | 视频在媒体框内的适应方式；`background` 下强制 `'cover'`                                                                                                                                      |
| controls            | `boolean`                        | `true`       | **渲染我们自己的美化控制条**（播放 / 暂停、静音、进度条、时间、全屏）。注意：它**不再**指定浏览器原生控件                                                                                    |
| native-controls     | `boolean`                        | `false`      | 渲染浏览器原生 `controls` 属性。原生控件**无法美化**、不同浏览器 / 系统表现不一致，仅作逃生舱；与 `controls` 可同时为真                                                                      |
| background          | `boolean`                        | `false`      | 装饰性横幅 / 背景视频模式：强制关闭 `controls` 与 `native-controls`，强制 `muted` + `autoplay` + `loop` + `object-fit: cover`，媒体框绝对定位铺满父容器，视频 `aria-hidden` 且不接收指针事件 |
| autoplay            | `boolean`                        | `false`      | 挂载后自动播放（浏览器策略要求静音，见「兼容性说明」）                                                                                                                                       |
| loop                | `boolean`                        | `false`      | 循环播放                                                                                                                                                                                     |
| muted               | `boolean`                        | `false`      | 静音播放                                                                                                                                                                                     |
| preload             | `'none' \| 'metadata' \| 'auto'` | `'metadata'` | 预加载策略                                                                                                                                                                                   |
| preview-disabled    | `boolean`                        | `false`      | 禁用浮层：不渲染放大入口，`showPreview()` 变为空操作（`background` 下同样禁用）                                                                                                              |
| show-toolbar        | `boolean`                        | `true`       | 是否渲染右上角放大入口（hover / focus 时显现；`background` 下不渲染）                                                                                                                        |
| close-on-mask-click | `boolean`                        | `true`       | 点击遮罩是否关闭浮层                                                                                                                                                                         |
| title               | `string`                         | `undefined`  | 浮层标题，同时作为无障碍名称的兜底                                                                                                                                                           |
| alt                 | `string`                         | `undefined`  | 视频无障碍说明，优先级高于 `title`                                                                                                                                                           |

### SnVideoPreview Events

| 名称    | 参数             | 说明                                                   |
| ------- | ---------------- | ------------------------------------------------------ |
| play    | `()`             | 内联播放开始                                           |
| pause   | `()`             | 内联播放暂停                                           |
| ended   | `()`             | 内联播放结束                                           |
| error   | `(event: Event)` | 视频加载或解码失败                                     |
| preview | `()`             | 预览浮层打开                                           |
| close   | `()`             | 预览浮层关闭（Esc / 遮罩 / 关闭按钮 / closePreview()） |

### SnVideoPreview Slots

| 名称        | 参数                          | 说明                                                    |
| ----------- | ----------------------------- | ------------------------------------------------------- |
| placeholder | `()`                          | 无封面或尚未播放时替换封面区域（`background` 下不渲染） |
| play-icon   | `()`                          | 替换居中的播放图标（默认 SnIcon + lucide Play）         |
| toolbar     | `{ showPreview: () => void }` | 替换右上角放大入口，调用 `showPreview` 打开浮层         |

### SnVideoPreview Methods

| 名称         | 类型         | 说明                                                             |
| ------------ | ------------ | ---------------------------------------------------------------- |
| play         | `() => void` | 开始内联播放                                                     |
| pause        | `() => void` | 暂停内联播放                                                     |
| showPreview  | `() => void` | 打开全屏预览浮层（`preview-disabled` / `background` 时为空操作） |
| closePreview | `() => void` | 关闭全屏预览浮层                                                 |

### 自定义控制条

内置控制条从左到右：**播放 / 暂停**、**静音 / 取消静音**、**当前时间**、**可拖拽进度条**、**总时长**、**全屏 / 退出全屏**。

- 进度条是原生 `<input type="range">`，可用键盘方向键 / Home / End 调节，并通过 `aria-valuetext` 播报 `当前时间 / 总时长`
- 控制条本身不持有播放状态：它把点击意图交给媒体元素，再由媒体元素的事件（`play` / `pause` / `timeupdate` / `volumechange` / `fullscreenchange`）回填 UI，因此浮层里复用的是**同一个组件**，样式只有一份
- 全屏按钮**按能力渲染**：浏览器不支持 Fullscreen API（如部分内嵌 WebView）时整颗按钮不渲染，而不是留一个死按钮
- 静音切换只改 `video.muted` 与图标，不额外触发 `play` / `pause` 事件

### 键盘与交互

- 未播放时遮罩层居中显示播放按钮，点击后调用 `video.play()` 内联播放
- `controls` 为 `true` 时出现自定义控制条，点击视频区域**不**切换播放（避免与控制条冲突）；`controls` 与 `native-controls` 都为 `false` 时点击视频区域切换播放 / 暂停
- 播放暂停或播放结束后自动回到封面状态；`play()` 被浏览器策略拒绝时同样回到封面状态
- 浮层打开时 `Esc` 关闭、点击遮罩关闭，关闭后焦点返回放大按钮，同时锁定页面滚动
- 遮罩不拦截指针事件，控制条始终可点；只有播放按钮与放大按钮是点击目标

## 兼容性说明

这些是**浏览器的既定行为**，不是组件缺陷：

- **自动播放必须静音。** Chrome / Safari / Firefox 的自动播放策略只允许「静音」媒体自动播放（Safari 还会检查用户站点偏好）。因此 `autoplay` 打开时会强制 `muted`（同时写 `muted` 属性与 `video.muted` 属性，因为不同引擎检查的位置不同）；`background` 下更是强制 `muted` + `autoplay` + `loop`。如果关闭静音，视频很可能停留在首帧——这不是播放失败，而是策略拦截。
- **iOS 需要 `playsinline`。** 不加 `playsinline` 时，iOS Safari 会接管整个屏幕、切到原生全屏播放器，页面里的布局直接失效。组件**始终**同时渲染 `playsinline` 与旧版 `webkit-playsinline`，没有开关可以关掉——这是修复而不是配置项。
- **原生控件无法美化，也不跨端一致。** 使用 `native-controls` 时，控制条由浏览器绘制：按钮数量、顺序、颜色、圆角、音量 / 字幕 / 画中画入口在 Chrome、Safari、Firefox、iOS、Android 上都不一样，并且不受 `--sn-web-*` token 影响，也无法通过 CSS 覆盖。这正是默认永不使用原生控件、而提供自定义控制条的原因。
- **背景 / 横幅视频必须没有控件。** 装饰性视频一旦带上任何播放控件（原生或自定义），横幅就不再是横幅。`background` 会强制关闭两种控件、去掉封面遮罩与播放按钮、去掉悬浮放大入口与预览浮层，并把视频标记为装饰性（`aria-hidden`、`pointer-events: none`），同时 `object-fit: cover` 铺满父容器。父容器只需 `position: relative`。
- **全屏 API 可能不存在。** 部分内嵌 WebView、iframe（未授权 `allowfullscreen`）或老版本浏览器没有 Fullscreen API；组件在挂载时检测 `requestFullscreen` / `exitFullscreen` / `fullscreenElement`，不可用时**不渲染**全屏按钮。

## 无障碍

- 播放按钮（`aria-label="播放视频"`）、放大按钮（`aria-label="放大预览"`）、控制条按钮均使用真实 `SnIcon` 图标并带有可读名称；控制条按钮的 `aria-label` 描述**将要执行的动作**（`播放` / `暂停`、`静音` / `取消静音`、`全屏` / `退出全屏`）
- 浮层为 `role="dialog"` + `aria-modal="true"`，打开时焦点移入关闭按钮，关闭时回到触发按钮
- `background` 模式下视频对辅助技术隐藏（`aria-hidden`），装饰性内容不应被朗读
- `:focus-visible` 描边统一使用 `--sn-web-focus-ring`

## 主题 token

控制条样式全部来自组件级 `--sn-web-video-preview-*` / `--sn-web-video-controls-*` 变量，每个都有字面量兜底，可逐实例覆盖：

| Token                                                                      | 用途                               |
| -------------------------------------------------------------------------- | ---------------------------------- |
| `--sn-web-video-preview-radius` / `--sn-web-video-preview-bg`              | 媒体框圆角与底色                   |
| `--sn-web-video-preview-mask-bg` / `--sn-web-video-preview-play-*`         | 封面遮罩与居中播放按钮             |
| `--sn-web-video-preview-toolbar-*`                                         | 右上角放大入口                     |
| `--sn-web-video-preview-controls-z-index`                                  | 自定义控制条层级                   |
| `--sn-web-video-controls-bg` / `--sn-web-video-controls-color`             | 控制条底色与文字颜色               |
| `--sn-web-video-controls-timeline-bg` / `--sn-web-video-controls-thumb-bg` | 进度条轨道与滑块                   |
| `--sn-web-video-preview-overlay-*`                                         | 预览浮层遮罩、标题、关闭按钮、尺寸 |
