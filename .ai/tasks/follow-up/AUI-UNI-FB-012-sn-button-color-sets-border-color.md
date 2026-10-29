# AUI-UNI-FB-012 — SnButton 的 `color` prop 会连带改写 `border-color`（已绕过）

- 状态：CLOSED（uni-templates 登录页重构期发现，页面侧绕过）
- 组件：`packages/uni/src/components/sn-button/sn-button.vue`
- 类型：实现根因留档（AGENTS.md §103）

## 现象

`<SnButton variant="text" :color="GREEN">获取验证码</SnButton>` 渲染出**带绿色描边**的
按钮，而不是纯文字按钮：`variant="text"` 的 `border-color: transparent` 被内联样式覆盖。

## 根因

`wrapperStyle` 计算属性里：

```ts
if (props.color) style += `color: ${props.color};border-color: ${props.color};`;
```

`color` 的语义是「文字色 + 边框色」一次设定（web / wot-ui 对齐的既有约定），
因此 `variant="text"` 这类「无边框变体」一旦传 `color`，透明边框会被改成实色。
内联样式优先级高于 `.sn-button--variant-text` 的 class 规则，故必定生效。

## 绕过方式（登录页采用）

- 纯文字按钮/链接色：改用 `:custom-style="{ color }"`，只改文字色，不动边框；
- 实心按钮底色：用 `bg-color`（只写 `background-color`，与 `color` 无耦合）。

## 待决（未改组件，避免超出本次任务 Scope）

`color` 是否应拆成 `color`（文字）+ `borderColor`（边框）两个 prop，属 Public API 调整，
需 Human Gate（AGENTS.md §90 / §112）后才能动；本次不修改组件。

## 记忆条目

根因仅在本项目（`@snui/uni` 的 prop 语义）成立，故按 AGENTS.md §103 的
「Project Memory → 引用 topic file」路径记录在本文件，不写入 User Memory
（`color` 的耦合语义换项目即不成立）。
