# 列表 List · Web（PC 端）

通用列表容器：header / 行 / footer 三段式，行内支持 prefix / suffix 槽位。

## 何时使用

- 消息流、设置项、通知等一行一条的场景
- 需要行间分割线、悬浮高亮、可点击光标等列表形态
- 需要统一的列表头尾区域

## 代码演示

### 基础用法

<Demo name="list-web-basic" description="header / footer + prefix / suffix 槽位。" />

### 悬浮与可点击

<Demo name="list-web-hoverable" description="hoverable 悬浮高亮 + clickable 指针光标。" />

### 边框与分割线

<Demo name="list-web-border" description="bordered 外边框；show-divider 关闭行间分割线。" />

## API

### SnList Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸标记（输出修饰类） |
| bordered | `boolean` | `false` | 是否显示外边框（行内边距变为 12px 20px） |
| clickable | `boolean` | `false` | 行是否显示可点击光标 |
| hoverable | `boolean` | `false` | 行悬浮时是否高亮 |
| show-divider | `boolean` | `true` | 是否显示行间 1px 分割线 |

### SnList Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| default | `()` | `SnListItem` 行列表 |
| header | `()` | 列表头部区域 |
| footer | `()` | 列表底部区域 |

### SnListItem Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| default | `()` | 行主内容 |
| prefix | `()` | 行首部内容 |
| suffix | `()` | 行尾部内容 |

`SnListItem` 在列表外独立使用时按默认形态降级渲染（保留分割线）。

完整契约见组件 `ai-description.md`。
