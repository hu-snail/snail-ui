# AUI-TOKEN-FB-001 — 换主题后表单控件仍带蓝色焦点环

## 现象

主题编辑器 / 首页色块把 primary 改成红、橙、绿等非蓝色后，`SnInput` 等表单控件的边框已经是新主色，但外圈焦点环仍是浅蓝色（截图：红边框 + 蓝光晕）。Select / Checkbox / Radio / Switch / Slider / Cascader / TimePicker / Upload 等所有复用焦点环的组件同样复现。

## 根因

`packages/tokens/styles/index.css` 把两个焦点环 token 写成了固定的蓝色字面量：

```css
--aui-focus-ring: rgba(22, 119, 255, 0.25);
--aui-button-focus-ring: rgba(22, 119, 255, 0.25);
```

组件消费链路是：

```text
--sn-web-focus-ring → var(--aui-focus-ring)
```

主题切换只覆盖了 `--aui-color-action-primary`（及 hover/active），没有覆盖 `--aui-focus-ring`。`--aui-color-action-primary-soft` 同样固定为 `blue-50`，导致下拉 hover 底色等“浅色主题面”也保持蓝色。

`--sn-web-*` 别名只负责转发，不会重新派生颜色；因此只在组件里换 `--sn-web-color-action-primary` 无法修复焦点环。

## 修复

1. `--aui-focus-ring` / `--aui-button-focus-ring` 改为从 primary 派生：
   `color-mix(in srgb, var(--aui-color-action-primary) 25%, transparent)`
2. `--aui-color-action-primary-soft` 改为从 primary + surface 派生（light 10% / dark 22%）。
3. `DEFAULT_COMPONENT_TOKENS.button.focusRing` 同步为派生表达式，保证 `snCssVars()` 注入的主题也一致。
4. `tokens-mp` 深色块不再把 `--sn-mp-color-action-primary-soft` 写死为蓝色，改为转发 `--aui-color-action-primary-soft`。
5. 清理 vue-web / uni 组件里残留的蓝色焦点环 fallback（`rgba(22,119,255,*)`、`#1677ff73`、`#2080f0` 等），统一改为 primary 派生的 `color-mix(...)`。

## Regression

`packages/tokens/src/static-css.test.ts` 新增用例：

- `--aui-focus-ring` / `--aui-button-focus-ring` / `--aui-color-action-primary-soft` 必须引用 `var(--aui-color-action-primary)`；
- 静态 token 样式表不得再出现 `rgba(22, 119, 255`。

## 验证

- Chrome headless 用 `--aui-color-action-primary: #ff4d24` 覆盖后，焦点环像素为橙色（不再出现蓝通道主导）。
- `@snui/tokens` / `@snui/tokens-mp` / `@snui/tokens-web` / `@snui/vue-web` / `@snui/uni` 的 typecheck、lint、test 通过；vue-web / uni 重新构建产物。
