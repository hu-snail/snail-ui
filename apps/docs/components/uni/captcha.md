# Captcha 拼图验证（uni 端 / 移动端）

`sn-captcha` 是 `@snui/uni` 的拼图滑块验证：拖动拼图块与底图缺口对齐，容差内松手触发 `success`，否则 `fail` 抖动归位。默认以弹层形态出现（全屏遮罩 + 居中面板，带"换一张"与关闭按钮），也可以用 `inline` 直接嵌在页面流里。基于 easycom 自动注册（`components/sn-captcha/sn-captcha.vue` → `<sn-captcha>`），几何值走 `rpx`。舞台宽度在打开 / 挂载时测量一次（暴露 `init()` 可重测）。

## 实现说明

- **不用 canvas**：缺口以半透明槽位呈现，拼图块是目标位置的源图切片（CSS 位移裁切），对齐时视觉无缝，H5 / 小程序表现一致。
- 刷新按钮内置在面板右上角。
- 仅校验「几何对齐」；真正的防机器人需服务端二次校验。
- 桌面 H5 额外支持鼠标拖拽，触摸与鼠标共用同一套位移换算。

## 基础用法

`v-model` 控制显隐；`src` 为底图；`success` / `fail` 回调驱动业务。

<Demo name="captcha-mp-basic" description="拼图验证：v-model 打开弹层，拖动拼图对齐缺口，success / fail 回调。" />

## 内嵌展示

`inline` 让验证块直接渲染在页面流中（不渲染遮罩、不抢焦点），适合表单原地校验：

<Demo name="captcha-mp-verify" description="inline 内嵌：拼图验证直接排在页面里，成功后 success 回报。" />

## 点击弹出

默认形态：触发器打开遮罩弹层；`closeOnClickModal` 控制点遮罩是否关闭，`refreshable` 控制刷新按钮：

<Demo name="captcha-mp-popup" description="点击弹出弹层；close-on-click-modal 与 refreshable 的两种行为。" />

## 两段式验证（组合滑块）

先低成本滑块、通过后再升级为拼图——常见的风控分级路径。两段都通过才算整链通过：

<Demo name="captcha-mp-interaction" description="与 sn-slide-verify 组合：滑块通过后解锁拼图，两段都过为整链通过。" />

## 自定义（`tips` / `successText` / `width` / `height` / `tolerance` / `closeOnClickModal`）

覆盖提示与成功文案；调整舞台尺寸；放宽对齐容差；禁止点遮罩关闭。

<Demo name="captcha-mp-custom" description="自定义文案 / 尺寸 / 容差 / 不可点遮罩。" />

## Props

| 属性                          | 类型      | 默认值  | 说明                                    |
| ----------------------------- | --------- | ------- | --------------------------------------- |
| `v-model`                     | `boolean` | `false` | 弹层显隐（`inline` 时表示验证通过状态） |
| `src`                         | `string`  | `''`    | 背景图（网络 / 包内路径，不支持 base64） |
| `width`                       | `number`  | `300`   | 舞台最大宽度（设计 px）                 |
| `height`                      | `number`  | `200`   | 舞台高度（设计 px）                     |
| `tips`                        | `string`  | `''`    | 提示文案（空 = 内置）                   |
| `successText`                 | `string`  | `''`    | 成功文案（空 = 内置"验证通过"）         |
| `tolerance`                   | `number`  | `10`    | 对齐容差（px）                          |
| `zIndex`                      | `number`  | `100`   | 弹层层级                                |
| `closeOnClickModal`           | `boolean` | `true`  | 点遮罩关闭                              |
| `refreshable`                 | `boolean` | `true`  | 显示"换一张"按钮                        |
| `inline`                      | `boolean` | `false` | 内嵌展示（不渲染遮罩、不抢焦点）        |
| `customClass` / `customStyle` | `string`  | `''`    | 根节点自定义类名 / 样式                 |

## Events

| 事件名    | 说明                          | 参数 |
| --------- | ----------------------------- | ---- |
| `success` | 松手时与目标 X 距离 ≤ 容差    | —    |
| `fail`    | 未对齐即松手（抖动 + 归位）   | —    |
| `refresh` | 重新掷缺口位置                | —    |
| `close`   | 弹层关闭（手动 / 成功后自动） | —    |

## Exposed API

| 成员                          | 签名         | 说明                      |
| ----------------------------- | ------------ | ------------------------- |
| `init`                        | `() => void` | 重新测量舞台宽度          |
| `refresh`                     | `() => void` | 重新掷缺口并复位拼图块    |
| `reset`                       | `() => void` | 复位拼图块与验证状态      |
| `target` / `offset` / `state` | `Ref`        | 位置与状态（调试 / 测试） |

## 主题变量

| 变量                 | 用途                                                           |
| -------------------- | -------------------------------------------------------------- |
| `--sn-mp-*` 全局别名 | 面板 / 圆角 / 阴影 / 成功色均走全局 token，无组件私有颜色变量 |

## AI Patch Boundary

- AI 可通过 Patch 修改 `src` / `tips` / `successText` / `width` / `height` / `tolerance` / `inline` / `closeOnClickModal` / `refreshable` 等展示配置。
- `success` / `fail` / `refresh` / `close` 属于运行时校验结果，Patch 不应伪造验证通过事件或跳过校验。
- `zIndex` 属于宿主层级决策，Patch 不应随意抬高全局层级。

## 无障碍

根节点 `role="dialog"` + `aria-modal`（`inline` 时改为 `role="group"` 且不带 `aria-modal`），`aria-label` 跟随提示文案；拼图块 / 刷新 / 关闭均带 `role="button"` 与 `aria-label`。

## 暗色模式

面板、描边、成功态颜色全部来自 `--sn-mp-color-*`，没有浅色 `var()` 兜底，因此在 `.sn-theme-dark` 下自动适配。用 `sn-config-provider` 的 `theme="dark"` 包裹即可验证。
