# Marquee 跑马灯（Web 端）

`SnMarquee` 把插槽里的**一份**内容在裁剪盒内无缝循环滚动，常用于公告条、促销条、滚动通知。

## 何时使用

- 站内公告、活动信息、实时动态等「一句话说不完但只需一眼扫过」的内容
- 需要竖向滚动的一行一条通知板
- 空间有限、不适合换行展示的长文案

不适合：内容很短（一屏放得下）时不需要滚动；重要信息需要用户停留阅读时，请用普通文案而不是跑马灯。

## 代码演示

### 基础用法

默认向左滚动，悬停暂停。

<Demo name="marquee-web-basic" description="基础横向跑马灯：默认 12 秒一轮、24px 间距、悬停暂停。" />

### 四个方向

`direction` 控制内容行进方向；竖向滚动需要给 `height` 一个固定高度作为裁剪视口。

<Demo name="marquee-web-direction" description="left / right / up / down 四个方向，竖向配合 height 使用。" />

### 通知栏形态

`playing` 受控暂停 / 恢复，`pause-on-hover` 控制悬停是否暂停。

<Demo name="marquee-web-notice" description="标签 + 跑马灯 + 播放暂停按钮的公告条。" />

## API

### SnMarquee Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| direction | `'left' \| 'right' \| 'up' \| 'down'` | `'left'` | 内容行进方向。 |
| duration | `number` | `12` | 一轮完整滚动的秒数。非有限值 / 非正数回退为 `12`。 |
| repeat | `number` | `2` | 渲染几份插槽内容。强制取整并至少为 2（`Math.max(2, Math.floor(...))`）。 |
| gap | `number \| string` | `24` | 两份内容之间的距离，数字按 px 处理。以「尾部内边距」的形式加在每一份内容上。 |
| pauseOnHover | `boolean` | `true` | 鼠标悬停时暂停动画。 |
| playing | `boolean` | `true` | 是否正在滚动，`false` 时原地冻结。 |
| vertical | `boolean` | `false` | 竖向滚动简写：`direction` 不是 `'up'` / `'down'` 时等价于 `direction="up"`。 |
| height | `number \| string` | `undefined` | 盒子高度（数字按 px）。竖向跑马灯建议显式设置，否则没有可裁剪的视口。 |

### SnMarquee Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| default | `()` | **一份**内容。组件内部会自动复制，调用方不要重复写多份。 |

### SnMarquee Events

无。滚动完全由 CSS 驱动，组件不抛出任何事件。

## 无缝循环原理

- 根节点 `overflow: hidden` 负责裁剪，真正被动画的是内部 `.sn-marquee__track`：一条包含 `repeat` 份相同内容的 flex 轨道。
- `gap` 以内边距形式加在**每一份内容的尾部**（横向 `padding-right`，竖向 `padding-bottom`）。刻意不用轨道上的 flex `gap`：flex 间距只会作用 `repeat - 1` 次且不含首尾相接处，滚动到接缝时会塌成一段空隙，露出循环痕迹。
- 一轮的位移正好等于一份内容盒（内容 + 尾部间距）= 轨道的 `100% / repeat`，通过 `--sn-marquee-shift` 下发（`repeat: 2` 即 `-50%`）。因此第 2 份会精确出现在第 1 份的起始位置，接缝不可见。
- `direction="right"` / `"down"` 复用同一组关键帧并置 `animation-direction: reverse`，无需第二套关键帧。
- 每一份都是 `flex: 0 0 auto`，不会被压缩到彼此不同宽，破坏接缝对齐。

## 无障碍

- 只有第一份内容对辅助技术可见，其余每一份都带 `aria-hidden="true"`，读屏只会念一遍而不是 N 遍。
- 根节点为 `role="marquee"` + `aria-live="off"`，滚动文字不会被逐字播报。
- 尊重 `prefers-reduced-motion: reduce`：直接 `animation: none` 停掉动画，内容原地静止可读。

## 主题

组件消费 `--sn-web-*` token 别名（文字色、背景、字号、行高），每个声明都带字面量兜底；改主题靠覆盖 token。
`--sn-marquee-duration` / `--sn-marquee-shift` 是组件内部动画参数（行内下发），不是设计 token。

## 设计差异

- naive-ui 没有同类组件（已核对 naive-ui `src/components.ts` 组件清单），按 §112 属于**显式 divergence**：prop 面参考事实标准 `react-fast-marquee` / `vue3-marquee` 的命名（`direction` / `duration` / `gap` / `pauseOnHover` / `playing`）。已废弃的 HTML `<marquee>` 元素刻意不使用。
- 用 `duration`（秒 / 轮）而不是 `speed`（px/s）：时长与内容宽度解耦，同一份配置对短公告和宽卡片流都成立。
- 没有 JS ticker / `requestAnimationFrame` / 定时器，只有一条 CSS 关键帧，因此不存在需要 `dispose` 的资源。
- 不提供 `autoFill`（按容器宽度自动补足份数）：需要挂载后测量会导致同步回流；宽度很大的场景请自行提高 `repeat`。
- 不提供 `gradient` 边缘渐隐：渐隐需要写死颜色，本库把颜色放在 token 而不是 prop 上。

完整契约见组件 `ai-description.md`。