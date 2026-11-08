# Steps 步骤条（uni 端 / 移动端）

`sn-steps` 是 `@snui/uni`（移动端 / 小程序 / H5）的步骤进度容器，`sn-step` 是单个步骤。基于 easycom 自动注册，几何值走 `rpx`，跨设备等比缩放。

## 基础用法

`active` 指定当前步骤下标，前面步骤自动标记为已完成：

<Demo name="steps-mp-basic" description="active 指定当前步骤；之前步骤自动 finished、当前 process、之后 wait。" />

## 垂直 / 点状 / 错误状态

`vertical` 纵向排布，`dot` 点状指示器，`status` 覆盖单个步骤状态：

<Demo name="steps-mp-vertical" description="vertical 纵向步骤条；status=error 显式覆盖状态；dot 点状步骤条。" />

## 间距、居中对齐与显式状态

`space` 覆盖指示器间距，`align-center` 让横向步骤条居中，`status` 显式覆盖由 `active` 推导的状态；`icon` / `title` / `description` 插槽可完全替换对应区域：

<Demo name="steps-mp-space" description="space=120rpx 与 align-center；显式 status 覆盖；icon / title / description 插槽。" />

## 自定义节点

`node` 插槽完全替换默认节点（覆盖序号与状态图标），宿主可以画徽标、头像或任意形状；连接线由容器拼装，仍会正常渲染。`content` 插槽整体替换内容区（标题 + 描述）：

<Demo name="steps-mp-node" description="node 插槽替换默认节点；content 插槽整体替换标题 + 描述。" />

## 连接线类型

`connector` 由容器统一持有，容器内每条连接线使用同一样式：`solid`（默认）、`dashed`（虚线）、`dotted`（点线）。`dot` 点状步骤条不渲染连接线，此时 `connector` 无效果：

<Demo name="steps-mp-connector" description="connector 取 solid / dashed / dotted；vertical 下同样生效。" />

## 图标配置

步骤图标有三个来源，优先级为 `iconData` > `iconUrl` > `icon`：

- `icon` — 图标名，依次经图标注册表与内置目录解析（kebab-case 名免注册直接可用），未命中时回退内置状态图标与序号；
- `iconData` — 直接传入 IconData 对象（内置图标集具名导入即可，无需注册）；
- `iconUrl` — 图片地址，渲染为 `<image>`。

`iconSize` 支持档位名（`tiny` / `small` / `medium` / `large` / `xlarge`）映射到 `--sn-mp-icon-size-*`，数字按 px；默认 `--sn-mp-icon-size-medium`。`iconColor` 覆盖描边颜色，默认 `currentColor` 跟随步骤状态色：

<Demo name="steps-mp-icon" description="icon 名称 / iconData 对象 / iconUrl 图片三轨；iconSize 档位与 iconColor 覆盖。" />

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<sn-steps :active="1">
  <sn-step title="提交订单" description="已提交" />
