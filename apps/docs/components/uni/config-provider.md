# ConfigProvider 全局配置（uni 端 / 移动端）

`sn-config-provider` 为页面中的某个子树提供**局部**的全局配置：主题模式、Token 覆盖、Style Pack。基于 easycom 自动注册，不改动子树之外的部分。

> 参考实现：wot-ui `wd-config-provider`（`theme` / `theme-vars` / `custom-class` / `custom-style` 四项 1:1 对齐）。`skin` 是本库追加的能力，不替代 `theme`。

## 基础用法

<Demo name="config-provider-mp-basic" description="包裹子树即可继承配置；页面其余部分不受影响。" />

## 深色模式

uni-app 运行在无 `document`、无 `:root` 的小程序与原生 App 上，web 端「给 `<html>` 加 `.dark`」的做法不可用。本组件把主题表达为**自身根节点上的 class**（`.sn-theme-dark`），子组件据此解析各自的 `--sn-mp-color-*` 别名，因此作用范围天然被限制在这个子树内。

<Demo name="config-provider-mp-dark" description="theme 设为 dark，仅该子树切换为深色；同级内容保持浅色。" />

## 主题变量覆盖

`themeVars` 会在根节点上写入内联 CSS 变量，因此改单个色槽不需要额外样式表。键支持两种写法：

| 写法 | 结果变量 |
| --- | --- |
| `'--sn-mp-color-action-primary'` | 原样使用 |
| `'buttonPrimaryBgColor'` | `--sn-mp-button-primary-bg-color`（自动加前缀并转 kebab） |

第二种是为了兼容 wot-ui 文档里的写法，复制过来的片段可以直接用。

<Demo name="config-provider-mp-vars" description="themeVars 覆盖主色与背景；两种键写法等价。" />

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `skin` | `string` | `''` | Style Pack 标识（kebab-case）。`'default'` 或空 = 不加 skin class |
| `theme` | `'light' \| 'dark'` | `'light'` | 子树主题模式 |
| `themeVars` | `Record<string, string>` | `{}` | 子树级 CSS 变量覆盖 |
| `customClass` | `string` | `''` | 根节点自定义类名 |
| `customStyle` | `string` | `''` | 根节点自定义内联样式 |

## Events

无。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 需要继承配置的内容 |

## 主题变量

本组件不消费颜色 token，而是**设置**它们：

| 机制 | 影响的变量 |
| --- | --- |
| `theme="dark"` | `@snui/tokens-mp/styles` 中 `page.sn-theme-dark, .sn-theme-dark` 块声明的全部 `--sn-mp-color-*` |
| `themeVars` | 调用方传入的任意键 |

## 无障碍

根节点是纯容器，带 `data-snui-theme` 便于检查。不引入 role，也不改变焦点行为 —— 它是配置边界，不是控件。

## 暗色模式

本组件本身就是暗色的入口：`theme="dark"` 即在子树内启用整套暗色别名。可用下面的方式验证：

<Demo name="config-provider-mp-dark" description="同一页面内浅色与深色两个子树并存，互不影响。" />

> 页面级（而非子树级）暗色请给 `page` 加 `sn-theme-dark` class，见 `@snui/tokens-mp/styles` 的说明。
