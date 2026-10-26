# Equation 公式 · Web（PC 端）

LaTeX 数学公式渲染。内置 KaTeX，开箱即用，支持 displayMode / 自定义宏 / 替换渲染器。

## 何时使用

- 需要在页面中展示 LaTeX 语法的数学公式（行内或行间）
- 学术、教育、文档类内容的公式排版
- 需要自定义 KaTeX 宏或替换 KaTeX 实例的高级场景

## 代码演示

### 基础用法

<Demo name="equation-web-basic" description="行内公式 + 行间公式。" />

### 使用 katex 配置

<Demo name="equation-web-katex-options" description="displayMode、fleqn 与自定义宏。" />

## API

### SnEquation Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| value | `string` | `''` | LaTeX 表达式 |
| katex | `SnEquationKatex` | `undefined` | 自定义 KaTeX 渲染器；默认使用内置 katex |
| katexOptions | `Record<string, unknown>` | `undefined` | 透传给 `renderToString` 的选项（如 `displayMode` / `macros` / `fleqn`），`throwOnError` 默认 `false` |

无事件、无插槽。渲染节点的标签与 class 从 KaTeX 输出中提取（行内 `span.katex`、行间 `span.katex-display`），并携带 `data-snui-component="equation"`。

公式样式由 KaTeX 自带 CSS 提供，已随 `@snui/vue-web/styles` 一起发布（含字体文件），无需额外引入。
