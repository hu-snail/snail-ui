# Resize 监听元素尺寸变化（uni 端 / 移动端）

`sn-resize` 包裹内容并在其尺寸或位置变化时触发 `resize` 事件。基于 easycom 自动注册，不消费任何颜色 token。

## 基础用法

内容变化（例如列表增长）后，宿主常需重新计算布局。`sn-resize` 在首次测量与每次尺寸变化时上报盒模型。

<Demo name="resize-mp-basic" description="增加一行后，测量结果随之更新。" />

## 自定义类名与测量边界

`customClass` / `customStyle` 作用在外层包裹节点，`customContainerClass` 作用在真正被 `boundingClientRect` 测量的内层节点：

<Demo name="resize-mp-custom" description="customClass / customStyle 画外层包裹边界，customContainerClass 画被测量的内层节点。" />

## 为什么用轮询而不是 ResizeObserver

| 端                  | `ResizeObserver` | `uni.createSelectorQuery` |
| ------------------- | ---------------- | ------------------------- |
| H5                  | 有               | 有                        |
| 微信 / 支付宝小程序 | **没有**         | 有                        |
| App（uni-app x）    | 不保证           | 有                        |

取三端都能用的最小公约数，所以用 `uni.createSelectorQuery().boundingClientRect()` 每 100ms 轮询一次。这也是本组件唯一的资源，卸载时一句 `clearInterval` 就清理干净。

盒模型未变化时**不会重复触发**，宿主监听 `resize` 不会因为空轮询而反复重渲染。

## Props

| 属性                   | 类型     | 默认值 | 说明                 |
| ---------------------- | -------- | ------ | -------------------- |
| `customStyle`          | `string` | `''`   | 根节点内联样式       |
| `customClass`          | `string` | `''`   | 根节点类名           |
| `customContainerClass` | `string` | `''`   | 被测量的内层节点类名 |

## Events

| 事件名   | 说明                       | 参数                                                        |
| -------- | -------------------------- | ----------------------------------------------------------- |
| `resize` | 首次测量与盒模型变化时触发 | `{ width, height, top, left, bottom, right }`（px，已取整） |

## Slots

| 插槽名    | 说明               |
| --------- | ------------------ |
| `default` | 需要监听尺寸的内容 |

## 主题变量

本组件只做几何测量，不消费任何 `--sn-mp-*` 颜色 / 间距变量。

## 无障碍

包裹层不加 role、不改变焦点行为 —— 它是测量边界而非控件，不改变子节点的可访问性树。

## 暗色模式

组件不含任何颜色，因此暗色下无需适配。若内部内容使用了颜色，那些颜色由内容自身负责（走 `--sn-mp-color-*` 即可自动跟随主题）。
