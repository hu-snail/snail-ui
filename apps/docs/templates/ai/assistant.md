# AI 助手 SnAiAssistant

把整个 AI 套件收进一页：页头 + 转录区 + 输入区，**外加一个预接好的「模型配置」抽屉**。它等价于对话页 `SnAiChat` 再加一个模型配置入口，所以只装一个组件就能得到一个「能用、能改模型」的完整 AI 页面。

> 平台：`Web`

## 何时使用

- 需要一个开箱即用的 AI 页面：既要对话，也要让用户自己切模型、调参数
- 不想自己拼接「对话页 + 模型配置面板 + 抽屉 + 两者共享的厂商列表」
- 希望模型配置以抽屉形式出现，不打断对话（而不是跳转到一个独立设置页）
- 页头还要放自己的按钮（历史记录、分享、清空），需要 `header-actions` 插槽
- 只想用其中一块时（只要输入框、只要转录区、只要配置面板），仍然按需引对应的子模板，见「统一模板与按需子模板」

## 安装与按需加载

样式**按模板**产出：引一个模板只带上它自己的 JS 与它自己的 CSS，不存在「所有模板的样式桶」。三件事：

```ts
// 1) 只导入用到的那个模板：它的 JS 和它自己的样式会一起被带上
import { SnAiAssistant } from '@snui/templates/web/assistant'

// 2) 共享 token 层在应用入口导入一次
import '@snui/templates/styles'

// 3) 需要自己控制代码分割时，也可以单独引某个模板的样式文件
import '@snui/templates/styles/web-assistant.css'
```

每个模板的样式文件（都在 `@snui/templates/styles/` 下）：

| 文件 | 对应模板 |
| --- | --- |
| `web-assistant.css` | `@snui/templates/web/assistant` |
| `web-chat.css` | `@snui/templates/web/chat` |
| `web-prompt.css` | `@snui/templates/web/prompt` |
| `web-message-list.css` | `@snui/templates/web/message-list` |
| `web-model-config.css` | `@snui/templates/web/model-config` |
| `uni-chat.css` | `@snui/templates/uni/chat` |
| `uni-message-list.css` | `@snui/templates/uni/message-list` |

引 `web-assistant.css` **不会**带上其他模板的规则；共享的 token 层只有一份（第 2 步），再引第二个模板时不会重复下载。

## 快速开始

最小可运行版本：对话能力来自 `SnAiChat`，模型配置抽屉由本模板自己接好。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SnAiAssistant } from '@snui/templates/web/assistant'
import type { SnAiRunTurn } from '@snui/templates/web/chat'
import type { SnAiMessage, SnAiVendor } from '@snui/templates/web'

const messages = ref<SnAiMessage[]>([])
const vendors = ref<SnAiVendor[]>([])

const run: SnAiRunTurn = async (turn, { emit }) => {
  emit({ type: 'text', text: `你刚才说的是：${turn.text}` })
}
</script>

<template>
  <SnAiAssistant
    v-model:messages="messages"
    :run="run"
    :vendors="vendors"
    title="AI 助手"
    @update:vendors="vendors = $event"
  />
