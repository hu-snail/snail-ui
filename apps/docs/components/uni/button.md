# Button 按钮（uni-app）

uni-app 多端按钮组件。基于 wot-ui 风格 API，移动端场景优先，使用 rpx 跨设备单位。

## 自动注册

组件位于 `packages/uni/src/components/sn-button/sn-button.vue`，符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<template>
  <sn-button type="primary">提交</sn-button>
</template>
```

如需显式 import：

```ts
import { SnButton } from '@snui/uni'
```

## 基础用法

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
```

## 尺寸

`small` / `medium` / `large` 三档。

```vue
<sn-button size="small">小</sn-button>
<sn-button size="medium">中</sn-button>
<sn-button size="large">大</sn-button>
```

## 块级与圆角

移动端块级按钮（占满父容器宽度）很常用：

```vue
<sn-button block type="primary">块级按钮</sn-button>
<sn-button round type="success">圆角按钮</sn-button>
```

## 状态

```vue
<sn-button disabled>禁用</sn-button>
<sn-button loading>加载中</sn-button>
```

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| type | `'primary' \| 'default' \| 'success' \| 'warning' \| 'danger'` | `'default'` | 按钮类型 |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 按钮尺寸 |
| block | `boolean` | `false` | 是否为块级 |
| round | `boolean` | `false` | 是否为胶囊形 |
| disabled | `boolean` | `false` | 是否禁用 |
| loading | `boolean` | `false` | 是否加载中 |
| hairline | `boolean` | `true` | 是否显示细边框（default 类型） |
| feedback | `boolean` | `true` | 是否有点击反馈（active 透明度） |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| click | `(event: Event)` | 点击按钮时触发（移动端用 `tap` 事件） |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 按钮内容 |
| icon | 自定义图标 |
| loading | 自定义加载图标 |

## 跨端说明

| 端 | 行为 |
| --- | --- |
| H5 | 渲染为 `<view>`，触摸事件触发 click |
| 微信小程序 | 编译为原生 view，自动注册 tap |
| 支付宝小程序 | 同上 |
| App（uni-app x） | 原生渲染，触摸反馈 |

## 主题定制

CSS 变量命名空间与 web 端完全一致：

```css
:root {
  --sn-color-action-primary: #1677ff;
  --sn-radius-button: 12rpx;
}
```

## 相关

- 源文件：`packages/uni/src/components/sn-button/sn-button.vue`
- AI 描述：`packages/uni/src/components/sn-button/ai-description.md`
- web 端：[`SnButton`](/components/web/button)
