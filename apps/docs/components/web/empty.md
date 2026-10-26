# 空状态 Empty · Web（PC 端）

居中的空状态占位：图标 + 描述 + 附加操作区。

## 何时使用

- 表格、列表无数据时的占位
- 搜索 / 筛选无结果的提示
- 需要在空状态放一个重试或引导操作

## 代码演示

### 基础用法

<Demo name="empty-web-basic" description="默认内联 SVG 图标 +「无数据」描述。" />

### 自定义图标与操作

<Demo name="empty-web-icon" description="icon 插槽替换图标，extra 插槽放操作。" />

### 尺寸

<Demo name="empty-web-size" description="size：tiny / small / medium / large / huge。" />

## API

### SnEmpty Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| description | `string` | `undefined` | 描述文本，缺省为「无数据」，`default` 插槽可覆盖 |
| show-description | `boolean` | `true` | 是否展示描述 |
| show-icon | `boolean` | `true` | 是否展示图标 |
| size | `'tiny' \| 'small' \| 'medium' \| 'large' \| 'huge'` | `'medium'` | 尺寸（图标 28 / 34 / 40 / 46 / 52px） |

### SnEmpty Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| default | `()` | 替代描述内容 |
| extra | `()` | 描述下方的附加内容 |
| icon | `()` | 自定义图标，替换默认内联 SVG |

完整契约见组件 `ai-description.md`。
