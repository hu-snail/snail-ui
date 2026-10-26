# Carousel 轮播图（Web 端）

`SnCarousel` + `SnCarouselItem` 在有限空间内轮播展示内容，支持 slide / fade / card / custom 四种切换效果、循环克隆、自动播放、拖拽、滚轮与键盘切换。

## 何时使用

- Banner、精选内容、图片画廊等需要轮播的场景。
- 同屏展示多条同构内容（`slides-per-view`），支持逐屏切换。
- 需要自动播放、循环滚动（克隆首尾实现无缝循环）。

不适合：内容超过一屏、需要滚动浏览的长列表，用滚动容器或 `SnInfiniteScroll`。

## 代码演示

### 基础用法

默认 `effect="slide"`、`loop` 循环（首尾克隆实现无缝滚动）。

<Demo name="carousel-web-basic" description="基础轮播，循环滚动" />

### 自动播放

`autoplay` + `interval`，鼠标悬停暂停、移出恢复。

<Demo name="carousel-web-autoplay" description="autoplay 自动播放，hover 暂停" />

### 箭头

`show-arrow` 显示内置左右箭头（边界箭头在 `loop=false` 时禁用）。

<Demo name="carousel-web-arrow" description="show-arrow 内置箭头" />

### 指示点

`dot-type`（dot / line）与 `dot-placement`（top / bottom / left / right）。

<Demo name="carousel-web-dots" description="dot-type 线形指示点与 dot-placement 左侧布局" />

### 垂直方向

`direction="vertical"` 纵向滚动。

<Demo name="carousel-web-vertical" description="vertical 纵向轮播 + 右侧指示点" />

### 切换效果对比

`effect`：slide 平移 / fade 淡入淡出 / card 3D 卡片。

<Demo name="carousel-web-effect" description="slide / fade / card 三种效果对比" />

### 自定义过渡效果

`effect="custom"` 把过渡控制权交给业务：slide 通过 `v-show` 切换并包在 `<Transition>` 中，`transition-props` 接收任意 Vue `<Transition>` props，过渡类由业务自定义。

<Demo name="carousel-web-effect-custom" description="effect=custom + transition-props 自定义缩放淡入淡出" />

### 3D 卡片效果

`effect="card"` 内置 3D 卡片层叠：当前卡片居中，两侧卡片缩小退后，点击侧卡直接切换。

<Demo name="carousel-web-card-3d" description="effect=card 3D 卡片层叠" />

### 多屏展示

`slides-per-view` + `space-between`，一屏多卡逐屏切换。

<Demo name="carousel-web-slides-per-view" description="slides-per-view=3 + space-between" />

### 滚轮切换

`mousewheel`：鼠标悬停在轮播上滚动滚轮即可翻页。

<Demo name="carousel-web-mousewheel" description="mousewheel 滚轮切换" />

### 自定义箭头与指示点

`arrow` / `dots` 作用域插槽完全接管（{ total, currentIndex, to, prev, next, isPrevDisabled, isNextDisabled }）。

<Demo name="carousel-web-custom-arrow-and-dots" description="作用域插槽自绘箭头与序号指示点" />

### 视频

原生 `<video>` 直接放进 `SnCarouselItem` 即可作为轮播帧：离开当前帧时组件自动 `pause()` 其中的视频（不会后台漏音），视频上的按下不会触发拖拽。demo 不渲染原生工具栏（`controls`），点击视频播放/暂停。

<Demo name="carousel-web-video" description="视频 + 图片混排，切走自动暂停" />

### 业务场景

营销 banner（`title` / `description` 标题描述浮层）：

<Demo name="carousel-web-banner" description="营销 banner：caption 标题描述 + 线形指示点" />

电商商品卡片（`slides-per-view=3` + `space-between=16` + `loop`）：

<Demo name="carousel-web-product-cards" description="一屏三张商品卡，鼠标拖拽换页" />

新闻 / 公告（`direction="vertical"` + `autoplay`）：

<Demo name="carousel-web-news" description="纵向新闻滚动条，悬停暂停、可拖拽" />

## API

