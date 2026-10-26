# Dialer 大转盘（uni 端）

`sn-dialer` 是抽奖大转盘：扇区由奖品列表驱动，宿主决定中奖索引后调用 `run(index)` 落定。

## 何时使用

- 营销抽奖（转盘 / 大转盘）场景
- 中奖结果由后端决定、前端只负责动画的过程展示

## 代码演示

### 基础用法

点击中心 GO 触发 `click`（此时请求后端），拿到结果调用 `run(index)`，旋转结束派发 `done(index)`。

<Demo name="dialer-mp" description="6 奖品转盘，点击 GO 随机落点，done 展示结果。" />

### 扇区配色

默认按 `prizeBgColors` 两色交替；奖品项的 `color` 字段优先。扇区数量取 `prizeList.length`（2-12）。

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `prizeList` | `SnDialerPrize[]` | `[]` | 奖品列表（`{ id, name, img?, color? }`，2-12 项） |
| `turns` | `number` | `5` | 旋转圈数 |
| `duration` | `number` | `3` | 旋转时长（秒） |
| `size` | `string` | `'600rpx'` | 转盘直径 |
| `prizeBgColors` | `string[]` | `['#FFF0A3', '#FFFCE6']` | 交替扇区背景色 |
| `borderColor` | `string` | `'#FFD752'` | 转盘描边色 |
| `fontSize` | `string` | `'24rpx'` | 奖品名字号 |
| `color` | `string` | `undefined` | 奖品名颜色，默认文本 token |
| `customClass` | `string` | `undefined` | 根节点自定义类名 |
| `customStyle` | `string` | `undefined` | 根节点自定义样式 |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `click` | — | 点击指针（旋转中不触发） |
| `done` | `(index: number)` | 旋转结束，落定奖品索引 |

### Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `prize` | `{ item, index }` | 自定义奖品内容 |
| `pointer` | — | 自定义指针，默认 GO 按钮 |

### Methods

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `run` | `(index: number) => void` | 开始旋转到指定奖品索引（旋转中调用被忽略） |

## 暗色模式

扇区配色为明快营销色，暗色下建议宿主通过 `prizeBgColors` 传入深色系配色。
