# Liquid 水波进度球（uni 端）

`sn-liquid` 用水波动画展示百分比进度，适合任务完成度、筹款进度、水量等场景。

## 何时使用

- 需要一个比线性进度条更有表现力的百分比展示
- 任务完成度、储能 / 筹款 / 库水位等"液面上升"隐喻

## 代码演示

### 基础用法

水位由 `percent` 驱动（0-100 自动夹取），`v-model:current` 拿到过渡值；默认球心显示百分比文字，可用插槽自定义。

<Demo name="liquid-mp" description="基础 / outline 外圈 / 自定义波浪色，点击按钮渐增进度。" />

## API

### Props

| 名称          | 类型      | 默认值      | 说明                              |
| ------------- | --------- | ----------- | --------------------------------- |
| `percent`     | `number`  | `0`         | 进度百分比（0-100，超出自动夹取） |
| `size`        | `string`  | `'160rpx'`  | 球体尺寸（rpx / px）              |
| `duration`    | `number`  | `500`       | 水位过渡时长（ms），0 立即到位    |
| `outline`     | `boolean` | `false`     | 是否显示外圈描边                  |
| `radius`      | `string`  | `'50%'`     | 圆角                              |
| `waveColor`   | `string`  | `undefined` | 波浪颜色，默认主色 token          |
| `innerColor`  | `string`  | `undefined` | 水面以上背景色，默认主色浅 token  |
| `customClass` | `string`  | `undefined` | 根节点自定义类名                  |
| `customStyle` | `string`  | `undefined` | 根节点自定义样式                  |

### Events

| 名称             | 参数              | 说明                                     |
| ---------------- | ----------------- | ---------------------------------------- |
| `update:current` | `(value: number)` | 过渡中的水位值（配合 `v-model:current`） |

### Slots

| 名称      | 参数 | 说明                                |
| --------- | ---- | ----------------------------------- |
| `default` | —    | 球心自定义内容，默认渲染 `current%` |

### Methods

| 名称 | 类型 | 说明           |
| ---- | ---- | -------------- |
| —    | —    | 组件无对外方法 |

## 暗色模式

颜色全部来自 `--sn-mp-*` token，包在 `<sn-config-provider theme="dark">` 内即可验证。