### SnCarousel Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| autoplay | `boolean` | `false` | 自动播放；悬停暂停，移出恢复 |
| centered-slides | `boolean` | `false` | 居中当前 slide（配合 slides-per-view / auto） |
| current-index | `number \| undefined` | `undefined` | 受控当前索引（`v-model:current-index`）；undefined 为非受控 |
| default-index | `number` | `0` | 初始索引（非受控） |
| direction | `'horizontal' \| 'vertical'` | `'horizontal'` | 滚动方向 |
| dot-placement | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | 指示点位置 |
| dot-type | `'dot' \| 'line'` | `'dot'` | 指示点形态 |
| draggable | `boolean` | `false` | 鼠标拖拽切换 |
| effect | `'slide' \| 'fade' \| 'card' \| 'custom'` | `'slide'` | 切换效果 |
| interval | `number` | `5000` | 自动播放间隔（ms） |
| loop | `boolean` | `true` | 两端循环（slide + 单屏时用首尾克隆实现无缝循环） |
| mousewheel | `boolean` | `false` | 滚轮切换 |
| next-slide-style | `CSSProperties \| string` | `undefined` | 下一张样式覆盖（card 模式） |
| prev-slide-style | `CSSProperties \| string` | `undefined` | 上一张样式覆盖（card 模式） |
| slides-per-view | `number \| 'auto'` | `1` | 每屏 slide 数；`'auto'` 按 DOM 实测宽度 |
| space-between | `number` | `0` | slide 间距（px） |
| show-arrow | `boolean` | `false` | 内置左右箭头（内联 SVG，零依赖） |
| show-dots | `boolean` | `true` | 指示点 |
| touchable | `boolean` | `true` | 触摸拖拽切换 |
| transition-style | `{ transitionDuration?, transitionTimingFunction? }` | `{ transitionDuration: '300ms' }` | slide/fade/card 过渡时长与缓动 |
| transition-props | `TransitionProps` | `undefined` | `effect="custom"` 时传给 `<Transition>` |
| trigger | `'click' \| 'hover'` | `'click'` | 指示点触发方式 |
| keyboard | `boolean` | `false` | 焦点在指示点上时方向键切换 |

事件：`update:current-index (currentIndex: number, lastIndex: number)`。

### SnCarouselItem Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| title | `string` | `undefined` | 底部渐变浮层的主标题（超出 naive 的扩展能力） |
| description | `string` | `undefined` | 标题下方的次级描述行 |

title / description / `caption` 插槽任一存在时渲染底部浮层（渐变背景 + 白字，`pointer-events: none` 不挡拖拽）；`caption` 插槽内容会替换 title/description 文本。

### Slots

| 组件 | 插槽 | 参数 | 说明 |
| --- | --- | --- | --- |
| SnCarousel | `default` | — | `<SnCarouselItem>` 序列（裸子元素会自动包一层 item） |
| SnCarousel | `arrow` | `{ total, currentIndex, to, prev, next, isPrevDisabled, isNextDisabled }` | 自定义箭头 |
| SnCarousel | `dots` | `{ total, currentIndex, to }` | 自定义指示点 |
| SnCarouselItem | `default` | `{ isPrev, isNext, isActive, index }` | slide 内容 |
| SnCarouselItem | `caption` | — | 自定义 caption 浮层内容（替换 title/description 文本） |

### Inst Methods

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| to | `(index: number) => void` | 跳转到指定索引 |
| prev | `() => void` | 上一张 |
| next | `() => void` | 下一张 |
| getCurrentIndex | `() => number` | 当前索引 |

## Divergence / future

- 与 naive 的有意分歧：`default-index` 在 naive 2.43.1 中因空列表初始化失效（恒为 0），本组件修正为真正生效。
- 超出 naive 的扩展能力（有意 divergence）：① `SnCarouselItem` 的 `title` / `description` props 与 `caption` 插槽（底部渐变文字浮层）；② slide 失去 current 态时自动 `pause()` 其内部 `<video>`（卸载时同样清理）；③ 拖拽起点落在交互元素（`video / audio / a / button / input / textarea / select / [contenteditable] / [data-no-drag]`）内时不启动拖拽，保证原生控件可用（naive 对所有 mouse 拖拽起点一律 `preventDefault`）。
- 文档 demo 全部默认开启 `draggable` 方便体验；组件默认值仍保持 `false`（保守默认）。
- 未提供 demo 的能力（API 已实现）：`space-between` 独立场景、`centered-slides`、`hover`/`keyboard`/`simulate-drag` 场景、`slides-per-view="auto"`、`dot-placement="top"/"right"`、`on-update:current-index` 受控联动。
- 拖拽几何（多页吸附、甩动阈值）在 `carousel-utils.ts` 纯函数层测试，happy-dom 不做 DOM 级拖拽断言（0×0 视口会把拖拽偏移钳到 0；交互元素抑制用例通过 stub `offsetWidth` 观察整条链路）。

完整契约见组件 `ai-description.md`。
