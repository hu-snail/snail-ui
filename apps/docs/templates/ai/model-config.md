# 模型配置 ModelConfig

模型与厂商的配置界面：厂商列表、接口地址与访问凭证、模型清单、以及生成参数调节。它是一整块可嵌入的配置面板，放进页面、抽屉或独立设置页都可以。

> 平台：`Web`

## 何时使用

- 需要让用户自行接入模型厂商（官方接口或自建网关）
- 需要在一处管理多个厂商与它们的模型
- 需要让用户调节温度、Top P、最大输出、思考程度与流式开关
- 需要把配置面板放进抽屉 / 弹窗，而不是单独开一个设置页（[AI 助手](/templates/ai/assistant) 就是这么用的）
- 需要在厂商卡片或参数面板下方追加自己的内容（`vendor-extra` / `params-extra` 插槽）

## 安装与按需加载

样式**按模板**产出：引一个模板只带上它自己的 JS 与它自己的 CSS，不存在「所有模板的样式桶」。三件事：

```ts
// 1) 只导入用到的那个模板：它的 JS 和它自己的样式会一起被带上
import { SnModelConfig } from '@snui/templates/web/model-config'

// 2) 共享 token 层在应用入口导入一次
import '@snui/templates/styles'

// 3) 需要自己控制代码分割时，也可以单独引某个模板的样式文件
import '@snui/templates/styles/web-model-config.css'
```

每个模板的样式文件（都在 `@snui/templates/styles/` 下）：

| 文件 | 对应模板 |
| --- | --- |
| `web-model-config.css` | `@snui/templates/web/model-config` |
| `web-assistant.css` | `@snui/templates/web/assistant` |
| `web-chat.css` | `@snui/templates/web/chat` |
| `web-prompt.css` | `@snui/templates/web/prompt` |
| `web-message-list.css` | `@snui/templates/web/message-list` |
| `uni-chat.css` | `@snui/templates/uni/chat` |
| `uni-message-list.css` | `@snui/templates/uni/message-list` |

引 `web-model-config.css` **不会**带上对话页、输入框、消息列表等其他模板的规则；共享的 token 层只有一份（第 2 步），再引第二个模板时不会重复下载。

## 快速开始

最小可运行版本：一个厂商、一个模型，参数用默认值。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SnModelConfig } from '@snui/templates/web/model-config'
import type { SnAiModelParams, SnAiVendor } from '@snui/templates/web'

const vendors = ref<SnAiVendor[]>([
  {
    id: 'v-gateway',
    name: '自建网关',
    baseUrl: 'https://api.example.com/v1',
    hasCredential: true,
    models: [{ id: 'deep', name: 'Deep', vendorId: 'v-gateway', supportsThinking: true }],
  },
])
const activeVendorId = ref('v-gateway')
const activeModelId = ref('deep')
const params = ref<SnAiModelParams>({ temperature: 0.7, topP: 1, maxTokens: 4096, stream: true })
</script>

<template>
  <SnModelConfig
    v-model:vendors="vendors"
    v-model:active-vendor-id="activeVendorId"
    v-model:active-model-id="activeModelId"
    v-model:params="params"
  />
</template>
```

## 完整接入示例

真实接入里，配置面板的输出要喂给对话请求：`test-connection` 由宿主机真正发一次探活请求，`update:vendors` 落盘到你的存储，选中的模型与参数随下一轮对话一起发出去。

```vue
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { SnModelConfig } from '@snui/templates/web/model-config'
import type { SnAiModelParams, SnAiVendor } from '@snui/templates/web'

const vendors = ref<SnAiVendor[]>([])
const activeVendorId = ref<string | undefined>(undefined)
const activeModelId = ref<string | undefined>(undefined)
const params = ref<SnAiModelParams>({ temperature: 0.7, stream: true })
const search = ref('')
/** 正在测试连接的厂商：配置面板据此在该卡片上显示加载态。 */
const testingVendorId = ref<string | undefined>(undefined)

const activeVendor = computed(() => vendors.value.find((item) => item.id === activeVendorId.value))

onMounted(async () => {
  const response = await fetch('/api/model-config')
  const data = (await response.json()) as {
    vendors: SnAiVendor[]
    activeVendorId?: string
    activeModelId?: string
    params?: SnAiModelParams
  }
  vendors.value = data.vendors
  activeVendorId.value = data.activeVendorId ?? data.vendors[0]?.id
  activeModelId.value = data.activeModelId ?? data.vendors[0]?.models?.[0]?.id
  params.value = data.params ?? { temperature: 0.7, stream: true }
})

