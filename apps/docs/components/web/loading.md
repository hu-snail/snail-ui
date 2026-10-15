# Loading 加载中（Web 端）

`SnLoading` 是加载指示器。单独使用只渲染一个转圈图标；传入默认插槽后变成遮罩层，内容保持挂载、被压暗且不可交互。props 与语义按 [naive-ui `n-spin`](https://www.naiveui.com/zh-CN/light/components/spin) 1:1 对齐（AGENTS.md §112）。

典型场景：按钮提交态、列表懒加载、局部区块刷新。

## 实时预览

<Demo name="loading-web-basic" description="五个内置尺寸档 + 数字尺寸" />

<Demo name="loading-web-wrapper" description="传入默认插槽变成遮罩层，请求期间内容压暗" />

<Demo name="loading-web-custom" description="自定义弧线颜色 / 图形插槽 / delay 防闪烁" />

## 基础用法

```ts
import { SnLoading } from '@snui/vue-web'
import '@snui/tokens-web/styles'
```

```html
<SnLoading />
<SnLoading size="large" description="加载中" />
```

`size` 接受 `'tiny' | 'small' | 'medium' | 'large' | 'huge'` 或一个数字（按 px 处理）。数字尺寸的弧线宽度沿用 `medium` 档。

## 遮罩模式

传入默认插槽即切换为遮罩模式 —— 内容照常渲染，spinner 居中覆盖其上：

```html
<SnLoading :show="loading" description="加载中...">
  <div>内容</div>
</SnLoading>
```

`show` 默认 `true`。激活时内容获得降低后的透明度与 `pointer-events: none`，因此请求进行中无法被点击。spinner 的显隐走 `Transition` 淡入淡出。

## 延迟显示

`delay` 让 spinner 延后 N 毫秒出现。**隐藏永远是即时的** —— 挂起的定时器会被取消，所以 200ms 内就返回的请求不会闪一下：

```html
<SnLoading :show="loading" :delay="400"><p>内容</p></SnLoading>
```

### 受控与劫持

`spinning` 是上游的废弃别名，两者同时给出时 `spinning` 获胜。传入 `spinning` 会在控制台打印一条弃用警告。

## 自定义图形与颜色

```html
<SnLoading stroke="var(--vp-c-brand-1)" />
<SnLoading>
  <template #icon>
    <MySpinner />
  </template>
</SnLoading>
```

`stroke` 改的是内建弧线颜色。`icon` 插槽会整体替换内建图形；此时 `rotate`（默认 `true`）决定是否用 CSS 旋转它 —— 内建 SVG 由 SMIL 驱动，不受 `rotate` 影响。

## API

### SnLoading Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `size` | `'tiny' \| 'small' \| 'medium' \| 'large' \| 'huge' \| number` | `'medium'` | 尺寸档或像素数值 |
| `show` | `boolean` | `true` | 是否显示 spinner |
| `delay` | `number` | `undefined` | 延后多少毫秒显示；隐藏始终即时 |
| `rotate` | `boolean` | `true` | 是否旋转自定义 `icon` 内容 |
| `description` | `string` | `undefined` | spinner 下方的文字 |
| `contentClass` | `string` | `undefined` | 施加到被包裹内容上的 class |
| `contentStyle` | `string \| Record<string, string \| number>` | `undefined` | 施加到被包裹内容上的样式 |
| `stroke` | `string` | `undefined` | 弧线颜色，默认取 `--sn-web-spin-color` |
| `strokeWidth` | `number` | 按尺寸档推导 | 弧线粗细（SVG 单位） |
| `scale` | `number` | `1` | 整体缩放系数 |
| `radius` | `number` | `100` | 弧线半径（设计单位） |
| `spinning` | `boolean` | `undefined` | **@deprecated**，请使用 `show` |

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 被包裹的内容；存在时切换为遮罩模式 |
| `description` | 富文本说明，覆盖 `description` prop |
| `icon` | 自定义 spinner 图形，替换内建 SVG 弧线 |

### Tokens

组件消费 `--sn-web-spin-*`，它们是 `--aui-*` 的别名：

| Token | 说明 |
| --- | --- |
| `--sn-web-spin-size-tiny` / `-small` / `-medium` / `-large` / `-huge` | 五个尺寸档 |
| `--sn-web-spin-color` | 弧线颜色 |
| `--sn-web-spin-text-color` | `description` 文字颜色 |
| `--sn-web-spin-font-size` | `description` 字号 |
| `--sn-web-spin-description-gap` | spinner 与文字间距 |
| `--sn-web-spin-opacity-spinning` | 激活时被包裹内容的透明度 |

## 无障碍

- 两种模式的根元素都带 `role="img"` + `aria-label="loading"`
- 内建 SVG 为 `aria-hidden="true"` + `focusable="false"`，可访问名称来自根元素的 `aria-label`
- 激活时被包裹内容获得 `pointer-events: none` 与 `user-select: none`，避免误操作
- 尊重 `prefers-reduced-motion: reduce`：关闭自定义图标的旋转与所有过渡

## 与 n-spin 的差异（§112 future markers）

- spinner 图形抽到内部 `SnLoadingSpinner.vue`，让裸模式与遮罩模式共用一份 SVG 定义而非各写一遍。它保留上游基于 SMIL 的弧线动画，但改用 `currentColor` 着色 —— 因此 `stroke` 无需上游额外那一跳 inline style 即可生效。
- `size` 的数字分支上游走 `pxfy()`，这里直接按 px 处理。
- 上游按尺寸档输出 `--n-*` 主题变量；本库改用 `--sn-web-spin-*` token 块。
- 弧线循环时长（`1.6s`）与 CSS 旋转时长（`2s`）为硬编码值，未接入 theme token —— tokens 包尚无 motion 别名，SnConfigProvider 也尚未建模。
- 未复刻上游遮罩层的 `n-spin-body` 绝对定位换行细节，改用简单的居中 overlay。
- 遮罩出现/消失对辅助技术的通知依赖 `aria-busy`/`aria-live` 区域，当前仅靠 `role="img"`；`aria-live` 区域待补。

## 相关

- [`SnCard`](/components/web/card) —— 常作为遮罩模式的容器
- [`SnAlert`](/components/web/alert) —— 请求结束后的结果反馈
