# sn-captcha

jigsaw slider captcha (uni 端 / 移动端 / 小程序 / H5)。

- Reference library: lime-ui `l-captcha`（内部元信息，见 AGENTS.md §112 / §114.4）
- Additive: `inline` 内嵌形态、桌面 H5 鼠标拖拽（AUI-OPT-12，AGENTS.md §112.3a）

## 什么时候用

- 需要一个"证明是真人"的交互式验证：拖动拼图块与缺口对齐。
- 表单原地校验：`inline` 把验证块嵌进页面流，不打断用户。
- 风控分级：先用 `sn-slide-verify` 过一遍，必要时再升级到拼图。
- 不要用于：行为式滑块（用 `sn-slide-verify`）、短信/图形验证码输入（host 业务）、服务端校验（host 必须）。

## 基本用法（弹层）

```vue
<script setup lang="ts">
import { ref } from 'vue';
const show = ref(false);
function onPass() { /* 发送业务请求，由 host 做服务端校验 */ }
</script>

<template>
  <sn-button type="primary" @tap="show = true">验证</sn-button>
  <sn-captcha
    v-model="show"
    src="https://picsum.photos/seed/snui-captcha-basic/600/400"
    :width="300"
    :height="200"
    @success="onPass"
    @fail="() => {}"
  />
</template>
```

## 内嵌形态

```vue
<sn-captcha inline :src="bg" :width="300" :height="190" @success="onPass" />
```

`inline` 不渲染遮罩与关闭按钮，通过后不自动关闭（停在通过态），`v-model` 不参与显隐。

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `v-model` | `boolean` | `false` | 弹层显隐（`inline` 下忽略） |
| `src` | `string` | `''` | 背景图地址（网络 / 包内路径，不支持 base64） |
| `width` | `number` | `300` | 舞台最大宽度（设计 px）；也是无法测量时的行程基准 |
| `height` | `number` | `200` | 舞台高度（设计 px） |
| `tips` | `string` | `''` | 提示文案（空 = 内置"拖动拼图，对齐缺口"） |
| `successText` | `string` | `''` | 成功文案（空 = 内置"验证通过"） |
| `tolerance` | `number` | `10` | 对齐容差（设计 px） |
| `zIndex` | `number` | `100` | 弹层层级（`inline` 下不生效） |
| `closeOnClickModal` | `boolean` | `true` | 点遮罩关闭 |
| `refreshable` | `boolean` | `true` | 显示"换一张"按钮 |
| `inline` | `boolean` | `false` | 内嵌展示：无遮罩 / 无关闭按钮 / 通过后不自动关闭 |
| `customClass` / `customStyle` | `string` | `''` | 根节点类名 / 内联样式 |

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `success` | 松手时与目标 X 的距离 ≤ `tolerance` | — |
| `fail` | 未对齐即松手（抖动 + 归位） | — |
| `refresh` | 换图按钮被点击（缺口重新掷位） | — |
| `close` | 弹层关闭（手动 / 成功后自动） | — |

## Exposed API

| 成员 | 签名 | 说明 |
| --- | --- | --- |
| `init` | `() => void` | 重新测量舞台宽度 |
| `refresh` | `() => void` | 重新掷缺口并复位拼图块 |
| `reset` | `() => void` | 复位拼图块与验证状态 |
| `target` / `offset` / `state` | `Ref` | 缺口位置 / 拼图位移 / 验证状态（调试与测试用） |

## 拖拽与测量（实现约定）

- 位移与缺口统一用设计 px（`1 设计 px = 2rpx`）；指针位移经 `pxPerDesign()` 换算：
  有效视口上限 960px（uni H5 的 `rpxCalcMaxDeviceWidth` 默认值），超过后回落到 375px 基准。
- 舞台测量顺序：DOM 盒子（`resolveNodeEl` 先解 `$el` —— uni H5 的 `<view>` 是组件，
  ref 拿到的是组件实例）→ `uni.createSelectorQuery()`（小程序 / App）→ `width` 属性兜底。
  三者都失败也不会把行程锁死为 0。
- 桌面 H5 鼠标拖拽由 `sn-captcha-mouse.ts` 的 `bindHorizontalDragMouse` 提供（与
  `sn-slide-verify` 共用）；触摸手势进行时鼠标输入让位，触摸后 500ms 内的合成
  mousedown 被忽略。

## 与参考实现的差异

- **无 canvas**：缺口以半透明虚线槽位呈现，拼图块 = 目标位置的源图切片（CSS 位移裁切），
  对齐时视觉无缝，H5 / 小程序表现一致。
- `refresh` 内置为右上角按钮。
- 仅校验"几何对齐"；防机器人需服务端二次校验。

## 主题变量

| 变量 | 用途 |
| --- | --- |
| `--sn-mp-color-background-overlay` | 弹层遮罩 |
| `--sn-mp-color-background-elevated` | 面板底板 |
| `--sn-mp-color-background-surface` | 内嵌模式底板 |
| `--sn-mp-color-background-soft` | 舞台底色（底图加载前） |
| `--sn-mp-color-feedback-success` | 通过态描边与文案 |
| `--sn-mp-radius-*` / `--sn-mp-shadow-*` | 圆角与投影 |

颜色只走 `var(--sn-mp-color-*)`，无浅色兜底（AGENTS.md §112.5）。

## 无障碍

- 弹层根节点 `role="dialog"` + `aria-modal="true"`；`inline` 退化为 `role="group"`。
- `aria-label` 跟随提示文案（通过后变成功文案）。
- 拼图块 / 换图 / 关闭：`role="button"` + `aria-label`；缺口 `aria-hidden`。

## uni-x

- 转换产物的既有 issue 仅 `template-attr`（`@tap` → `@click`、`data-*` 剥离），
  无伪类 / 伪元素 / 属性选择器 / 组合器类 issue（见 `packages/uni-x/PORTING-REPORT.md`）。
