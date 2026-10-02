# AUI 产品需求与系统架构文档

**版本：v1.2**  
**状态：Architecture Baseline / Phase 1 开发基线**  
**文档性质：产品需求 + 系统架构 + Protocol Contract**  
**目标：作为《AUI Development v1.2》的唯一上游需求基线**

---

# 0. 文档说明

## 0.1 文档目标

AUI 是一个以 **Schema First** 为核心的现代 UI 框架体系。

AUI 的核心目标不是创建一个传统的 Vue UI Component Library，也不是构建一个完整 Low-Code 平台，而是建立一套：

> **Schema → Contract → Runtime → Renderer**

的 UI 基础设施，使同一套 UI Schema 可以被不同前端运行环境解释、渲染、检查和被 AI 生成/修改。

核心方向：

```text
UI Schema
    ↓
Validation
    ↓
Normalization
    ↓
Runtime
    ↓
Renderer
    ↓
UI
```

AI 位于 Runtime 外部：

```text
AI
 ↓
Generate Schema
 ↓
Validate
 ↓
Patch
 ↓
AUI Runtime
 ↓
Render / Inspect
 ↓
Error
 ↓
AI Patch
```

---

# 1. 产品定位

## 1.1 AUI 是什么

AUI 是：

> 面向 Vue 生态、Schema 驱动、AI 可理解与可修改的 UI 基础框架。

第一阶段主要服务：

- SaaS
- Admin
- 内部管理系统
- 企业后台
- 数据录入系统
- Dashboard
- 中后台页面
- 快速原型与 AI 辅助开发

---

# 2. AUI 不是什么

AUI 不定位为：

- 完整 Low-Code 平台
- 业务 API Framework
- 业务 Store Framework
- 工作流平台
- CMS
- ERP
- CRM
- AI Agent Framework
- 自动生成生产级 SFC 的代码生成器
- 第三方 UI Framework Adapter 集合

特别禁止：

```text
AUI Core
    ↓
Pinia
Axios
Vue Router
Business API
Business Store
Payment
User Service
```

这些都属于 Host Application。

---

# 3. 多端战略

## 3.1 Web

AUI Web 是：

> 类似 Element Plus / Naive UI 的 Vue 3 Web UI Library。

使用：

```text
Vue 3
Vite
TypeScript
```

---

## 3.2 Uni App

AUI Uni 不是重新实现 H5 / 微信小程序 / App Renderer。

正确关系：

```text
AUI Uni
   ↓
uni-app
   ↓
H5 / MP / App / ...
```

AUI 只提供：

> 适配 uni-app 的 UI Component Library。

因此：

**AUI 不重复实现 uni-app 已经解决的平台渲染能力。**

---

## 3.3 React / Flutter

未来可以支持：

```text
AUI Schema
    ↓
React Implementation
```

以及：

```text
AUI Schema
    ↓
Flutter Implementation
```

但 React / Flutter：

> 属于未来生态扩展，不属于 Phase 1 Core。

---

# 4. 核心设计原则

## 4.1 Schema First

Schema 是 UI 的核心描述形式。

AI 不直接操作：

```text
.vue
.ts
DOM
```

而主要操作：

```text
UISchema
```

---

## 4.2 Contract First

每个 Component 必须有正式 Contract。

Contract 定义：

- Props
- Events
- Slots
- Tokens
- Capabilities
- A11y
- AI Patch Boundary

---

## 4.3 Boundary First

系统必须明确以下边界：

```text
Schema
 ↓
Contract
 ↓
Runtime
 ↓
Renderer
```

以及：

```text
Runtime
 ↓
AppBridge
 ↓
Host Application
```

---

## 4.4 Framework-first，而非伪跨框架

Phase 1：

```text
AUI Runtime API
+
Vue Reactivity
+
Vue Renderer
```

不为了未来 React / Flutter 而过度抽象。

---

# 5. 系统总体架构

```text
                         ┌──────────────────┐
                         │    AUI Schema     │
                         │ JSON Canonical    │
                         └────────┬─────────┘
                                  │
                           Validate / Normalize
                                  │
                                  ▼
                         ┌──────────────────┐
                         │      Runtime      │
                         │                  │
                         │ Binding          │
                         │ Local State      │
                         │ Derived State    │
                         │ Action Registry  │
                         │ Lifecycle        │
                         │ Error            │
                         │ Inspect          │
                         └───────┬──────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
         AppBridge            Tokens           Component
              │                  │               Contract
              │                  │                  │
              ▼                  ▼                  ▼
          Host App        Theme/Style/Density     Props
          Services                               Events
          Router                                 Slots
          Notify                                 A11y
                                                    │
                                                    ▼
                                           ┌────────────────┐
                                           │    Renderer    │
                                           └───────┬────────┘
                                                   │
                              ┌────────────────────┼──────────────┐
                              ▼                    ▼              ▼
                           Vue Web              Vue Uni       Future
                                                               React/
                                                               Flutter
```

