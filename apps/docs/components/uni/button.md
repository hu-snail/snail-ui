# Button 按钮（uni 端 / 移动端）

`sn-button` 是 `@snui/uni`（移动端 / 小程序 / H5）核心交互组件。基于 easycom 自动注册，rpx 单位跨设备缩放。

> **v3.1 端独立**：`sn-button` (`@snui/uni`) 与 `SnButton` (`@snui/vue-web`) 是**两个独立组件**。uni 端 CSS 只用 `var(--sn-mp-*)`（rpx）。**两端 0 行源代码复用**。详细差异对照见 [Web 端 SnButton](/components/web/button)。

---

## 自动注册（easycom）

组件位于 `packages/uni/src/components/sn-button/sn-button.vue`，符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<template>
  <sn-button type="primary">提交</sn-button>
</template>
```

easycom 路径约定：`^sn-(.*)` → `components/sn-$1/sn-$1.vue`。

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

## Token 定制（uni 别名层 + rpx）

uni 端组件 CSS 只用 `--sn-mp-*` 别名层，**单位是 rpx**（按 750 设计稿自动转换）：

```css
/* 自定义品牌色 */
.sn-button {
  background-color: var(--sn-mp-color-action-primary);
  border-radius: var(--sn-mp-button-radius);   /* 自动转 rpx */
  height: var(--sn-mp-button-height-medium);  /* 自动转 rpx */
}
```

或在页面顶层 `:root` 覆盖：

```css
page {
  --sn-mp-color-action-primary: #ff5722;
  --sn-mp-button-radius: 12rpx;          /* 直接用 rpx */
  --sn-mp-button-height-medium: 72rpx;
}
```

> **禁止**：uni 端组件 CSS 不允许引用 `--sn-web-*` 或 `--aui-*` 原始层。覆盖方式：通过 Style Pack 或在 `page` 重新声明 `--sn-mp-*`。

---

## 端差异对照

| 维度 | Web（`SnButton`） | uni（`sn-button`） |
|---|---|---|
| 包 | `@snui/vue-web` | `@snui/uni` |
| 组件名 | `SnButton`（PascalCase import） | `sn-button`（kebab-case easycom） |
| Token 别名 | `--sn-web-*`（px） | `--sn-mp-*`（rpx） |
| 尺寸档 | tiny / small / medium / large | small / medium / large（无 tiny） |
| 事件 | `click` (MouseEvent) | `click` (tap event) |
| 端专属 Props | `htmlType`（原生 button type） | `hairline` / `feedback`（细边框 + 反馈） |
| 默认加载图标 | CSS 旋转 spinner | CSS spinner / uni-ui spinner |
| 平台范围 | 现代浏览器 | H5 / 微信小程序 / 支付宝小程序 / App / 抖音小程序 |

---

## 无障碍

- `role="button"`
- `disabled` 时设置 `aria-disabled="true"`
- `loading` 时设置 `aria-busy="true"`
- 移动端通过 tap 触发（无键盘事件）
- 小程序语义化节点（`button` 标签由编译器包裹）

---

## 相关

- 源文件：`packages/uni/src/components/sn-button/sn-button.vue`
- AI 描述：`packages/uni/src/components/sn-button/ai-description.md`（标注 `end: mp`）
- Token 别名层：`packages/tokens-mp/`（`--sn-mp-*` + rpx 转换）
- Web 端：[`SnButton`](/components/web/button)