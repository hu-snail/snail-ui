# Highlight 高亮文本

在纯文本中命中关键词并以高亮元素包裹，常用于搜索结果与关键词强调。

## 何时使用

- 搜索结果里需要突出命中词。
- 文案中需要强调一组关键词。
- 需要自定义高亮元素或样式（标签、类名、内联样式均可配）。

## 代码演示

### 基础用法

传入 `text` 与 `patterns`，命中的片段默认渲染为 `mark` 元素；匹配默认不区分大小写。

<Demo name="highlight-web-basic" description="多关键词命中渲染 mark。" />

### 自定义样式

通过 `highlight-style`（对象或字符串）与 `highlight-class` 自定义命中片段外观。

<Demo name="highlight-web-style" description="对象形式的高亮样式。" />

### 区分大小写

`case-sensitive` 开启后只命中写法完全一致的片段。

<Demo name="highlight-web-case-sensitive" description="case-sensitive 开与关的对照。" />

### 自定义高亮元素

`highlight-tag` 指定命中片段的渲染元素。

<Demo name="highlight-web-component" description="highlight-tag=span + 下划线样式。" />

## API

### SnHighlight Props

| 名称            | 类型               | 默认值      | 说明                                     |
| --------------- | ------------------ | ----------- | ---------------------------------------- |
| text            | `string`           | `undefined` | 完整文本                                 |
| patterns        | `string[]`         | `[]`        | 需要高亮的内容                           |
| highlight-tag   | `string`           | `'mark'`    | 高亮片段的 HTML 元素                     |
| case-sensitive  | `boolean`          | `false`     | 是否区分大小写                           |
| auto-escape     | `boolean`          | `true`      | 是否对 patterns 做正则转义（按字面匹配） |
| highlight-class | `string`           | `undefined` | 高亮片段的类名                           |
| highlight-style | `object \| string` | `undefined` | 高亮片段的内联样式                       |

完整契约见组件 `ai-description.md`。
