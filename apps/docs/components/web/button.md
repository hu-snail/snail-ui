# Button 按钮

按钮用于触发一个操作。`SnButton` 是 web 端最常用的组件，所有视觉属性都通过 `--sn-*` CSS 变量驱动。

## 基础用法

<script setup>
import { SnButton } from '@snui/vue-web'
</script>

<SnButton>默认</SnButton>
<SnButton type="primary">主要</SnButton>
<SnButton type="success">成功</SnButton>
<SnButton type="warning">警告</SnButton>
<SnButton type="danger">危险</SnButton>

```vue
<template>
  <SnButton>默认</SnButton>
  <SnButton type="primary">主要</SnButton>
  <SnButton type="success">成功</SnButton>
  <SnButton type="warning">警告</SnButton>
  <SnButton type="danger">危险</SnButton>
</template>
```

## 尺寸

`tiny` / `small` / `medium` / `large` 四档。

<SnButton size="tiny">tiny</SnButton>
<SnButton size="small">small</SnButton>
<SnButton size="medium">medium</SnButton>
<SnButton size="large">large</SnButton>

## 块级与圆角

<SnButton block type="primary">块级按钮</SnButton>
<SnButton round type="success">圆角按钮</SnButton>

## 状态

<SnButton disabled>禁用</SnButton>
<SnButton loading>加载中</SnButton>

## 加载中

加载状态下按钮不可点击，自动显示旋转图标。也可以用 `loading` slot 自定义。

<SnButton loading type="primary">加载中…</SnButton>

```vue
<template>
  <SnButton loading type="primary">加载中…</SnButton>
</template>
```

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| type | `'primary' \| 'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | 按钮类型 |
| size | `'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'` | 按钮尺寸 |
| block | `boolean` | `false` | 是否为块级（占满父容器宽度） |
| round | `boolean` | `false` | 是否为胶囊形 |
| disabled | `boolean` | `false` | 是否禁用 |
| loading | `boolean` | `false` | 是否加载中 |
| htmlType | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生 button type 属性 |
| bordered | `boolean` | `true` | 是否显示边框（对 default 类型有效） |
| ariaLabel | `string` | — | 无障碍标签 |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| click | `(event: MouseEvent)` | 点击按钮时触发。`disabled` 或 `loading` 时不触发 |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 按钮内容 |
| icon | 自定义图标（替代 loading spinner） |
| loading | 自定义加载图标（替代默认 spinner） |

### 类型定义

```ts
import type { PropType } from 'vue'

type ButtonType = 'primary' | 'default' | 'success' | 'warning' | 'danger' | 'info'
type ButtonSize = 'tiny' | 'small' | 'medium' | 'large'
```

## 主题定制

通过 CSS 变量覆盖：

```css
:root {
  --sn-color-action-primary: #1677ff;       /* primary 背景 */
  --sn-color-feedback-danger: #ef4444;      /* danger 背景 */
  --sn-radius-button: 8px;                  /* 圆角 */
  --sn-button-size-medium-height: 36px;     /* medium 尺寸高度 */
}
```

## 无障碍

- 使用原生 `<button>` 元素，`role="button"`
- `disabled` 时设置 `aria-disabled="true"`
- `loading` 时设置 `aria-busy="true"`
- 支持 `aria-label` 覆盖
- 键盘 Enter / Space 原生触发 click

## 相关

- 源文件：`packages/vue-web/src/button/SnButton.vue`
- AI 描述：`packages/vue-web/src/button/ai-description.md`
- uni 端：[`sn-button`](/components/uni/button)
