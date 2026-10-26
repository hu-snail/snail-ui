# Text · Web（PC 端）

文本排版组件。六色 type、depth 色阶、行内样式修饰、code 底色。

## 基础用法

<Demo name="text-web-basic" description="默认文本 + 六色 type。" />

## 修饰样式

<Demo name="text-web-styles" description="strong / italic / underline / delete / code / disabled。" />

## 次级色阶（depth）

<Demo name="text-web-depth" description="depth='1'-'3' 仅 default 型生效。" />

## 标题与段落

<Demo name="text-web-title" description="SnTitle level 1-6；SnParagraph 行距档位。" />

## API

### SnText Props

| Prop               | 类型                                                          | 默认值      | 说明                      |
| ------------------ | ------------------------------------------------------------- | ----------- | ------------------------- |
| type               | `'default'\|'primary'\|'info'\|'success'\|'warning'\|'error'` | `'default'` | 颜色语义                  |
| depth              | `'1'\|'2'\|'3'`                                               | —           | 次级色阶（default 型）    |
| strong / italic    | `boolean`                                                     | `false`     | 粗体 / 斜体               |
| underline / delete | `boolean`                                                     | `false`     | 下划线 / 删除线（可叠加） |
| code               | `boolean`                                                     | `false`     | 行内代码底色              |
| disabled           | `boolean`                                                     | `false`     | 禁用色                    |
| tag                | `'span'\|'p'\|'blockquote'`                                   | `'span'`    | 渲染元素                  |

### SnTitle / SnParagraph

SnTitle：`level`(1-6，字号 30/22/18/16/16/16px)。SnParagraph：`spacing`('tight'|'base'|'loose')。两者均为 SnText 薄封装（tag 固定）。

完整契约见组件 `ai-description.md`。
