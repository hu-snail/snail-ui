# Button 按钮（Web 端）

`SnButton` 是 `@snui/vue-web`（PC 桌面端）最常用的交互组件。所有视觉属性通过 `--sn-web-*` Token 别名层驱动。

> **v3.1 端独立**：`SnButton` (`@snui/vue-web`) 与 `sn-button` (`@snui/uni`) 是**两个独立组件**，分布在两个独立包，从开发到打包发布完全独立。Web 端 CSS 只用 `var(--sn-web-*)`（px 单位）；uni 端 CSS 只用 `var(--sn-mp-*)`（rpx 单位）。**两端 0 行源代码复用**。

---

## 基础用法

<Demo name="button-web" />

```vue
<script setup lang="ts">
import { SnButton } from '@snui/vue-web'
import '@snui/tokens-web/styles'
</script>

<template>
  <SnButton>默认</SnButton>
  <SnButton type="primary">主要</SnButton>
  <SnButton type="success">成功</SnButton>
  <SnButton type="warning">警告</SnButton>
  <SnButton type="danger">危险</SnButton>
</template>
```

## 尺寸

`tiny` / `small` / `medium` / `large` 四档，对应 `--sn-web-button-height-{tiny,small,medium,large}`。

```vue
<SnButton size="tiny">tiny</SnButton>
<SnButton size="small">small</SnButton>
<SnButton size="medium">medium</SnButton>
<SnButton size="large">large</SnButton>
```

## 块级与圆角

```vue
<SnButton block type="primary">块级按钮</SnButton>
<SnButton round type="success">圆角按钮</SnButton>
```

## 状态

```vue
<SnButton disabled>禁用</SnButton>
<SnButton loading>加载中</SnButton>
```

`loading` 状态下按钮不可点击，自动显示旋转图标。也可用 `loading` slot 自定义。

---

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| type | `'primary' \| 'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | 按钮类型 |
| size | `'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'` | 按钮尺寸 |
| block | `boolean` | `false` | 是否块级（占满父容器宽度） |
| round | `boolean` | `false` | 是否胶囊形 |
| disabled | `boolean` | `false` | 是否禁用 |
| loading | `boolean` | `false` | 是否加载中 |
| htmlType | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生 button type |
| bordered | `boolean` | `true` | 是否显示边框（对 default 类型有效） |
| ariaLabel | `string` | — | 无障碍标签 |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| click | `(event: MouseEvent)` | 点击按钮触发；`disabled` / `loading` 时不触发 |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 按钮内容 |
| icon | 自定义图标（替代 loading spinner） |
| loading | 自定义加载图标（替代默认 spinner） |

### 类型定义

```ts
type ButtonType = 'primary' | 'default' | 'success' | 'warning' | 'danger' | 'info'
type ButtonSize = 'tiny' | 'small' | 'medium' | 'large'
```

---

## Token 定制（Web 别名层）

Web 端组件 CSS 只用 `--sn-web-*` 别名层，覆盖方式：

```css
:root {
  --sn-web-color-action-primary: #1677ff;       /* primary 背景 */
  --sn-web-color-feedback-danger: #ef4444;      /* danger 背景 */
  --sn-web-button-radius: 8px;                  /* 圆角 */
  --sn-web-button-height-medium: 36px;          /* medium 高度 */
}
```

> **禁止**：Web 端组件 CSS 不允许引用 `--sn-mp-*` 或 `--aui-*` 原始层。SnButton 源码 CSS 内部必须用 `--sn-web-*`。覆盖方式：通过 Style Pack 或在 `:root` 重新声明 `--sn-web-*` 别名（aliases 最终引用 `--aui-*`）。

---

## 无障碍

- 使用原生 `<button>` 元素，`role="button"`
- `disabled` 时设置 `aria-disabled="true"`
- `loading` 时设置 `aria-busy="true"`
- 支持 `aria-label` 覆盖
- 键盘 Enter / Space 原生触发 click

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
| 单位 | — | rpx（按钮尺寸自动按 750 设计稿） |

Web 端独有 `htmlType`；uni 端独有 `hairline` / `feedback`。详细对照见 [uni 端 sn-button](/components/uni/button)。

---

## 相关

- 源文件：`packages/vue-web/src/button/SnButton.vue`
- AI 描述：`packages/vue-web/src/button/ai-description.md`（标注 `end: web`）
- Token 别名层：`packages/tokens-web/`（`--sn-web-*`）
- uni 端：[`sn-button`](/components/uni/button)