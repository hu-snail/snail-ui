# Mention · Web（PC 端）

提及输入。输入 `@`（可自定义 delimiter）触发候选面板，选中替换触发词。

## 基础用法

<Demo name="mention-web-basic" description="@ 触发候选 → 过滤 → 键盘/点击选中替换。" />

## textarea 多行

<Demo name="mention-web-textarea" description="type='textarea' 多行提及。" />

## 自定义分隔符

<Demo name="mention-web-delimiter" description="delimiter='#' 话题提及。" />

## 禁用 / 只读

<Demo name="mention-web-states" description="disabled / readonly。" />

## API

### SnMention Props

| Prop                | 类型                                         | 默认值      | 说明                                         |
| ------------------- | -------------------------------------------- | ----------- | -------------------------------------------- |
| modelValue          | `string`                                     | `''`        | v-model                                      |
| options             | `SnMentionRawOption[]`                       | `[]`        | 候选（string 或 {label, value?, disabled?}） |
| delimiter           | `string`                                     | `'@'`       | 触发字符（多字符取末字符触发、完整回写）     |
| placeholder         | `string`                                     | —           | 占位                                         |
| disabled / readonly | `boolean`                                    | `false`     | 禁用 / 只读                                  |
| size                | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'`  | 尺寸                                         |
| status              | `'default'\|'error'\|'warning'`              | `'default'` | 校验状态                                     |
| type                | `'text'\|'textarea'`                         | `'text'`    | 输入形态（textarea 配 rows）                 |

事件：`update:modelValue` / `change` / `select({label, value})` / `focus` / `blur`；Slot：`empty`。键盘：ArrowUp/Down 高亮、Enter/Tab 选中、Esc 关闭。

完整契约见组件 `ai-description.md`。