</template>
```

页头右侧会多出一个「模型配置」按钮，点开就是完整的模型配置面板（厂商列表 / 接口与凭证 / 模型清单 / 生成参数）。

## 完整接入示例

下面把三件事一次接完：真实后端流式对话、抽屉里编辑厂商与模型、以及把抽屉里选中的模型同步给输入区的模型选择器。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { SnAiAssistant } from '@snui/templates/web/assistant'
import { SnButton } from '@snui/vue-web'
import type { SnAiRunTurn } from '@snui/templates/web/chat'
import type { SnAiMessage, SnAiModelParams, SnAiVendor } from '@snui/templates/web'

const messages = ref<SnAiMessage[]>([])
const vendors = ref<SnAiVendor[]>([])
const activeVendorId = ref<string | undefined>(undefined)
const activeModelId = ref<string | undefined>(undefined)
const params = ref<SnAiModelParams>({ temperature: 0.7, stream: true })
/** 抽屉开合由宿主机接管，用来同步到 URL 或埋点。 */
const configOpen = ref(false)

/** 输入区的模型选择器与抽屉共用同一份厂商列表。 */
const models = computed(() => vendors.value.flatMap((vendor) => vendor.models ?? []))

const run: SnAiRunTurn = async (turn, { signal, emit }) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      prompt: turn.text,
      agentId: turn.agentId,
      permission: turn.permission,
      modelId: turn.modelId ?? activeModelId.value,
      params: params.value,
    }),
    // 抽屉里的 stop 与页面卸载都会中止它。
    signal,
  })
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    emit({ type: 'text', text: decoder.decode(value, { stream: true }) })
  }
}

/** 宿主机负责真正验证接口与凭证；这里只回填「测试中」的那一项。 */
const testingVendorId = ref<string | undefined>(undefined)
function onTestConnection({ vendorId }: { vendorId: string }): void {
  testingVendorId.value = vendorId
}
</script>

<template>
  <SnAiAssistant
    v-model:messages="messages"
    v-model:active-vendor-id="activeVendorId"
    v-model:active-model-id="activeModelId"
    v-model:model-config-open="configOpen"
    :run="run"
    :vendors="vendors"
    :models="models"
    :model-params="params"
    title="AI 助手"
    model-config-title="模型与参数"
    :model-config-width="480"
    @update:vendors="vendors = $event"
    @update:params="params = $event"
    @test-connection="onTestConnection"
    @error="({ error }) => console.warn(error.code)"
  >
    <!-- 排在「模型配置」按钮之后，页头右侧的自定义操作放这里 -->
    <template #header-actions>
      <SnButton size="small" @click="messages = []">清空对话</SnButton>
    </template>
  </SnAiAssistant>
</template>
```

不用抽屉、只在需要时才挂它：`:show-model-config="false"` 会让页头不再渲染入口，抽屉本身也不会挂载，行为退化成纯对话页。

## 代码演示

### 统一模板：对话 + 模型配置抽屉

页头点开「模型配置」即可增删厂商与模型、编辑接口与凭证、调节生成参数；抽屉里的模型选择与输入区的选择器共用同一份厂商列表，切换后两边立刻同步。

<Demo name="ai-assistant-web-basic" description="页头「模型配置」入口 + 抽屉里的厂商 / 模型 / 参数面板，与输入区选择器共享同一份数据。" />

## API

### Props

