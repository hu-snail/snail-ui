# 图片 Image · Web（PC 端）

带点击预览的图片展示：全屏浮层内支持缩放、旋转、1:1、拖拽平移、滚轮缩放、下载，组内图片可左右切换。

## 何时使用

- 需要展示图片缩略图，并希望点击后全屏查看大图
- 图片列表需要统一的预览体验，支持上一张/下一张切换
- 需要图片加载失败回退、占位提示或懒加载

## 代码演示

### 基础用法

<Demo name="image-web-basic" description="width/height/object-fit 控制缩略图。" />

### 组内预览

<Demo name="image-web-group" description="组内图片共享一个预览浮层，支持上一张/下一张与循环切换。" />

### 加载失败回退

<Demo name="image-web-fallback" description="src 加载失败时自动切换到 fallback-src。" />

### 自定义加载失败占位

<Demo name="image-web-error-slot" description="error 插槽替换失败状态的 img。" />

### 禁止预览

<Demo name="image-web-preview-disabled" description="preview-disabled 关闭点击预览。" />

### 懒加载

<Demo name="image-web-lazy" description="lazy 原生懒加载；配合 intersection-observer-options 在滚动容器内进入视口再加载。" />

### 手动打开预览

<Demo name="image-web-manual-preview" description="通过实例方法 showPreview() 打开预览。" />

### 预览图属性

<Demo name="image-web-previewed-img-props" description="previewed-img-props 为预览大图附加样式。" />

### 工具栏提示

<Demo name="image-web-toolbar-tooltip" description="show-toolbar-tooltip 为预览工具栏按钮提供提示。" />

### 自定义工具栏

<Demo name="image-web-custom-toolbar" description="render-toolbar 保留 prev/next 并插入自定义操作。" />

## API

### SnImage Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| src | `string` | `undefined` | 图片来源 |
| alt | `string` | `undefined` | 图片说明，同时作为 alt 与 aria-label |
| width | `string \| number` | `undefined` | 缩略图宽度（数字按 px） |
| height | `string \| number` | `undefined` | 缩略图高度（数字按 px） |
| object-fit | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'fill'` | 缩略图在容器内的适应方式 |
| fallback-src | `string` | `undefined` | 缩略图加载失败时显示的图片地址 |
| preview-src | `string` | `undefined` | 预览大图地址，缺省回退到 `src` |
| img-props | `ImgHTMLAttributes` | `undefined` | 转发到内部 img 元素上的额外属性 |
| previewed-img-props | `ImgHTMLAttributes` | `undefined` | 预览大图 img 元素上的属性与样式 |
| lazy | `boolean` | `false` | 进入视口后再加载；单独使用为原生懒加载 |
| intersection-observer-options | `{ root?, rootMargin?, threshold? }` | `undefined` | 懒加载改用 IntersectionObserver 时的配置，`root` 支持元素或选择器 |
| preview-disabled | `boolean` | `false` | 禁用单击预览 |
| show-toolbar | `boolean` | `true` | 预览时是否显示底部工具栏 |
| show-toolbar-tooltip | `boolean` | `false` | 工具栏按钮显示原生 title 提示 |
| keep-drag-offset | `boolean` | `false` | 拖拽松手后保留偏移（默认回弹居中或钳制在视口内） |
| render-toolbar | `(props: { nodes }) => VNodeChild` | `undefined` | 自定义工具栏渲染函数，nodes 含 prev / next / rotateCounterclockwise / rotateClockwise / resizeToOriginalSize / zoomOut / zoomIn / download / close |

### SnImage Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| load | `(event: Event)` | 缩略图加载完成 |
| error | `(event: Event)` | 缩略图加载失败（回退之后） |

### SnImage Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| error | `()` | 加载失败时的占位内容 |
| placeholder | `()` | 图片未加载完成时的占位内容 |

### SnImage Methods

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| showPreview | `() => void` | 手动打开大图预览 |
| click | `() => void` | 同 showPreview |

### SnImageGroup Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| src-list | `string[]` | `undefined` | 独立图片列表，预览直接浏览该列表（忽略成员图片） |
| current | `number` | `undefined` | 当前预览下标，支持 v-model:current |
| default-current | `number` | `0` | 非受控时的初始下标 |
| show | `boolean` | `undefined` | 预览显示状态，支持 v-model:show |
| default-show | `boolean` | `false` | 非受控时的初始显示状态 |
| show-toolbar | `boolean` | `true` | 预览时是否显示底部工具栏 |
| show-toolbar-tooltip | `boolean` | `false` | 工具栏按钮显示原生 title 提示 |
| keep-drag-offset | `boolean` | `false` | 拖拽松手后保留偏移 |
| render-toolbar | `(props: { nodes }) => VNodeChild` | `undefined` | 自定义工具栏渲染函数 |

### SnImageGroup Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| update:current | `(value: number)` | 预览下标变化（v-model:current） |
| update:show | `(value: boolean)` | 预览显示状态变化（v-model:show） |
| preview-next | `()` | 点击下一张 |
| preview-prev | `()` | 点击上一张 |

### SnImageGroup Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| default | `()` | 组内图片内容 |

### 键盘与交互

- 预览打开时 `Esc` 关闭，`←` / `→` 切换（组内），`↑` / `↓` 缩放，空格阻止页面滚动
- 大图支持按住拖拽平移、双击在原始尺寸与适屏之间切换、滚轮缩放
- 浮层打开期间锁定页面滚动
