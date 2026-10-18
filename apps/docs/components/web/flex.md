# Flex · Web（PC 端）

弹性布局原语（对标 n-flex）。通用 flex 容器，gap 直通像素值。

## 基础用法

<Demo name="flex-web-basic" description="横向排布 + gap。" />

## 纵向与两端对齐

<Demo name="flex-web-vertical" description="vertical / justify / align 组合。" />

## 子项撑满（expand）

<Demo name="flex-web-expand" description="expand 为 snail 扩展（naive 无此 prop）。" />

## API

### SnFlex Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| vertical | `boolean` | `false` | 纵向排布 |
| gap | `number \| 'small'\|'medium'\|'large' \| [number, number]` | `'medium'` | 间距 |
| justify | flex justify 值（直通） | `'start'` | 主轴 |
| align | flex align 值 | — | 交叉轴 |
| wrap | `boolean` | `true` | 换行 |
| inline | `boolean` | `false` | 行内容器 |
| expand | `boolean` | `false` | 子项 flex:1 撑满（snail 扩展） |

与 Space 的区别：Flex 是通用 flex 原语（justify 直通、默认语义更"布局"），Space 是「组件间距」语义。

完整契约见组件 `ai-description.md`。