/** 落盘：厂商、激活模型或参数任意一项变化都写回后端。 */
async function persist(): Promise<void> {
  await fetch('/api/model-config', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      vendors: vendors.value,
      activeVendorId: activeVendorId.value,
      activeModelId: activeModelId.value,
      params: params.value,
    }),
  })
}

/** 连接测试：配置面板只报告意图，真正探活由宿主机负责。 */
async function onTestConnection({ vendorId }: { vendorId: string }): Promise<void> {
  const vendor = vendors.value.find((item) => item.id === vendorId)
  if (!vendor) return
  testingVendorId.value = vendorId
  try {
    const response = await fetch('/api/model-config/test', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ baseUrl: vendor.baseUrl }),
    })
    // 结果只回写到「是否已配置凭证」，凭证本身不离开宿主机。
    if (response.ok) {
      vendors.value = vendors.value.map((item) =>
        item.id === vendorId ? { ...item, hasCredential: true } : item,
      )
    }
  } finally {
    testingVendorId.value = undefined
    void persist()
  }
}

/** 下一轮对话带上这里选中的模型与参数。 */
function chatBody(prompt: string): string {
  return JSON.stringify({
    prompt,
    modelId: activeModelId.value,
    temperature: params.value.temperature,
    topP: params.value.topP,
    maxTokens: params.value.maxTokens,
    thinkingLevel: params.value.thinkingLevel,
    stream: params.value.stream,
  })
}
</script>

<template>
  <SnModelConfig
    v-model:vendors="vendors"
    v-model:active-vendor-id="activeVendorId"
    v-model:active-model-id="activeModelId"
    v-model:params="params"
    v-model:search="search"
    title="模型与参数"
    :testing-vendor-id="testingVendorId"
    @update:vendors="persist"
    @update:params="persist"
    @test-connection="onTestConnection"
  >
    <!-- 厂商卡片下方追加自己的内容：当前厂商的模型数量 -->
    <template #vendor-extra="{ vendor }">
      <p class="hint">共 {{ vendor.models?.length ?? 0 }} 个模型</p>
    </template>

    <!-- 参数面板中追加一行自己的参数 -->
    <template #params-extra="{ params: current }">
      <p class="hint">当前温度 {{ current.temperature?.toFixed(1) ?? '默认' }}</p>
    </template>
  </SnModelConfig>
