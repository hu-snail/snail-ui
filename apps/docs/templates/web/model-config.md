# 模型配置页 ModelConfig

模型与厂商的配置界面：厂商列表、接口地址与访问凭证、模型清单、以及生成参数调节。

## 何时使用

- 需要让用户自行接入模型厂商（官方接口或自建网关）
- 需要在一处管理多个厂商与它们的模型
- 需要让用户调节温度、Top P、最大输出、思考程度与流式开关

## 安装与按需加载

```ts
import { SnModelConfig } from '@snui/templates/web/model-config'
```

## 代码演示

### 厂商 / 模型 / 参数

演示里可以真实地添加厂商、编辑接口与凭证、增删模型、切换激活模型，并观察参数面板随模型能力变化。

<Demo name="model-config-web-basic" description="切换模型后，「思考程度」会按该模型是否支持推理自动启用或禁用。" />

## 页面结构

界面按用户实际的操作顺序分为三块：

1. **厂商列表**：选择或新增厂商，显示凭证是否已配置、模型数量，并提供连接测试
2. **厂商详情**：编辑名称、接口地址与访问凭证；管理该厂商的模型清单
3. **生成参数**：调节当前激活模型的采样与输出参数

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

## 参数面板

| 参数 | 范围 | 说明 |
| --- | --- | --- |
| 温度 | 0 – 2，步长 0.1 | 越高输出越发散 |
| Top P | 0 – 1，步长 0.01 | 核采样阈值 |
| 最大输出 | tokens | 单轮答案的长度上限 |
| 思考程度 | 五档 | 所选模型不支持推理时，该项显示为「当前模型不支持」 |
| 流式输出 | 开 / 关 | 是否逐字返回 |

## 凭证处理

访问凭证字段使用密码输入框，其值只会写进宿主机已经持有的厂商对象里：

- 组件不提供任何单独的凭证事件通道
- 代码路径中不存在打印凭证的分支
- 界面只展示「已配置 / 未配置」这一状态，不展示凭证本身

## 无障碍

- 厂商卡片与模型行都声明了选中状态（`aria-pressed` / `aria-checked`），可用键盘 Enter 选择
- 凭证、接口地址、名称、搜索等输入都带可访问名称
- 仅图标按钮带 `aria-label`
