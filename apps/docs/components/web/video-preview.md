# 视频预览 VideoPreview · Web（PC 端）

视频缩略图：封面 + 居中播放按钮，点击后原位内联播放；右上角的「放大」按钮可打开全屏预览浮层（Esc 或点击遮罩关闭）。

> naive-ui 没有视频组件（`src/components.ts` 中不存在），因此本组件**不遵循 §112 的一比一对照**，而是对齐本仓库 `SnImage` 的预览模型：缩略图 + 点击打开浮层，`preview-disabled` / `show-toolbar` / `showPreview()` 与 SnImage 同名同义。浮层是独立内部组件 `SnVideoPreviewOverlay.vue`，对应 SnImage / SnImagePreview 的拆分方式。

## 何时使用

- 在列表、卡片或图文内容中展示视频缩略图
- 希望点击后在原位播放，同时提供全屏预览入口
- 需要自定义封面、播放按钮样式或预览入口

## 代码演示

### 基础用法

<Demo name="video-preview-web-basic" description="width / height / aspect-ratio 控制媒体框尺寸，object-fit 控制填充方式。" />

### 全屏预览

<Demo name="video-preview-web-overlay" description="右上角放大按钮打开全屏浮层，Esc 或点击遮罩关闭；preview-disabled 关闭该能力。" />

### 自定义封面与插槽

<Demo name="video-preview-web-custom-poster" description="placeholder 替换封面区域，play-icon 替换播放图标，toolbar 替换放大入口。" />

## API

### SnVideoPreview Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| src | `string` | — | 视频地址（必填） |
| poster | `string` | `undefined` | 播放前显示的封面 |
| preview-src | `string` | `undefined` | 浮层内使用的大尺寸地址，缺省回退到 `src` |
| width | `string \| number` | `320` | 媒体框宽度（数字按 px） |
| height | `string \| number` | `undefined` | 媒体框高度（数字按 px） |
| aspect-ratio | `string` | `undefined` | 媒体框宽高比，如 `'16 / 9'`；仅在未显式给出 height 时生效 |
| object-fit | `'contain' \| 'cover' \| 'fill'` | `'cover'` | 视频在媒体框内的适应方式 |
| controls | `boolean` | `true` | 原生控制条（内联播放开始后可用） |
| autoplay | `boolean` | `false` | 挂载后自动内联播放 |
| loop | `boolean` | `false` | 循环播放 |
| muted | `boolean` | `false` | 静音播放 |
| preload | `'none' \| 'metadata' \| 'auto'` | `'metadata'` | 预加载策略 |
| preview-disabled | `boolean` | `false` | 禁用浮层：不渲染放大入口，`showPreview()` 变为空操作 |
| show-toolbar | `boolean` | `true` | 是否渲染右上角放大入口（hover / focus 时显现） |
| close-on-mask-click | `boolean` | `true` | 点击遮罩是否关闭浮层 |
| title | `string` | `undefined` | 浮层标题，同时作为无障碍名称的兜底 |
| alt | `string` | `undefined` | 视频无障碍说明，优先级高于 `title` |

### SnVideoPreview Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| play | `()` | 内联播放开始 |
| pause | `()` | 内联播放暂停 |
| ended | `()` | 内联播放结束 |
| error | `(event: Event)` | 视频加载或解码失败 |
| preview | `()` | 预览浮层打开 |
| close | `()` | 预览浮层关闭（Esc / 遮罩 / 关闭按钮 / closePreview()） |

### SnVideoPreview Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| placeholder | `()` | 无封面或尚未播放时替换封面区域 |
| play-icon | `()` | 替换居中的播放图标（默认 SnIcon + lucide Play） |
| toolbar | `{ showPreview: () => void }` | 替换右上角放大入口，调用 `showPreview` 打开浮层 |

### SnVideoPreview Methods

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| play | `() => void` | 开始内联播放 |
| pause | `() => void` | 暂停内联播放 |
| showPreview | `() => void` | 打开全屏预览浮层（`preview-disabled` 时为空操作） |
| closePreview | `() => void` | 关闭全屏预览浮层 |

### 键盘与交互

- 未播放时遮罩层居中显示播放按钮，点击后调用 `video.play()` 内联播放
- `controls` 为 `true` 时出现原生控制条；`controls` 为 `false` 时点击视频区域切换播放 / 暂停
- 播放暂停或播放结束后自动回到封面状态；`play()` 被浏览器策略拒绝时同样回到封面状态
- 浮层打开时 `Esc` 关闭、点击遮罩关闭，关闭后焦点返回放大按钮，同时锁定页面滚动
- 遮罩不拦截指针事件，原生控制条始终可点；只有播放按钮与放大按钮是点击目标