---

# 6. 三层核心架构

## 6.1 Protocol

负责：

- Schema
- Node
- Binding
- Actions
- Event
- Component Contract
- Theme
- Token
- A11y
- Capability
- Version

Protocol 不依赖：

- Vue
- React
- Flutter
- Router
- Pinia

---

## 6.2 Runtime

负责：

- Schema 生命周期
- State
- Binding
- Computed
- Action
- Dependency tracking
- Validation
- Normalization
- Patch
- Error
- Inspect

Phase 1 Runtime 使用 Vue 3 Reactivity。

---

## 6.3 Renderer

负责：

```text
Runtime Node
      ↓
Platform Component
```

Phase 1：

```text
Vue Web Renderer
```

Phase 2：

```text
Vue Uni Renderer
```

未来：

```text
React Renderer
Flutter Renderer
```

---

# 7. Schema Canonical Format

## 7.1 Canonical Format

AUI Schema 的运行时标准格式：

```text
JSON
```

原因：

- 可序列化
- AI 友好
- 与语言无关
- 可持久化
- 可 Patch
- 可传输
- 可测试

---

## 7.2 TypeScript

TypeScript 用于：

```text
Developer API
Protocol Types
Component Contract
Runtime Types
```

类型来源：

```text
Zod
 ↓
z.infer
 ↓
TypeScript
```

---

## 7.3 YAML

YAML 可以作为：

- AI Authoring
- 文档
- Template
- 配置

但：

> YAML 不是 Canonical Runtime Format。

---

# 8. UISchema

基础结构：

```ts
interface UISchema {
  schema: string
  version: string
  root: UINode
}
```

例如：

```json
{
  "schema": "aui.page",
  "version": "1.0",
  "root": {
    "type": "card",
    "props": {},
    "children": []
  }
}
```

---

# 9. UINode

```ts
interface UINode {
  id?: string
  type: string

  props?: Record<string, unknown>

  children?: UINode[]

  bindings?: Record<string, UIBinding>

  events?: Record<string, UIEventBinding>

  a11y?: UIAccessibility

  style?: Record<string, unknown>
}
```

---

# 10. Schema ID

Schema 必须具有明确 Schema ID。

例如：

```text
aui.page
aui.component
aui.template
aui.fragment
```

版本：

```json
{
  "schema": "aui.page",
  "version": "1.0"
}
```

禁止只使用：

```json
{
  "version": "1.0"
}
```

因为无法确定版本所属协议。

---

# 11. Schema 生命周期

```text
Input Schema
     ↓
Schema Validation
     ↓
Normalization
     ↓
Compatibility Check
     ↓
Runtime Create
     ↓
Mount
     ↓
Update
     ↓
Patch
     ↓
Update
     ↓
Unmount
     ↓
Dispose
```

---

# 12. Validation

Schema 必须经过 Validator。

```ts
interface SchemaValidator {
  validate(
    schema: UISchema
  ): ValidationResult
}
```

结果：

```ts
interface ValidationResult {
  valid: boolean
  errors: SchemaValidationError[]
}
```

错误：

```ts
interface SchemaValidationError {
  path: string
  code: string
  message: string
  hint?: string

  source:
    | "schema"
    | "component"
    | "binding"
    | "action"

  severity:
    | "error"
    | "warning"
}
```

---

# 13. Normalize

Normalize 的作用不是简单格式化，而是：

> 将合法但存在多种表达形式的 Schema 转换成唯一 Canonical Representation。

例如：

```json
{
  "type": "button"
}
```

Normalize：

```json
{
  "type": "button",
  "props": {
    "type": "primary",
    "size": "medium",
    "disabled": false
  }
}
```

因此：

```text
Validate
=
是否合法

Normalize
=
标准形式是什么
```

---

# 14. Runtime State Model

AUI State 分为三类。

## 14.1 Local State

由 Runtime 持有。

例如：

```text
local.form.email
local.loading
local.count
```

生命周期与 Runtime Instance 一致。

---

## 14.2 Derived State

由 computed 产生。

例如：

```text
price
quantity
    ↓
computed
    ↓
total
```

Derived State 不作为独立持久状态。

---

## 14.3 External State

由 Host Application 持有。

例如：

```text
Pinia
Vue Store
API Cache
User Session
```

AUI 不拥有。

---

# 15. RuntimeContext

```ts
interface RuntimeContext {
  localState: LocalState

  externalState: ExternalStateBridge

  computed: ComputedRegistry

  actions: ActionRegistry

  bridge: AppBridge

  signal: AbortSignal
}
```

禁止提供模糊的：

```ts
context.state
```

作为所有状态的统一入口。

---

# 16. Reactive Model

Phase 1：

```text
Vue 3 Reactivity
```

使用：

```ts
ref
reactive
computed
effect
effectScope
```

