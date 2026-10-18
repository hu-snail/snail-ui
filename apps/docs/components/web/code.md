# Code 代码

等宽字体的代码展示块，支持行号、软换行、行内模式与 JSON 语法着色。

## 何时使用

- 需要在页面或文档中展示一段源代码、配置片段。
- 需要行号对照的代码评审或教程场景。
- 需要在句子中嵌入一小段行内代码。
- 需要展示并排长代码且不破坏布局（软换行）。

## 代码演示

### 基础用法

默认等宽渲染；`language="json"` 时内置分词器为键、字符串、数字、关键字着色，其余语言按纯文本等宽展示。

<Demo name="code-web-basic" description="json 语法着色 + 纯文本语言。" />

### 行内显示

`inline` 让代码以行内形式嵌入句子，不生成块级 pre 容器。

<Demo name="code-web-inline" description="句子内嵌行内代码。" />

### 软换行

`word-wrap` 让超长行在溢出时自动换行而不是撑开容器。

<Demo name="code-web-softwrap" description="长行自动换行。" />

### 显示行号

`show-line-numbers` 在左侧显示行号列，与代码行严格对齐；`inline` 或 `word-wrap` 下自动隐藏。

<Demo name="code-web-line-numbers" description="行号列与代码行等高对齐。" />

### 动态更新

`code` 变化时内容实时重渲染。

<Demo name="code-web-loop-debug" description="code prop 响应式更新。" />

## API

### SnCode Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| code | `string` | `''` | 传入的代码字符串 |
| language | `string` | `undefined` | 高亮语言；`json` 使用内置分词器，其他语言纯文本展示 |
| trim | `boolean` | `true` | 高亮路径下是否去掉首尾空白 |
| inline | `boolean` | `false` | 行内样式 |
| word-wrap | `boolean` | `false` | 代码过长时是否自动换行 |
| show-line-numbers | `boolean` | `false` | 是否显示行号，`inline` 或 `word-wrap` 时不生效 |
| uri | `boolean` | `false` | 是否将 `code` 按 URI 解码后展示 |

### Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| default | — | 自定义代码内容，替换 `code` 渲染；行号仍按 `code` 计算 |

完整契约见组件 `ai-description.md`。
