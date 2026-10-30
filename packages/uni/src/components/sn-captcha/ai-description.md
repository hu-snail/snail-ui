# sn-captcha

jigsaw slider captcha (uni 端 / 移动端 / 小程序 / H5)。

## 什么时候用

- 需要一个"证明是真人"的交互式验证：拖动拼图块与缺口对齐。
- 不要用于：行为式滑块（用 `sn-slide-verify`）、短信/图形验证码输入（host 业务）、服务端校验（host 必须）。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue';
const show = ref(false);
function onPass() { /* 发送业务请求 */ }
</script>

<template>
  <sn-button type="primary" @tap="show = true">验证</sn-button>
  <sn-captcha
    v-model="show"
    src="https://example.com/bg.jpg"
    :width="300"
    :height="200"
    @success="onPass"
    @fail="() => {}"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `v-model` | `boolean` | `false` | 弹层显隐 |
| `src` | `string` | `''` | 背景图地址（网络 / 包内路径，不支持 base64） |
| `width` | `number` | `300` | 舞台最大宽度（设计 px） |
| `height` | `number` | `200` | 舞台高度（设计 px） |
| `tips` | `string` | `''` | 提示文案（空 = 内置"拖动拼图，对齐缺口"） |
| `successText` | `string` | `''` | 成功文案（空 = 内置"验证通过"） |
| `tolerance` | `number` | `10` | 对齐容差（px） |
| `zIndex` | `number` | `100` | 弹层层级 |
| `closeOnClickModal` | `boolean` | `true` | 点遮罩关闭 |
| `refreshable` | `boolean` | `true` | 显示"换一张"按钮 |
| `inline` | `boolean` | `false` | 内嵌展示：不渲染遮罩、不抢焦点（additive，AUI-OPT-12） |
| `customClass` / `customStyle` | `string` | `''` | 根节点类名 / 内联样式 |

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `success` | 松手时与目标 X 的距离 ≤ `tolerance` | — |
| `fail` | 未对齐即松手（抖动 + 归位） | — |
| `refresh` | 重新掷缺口位置 | — |
| `close` | 弹层关闭（手动 / 成功后自动） | — |

## Exposed API

| 成员 | 签名 | 说明 |
| --- | --- | --- |
| `init` | `() => void` | 重新测量舞台宽度 |
| `refresh` | `() => void` | 重新掷缺口并复位拼图块 |
| `reset` | `() => void` | 复位拼图块与验证状态 |
| `target` / `offset` / `state` | `Ref` | 位置与状态（调试 / 测试用） |

## 与 lime-ui `l-captcha` 的差异（§112）

- **无 canvas**：lime 用 canvas 从原图裁出缺口；小程序 canvas 层级 / H5 跨端一致性差。本实现缺口 = 半透明虚线槽位，拼图块 = 目标位置的源图切片（CSS 位移裁切），对齐时视觉上无缝，H5 / MP 表现一致。
- `refresh` 内置为右上角按钮（lime 经插槽自定义）。
- 仅校验"几何对齐"；防机器人需服务端二次校验（与 lime 相同的前提）。

## 主题变量

| 变量 | 用途 |
| --- | --- |
| `--sn-mp-*` 全局别名 | 面板 / 圆角 / 阴影 / 成功色等全部走全局 token，无组件私有颜色变量 |

## 无障碍

- 根节点 `role="dialog"` + `aria-modal`，`aria-label` 跟随提示文案。
- 拼图块 / 刷新 / 关闭均带 `role="button"` 与 `aria-label`。