AUI 不自研 Proxy Reactive Engine。

---

## 16.1 ReactiveAdapter

```ts
interface ReactiveAdapter {
  createState<T>(
    value: T
  ): ReactiveValue<T>

  computed<T>(
    getter: () => T
  ): ReactiveValue<T>

  effect(
    fn: () => void
  ): StopHandle

  dispose(): void
}
```

Phase 1：

```text
VueReactiveAdapter
```

---

# 17. Binding

Binding 是 Schema 对 Runtime State 的声明式引用。

Phase 1 只支持：

```text
$bind
```

例如：

```json
{
  "value": {
    "$bind": "local.form.email"
  }
}
```

---

# 18. Binding 读写

Binding 必须区分：

### Read

```ts
resolve(binding, context)
```

### Write

```ts
set(binding, value, context)
```

---

## 18.1 双向绑定

Input：

```text
Input
 ↓
BindingResolver.set()
 ↓
local.form.email
```

---

# 19. Expression Engine

Phase 1：

> 不实现通用 Expression Language。

禁止：

```text
eval()
new Function()
任意 JavaScript
```

也禁止让 Schema 直接执行：

```text
state.a + state.b
```

作为任意表达式。

Computed Logic 在 Phase 1 由 Runtime / Developer API 提供。

未来如需要 Expression DSL，必须单独建立安全协议。

---

# 20. Event / Action / Service 三层模型

这是 AUI 的核心业务边界。

## Event

表示：

> 发生了什么。

例如：

```text
click
change
submit
```

---

## Action

表示：

> 要做什么。

例如：

```text
user.login
form.submit
router.back
```

---

## Service

表示：

> Host Application 实际提供什么业务能力。

例如：

```text
UserService
PaymentService
StorageService
```

关系：

```text
Component Event
      ↓
Event Binding
      ↓
Action
      ↓
Action Registry
      ↓
Service / Router / Notify
```

---

# 21. Action Contract

```ts
interface ActionDefinition<TPayload = unknown> {
  id: string

  payload?: ZodType<TPayload>

  execute(
    context: ActionContext,
    payload: TPayload
  ): Promise<ActionResult>

  ai?: {
    description: string
    allowed: boolean
  }
}
```

Action Payload 必须经过 Zod 验证。

---

# 22. Action Registry

```ts
interface ActionRegistry {
  register(
    action: ActionDefinition
  ): void

  get(
    id: string
  ): ActionDefinition | undefined

  execute(
    id: string,
    payload: unknown,
    context: ActionContext
  ): Promise<ActionResult>
}
```

Schema 只能调用：

```text
Action ID
```

不能直接调用：

```text
services.xxx()
```

---

# 23. ServiceRegistry

AppBridge 不直接把业务服务作为 Schema API。

```ts
interface ServiceRegistry {
  get(
    id: string
  ): ServiceFunction | undefined
}
```

关系：

```text
ActionRegistry
      ↓
ServiceRegistry
      ↓
Host Service
```

---

# 24. AppBridge

AppBridge 是 AUI Runtime 与 Host Application 的唯一正式业务能力边界。

```ts
interface AppBridge {
  services?: ServiceRegistry

  router?: {
    push(path: string): void
    replace(path: string): void
    back(): void
  }

  emit?: (
    event: string,
    payload?: unknown
  ) => void

  notify?: {
    success(message: string): void
    error(message: string): void
    info(message: string): void
    warning?(message: string): void
  }

  state?: ExternalStateBridge

  abortSignal?: AbortSignal
}
```

---

# 25. AppBridge 初始化

Host Application：

```ts
const app = createAUI({
  schema,
  bridge: {
    services,
    router,
    notify
  }
})
```

所有字段可选。

缺失能力使用 Noop Implementation。

---

# 26. AppBridge 与 Vue provide/inject

Vue：

```text
provide/inject
```

只是内部实现机制。

不属于 AUI Protocol。

未来 React / Flutter 可以使用不同的 Runtime 注入机制。

---

# 27. Component Contract

每个官方 Component 必须有：

```text
component.ts
component.schema.ts
component.tokens.ts
component.test.ts
```

Contract：

```ts
interface ComponentContract<TProps = unknown> {
  name: string

  version: string

  props: ZodType<TProps>

  events: ComponentEventDefinition[]

  slots: ComponentSlotDefinition[]

  exposes?: ComponentExposeDefinition[]

  tokens: ComponentTokenDefinition

  capabilities: UICapability[]

  accessibility: UIAccessibility

  ai: AIComponentMetadata
}
```

---

# 28. Zod Contract

Zod 是 Component Schema 的 Source of Truth。

例如：

```ts
const ButtonPropsSchema = z.object({
  type: z
    .enum([
      "primary",
      "secondary",
      "danger"
    ])
    .default("primary"),

  size: z
    .enum([
      "small",
      "medium",
      "large"
    ])
    .default("medium"),

  disabled: z
    .boolean()
    .default(false),

  loading: z
    .boolean()
    .default(false),

  text: z
    .string()
    .optional()
})

type ButtonProps =
  z.infer<typeof ButtonPropsSchema>
```

