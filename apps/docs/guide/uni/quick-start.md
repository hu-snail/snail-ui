# 快速开始（uni-app）

5 分钟把 `@snui/uni` 接入到 uni-app 项目。

## 安装

```bash
pnpm add @snui/uni
```

## 配置 easycom

`@snui/uni` 默认按 easycom 规范组织（`components/sn-*/sn-*.vue`），需要在你项目的 `pages.json` 中配置：

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^sn-(.*)": "@snui/uni/src/components/sn-$1/sn-$1.vue"
    }
  }
}
```

或者使用默认扫描（推荐，需要将 `components/` 目录放在 `src/components/`）：

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {}
  }
}
```

## 引入样式

`App.vue` 的 `<style>` 顶部：

```css
@import '@snui/tokens/styles/index.css';
```

## 使用组件

模板里直接用（无需 import）：

```vue
<template>
  <view class="container">
    <sn-button type="primary" @click="onSubmit">提交</sn-button>
  </view>
</template>

<script setup lang="ts">
const onSubmit = () => {
  uni.showToast({ title: '已提交' })
}
</script>
```

如需显式 import：

```ts
import { SnButton } from '@snui/uni'
```

## 跨端构建

`@snui/uni` 组件支持 H5、微信小程序、支付宝小程序、抖音小程序、App（uni-app x）。运行：

```bash
pnpm dev:h5           # H5
pnpm dev:mp-weixin    # 微信小程序
pnpm dev:mp-alipay    # 支付宝小程序
pnpm build:app        # App
```

## 暗色模式

```html
<html data-theme="dark">
```

CSS 变量自动级联。

## 下一步

- 组件文档：[`sn-button`](/components/uni/button)
- 跨端适配说明：[`跨端 capability`](/guide/uni/cross-platform)
- Web 端接入：[`Web 快速开始`](/guide/web/quick-start)
