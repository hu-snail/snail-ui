# Button 按钮

最常用的交互组件，触发一个操作。支持多种类型、尺寸、状态。

## 基础用法

<Demo name="button-web" />

```vue
<script setup lang="ts">
import { SnButton } from '@snui/vue-web'
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

`tiny` / `small` / `medium` / `large` 四档。

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

`loading` 状态下按钮不可点击，自动显示旋转图标。

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| type | `'primary' \| 'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | 按钮类型 |
| size | `'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'` | 按钮尺寸 |
| block | `boolean` | `false` | 块级（占满父容器宽度） |
| round | `boolean` | `false` | 胶囊形 |
| disabled | `boolean` | `false` | 禁用 |
| loading | `boolean` | `false` | 加载中 |
| htmlType | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生 button type |
| bordered | `boolean` | `true` | 显示边框（对 default 类型有效） |
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

## 无障碍

- 使用原生 `<button>` 元素，`role="button"`
- `disabled` 时设置 `aria-disabled="true"`
- `loading` 时设置 `aria-busy="true"`
- 支持 `aria-label` 覆盖
- 键盘 Enter / Space 原生触发 click

## 相关

- [uni 端 sn-button](/components/uni/button)