</sn-steps>
```

如需显式 import：

```ts
import { SnSteps } from '@snui/uni/components/sn-steps/sn-steps.vue';
import { SnStep } from '@snui/uni/components/sn-steps/sn-step.vue';
```

## Props

### sn-steps

| 属性          | 类型                              | 默认值    | 说明                               |
| ------------- | --------------------------------- | --------- | ---------------------------------- |
| `active`      | `number`                          | `0`       | 当前激活步骤下标                   |
| `vertical`    | `boolean`                         | `false`   | 是否垂直方向展示                   |
| `dot`         | `boolean`                         | `false`   | 是否使用点状步骤条                 |
| `space`       | `string`                          | `''`      | 步骤条间距，默认自动计算           |
| `alignCenter` | `boolean`                         | `false`   | 是否水平居中（仅横向有效）         |
| `customClass` | `string`                          | `''`      | 根节点自定义类名                   |
| `customStyle` | `string`                          | `''`      | 根节点自定义 inline style          |
| `connector`   | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | 连接线样式（`dot` 模式下无连接线） |

### sn-step

| 属性          | 类型                                           | 默认值      | 说明                                                                   |
| ------------- | ---------------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| `title`       | `string`                                       | `''`        | 步骤标题                                                               |
| `description` | `string`                                       | `''`        | 步骤描述                                                               |
| `icon`        | `string`                                       | `''`        | 步骤图标名（注册表 → 内置目录，未命中回退状态图标 / 序号）             |
| `status`      | `'finished' \| 'process' \| 'error' \| 'wait'` | `undefined` | 步骤状态（不传时由 `active` 推导）                                     |
| `customClass` | `string`                                       | `''`        | 根节点自定义类名                                                       |
| `customStyle` | `string`                                       | `''`        | 根节点自定义 inline style                                              |
| `iconData`    | `IconData`                                     | `undefined` | 图标数据对象（优先级最高）                                             |
| `iconUrl`     | `string`                                       | `''`        | 图标图片地址（优先级低于 `iconData`、高于 `icon`）                     |
| `iconSize`    | `string \| number`                             | `undefined` | 图标尺寸：档位名映射 token，数字按 px，默认 `--sn-mp-icon-size-medium` |
| `iconColor`   | `string`                                       | `''`        | 图标颜色，默认 `currentColor`（跟随步骤状态色）                        |

## Events

`sn-steps` / `sn-step` 均无事件：状态完全由 `active` prop 驱动（AGENTS.md §18，Runtime 只负责状态渲染，不承载业务流转）。

## Slots

| 插槽名                | 说明                                    |
| --------------------- | --------------------------------------- |
| `default`（steps）    | Step 列表                               |
| `icon`（step）        | 自定义步骤图标（渲染在默认节点内）      |
| `title`（step）       | 自定义步骤标题                          |
| `description`（step） | 自定义步骤描述                          |
| `node`（step）        | 完全替换默认节点（覆盖序号 / 状态图标） |
| `content`（step）     | 整体替换内容区（标题 + 描述）           |

## 主题变量

| 变量                                                                                  | 用途                                                                  |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `--sn-mp-color-background-surface`                                                    | 步骤条与指示器底色                                                    |
| `--sn-mp-color-border-default`                                                        | 指示器描边与连接线                                                    |
| `--sn-mp-color-text-secondary`                                                        | 等待 / 完成态标题与描述文字色                                         |
| `--sn-mp-color-text-on-primary`                                                       | 完成 / 错误态指示器内图标色                                           |
| `--sn-mp-color-action-primary`                                                        | 进行中 / 完成态的指示器与连接线                                       |
| `--sn-mp-color-feedback-danger`                                                       | 错误态指示器与标题                                                    |
| `--sn-mp-font-size-md` / `--sn-mp-font-size-sm` / `--sn-mp-font-size-xs`              | 标题 / 节点序号 / 描述字号                                            |
| `--sn-mp-font-weight-medium`                                                          | 进行中标题字重                                                        |
| `--sn-mp-radius-full`                                                                 | 圆形指示器圆角                                                        |
| `--sn-mp-spacing-1` / `--sn-mp-spacing-2` / `--sn-mp-spacing-3` / `--sn-mp-spacing-5` | 标题与描述间距 / 内容上下内边距 / 垂直内容左内边距 / 垂直内容下外边距 |
| `--sn-mp-icon-size-tiny` … `--sn-mp-icon-size-xlarge`                                 | `iconSize` 档位名对应的图标尺寸                                       |

节点内所有字形（自定义图标、完成 / 错误状态图标、序号）共用同一档位：默认 `--sn-mp-icon-size-medium`，`iconSize` 覆盖后整体跟随。连接线颜色默认取 `--sn-mp-color-border-default`，完成态取 `--sn-mp-color-action-primary`。

## AI Patch Boundary

- AI 可通过 Patch 修改 `active` / `vertical` / `dot` / `space` / `alignCenter` / `connector`，以及每个步骤的 `title` / `description` / `icon` / `iconData` / `iconUrl` / `iconSize` / `iconColor` / `status` 等展示配置。
- `active` 是宿主业务进度的投影，Patch 只应调整初始值，不应把它当作流程引擎；步骤间流转由宿主驱动。
- 插槽内容（`node` / `content` / `icon` / `title` / `description`）属于业务数据，Patch 只应调整容器配置，不应改写插槽内部结构。
- 颜色 / 尺寸必须走 `--sn-mp-color-*` / `--sn-mp-icon-size-*` token，Patch 不得写入颜色或尺寸字面量。
- `connector` 只接受 `solid` / `dashed` / `dotted` 三个枚举值，不接受任意 CSS `border-style`。

## 无障碍

- 容器 `role="list"`，每个步骤 `role="listitem"`。
- 进行中的步骤额外带 `aria-current="step"`，其余步骤不带该属性。
- 连接线与点状指示器为装饰元素，不参与朗读。
- 移动端仅 `tap` 交互，小程序无键盘焦点概念。

## 暗色模式

`sn-steps` 的全部颜色来自 `--sn-mp-color-*`，没有浅色 `var()` 兜底，因此在 `.sn-theme-dark` 下自动适配：指示器底色切到暗色表面，未激活描边与连接线使用暗色边框令牌，激活态保持主色，错误态保持危险色。

用 sn-config-provider 的 theme 设为 dark 包裹即可验证：

## 相关

- 标签页：[`sn-tabs`](/components/uni/tabs)
- 折叠面板：[`sn-collapse`](/components/uni/collapse)
- 进度条：[`sn-progress`](/components/uni/progress)
