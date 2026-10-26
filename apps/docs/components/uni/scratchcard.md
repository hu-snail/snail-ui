# Scratchcard 刮刮乐（uni 端）

`sn-scratchcard` 在内容上覆盖一层可刮开的涂层，刮开比例超过阈值后整层揭开并触发 `open`。

## 何时使用

- 刮奖 / 优惠券 / 惊喜盒等"揭开见奖"场景

## 代码演示

### 基础用法

奖品类容放在默认插槽；`ratio` 控制阈值（刮开面积占比），`title` / `watermarkText` 定制封面。

<Demo name="scratchcard-mp" description="真刮擦（指针擦除涂层）、阈值 open 回调与重置。" />

### 双端渲染策略

- **uni-app x App / H5**：元素级 2d canvas，指针移动实时以 `destination-out` 擦除，`touchend` 采样透明比例。
- **小程序 / App-vue**：旧版 canvas 上下文不支持合成擦除，封面退化为点按整层揭示（同样触发 `open`），行为显式可预期。

## API

### Props

| 名称             | 类型     | 默认值              | 说明                                        |
| ---------------- | -------- | ------------------- | ------------------------------------------- |
| `coverColor`     | `string` | `'#C5C5C5'`         | 封面颜色（`coverImg` 优先）                 |
| `coverImg`       | `string` | `''`                | 封面图片                                    |
| `ratio`          | `number` | `0.8`               | 刮开比例阈值（0-1）                         |
| `scratchRadius`  | `number` | `10`                | 刮擦半径（px）                              |
| `watermarkText`  | `string` | `''`                | 封面水印文字                                |
| `watermarkSize`  | `number` | `14`                | 水印字号（px）                              |
| `watermarkColor` | `string` | `'rgba(0,0,0,0.1)'` | 水印颜色                                    |
| `title`          | `string` | `''`                | 封面标题文字                                |
| `titleSize`      | `number` | `24`                | 标题字号（px）                              |
| `titleColor`     | `string` | `'rgba(0,0,0,0.8)'` | 标题颜色                                    |
| `customClass`    | `string` | `undefined`         | 根节点自定义类名                            |
| `customStyle`    | `string` | `undefined`         | 根节点自定义样式（至少提供 width / height） |

### Events

| 名称   | 参数 | 说明                                  |
| ------ | ---- | ------------------------------------- |
| `open` | —    | 刮开比例超过 `ratio` 时触发（一次性） |

### Slots

| 名称      | 参数 | 说明               |
| --------- | ---- | ------------------ |
| `default` | —    | 刮层下方的奖品内容 |

### Methods

| 名称    | 类型         | 说明                   |
| ------- | ------------ | ---------------------- |
| `reset` | `() => void` | 重绘封面，恢复可刮状态 |

## 暗色模式

奖品内容由宿主插槽提供；封面色为营销色，建议暗色下通过 `coverColor` 传入深色。
