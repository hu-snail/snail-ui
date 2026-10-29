# Captcha 拼图验证（uni 端 / 移动端）

`sn-captcha` 是 `@snui/uni` 的拼图滑块验证：拖动拼图块与底图缺口对齐，容差内松手触发 `success`，否则 `fail` 抖动归位。弹层形态（全屏遮罩 + 居中面板），带"换一张"与关闭按钮。基于 easycom 自动注册（`components/sn-captcha/sn-captcha.vue` → `<sn-captcha>`），几何值走 `rpx`。舞台宽度在打开 / 挂载时测量一次（暴露 `init()` 可重测）。

## 与 lime-ui `l-captcha` 的差异

- **无 canvas**：lime 用 canvas 从原图裁出缺口；小程序 canvas 层级 / H5 一致性差。本实现缺口 = 半透明虚线槽位，拼图块 = 目标位置的源图切片（CSS 位移裁切），对齐时视觉无缝，H5 / MP 表现一致。
- `refresh` 内置为右上角按钮（lime 经插槽自定义）。
- 仅校验"几何对齐"；防机器人需服务端二次校验（与 lime 相同前提）。

## 基础用法

v-model 控制显隐；`src` 为底图；`success` / `fail` 回调驱动业务。

<Demo name="captcha-mp-basic" description="拼图验证：v-model 打开弹层，拖动拼图对齐缺口，success / fail 回调。" />

## 自定义（`tips` / `successText` / `width` / `height` / `tolerance` / `closeOnClickModal`）

覆盖提示与成功文案；调整舞台尺寸；放宽对齐容差；禁止点遮罩关闭。

<Demo name="captcha-mp-custom" description="自定义文案 / 尺寸 / 容差 / 不可点遮罩。" />

## Props

| 属性                 | 类型      | 默认值 | 说明                                   |
| -------------------- | --------- | ------ | -------------------------------------- |
| `v-model`            | `boolean` | `false`| 弹层显隐                               |
| `src`                | `string`  | `''`   | 背景图（网络 / 包内路径，不支持 base64）|
| `width`              | `number`  | `300`  | 舞台最大宽度（设计 px）                |
| `height`             | `number`  | `200`  | 舞台高度（设计 px）                    |
| `tips`               | `string`  | `''`   | 提示文案（空 = 内置）                  |
| `successText`        | `string`  | `''`   | 成功文案（空 = 内置"验证通过"）        |
| `tolerance`          | `number`  | `10`   | 对齐容差（px）                         |
| `zIndex`             | `number`  | `100`  | 弹层层级                               |
| `closeOnClickModal`  | `boolean` | `true` | 点遮罩关闭                             |
| `refreshable`        | `boolean` | `true` | 显示"换一张"按钮                       |
| `customClass` / `customStyle` | `string` | `''` | 根节点自定义类名 / 样式        |

## Events

| 事件名    | 说明                           | 参数 |
| --------- | ------------------------------ | ---- |
| `success` | 松手时与目标 X 距离 ≤ 容差     | —    |
| `fail`    | 未对齐即松手（抖动 + 归位）    | —    |
| `refresh` | 重新掷缺口位置                 | —    |
| `close`   | 弹层关闭（手动 / 成功后自动）  | —    |

## Exposed API

| 成员                          | 签名         | 说明                     |
| ----------------------------- | ------------ | ------------------------ |
| `init`                        | `() => void` | 重新测量舞台宽度         |
| `refresh`                     | `() => void` | 重新掷缺口并复位拼图块   |
| `reset`                       | `() => void` | 复位拼图块与验证状态     |
| `target` / `offset` / `state` | `Ref`        | 位置与状态（调试 / 测试）|

## 主题变量

| 变量                 | 用途                                     |
| -------------------- | ---------------------------------------- |
| `--sn-mp-*` 全局别名 | 面板 / 圆角 / 阴影 / 成功色均走全局 token，无组件私有颜色变量 |

## 无障碍

根节点 `role="dialog"` + `aria-modal`，`aria-label` 跟随提示文案；拼图块 / 刷新 / 关闭均带 `role="button"` 与 `aria-label`。