禁止同时维护一套与 Zod 不一致的 Props Type。

---

# 29. Component Props

Props 必须：

- 有明确类型
- 可被 Zod 验证
- 有默认值时必须定义默认值
- AI 可识别
- 可 Normalize

---

# 30. Component Events

例如 Button：

```text
click
```

Input：

```text
input
change
focus
blur
```

Form：

```text
submit
validate
```

Event 必须有 Contract。

---

# 31. Component Slots

Schema 层定义：

```ts
interface ComponentSlotDefinition {
  name: string
  required: boolean
  accepts: string[]
}
```

例如：

```text
Card
 ├── header
 ├── default
 └── footer
```

Slot Protocol 不直接暴露 Vue Slot API。

Renderer 负责映射。

---

# 32. Component Exposes

Component 可以声明对 Runtime 暴露的能力。

例如：

```text
Form.validate()
Form.reset()
```

但必须经过 Contract。

禁止 AI 或 Schema 直接访问：

```text
Vue Component Instance
DOM
ref
```

---

# 33. AI Patch Boundary

Component 必须声明：

```ts
ai: {
  patchable: [],
  readonly: []
}
```

允许 AI 修改：

```text
Schema Props
Bindings
Actions
Layout
Tokens
```

禁止：

```text
Runtime Internal State
Component Instance
DOM Ref
AppBridge
Service Implementation
Router Instance
```

---

# 34. A11y Contract

Component Contract 必须声明：

```ts
accessibility: {
  role: string

  keyboard?: string[]

  aria?: Record<string, boolean>
}
```

Schema Instance 可以提供：

```json
{
  "a11y": {
    "ariaLabel": "提交订单"
  }
}
```

关系：

```text
Component Contract
       ↓
支持哪些 A11y 能力

Schema
       ↓
具体语义

Renderer
       ↓
平台实现
```

---

# 35. Token 架构

Token 分为三个层次：

```text
Primitive Token
      ↓
Semantic Token
      ↓
Component Token
```

例如：

```text
blue500
 ↓
color.primary
 ↓
button.primary.background
```

---

# 36. Theme / Style / Density

Theme / Style / Density 不是简单的 Token 层，而是三个独立配置维度。

---

## Theme

负责：

- Color
- Surface
- Text
- Border
- Status

例如：

```text
Light
Dark
```

---

## Style

负责：

- Radius
- Shadow
- Border treatment
- Elevation
- Visual personality

例如：

```text
Modern
Glass
Minimal
```

---

## Density

负责：

- Height
- Padding
- Spacing
- Control Size
- Font Size

例如：

```text
Compact
Comfortable
```

---

# 37. Token Resolver

整体模型：

```text
                  Theme
                    ↓
Primitive → Semantic → Component Token
                    ↑
                  Style
                    ↑
                 Density
                    ↓
                 Variant
                    ↓
          Instance Override
```

最终实例覆盖优先级：

```text
低
Primitive
Semantic
Theme
Style
Density
Component Token
Variant
Instance Override
高
```

高层只能覆盖明确声明允许覆盖的 Token。

---

# 38. Theme / Style / Density 运行时切换

### Theme

```text
Theme Change
 ↓
保留 Style
 ↓
保留 Density
 ↓
重新解析 Token
```

### Style

```text
Style Change
 ↓
保留 Theme
 ↓
保留 Density
 ↓
重新计算 Component Token
```

### Density

```text
Density Change
 ↓
保留 Theme
 ↓
保留 Style
 ↓
只重新计算尺寸类 Token
```

三个维度不得隐式修改其他维度。

---

# 39. Renderer Contract

Phase 1 定义最小 Renderer Contract：

```ts
interface RendererAdapter {
  mount(
    node: UINode,
    context: RenderContext
  ): RendererInstance

  update(
    instance: RendererInstance,
    node: UINode,
    context: RenderContext
  ): void

  unmount(
    instance: RendererInstance
  ): void
}
```

Phase 1：

```text
VueRenderer
```

不实现 Universal Renderer。

---

# 40. Vue Web Renderer

目录：

```text
packages/vue-web
```

职责：

- Schema Node → Vue Component
- Props 映射
- Event 映射
- Slot 映射
- Token 映射
- A11y 映射

---

# 41. Uni Renderer

Phase 2。

目录：

```text
packages/uni
```

它运行在：

```text
uni-app
```

内部。

AUI 不重复实现：

- H5 Runtime
- 微信小程序 Runtime
- App Runtime

---

# 42. Runtime Lifecycle

完整生命周期：

```text
create
 ↓
validate
 ↓
normalize
 ↓
mount
 ↓
update
 ↓
patch
 ↓
update
 ↓
unmount
 ↓
dispose
```