继承 `SnAiChat` 的全部 props 与事件，语义完全不变：`messages`、`run`、`agents`、`permissions`、`models`、`vendors`、`theme`、`title`、`subtitle`、`disabled`、`allowQueue`、`showHeader`、`loading`、`rememberSelection`，以及事件 `update:messages`、`turn-start`、`turn-end`、`error`、`retry`、`update:modelId`、`update:agentId`。逐个字段的说明见 [AI 对话页](/templates/ai/chat#props)。

除此之外，本模板只新增下面这些成员：

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `showModelConfig` | `boolean` | `true` | 是否显示页头的「模型配置」入口与抽屉 |
| `modelConfigTitle` | `string` | `'模型配置'` | 抽屉标题，同时作为入口按钮的可访问名称 |
| `modelConfigWidth` | `number \| string` | `420` | 抽屉宽度，数字按 px 处理 |
| `modelConfigOpen` | `boolean \| undefined` | `undefined` | 受控的抽屉开合状态；不传时由模板自己记住 |
| `activeVendorId` | `string \| undefined` | `undefined` | 传给模型配置的当前厂商 |
| `activeModelId` | `string \| undefined` | `undefined` | 传给模型配置的当前模型 |
| `modelParams` | `SnAiModelParams \| undefined` | `undefined` | 传给模型配置的生成参数 |
| `editableModels` | `boolean` | `true` | 是否允许在抽屉里增删改厂商 / 模型 |
| `vendors` | `SnAiVendor[] \| undefined` | `undefined` | 已配置的厂商。抽屉与输入区模型选择器共用这一份 |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelConfigOpen` | `boolean` | 抽屉开合状态变化 |
| `update:vendors` | `SnAiVendor[]` | 抽屉里的厂商或其模型发生变化 |
| `update:activeVendorId` | `string` | 抽屉里切换了厂商 |
| `update:activeModelId` | `string` | 抽屉里切换了激活模型 |
| `update:params` | `SnAiModelParams` | 抽屉里改动了生成参数 |
| `test-connection` | `{ vendorId }` | 请求宿主机验证该厂商的接口与凭证 |

事件名沿用模型配置的命名（`update:params` 而非 `update:modelParams`），这样同一个 handler 可以原样给 `SnModelConfig` 用。

### Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `header-actions` | — | 渲染在「模型配置」按钮之后，页头右侧的自定义操作 |
| `model-config` | `{ close }` | 替换抽屉正文；`close()` 关闭抽屉，走同一个开合状态 |
| `transcript` | `{ messages, empty }` | 转发自 `SnAiChat`，替换整个转录区域 |
| `toolbar` | — | 转发自 `SnAiChat`，输入框工具条中的额外控件 |

### 类型导出

| 名称 | 来源 | 说明 |
| --- | --- | --- |
| `SnAiAssistant` | `@snui/templates/web/assistant` | 模板组件本体。 |
| `SnAiRunTurn` | `@snui/templates/web/chat` | 运行函数签名。 |
| `SnAiMessage` / `SnAiVendor` / `SnAiModelParams` 等 | `@snui/templates` | 共享契约类型，供宿主机构造数据。 |

## 主题与 token 定制

`theme` 直接透传给内部的对话页，因此行为与 `SnAiChat` 一致：非 `default` 的值会在 `<body>` 上加 `snui-skin-<theme>` 类，由风格包覆盖 token 与皮肤 CSS。可用值：`default`、`dark`、`ios`、`doodle`、`sticky-note`。

```vue
<SnAiAssistant title="iOS 风格" theme="ios" :run="run" />
```

抽屉内是模型配置模板，覆盖同一套 `--sn-web-*` 别名即可同时影响对话区与抽屉：

```css
/* 页面根节点上的细粒度覆盖 */
.sn-ai-assistant {
  --sn-web-color-background-surface: #faf7f0;
  --sn-web-color-border-subtle: rgba(0, 0, 0, 0.08);
  --sn-web-spacing-5: 20px;
}
```

抽屉宽度不属于 token，用 `model-config-width` prop 控制。

## 无障碍

- 「模型配置」入口是带可访问名称的按钮：名称来自 `modelConfigTitle`，并同步写入 `title` 提示
- 抽屉由基础抽屉组件提供焦点管理、遮罩与 ESC 关闭；关闭后焦点回到入口按钮
- 转录区每行带 `data-status`，读屏与自动化测试可据此定位状态
- 输入框、发送、停止等控件的可访问名称由输入框模板提供；运行中发送按钮切换为停止，名称同步变化
- `header-actions` 插槽里的自定义控件需要由使用方自己保证可访问名称

## 中断与资源回收

- 一轮运行的中断完全由内部对话页负责：点「停止」中止 `signal`，页面卸载时中止仍在运行的轮次
- 本模板不额外创建订阅或定时器；抽屉开关只切换可见性，不重建转录区，因此开关抽屉不会打断正在生成的轮次
- `:show-model-config="false"` 时抽屉整体不挂载，也不会有任何残留监听

## 常见问题

**Q：它和 `SnAiChat` 到底什么关系？**
`SnAiAssistant` 是「AI 套件」的伞形模板：内部就是 `SnAiChat`，再加上模型配置入口与抽屉。`SnAiChat` 仍然可用，是需要**纯对话页**（不要配置入口）时的选择。两者的 props / 事件完全兼容，从 `SnAiChat` 换过来只需把标签名改掉。

**Q：我只想要输入框（或只要配置面板）怎么办？**
按需引子模板即可：`@snui/templates/web/prompt`、`@snui/templates/web/model-config`、`@snui/templates/web/message-list`。见 [模板总览](/templates/overview) 的「统一模板与按需子模板」。

**Q：抽屉里的凭证会被组件读走吗？**
不会。凭证只写进你传给 `vendors` 的那个厂商对象里，组件不提供单独的凭证事件通道，也不打印凭证。

**Q：怎么让抽屉默认打开？**
用受控写法：`v-model:model-config-open="configOpen"`，把 `configOpen` 初始值设为 `true` 即可。

**Q：模型配置里的模型会传给 `run` 吗？**
抽屉选中的模型通过 `v-model:active-model-id` 出去；一轮运行时 `turn.modelId` 来自输入区的选择器。两者是否共享同一份状态由宿主机决定（把 `activeModelId` 也绑给输入区即可，完整示例里就是这么做的）。
