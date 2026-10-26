# 东西 Thing · Web（PC 端）

结构化内容块：头像 / 标题 / 附加信息 / 描述 / 正文 / 尾部 / 操作七个区域。

## 何时使用

- 详情介绍、通知卡片等需要固定信息层级的场景
- 列表行内部需要头像 + 标题 + 描述 + 操作的组合
- 需要头像缩进（正文与头像左缘对齐）

## 代码演示

### 基础用法

<Demo name="thing-web-basic" description="title / description / 正文 + footer / action 插槽。" />

### 内容缩进

<Demo name="thing-web-indent" description="content-indented 让内容缩进到头像旁，配 header-extra 槽位。" />

## API

### SnThing Props

| 名称              | 类型                      | 默认值      | 说明                                            |
| ----------------- | ------------------------- | ----------- | ----------------------------------------------- |
| title             | `string`                  | `undefined` | 标题，`header` 插槽可覆盖                       |
| title-extra       | `string`                  | `undefined` | 标题行尾部的附加内容，`header-extra` 插槽可覆盖 |
| description       | `string`                  | `undefined` | 描述，`description` 插槽可覆盖                  |
| content           | `string`                  | `undefined` | 正文，`default` 插槽可覆盖                      |
| content-indented  | `boolean`                 | `false`     | 头像移出内容列、正文缩进到头像旁                |
| description-class | `string`                  | `undefined` | 描述区域类名                                    |
| description-style | `string \| CSSProperties` | `undefined` | 描述区域样式                                    |
| content-class     | `string`                  | `undefined` | 正文区域类名                                    |
| content-style     | `string \| CSSProperties` | `undefined` | 正文区域样式                                    |

### SnThing Slots

| 名称         | 参数 | 说明                             |
| ------------ | ---- | -------------------------------- |
| default      | `()` | 正文区域                         |
| avatar       | `()` | 头像区域                         |
| header       | `()` | 标题区域，覆盖 `title`           |
| header-extra | `()` | 标题尾部区域，覆盖 `title-extra` |
| description  | `()` | 描述区域，覆盖 `description`     |
| footer       | `()` | 尾部区域                         |
| action       | `()` | 操作区域（通常放按钮组）         |

默认（未缩进）时头像在标题列旁；`content-indented` 后头像移到整体左侧、标题列回到正文流。

完整契约见组件 `ai-description.md`。