必须确保：

```text
effect
watch
computed
event listener
subscription
```

在 dispose 后全部清理。

---

# 43. Error Model

```ts
interface AUIError {
  code: string

  message: string

  path?: string

  source:
    | "schema"
    | "runtime"
    | "renderer"
    | "component"
    | "binding"
    | "action"
    | "bridge"

  severity:
    | "info"
    | "warning"
    | "error"
    | "fatal"

  recoverable: boolean

  hint?: string

  cause?: unknown
}
```

---

# 44. JSON Patch

Phase 1 AI Patch 使用：

```text
RFC 6902
```

支持：

```text
add
remove
replace
move
copy
test
```

---

# 45. Patch Transaction

Patch 必须原子执行。

正确流程：

```text
Original Schema
      ↓
Clone
      ↓
Apply Patch
      ↓
Validate
      ↓
Normalize
      ↓
Static Check
      ↓
Commit
```

失败：

```text
Rollback
```

不得出现：

```text
Patch op1 成功
Patch op2 成功
Patch op3 失败
Schema 半修改
```

---

# 46. Patch Engine

```ts
interface PatchEngine {
  preview(
    schema: UISchema,
    patch: JSONPatch[]
  ): PatchResult

  commit(
    schema: UISchema,
    patch: JSONPatch[]
  ): PatchResult
}
```

Phase 1 至少支持：

```text
preview
atomic commit
```

---

# 47. Compatibility

AUI 同时维护：

```text
Protocol Version
Runtime Version
Component Version
```

兼容关系必须在 Runtime 启动时检查：

```text
Schema Version
 ↓
Protocol Compatibility
 ↓
Runtime Compatibility
 ↓
Component Compatibility
 ↓
Mount
```

---

# 48. Version Policy

原则：

```text
Patch
向后兼容

Minor
新增能力，保持兼容

Major
允许 Breaking Change
```

重大 Schema 变化必须提供 Migration。

---

# 49. Runtime Inspect

Phase 1：

```ts
runtime.inspect()
```

接口：

```ts
interface RuntimeInspection {
  schemaVersion: string

  nodes: RuntimeNodeInspection[]

  errors: AUIError[]

  renderStats: RenderStats

  bindings?: BindingInspection[]

  actions?: ActionInspection[]
}
```

---

# 50. Inspection Serializer

Inspection 不允许直接：

```text
JSON.stringify(runtime)
```

必须：

```text
Runtime
 ↓
InspectionSerializer
 ↓
Redaction
 ↓
RuntimeInspection
```

---

# 51. Production Inspect

Development：

```text
Full Inspection
```

Production 默认：

```text
Disabled
```

显式开启后：

```text
nodes
errors
renderStats
```

默认禁止暴露：

```text
binding values
action payload
service response
password
token
authorization
cookie
secret
```

---

# 52. Security Boundary

不可信 Schema：

```text
Untrusted Schema
 ↓
Validation
 ↓
Normalization
 ↓
Capability Check
 ↓
Runtime
```

不得：

```text
AI Schema
 ↓
Direct Runtime
```

---

# 53. Action Permission

未来 Action 可以声明：

```text
allowed
denied
requires-confirmation
```

Phase 1 最低要求：

```text
registered
unregistered
```

Schema 只能调用已注册 Action。

---

# 54. AI Architecture

AI 不属于 Runtime Core。

AI 是 Schema 的：

```text
Generator
Patch Author
Debugger
```

AI 不允许：

```text
直接操作 Runtime
直接访问 DOM
直接访问 AppBridge
直接修改 Vue Instance
```

---

# 55. AI 生成闭环

```text
User Intent
    ↓
AI Generate
    ↓
Schema
    ↓
Validate
    ↓
Normalize
    ↓
Static Check
    ↓
Render
    ↓
Inspect
    ↓
Error
    ↓
AI Patch
    ↓
Validate
```

---

# 56. AI Context

AI 可读取：

```text
Schema
Component Contract
Zod Props
Token Definition
Action Contract
Template Metadata
Error
Runtime Inspection
```

AI 不读取：

```text
Password
Token
Cookie
Service Internal Implementation
Private Business Data
```

---

# 57. AI Component Metadata

Component Contract 应提供：

```ts
interface AIComponentMetadata {
  description?: string

  patchable: string[]

  readonly: string[]

  examples?: unknown[]

  constraints?: string[]
}
```

Zod Schema 是 AI 约束的重要来源。

---

# 58. Template System

Template 是：

> 可复用的 Schema 页面模板。

Phase 1 只提供：

```text
login-basic
dashboard-basic
```

最多：

```text
3 个
```

---

# 59. Template Contract

Template 必须包含：

```text
Schema
Dependencies
Version
Required Components
Theme
Style
Density
AI Context
```

---

# 60. Template Quality Gate

