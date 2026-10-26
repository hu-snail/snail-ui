# Infinite Scroll 无限滚动 · Web（PC 端）

滚动容器在接近底部时自动触发加载回调，内置加载中转圈与防重复触发。

## 何时使用

- 长列表、消息流、时间线等需要滚动到底部自动加载更多内容的场景。
- 希望用统一的加载动效替代各处手写的触底判断与 loading 占位。

## 代码演示

### 基础用法

容器需要显式高度；距底部 `distance` px 内滚动即触发 `load`。

<Demo name="infinite-scroll-web-basic" description="height 240px + distance 10，触底追加内容。" />

### 消息流

`load` 期间在底部显示加载转圈，内容不再增长时自行停止追加。

<Demo name="infinite-scroll-web-chat" description="消息流 + pending 转圈 + 没有更多提示。" />

## API

### SnInfiniteScroll Props

| 名称           | 类型                          | 默认值      | 说明                                                                 |
| -------------- | ----------------------------- | ----------- | -------------------------------------------------------------------- |
| distance       | `number`                      | `0`         | 触底触发 `load` 的距离阈值（px）                                     |
| load           | `() => Promise<void> \| void` | `undefined` | 触底时的加载回调；Promise 未决期间不重复触发，拒绝会被吞掉并复位状态 |
| scrollbarProps | `Record<string, unknown>`     | `undefined` | 附加到内部滚动容器上的属性                                           |
| showLoading    | `boolean`                     | `true`      | `load` 未决期间在内容底部显示转圈                                    |

### SnInfiniteScroll Events

无。加载回调通过 `load` prop 传入。

### SnInfiniteScroll Slots

| 名称    | 参数 | 说明     |
| ------- | ---- | -------- |
| default | —    | 滚动内容 |

尺寸由使用方控制（如 `style="height: 240px"`），根元素即滚动容器（`overflow: auto`）。

完整契约见组件 `ai-description.md`。