</template>
```

### 页面结构

界面按用户实际的操作顺序分为三块：

1. **厂商列表**：选择或新增厂商，显示凭证是否已配置、模型数量，并提供连接测试
2. **厂商详情**：编辑名称、接口地址与访问凭证；管理该厂商的模型清单
3. **生成参数**：调节当前激活模型的采样与输出参数

## 代码演示

### 厂商 / 模型 / 参数

演示里可以真实地添加厂商、编辑接口与凭证、增删模型、切换激活模型，并观察参数面板随模型能力变化。

<Demo name="model-config-web-basic" description="切换模型后，「思考程度」会按该模型是否支持推理自动启用或禁用。" />

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `vendors` | `SnAiVendor[]` | `undefined` | 已配置的厂商，各自带模型清单。 |
| `activeVendorId` | `string` | `undefined` | 当前选中的厂商。 |
| `activeModelId` | `string` | `undefined` | 当前激活的模型。 |
| `params` | `SnAiModelParams` | `undefined` | 生成参数。 |
| `editable` | `boolean` | `true` | 是否提供新增 / 编辑 / 删除操作。 |
| `title` | `string` | `'模型配置'` | 页面标题。 |
| `searchable` | `boolean` | `true` | 是否提供模型搜索框。 |
| `testingVendorId` | `string` | `undefined` | 正在测试连接的厂商，该卡片显示加载态。 |
| `search` | `string` | `undefined` | 模型搜索关键词。 |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `update:vendors` | `SnAiVendor[]` | 厂商或其模型发生变化。 |
| `update:activeVendorId` | `string` | 切换厂商。 |
| `update:activeModelId` | `string` | 切换激活模型。 |
| `update:params` | `SnAiModelParams` | 生成参数变化。 |
| `update:search` | `string` | 搜索关键词变化。 |
| `test-connection` | `{ vendorId }` | 请求宿主机验证该厂商的接口与凭证。 |

### Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `vendor-extra` | `{ vendor }` | 在厂商卡片下追加内容。 |
| `params-extra` | `{ params }` | 在参数面板中追加参数行。 |

### 类型导出

| 名称 | 来源 | 说明 |
| --- | --- | --- |
| `SnModelConfig` | `@snui/templates/web/model-config` | 模板组件本体。 |
| `SnAiVendor` / `SnAiModel` / `SnAiModelParams` 等 | `@snui/templates` | 共享契约类型，供宿主机构造数据。 |

### 参数面板

| 参数 | 范围 | 默认值 | 说明 |
| --- | --- | --- | --- |
| 温度 | 0 – 2，步长 0.1 | 0.7 | 越高输出越发散。 |
| Top P | 0 – 1，步长 0.01 | 1 | 核采样阈值。 |
| 最大输出 | tokens | 4096 | 单轮答案的长度上限。 |
| 思考程度 | 五档（`off` / `low` / `medium` / `high` / `max`） | `off` | 所选模型不支持推理时，该项显示为「当前模型不支持」。 |
| 流式输出 | 开 / 关 | 开 | 是否逐字返回。 |

参数默认值只在 `params` 未提供对应字段时生效；宿主机的 `params` 与面板双向同步。

## 主题与 token 定制

配置面板不收 `theme` prop：它继承应用级别的风格包（祖先里的 `SnConfigProvider`，或应用入口挂的风格包），消费的 `--sn-web-*` 别名随风格包变化。

```vue
<SnConfigProvider skin="ios">
  <SnModelConfig v-model:vendors="vendors" />
</SnConfigProvider>
```

只改这一块的观感时，直接覆盖 `--sn-web-*` 别名：

```css
/* 配置面板根节点上的细粒度覆盖 */
.sn-model-config {
  --sn-web-color-background-surface: #faf7f0;
  --sn-web-color-background-subtle: #f2eee5;
  --sn-web-spacing-4: 18px;
}
```

放进抽屉（例如 [AI 助手](/templates/ai/assistant)）时，抽屉宽度用 `modelConfigWidth` 控制，不属于 token。

## 无障碍

- 厂商卡片与模型行都声明了选中状态（`aria-pressed` / `aria-checked`），可用键盘 Enter 选择
- 凭证、接口地址、名称、搜索等输入都带可访问名称
- 仅图标按钮带 `aria-label`
- 厂商列表带区域名（`aria-label="厂商列表"`），搜索框带可访问名称
- 面板中的控件在 `editable` 为 `false` 时为禁用态，而不是隐藏，状态变化仍可被读屏感知

## 中断与资源回收

- 配置面板本身不发起网络请求：连接测试、凭证校验、配置落盘都由宿主机负责，组件只报告意图（`test-connection`、`update:*`）
- 厂商与模型的编辑是受控数据：组件不缓存副本，替换 `vendors` 会整体反映到界面
- 组件不注册全局监听、不创建定时器；卸载时没有残留订阅
- `testingVendorId` 只驱动加载态显示：宿主机在测试结束后把它清空即可，不要在组件外持有对该卡片的引用

## 常见问题

**Q：凭证会出现在事件里吗？**
不会。访问凭证字段是密码输入框，其值只会写进宿主机已经持有的那个厂商对象里；组件不提供单独的凭证事件通道，代码路径中不存在打印凭证的分支，界面只展示「已配置 / 未配置」状态。

**Q：怎么让用户不能改配置？**
`:editable="false"`：不提供新增 / 编辑 / 删除操作，参数控件变为禁用态。

**Q：连接测试要自己实现吗？**
要。组件只触发 `test-connection` 并接受 `testingVendorId` 来显示加载态，真正的探活请求与结果判定都在宿主机。

**Q：想把它放进抽屉需要自己套一层吗？**
不需要手写抽屉逻辑，直接用 [AI 助手](/templates/ai/assistant)：页头已带「模型配置」入口与抽屉，且与输入区的模型选择器共享同一份厂商列表。

**Q：搜索框什么时候出现？**
`searchable` 为 `true`（默认）时出现；搜索关键词受 `v-model:search` 控制，过滤在组件内部完成。
