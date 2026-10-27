# RichText 富文本（uni 端 / 移动端）

`sn-rich-text` 把一段 HTML 字符串渲染成可读内容：标题、段落、强调、引用、代码、列表、图片（含加载 / 失败占位与原生预览）、链接、表格（合并单元格）与音视频，并提供标题目录与页面定位能力。基于 easycom 自动注册。

## 何时使用

- 文章、公告、活动介绍等富文本内容展示
- 需要点击图片预览、点击链接由业务处理导航的场景
- 长文按标题生成目录并跳转章节
- 内容里嵌入了视频 / 音频，需要程序化控制播放

## 代码演示

### 基础图文

把 HTML 交给 `content` 即可；`selectable` 让文字可选中。

<Demo name="rich-text-mp-basic" description="标题 / 段落 / 强调 / 引用 / 有序与无序列表组合成完整文章。" />

### 图片与预览

普通图片点击触发 `image-click` 并默认打开内置的微信级预览层（捏合缩放、双击放大、下滑关闭，见 `sn-image-preview`）；`original-src` 用缩略图展示、高清图预览；`data-preview="false"` 让单张图片退出预览列表；地址无效时回退到 `alt`。

<Demo name="rich-text-mp-images" description="内置微信级预览、original-src 高清预览、data-preview 退出列表、失败回退 alt 文本。" />

### 链接与图片链接

点击有效链接只触发 `link-click`，导航由业务决定；有效链接包裹的图片同样触发 `link-click`；地址被过滤时按普通图片 / 文本处理。

<Demo name="rich-text-mp-links" description="link-click 事件、图片链接、无效地址过滤。" />

### 表格

支持 `colspan` / `rowspan` 合并与 `colgroup` 列宽；宽表格在组件内横向滚动，不会撑宽页面。

<Demo name="rich-text-mp-table" description="合并单元格、colgroup 列宽、横向滚动。" />

### 音视频与媒体控制

媒体不会自动播放；视频带原生控件，音频提供播放 / 暂停按钮。设置唯一的 `id` 后可用 `playMedia` / `pauseMedia` / `seekMedia` 控制，返回 `true` 表示指令已下发。

<Demo name="rich-text-mp-media" description="视频与音频、media-timeupdate 进度、组件方法控制播放。" />

### 样式映射、目录与空状态

`tag-style` 设置标签默认样式，`class-styles` 为内容里的 class 提供样式（编辑器导出的 `ql-*` 类已内置映射）；`enable-anchor` 开启标题目录与 `scrollToAnchor`；内容为空、被过滤为空或解析失败时显示默认插槽。

<Demo name="rich-text-mp-styles" description="tag-style / class-styles 优先级、标题目录跳转、空状态插槽。" />

## 内容边界

- 支持：标题、段落、强调、引用、代码、有序 / 无序（嵌套）列表、图片、链接、表格、音视频、常用命名实体与数字实体。
- 过滤：`script`、`style`、`iframe`、`svg`、`object`、`embed`、表单控件与事件属性；内联样式只保留排版与盒模型相关属性，`position`、`url()`、`expression()` 一律丢弃。
- 资源地址允许 HTTP(S)、协议相对与相对路径；链接额外允许 `#锚点`、`mailto:`、`tel:`。
- 单次内容上限：200000 个 UTF-16 单元、10000 个节点、128 层嵌套。超限触发 `error` 并显示默认插槽 —— 超长文章请拆分加载。

## 自动注册（easycom）

```vue
<sn-rich-text :content="article" selectable @link-click="onLink" />
```

如需显式 import：

```ts
import { SnRichText } from '@snui/uni';
```

## Props

| 属性             | 类型                     | 默认值  | 说明                                                     |
| ---------------- | ------------------------ | ------- | -------------------------------------------------------- |
| `content`        | `string`                 | `''`    | HTML 字符串                                              |
| `loadingImage`   | `string`                 | `''`    | 图片加载中占位图，失败后退回文字                         |
| `errorImage`     | `string`                 | `''`    | 图片失败占位图，失败后退回 `alt`                         |
| `enableAnchor`   | `boolean`                | `false` | 开启标题目录与锚点定位                                   |
| `selectable`     | `boolean`                | `false` | 允许选择文字，实际行为依平台而定                         |
| `previewImage`   | `boolean`                | `true`  | 点击普通图片时自动预览                                   |
| `lazyLoad`       | `boolean`                | `false` | 开启平台支持的图片懒加载                                 |
| `baseUrl`        | `string`                 | `''`    | 资源基址，用于补全相对地址；不转换链接 `href`            |
| `allowDataImage` | `boolean`                | `false` | 允许 ≤64KiB 的 PNG/JPEG/GIF/WebP Base64 图片，不自动预览 |
| `tagStyle`       | `Record<string, string>` | `{}`    | 标签默认样式映射                                         |
| `classStyles`    | `Record<string, string>` | `{}`    | class 到内联样式的显式映射                               |
| `customClass`    | `string`                 | `''`    | 根节点自定义类名                                         |
| `customStyle`    | `string`                 | `''`    | 根节点内联样式                                           |

