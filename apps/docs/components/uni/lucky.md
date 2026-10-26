# Lucky 抽奖九宫格（uni 端）

`sn-lucky` 是九宫格抽奖：`play()` 开始沿周长循环高亮，宿主拿到结果后 `stop(index)` 减速落定。

## 何时使用

- 营销抽奖（九宫格）场景
- 中奖结果由后端决定、前端负责两段式动画（加速 → 减速落定）

## 代码演示

### 基础用法

点击中间按钮开始；`start` 后在宿主请求结果，再调用 `stop(index)`，落定触发 `end(index)`。奖品沿周长顺时针排列，中间按钮占位。

<Demo name="lucky-mp" description="3×3 九宫格，play/stop 两段式动画，自定义格子插槽。" />

### 自定义格子与按钮

`prize` 插槽拿到 `{ item, index, isActive }` 自定义格子；`button` 插槽拿到 `{ isPlaying }` 自定义按钮。

## API

### Props

| 名称          | 类型             | 默认值      | 说明                                             |
| ------------- | ---------------- | ----------- | ------------------------------------------------ |
| `rows`        | `number`         | `3`         | 行数（≥3）                                       |
| `cols`        | `number`         | `3`         | 列数（≥3）                                       |
| `prizes`      | `SnLuckyPrize[]` | `[]`        | 奖品列表（沿周长排列，`{ name, img?, color? }`） |
| `gutter`      | `string`         | `'8rpx'`    | 格子间距                                         |
| `cellHeight`  | `string`         | `'120rpx'`  | 格子高度                                         |
| `speed`       | `number`         | `60`        | 循环高亮步进间隔（ms）                           |
| `customClass` | `string`         | `undefined` | 根节点自定义类名                                 |
| `customStyle` | `string`         | `undefined` | 根节点自定义样式                                 |

### Events

| 名称    | 参数              | 说明                |
| ------- | ----------------- | ------------------- |
| `start` | —                 | `play()` 开始时触发 |
| `end`   | `(index: number)` | 落定，中奖奖品索引  |

### Slots

| 名称     | 参数                        | 说明           |
| -------- | --------------------------- | -------------- |
| `prize`  | `{ item, index, isActive }` | 自定义奖品格   |
| `button` | `{ isPlaying }`             | 自定义中间按钮 |

### Methods

| 名称   | 类型                      | 说明                                 |
| ------ | ------------------------- | ------------------------------------ |
| `play` | `() => void`              | 开始循环高亮                         |
| `stop` | `(index: number) => void` | 减速停止到指定索引（未 play 时忽略） |

## 暗色模式

格子与按钮全部来自 `--sn-mp-*` token，暗色下自动适配；`color` 字段优先。
