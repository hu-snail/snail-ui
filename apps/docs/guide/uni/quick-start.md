# 快速开始（uni-app x）

5 分钟把 snui 接入 uni-app x 项目（App 端蒸汽模式 / vapor）。

推荐路径：组件消费 `@snui/uni-x` 生成的 `.uvue` 产物（由 `@snui/uni` 单源码
确定性转换，见 [uni-app x（蒸汽模式）支持](/guide/uni/uni-app-x)）。经典
uni-app（H5 / 小程序 / App-vue）接入方式保留在本页下半部分。

## uni-app x 接入（蒸汽模式）

### 1. 安装

```bash
pnpm add @snui/uni-x
```

组件产物（`.uvue` + 主题层）已随包发布，无需本地生成、无需拷贝目录。

### 2. 配置 easycom

在 `pages.json` 中加入：

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^sn-(.*)": "@snui/uni-x/components/sn-$1/sn-$1.uvue"
    }
  }
}
```

### 3. 引入主题变量

在 `App.uvue` 的 `<style>` 中引入 class-only token 层（App 端无 `:root`，
变量挂载在 `.sn-theme-root` 上，`sn-config-provider` 会自动携带该 class）：

```css
@import '@snui/uni-x/theme/index.css';
```

### 4. 开启蒸汽模式

在 HBuilderX（5.31+）的 `manifest.json` 可视化界面勾选「蒸汽模式」，或直接
在源码视图中确认：

```json
{
  "uni-app-x": { "vapor": true }
}
```

### 5. 使用组件

模板里直接用（无需 import）：

```vue
<template>
  <view class="container">
    <sn-button type="primary" @click="onSubmit">提交</sn-button>
  </view>
</template>

<script setup lang="ts">
const onSubmit = () => {
  uni.showToast({ title: '已提交' });
};
</script>
```

仓库内完整示例工程：`apps/uni-demo-x`（100 个组件演示页，`gen` / `check`
脚本可复现）。状态与真机验证清单见
[uni-app x（蒸汽模式）支持](/guide/uni/uni-app-x)。

## 经典 uni-app x 接入（H5 / 小程序 / App-vue）

### 安装

```bash
pnpm add @snui/uni
```

### 配置 easycom

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

### 引入样式

`App.vue` 的 `<style>` 顶部：

```css
@import '@snui/tokens/styles/index.css';
```

### 使用组件

模板里直接用（无需 import）：

```vue
<template>
  <view class="container">
    <sn-button type="primary" @click="onSubmit">提交</sn-button>
  </view>
</template>

<script setup lang="ts">
const onSubmit = () => {
  uni.showToast({ title: '已提交' });
};
</script>
```

如需显式 import：

```ts
import { SnButton } from '@snui/uni';
```

### 跨端构建

`@snui/uni` 组件支持 H5、微信小程序、支付宝小程序、抖音小程序、App。运行：

```bash
pnpm dev:h5           # H5
pnpm dev:mp-weixin    # 微信小程序
pnpm dev:mp-alipay    # 支付宝小程序
pnpm build:app        # App
```

### 暗色模式

```html
<html data-theme="dark"></html>
```

CSS 变量自动级联。

## 下一步

- 组件文档：[`sn-button`](/components/uni/button)
- uni-app x（蒸汽模式）支持：[`/guide/uni/uni-app-x`](/guide/uni/uni-app-x)
- 跨端适配说明：[`跨端 capability`](/guide/uni/cross-platform)
- Web 端接入：[`Web 快速开始`](/guide/web/quick-start)