样式优先级：标签默认样式 → `tagStyle` → `classStyles` → HTML 内联样式。

## Events

| 事件名称           | 参数                                                      | 说明                                     |
| ------------------ | --------------------------------------------------------- | ---------------------------------------- |
| `load`             | `{ imageCount }`                                          | 解析与节点更新完成，不等待媒体资源加载   |
| `error`            | `{ source: 'parse' \| 'image' \| 'video' \| 'audio', … }` | 解析超限、图片失败或媒体资源失败         |
| `image-load`       | `{ src, index, width, height }`                           | 原内容中的图片成功加载，每个图片节点一次 |
| `image-click`      | `{ src, index }`                                          | 点击普通图片，无论是否开启自动预览       |
| `link-click`       | `{ href }`                                                | 点击有有效地址的链接，包括图片链接       |
| `media-play`       | `{ id, type, src }`                                       | 音视频开始播放                           |
| `media-pause`      | `{ id, type, src }`                                       | 音视频暂停                               |
| `media-ended`      | `{ id, type, src }`                                       | 音视频播放结束                           |
| `media-timeupdate` | `{ id, type, src, currentTime, duration }`                | 播放进度更新，单位秒                     |

## Methods

| 方法名称         | 参数                                           | 返回值                                  | 说明                                   |
| ---------------- | ---------------------------------------------- | --------------------------------------- | -------------------------------------- |
| `getText`        | -                                              | `string`                                | 过滤后的纯文本，保留段落与图片替代文字 |
| `getHeadings`    | -                                              | `{ id, level, text }[]`                 | 标题目录副本，未开启时为空数组         |
| `getAnchorRect`  | `id: string`                                   | `Promise<{ top, left, width, height }>` | 查询目标在内容视口中的位置             |
| `scrollToAnchor` | `id: string, options?: { offset?, duration? }` | `Promise<void>`                         | 页面滚动至目标，动画后校正一次         |
| `playMedia`      | `id: string`                                   | `boolean`                               | 播放指定媒体，`true` 表示已下发指令    |
| `pauseMedia`     | `id?: string`                                  | `boolean`                               | 暂停指定媒体；不传 ID 暂停全部         |
| `seekMedia`      | `id: string, seconds: number`                  | `boolean`                               | 跳转播放进度，不主动播放               |

## Slots

| 插槽名称  | 说明                                       |
| --------- | ------------------------------------------ |
| `default` | 内容为空、过滤后无渲染节点或解析失败时显示 |

## CSS 变量

| 名称                                       | 说明                   |
| ------------------------------------------ | ---------------------- |
| `--sn-mp-rich-text-color`                  | 正文颜色               |
| `--sn-mp-rich-text-font-size`              | 正文字号               |
| `--sn-mp-rich-text-line-height`            | 正文行高，默认 `1.7`   |
| `--sn-mp-rich-text-link-color`             | 链接颜色               |
| `--sn-mp-rich-text-video-height`           | 未指定高度时的视频高度 |
| `--sn-mp-rich-text-image-state-min-height` | 图片状态最小高度       |
| `--sn-mp-rich-text-image-state-color`      | 图片状态文字颜色       |
| `--sn-mp-rich-text-image-state-bg`         | 图片状态背景色         |

八个变量都默认指向主题变量，暗色模式无需额外接线。

## 暗色模式

组件颜色全部取自 `--sn-mp-color-*` 语义变量，用 `<sn-config-provider theme="dark">` 包裹即可验证暗色表现：

```vue
<sn-config-provider theme="dark">
  <sn-rich-text :content="article" />
</sn-config-provider>
```

## 平台说明

- 内容用真实的 `view` / `text` / `image` / `video` 元素渲染，而非平台 `rich-text` 元素 —— 这是图片尺寸、链接点击与媒体控制可被观测的前提。
- 音频播放按需创建内部音频上下文，组件卸载时销毁；视频控制通过视频上下文下发。
- 锚点方法依赖平台的选择器查询与页面滚动接口，缺失时 Promise 直接 reject，不静默失败。
- `tagStyle` / `classStyles` 是字符串键的普通映射；在 uni-app x（App 端）上使用前请确认动态键对象的支持情况。
