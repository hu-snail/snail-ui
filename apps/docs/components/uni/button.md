# Button 按钮（uni 端 / 移动端）

`sn-button` 是 `@snui/uni`（移动端 / 小程序 / H5）核心交互组件。基于 easycom 自动注册，rpx 单位跨设备缩放。

---

## 自动注册（easycom）

如需显式 import：

```ts
import { SnButton } from '@snui/uni'
```

> easycom 是 uni-app 生态的官方按需注册系统。**Web 端没有 easycom**，必须显式 import（`import { SnButton } from '@snui/vue-web'`）。

---

## 基础用法

<Demo name="button-mp" />

```vue
<template>
  <view class="container">
    <sn-button>默认</sn-button>
    <sn-button type="primary">主要</sn-button>
    <sn-button type="success">成功</sn-button>
    <sn-button type="warning">警告</sn-button>
    <sn-button type="danger">危险</sn-button>
  </view>
</template>

<script setup lang="ts">
import '@snui/tokens-mp/styles'  // ← 必须显式 import rpx 别名层
</script>
```

> **关键差异**：uni 端需要 `import '@snui/tokens-mp/styles'` 引入 rpx 别名层（Web 端是 `import '@snui/tokens-web/styles'`）。

---

## 尺寸

`small` / `medium` / `large` 三档（**无 tiny**——移动端场景不需要）。

```vue
<sn-button size="small">小</sn-button>
<sn-button size="medium">中</sn-button>
<sn-button size="large">大</sn-button>
```

对应 `--sn-mp-button-height-{small,medium,large}`（自动按 750 设计稿转为 rpx）。

---

## 块级与圆角

移动端块级按钮（占满父容器宽度）很常用：

```vue
<sn-button block type="primary">块级按钮</sn-button>
<sn-button round type="success">圆角按钮</sn-button>
```

---

## 状态

```vue
<sn-button disabled>禁用</sn-button>
<sn-button loading>加载中</sn-button>
```

---

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| type | `'primary' \| 'default' \| 'success' \| 'warning' \| 'danger'` | `'default'` | 按钮类型 |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 按钮尺寸 |
| block | `boolean` | `false` | 是否块级 |
| round | `boolean` | `false` | 是否胶囊形 |
| disabled | `boolean` | `false` | 是否禁用 |
| loading | `boolean` | `false` | 是否加载中 |
| hairline | `boolean` | `true` | 是否显示细边框（default 类型） |
| feedback | `boolean` | `true` | 是否有点击反馈（active 透明度） |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| click | `(event: Event)` | 点击按钮触发（移动端用 `tap` 事件） |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 按钮内容 |
| icon | 自定义图标 |
| loading | 自定义加载图标 |

---

## 跨平台行为

| 端 | 行为 |
| --- | --- |
| H5 | 渲染为 `<button>`，触摸事件触发 click |
| 微信小程序 | 编译为原生 view，自动注册 tap |
| 支付宝小程序 | 同上 |
| App（uni-app x） | 原生渲染，触摸反馈 |
| 抖音小程序 | 同微信小程序 |

> 跨平台一致性由 uni-app 保证，组件源码不变。

---

---

---

## 无障碍

- `role="button"`
- `disabled` 时设置 `aria-disabled="true"`
- `loading` 时设置 `aria-busy="true"`
- 移动端通过 tap 触发（无键盘事件）
- 小程序语义化节点（`button` 标签由编译器包裹）

---

## 相关

- Web 端：[`SnButton`](/components/web/button)