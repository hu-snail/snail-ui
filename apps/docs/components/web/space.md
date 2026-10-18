# Space · Web（PC 端）

间距容器（对标 n-space）。CSS gap 实现，子项无包裹层。

## 基础用法

<Demo name="space-web-basic" description="默认横向 + 档位 size。" />

## 纵向与数组 gap

<Demo name="space-web-vertical" description="vertical + [横向, 纵向] 双轴。" />

## 对齐与换行

<Demo name="space-web-align" description="justify / align / wrap。" />

## API

### SnSpace Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| vertical | `boolean` | `false` | 纵向排布（强制 nowrap） |
| size | `number \| 'small'\|'medium'\|'large' \| [number, number]` | `'medium'` | 间距（8/12/16） |
| wrap | `boolean` | `true` | 换行 |
| justify | flex justify 值 | `'start'` | 主轴（start/end 归一 flex-\*） |
| align | flex align 值 | — | 交叉轴 |
| inline | `boolean` | `false` | 行内容器 |

完整契约见组件 `ai-description.md`。