Template 发布前必须通过：

```text
Schema Validation
Component Validation
A11y
Visual Regression
Build
AI Patch Test
```

---

# 61. Generator

AUI Generator 不直接生成大量生产 SFC。

生成：

```text
Schema
Config
Scaffold
```

例如：

```text
aui create
 ↓
Template
 ↓
Theme
 ↓
Style
 ↓
Density
 ↓
aui.config.ts
 ↓
schema/
```

---

# 62. CLI

Phase 1：

```bash
aui create
aui add
aui validate
aui patch
```

---

## aui create

流程：

```text
Project
 ↓
Template
 ↓
Theme
 ↓
Style
 ↓
Density
 ↓
Generate
```

---

## aui add

用于：

```text
Component
Template
Token
```

---

## aui validate

输入：

```text
Schema
```

输出：

```text
Valid
```

或：

```text
Error
Path
Code
Hint
```

---

## aui patch

输入：

```text
Schema
JSON Patch
```

输出：

```text
Preview
```

或：

```text
Committed Schema
```

---

# 63. Telemetry

默认：

```text
NoopReporter
```

Development：

```text
ConsoleReporter
```

用户显式配置：

```text
EndpointReporter
```

浏览器环境：

```text
navigator.sendBeacon()
```

AUI 默认：

> 不向任何第三方服务器发送数据。

---

# 64. DevTools

Phase 1：

```text
runtime.inspect()
```

Phase 2：

```text
Vue DevTools Custom Inspector
```

不开发独立浏览器扩展。

Phase 5：

```text
AUI Studio
```

---

# 65. Type Generation

类型来源：

```text
Zod
 ↓
z.infer
 ↓
TypeScript
```

未来 CLI：

```bash
aui typegen
```

用于生成：

```text
Schema Types
Component Types
Action Types
```

Phase 1 可以先提供源码级 `z.infer`。

---

# 66. Monorepo

采用：

```text
pnpm workspace
Turborepo
Changesets
```

目录：

```text
aui/
├── apps/
│   ├── docs/
│   ├── playground/
│   └── cli/
│
├── packages/
│   ├── protocol/
│   ├── schema/
│   ├── tokens/
│   ├── runtime/
│   ├── vue-web/
│   └── uni/
│
├── templates/
│   ├── login-basic/
│   └── dashboard-basic/
│
├── tests/
│
├── turbo.json
├── pnpm-workspace.yaml
└── .changeset/
```

---

# 67. Package Dependency

核心依赖方向：

```text
              protocol
             /        \
         schema       tokens
            \          /
             \        /
              runtime
                 |
              vue-web
                 |
                apps
```

原则：

```text
protocol
```

不得依赖：

```text
Vue
React
Flutter
Router
Pinia
Business API
```

Renderer 不得反向污染 Protocol。

---

# 68. 官方 Component

Phase 1：

```text
Button
Input
Form
Card
```

每个组件：

```text
component.ts
component.schema.ts
component.tokens.ts
component.test.ts
```

---

# 69. Button

必须支持：

```text
type
size
disabled
loading
text
```

Events：

```text
click
```

A11y：

```text
role=button
keyboard=Enter/Space
aria-disabled
```

---

# 70. Input

必须支持：

```text
value
placeholder
disabled
readonly
type
```

Events：

```text
input
change
focus
blur
```

支持：

```text
$bind
```

---

# 71. Form

必须支持：

```text
model
rules
disabled
```

能力：

```text
validate
reset
submit
```

---

# 72. Card

支持：

```text
header
default
footer
```

主要用于验证：

```text
Slots
Tokens
Nested Nodes
```

---

# 73. Accessibility

Phase 1 至少覆盖：

```text
Role
ARIA
Keyboard
Focus
Disabled
Label
Error Message
```

必须加入自动化测试。

---

# 74. SSR

AUI 不阻塞 Vue SSR。

Phase 1：

> 不实现完整 SSR Runtime。

但 API 设计不能依赖：

```text
window
document
localStorage
```

作为 Runtime Core 的必要条件。

---

# 75. State Boundary

AUI 不实现：

```text
Pinia
Redux
Zustand
Business Store
```

AUI 只负责：

```text
Local UI State
Derived State
External State Bridge
```

---

# 76. 业务边界原则

禁止：

```text
Schema
 ↓
service.user.login()
```

必须：

```text
Schema
 ↓
Action
 ↓
ActionRegistry
 ↓
ServiceRegistry
 ↓
Host
```

这样可以保证：

> AUI Core 不成为业务框架。

---

# 77. Scope Governance

每个新增 Core Feature 必须通过：

```text
1. 是否属于 AUI Core？
2. 是否破坏 Schema First？
3. 是否让 AUI 接管业务逻辑？
4. 是否重复实现 uni-app 已解决的问题？
5. 是否应该属于 Integration？
6. 是否可以被 AI 理解和 Patch？
```

