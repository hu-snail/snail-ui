# Steps 步骤条（Web 端）

`SnSteps` + `SnStep` 是 `@snui/vue-web`（PC 桌面端）的步骤条组。水平 / 垂直布局、标题位置（contentPlacement）、四种状态（process / finish / error / wait）、尺寸按 [naive-ui `n-steps`](https://www.naiveui.com/zh-CN/light/components/steps) 1:1 对齐（AGENTS.md §112）。

适合填写向导、下单流程、审核流水线等多阶段流程。

## 实时预览

<Demo name="steps-web-basic" description="默认水平布局 + 默认状态推导（1 已完成 / 2 进行中 / 3 等待）" />

<Demo name="steps-web-status" description="status='error' + 单步 status 覆盖，展示四种状态" />

<Demo name="steps-web-vertical" description="vertical 垂直布局，适合侧边流程说明" />

<Demo name="steps-web-content-bottom" description="contentPlacement='bottom' — 标题在指示器下方，常见于首页引导" />

<Demo name="steps-web-clickable" description="v-model:current + @update:current — 点击可跳转" />

## 基础用法

```ts
import { ref } from 'vue'
import { SnSteps, SnStep } from '@snui/vue-web'
import '@snui/tokens-web/styles'

const current = ref(1)
```

```html
<SnSteps v-model:current="current">
  <SnStep title="填写信息" description="基础资料与联系方式" />
  <SnStep title="确认订单" description="核对商品与金额" />
  <SnStep title="完成" description="提交成功" />
</SnSteps>
```

`current` 为 1-based：`current=1` 时第 1 步是 `process`，后面的步都是 `wait`；`current=2` 时第 1 步自动变成 `finish`。

## 状态控制

```html
<!-- 让第 2 步显示为error -->
<SnSteps :current="2" status="error">
  <SnStep title="填写信息" />
  <SnStep title="确认订单" />
</SnSteps>

<!-- 或者单步显式指定，优先级最高 -->
<SnSteps :current="1">
  <SnStep title="填写信息" />
  <SnStep title="确认订单" status="error" />
</SnSteps>
```

状态解析顺序（与 n-step 一致）：显式 `status` prop → 由父级 `current` 推导（`< current` 为 finish，`=== current` 取父级 status，`> current` 为 wait）。

## 点击跳转

`SnStep` 未设置 `disabled` 且父级 `current` 存在时可点击，点击后向父级 emit `update:current`：

```html
<SnSteps v-model:current="current">
  <SnStep title="步骤一" />
  <SnStep title="步骤二" />
  <SnStep title="步骤三" disabled />
</SnSteps>
```

## API

### SnSteps Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `current` | `number` | `undefined` | 当前激活步骤下标（1-based，`v-model:current`） |
| `status` | `'process' \| 'finish' \| 'error' \| 'wait'` | `'process'` | 应用于 `current` 所处步骤的状态 |
| `size` | `'small' \| 'medium'` | `'medium'` | 指示器尺寸 |
| `vertical` | `boolean` | `false` | 垂直堆叠布局 |
| `contentPlacement` | `'right' \| 'bottom'` | `'right'` | 标题相对指示器的位置（仅水平布局生效） |

### SnStep Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `status` | `'process' \| 'finish' \| 'error' \| 'wait'` | `undefined` | 显式状态，优先级高于从 `current` 推导 |
| `title` | `string` | `''` | 步骤标题 |
| `description` | `string` | `''` | 步骤描述 |
| `disabled` | `boolean` | `false` | 禁用点击并降低不透明度 |

### SnSteps Events

| 名称 | 载荷 | 触发时机 |
| --- | --- | --- |
| `update:current` | `(current: number)` | 点击可点击的步骤（`v-model:current`） |

### Slots

| 组件 | 名称 | 说明 |
| --- | --- | --- |
| `SnSteps` | `default` | 一组 `<SnStep>` 子节点 |
| `SnSteps` | `finish-icon` | 已完成步骤的自定义图标（§112 已声明，暂未下发） |
| `SnSteps` | `error-icon` | 出错步骤的自定义图标（§112 已声明，暂未下发） |
| `SnStep` | `default` | 步骤正文，覆盖 `description` |
| `SnStep` | `icon` | 指示器内容，覆盖序号 / 状态图标 |
| `SnStep` | `title` | 步骤标题，覆盖 `title` prop |

## 无障碍

当前版本的无障碍支持尚不完整，**已在 `ai-description.md` 记录为待办**：

- 序号以文本渲染，屏幕阅读器可读出「1 / 2 / 3」
- 禁用步骤有 `cursor: not-allowed` + `opacity: 0.6`
- 点击仅为指针便利，不替代表单自身的主操作按钮，因此不依赖点击也能用键盘完成流程
- 待补：激活步骤的 `aria-current="step"`，以及分组容器的 `role="list"` / `aria-label`

## 相关

- 与 [`SnTabs`](/components/web/tabs) 同属导航线；向导页常配 [`SnCard`](/components/web/card) 承载表单内容