任何一项存在重大疑问：

> 必须增加 Architecture Decision Record。

这些检查不是 ESLint 规则。

---

# 78. Integration 边界

未来第三方 UI：

```text
Element Plus
Ant Design Vue
Naive UI
```

如果需要：

```text
packages/integrations/
```

例如：

```text
integrations/element-plus
integrations/ant-design-vue
```

禁止：

```text
packages/adapters/element-plus
```

污染 Core。

Phase 1 不实现任何第三方 UI Integration。

---

# 79. Testing Strategy

测试分为：

```text
Unit
Contract
Schema
Runtime
Renderer
Visual
Accessibility
E2E
AI
Build
Performance
```

---

# 80. Unit Test

覆盖：

```text
Protocol
Schema
Tokens
Runtime
Binding
Action
Patch
Error
```

建议核心模块：

```text
≥90%
```

---

# 81. Component Test

Button / Input / Form / Card：

```text
≥85%
```

测试：

```text
Props
Events
Slots
A11y
Token
State
Error
```

---

# 82. Schema Test

至少：

```text
Valid Schema
Invalid Schema
Unknown Component
Invalid Props
Invalid Binding
Invalid Action
Version Error
Normalization
```

---

# 83. Runtime Test

至少：

```text
Create
Mount
Update
Unmount
Dispose
Reactive State
Computed
Cleanup
Error
```

---

# 84. Binding Test

至少：

```text
Read
Write
Nested Path
Missing Path
Reactive Update
Cleanup
```

---

# 85. Action Test

至少：

```text
Register
Execute
Payload Validation
Async
Error
Abort
Missing Action
Permission
```

---

# 86. Patch Test

至少：

```text
add
remove
replace
move
copy
test
invalid pointer
invalid schema
rollback
atomic commit
```

---

# 87. Visual Regression

至少验证：

```text
Theme
Style
Density
Button
Input
Form
Card
```

矩阵：

```text
Light × Modern × Comfortable
Light × Modern × Compact
Dark × Modern × Comfortable
Dark × Modern × Compact
```

不要求 Phase 1 穷举所有未来组合。

---

# 88. Accessibility Test

必须验证：

```text
Keyboard
ARIA
Focus
Role
Disabled
Label
Error
```

---

# 89. E2E

至少覆盖：

```text
Create Project
Load Schema
Render
Input
Binding
Submit
Action
Patch
Inspect
```

---

# 90. AI Evaluation

Phase 1 建立最小 Golden Dataset：

```text
Login
Dashboard
Form
Card
Input
Button
```

每个案例包含：

```text
Prompt
Expected Schema
Validation
Render
Patch
```

---

# 91. Performance

Phase 1 不承诺未经验证的 AST / IR 性能收益。

必须建立：

```text
Schema Parse
Validation
Normalization
Runtime Mount
Update
Patch
```

基准测试。

优化必须基于 Benchmark。

---

# 92. Bundle

分别统计：

```text
protocol
schema
runtime
vue-web
```

目标：

> 防止 Runtime Core 因为工具链、CLI、AI 能力而被无关依赖污染。

---

# 93. Phase 0

工程基础：

```text
pnpm
TypeScript strict
Turborepo
ESLint
Prettier
Vitest
Playwright
Changesets
VitePress
GitHub Actions
```

验收：

```text
Install
Build
Typecheck
Lint
Test
Docs
CI
```

全部成功。

---

# 94. Phase 1A：Framework Kernel

核心内容：

```text
Protocol
Schema
Zod
Normalize
Runtime
Vue Reactivity
Lifecycle
Renderer
Tokens
Theme
Style
Density
Button
Input
Form
Card
Binding
Error
A11y
```

这是第一阶段真正的 Core。

---

# 95. Phase 1B：Runtime Tooling

加入：

```text
Action Registry
AppBridge
Patch Engine
Runtime Inspect
CLI
Telemetry
```

---

# 96. Phase 1C：AI Foundation

加入：

```text
AI Metadata
AI Patch
Template Context
Golden Schema
AI Evaluation
```

---

# 97. Phase 2

主要：

```text
Uni Adapter
Vue DevTools
更多 Components
Template Ecosystem
Schema Migration
```

---

# 98. Phase 3

主要：

```text
更多平台能力
Advanced Runtime
Dependency Graph
Normalized IR
Render Planning
```

只有 Benchmark 证明需要时才进入 IR/Compiler。

---

# 99. Phase 4

主要：

```text
AI Screenshot → Schema
AI Visual Repair
AI Layout Generation
Advanced Patch
```

---

# 100. Phase 5

主要：

```text
AUI Studio
Visual Schema Editor
Component Inspector
AI Copilot
```

---

# 101. Phase 6

主要：

```text
Template Marketplace
Component Ecosystem
Community
Enterprise Capabilities
```

---

# 102. Phase 1 禁止事项

Phase 1 禁止：

```text
React
Flutter
完整 Uni Renderer
Studio
Marketplace
AST Compiler
自研 Reactive Engine
Expression Engine
Element Plus Integration
Ant Design Integration
完整 Low-Code Editor
业务 Store
业务 API Framework
```

---

# 103. Definition of Done

一个 Phase 1 Feature 只有同时满足：

```text
Interface
+
Implementation
+
Validation
+
Test
+
Documentation
```

才视为完成。

只有：

```text
“未来支持”
“计划支持”
“设计支持”
```

不计入完成度。

---

# 104. Phase 1 最低验收标准

必须通过：

```text
Typecheck
Lint
Unit
Contract
Schema
Runtime
Component
Renderer
E2E
Visual
Accessibility
Build
Bundle Benchmark
```

---

# 105. Phase 1 最小闭环

必须最终能够运行：

```text
UISchema
   ↓
Zod Validate
   ↓
Normalize
   ↓
Runtime
   ↓
Vue Reactivity
   ↓
Vue Renderer
   ↓
Button/Input/Form/Card
   ↓
User Interaction
   ↓
Binding
   ↓
Action
   ↓
AppBridge
   ↓
Host
```

同时：

```text
Schema
   ↓
JSON Patch
   ↓
Validate
   ↓
Normalize
   ↓
Atomic Commit
   ↓
Runtime Update
```

---

# 106. 最终架构原则

AUI 最核心的边界最终冻结为：

```text
Schema
=
描述 UI

Contract
=
定义 UI 能做什么

Runtime
=
解释 Schema

Renderer
=
把 Runtime 映射到平台

AppBridge
=
连接宿主应用

AI
=
生成 / 修改 / 修复 Schema
```

---

# 107. 最终产品模型

```text
                    ┌─────────────┐
                    │     AI      │
                    └──────┬──────┘
                           │
                    Generate / Patch
                           │
                           ▼
                    ┌─────────────┐
                    │    Schema   │
                    └──────┬──────┘
                           │
                  Validate / Normalize
                           │
                           ▼
                    ┌─────────────┐
                    │   Runtime   │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
       Binding          Action          Component
          │                │             Contract
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Renderer   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
           Vue Web      Vue Uni      Future
                                      React
                                      Flutter

                           │
                           ▼
                     AppBridge
                           │
                           ▼
                     Host App
```

---

# 108. 架构冻结清单

以下内容进入 Architecture Freeze：

```text
[✓] Schema First
[✓] JSON Canonical Schema
[✓] Schema ID + Version
[✓] Zod Contract
[✓] Validate
[✓] Normalize
[✓] Protocol / Runtime / Renderer
[✓] Vue 3 Reactivity
[✓] Local / Derived / External State
[✓] Binding Read / Write
[✓] Event / Action / Service Separation
[✓] Action Registry
[✓] Service Registry
[✓] AppBridge
[✓] Component Contract
[✓] Slots Contract
[✓] A11y Contract
[✓] AI Patch Boundary
[✓] Primitive / Semantic / Component Token
[✓] Theme / Style / Density
[✓] Renderer Contract
[✓] Runtime Lifecycle
[✓] AUI Error Model
[✓] RFC 6902 Patch
[✓] Atomic Patch
[✓] Runtime Inspect
[✓] Inspection Serializer
[✓] Production Allowlist
[✓] Sensitive Data Redaction
[✓] Protocol / Runtime / Component Version
[✓] Monorepo
[✓] Turborepo
[✓] Changesets
[✓] Phase Gate
```

---

# 109. 明确不冻结的内容

以下内容保留未来设计空间：

```text
React Renderer
Flutter Renderer
Universal Reactive Engine
Expression DSL
AST / IR
Compiler
Studio
Marketplace
Advanced AI Agent
Third-party Integrations
Advanced Permission System
Schema Migration Engine
```

---

# 110. 最终判断

AUI Phase 1 的目标不是：

> “把所有未来能力都做出来。”

而是建立一个稳定的：

```text
Schema
+
Contract
+
Runtime
+
Renderer
+
AppBridge
```

核心闭环。

只要这个闭环成立：

```text
Web
Uni
AI
Template
Studio
React
Flutter
Marketplace
```

都可以作为后续能力叠加，而无需推翻 Core。

---

# 111. 下一阶段开发入口

本需求文档完成后，进入：

```text
AUI Development v1.2
```

Development 文档必须严格按照以下顺序：

```text
01. Repository
02. Package Dependency Graph
03. Protocol
04. Schema
05. Zod Contract
06. Token
07. Runtime State
08. Binding
09. Action
10. AppBridge
11. Component Contract
12. Renderer
13. Button
14. Input
15. Form
16. Card
17. Patch Engine
18. Inspect
19. CLI
20. Test
21. CI
22. Phase Gate
```

不得在 Development 阶段重新讨论已经在本需求文档冻结的架构决策。