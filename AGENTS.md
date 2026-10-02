# AGENTS.md

# AUI AI Agent 执行任务标准与编码规范

> **项目**：AUI — AI-Native Multi-End UI Framework  
> **文档版本**：v1.0.0  
> **适用对象**：所有参与 AUI 开发的 AI Agent、Review Agent、Test Agent、Documentation Agent  
> **适用范围**：代码、测试、Schema、Protocol、Runtime、Renderer、Component、CLI、AI Engine、Studio、Template、Documentation  
> **优先级**：本文件属于 AUI Agent 执行最高级别的项目规则之一。

---

# 1. 核心原则

AUI 采用：

```text
AI Agent 主开发
+
Human Architecture Gate
+
Automated CI
+
Review Agent
```

AI Agent 的职责是：

```text
理解任务
 ↓
分析现有代码
 ↓
制定实现方案
 ↓
编码
 ↓
测试
 ↓
修复
 ↓
验证
 ↓
提交
```

Human 的职责是：

```text
架构决策
产品判断
公共 API 冻结
重大技术决策
Milestone Gate
Release
```

AI Agent **不能代替 Human 做架构级最终决策**。

---

# 2. 第一原则：任务优先

AI Agent 永远以：

```text
Task
```

作为执行边界。

不得因为发现“顺手可以优化”而扩大 Scope。

例如：

```text
当前任务：
实现 Button loading

允许：
Button loading
Button loading test
相关类型
相关文档

不允许：
重构整个 Component System
修改 Runtime
重写 Token System
顺便开发新的 Button API
```

如果发现相关问题：

```text
记录问题
 ↓
创建 Follow-up Task
 ↓
当前任务继续
```

除非该问题阻塞当前任务。

---

# 3. 任务优先级

任务优先级：

```text
P0
阻塞核心架构 / Runtime / Release

P1
核心功能

P2
重要优化

P3
增强功能

P4
未来功能
```

AI Agent 必须优先处理：

```text
P0 > P1 > P2 > P3 > P4
```

---

# 4. Task 状态

```text
TODO
 ↓
READY
 ↓
IN_PROGRESS
 ↓
REVIEW
 ↓
PASSED
 ↓
DONE
```

异常状态：

```text
BLOCKED
FAILED
CANCELLED
DEPRECATED
```

---

# 5. 接收任务后的第一步

AI Agent 不得直接开始写代码。

必须首先读取：

```text
1. AGENTS.md
2. ARCHITECTURE.md
3. 当前 Task
4. 相关 Contract
5. 相关 Schema
6. 相关测试
7. 相关 package
```

如果任务涉及：

```text
Protocol
Schema
Runtime
Component Contract
```

必须进一步读取对应 `.ai/architecture/` 和 `.ai/contracts/`。

---

# 6. 任务理解标准

开始编码之前，AI Agent 必须明确：

```text
Task ID
Task Objective
Input
Output
Dependencies
Affected Packages
Affected Files
Public API
Tests
Acceptance Criteria
Forbidden Changes
```

如果其中任何一项不明确：

```text
STOP
```

不要猜测。

---

# 7. AI Agent 执行流程

标准流程：

```text
┌──────────────────────┐
│ 1. Read AGENTS.md    │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 2. Read Task         │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 3. Read Architecture │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 4. Read Contract     │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 5. Inspect Code      │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 6. Implementation    │
│    Plan              │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 7. Code              │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 8. Test              │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 9. TypeCheck         │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 10. Lint             │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 11. Build            │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 12. Self Review      │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 13. Review Agent     │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 14. Human Gate       │
└──────────┬───────────┘
           ↓
          DONE
```

---

# 8. 编码前分析要求

AI Agent 必须先分析：

```text
当前实现是什么？
为什么这样实现？
当前 API 是什么？
有哪些依赖？
有哪些测试？
有哪些兼容性要求？
```

禁止：

```text
看到需求
 ↓
直接重写
```

必须：

```text
Read
 ↓
Understand
 ↓
Plan
 ↓
Implement
```

---

# 9. Implementation Plan 标准

编码前必须形成简短 Implementation Plan。

格式：

```md
## Implementation Plan

### Objective

实现什么。

### Existing

当前系统如何工作。

### Changes

准备修改什么。

### Files

需要修改哪些文件。

### API

是否涉及 Public API。

### Tests

准备增加哪些测试。

### Risks

可能有什么风险。

### Out of Scope

明确哪些内容不做。
```

---

# 10. 修改文件原则

优先：

```text
修改现有正确代码
```

而不是：

```text
删除重写
```

原则：

```text
Minimal Change
```

即：

> 用最小修改完成任务。

---

# 11. 禁止无意义重构

以下情况禁止：

```text
为了格式统一重写整个文件
为了好看重构目录
为了“更优雅”修改公共 API
为了减少代码行数重写核心 Runtime
为了顺便升级依赖而修改架构
```

除非任务明确要求。

---

# 12. TypeScript 标准

AUI 使用：

```text
TypeScript Strict Mode
```

必须：

```ts
strict: true
```

禁止：

```ts
any
```

除非存在明确技术原因并添加注释。

优先：

```ts
unknown
```

然后通过：

```text
type guard
schema validation
narrowing
```

进行类型收窄。

---

# 13. TypeScript 类型原则

优先：

```text
interface
```

用于：

```text
Public Object Contract
```

优先：

```text
type
```

用于：

```text
Union
Tuple
Mapped Type
Conditional Type
Utility Type
```

例如：

```ts
interface ComponentDefinition {
  name: string
  version: string
}
```

---

# 14. Public API 原则

Public API 必须：

```text
明确
稳定
最小
可测试
可扩展
```

禁止：

```text
为了方便内部实现
暴露 Runtime Internal State
```

例如：

```ts
runtime._internalState
```

禁止作为公共 API。

---

# 15. Internal API

内部 API 必须明确：

```text
Internal
Private
Experimental
```

不要让内部实现自然变成 Public API。

---

# 16. Schema First

AUI 是：

```text
Schema First
```

不是：

```text
Vue First
```

因此：

```text
Protocol
Schema
Runtime
Renderer
```

必须保持层级关系。

正确：

```text
Schema
 ↓
Runtime
 ↓
Vue Renderer
```

错误：

```text
Vue Component
 ↓
反向推导整个 Runtime
```

---

# 17. Protocol 禁止依赖 Vue

绝对禁止：

```text
packages/protocol
 ↓
Vue
```

Protocol 必须 Framework Agnostic。

正确：

```text
Protocol
 ↓
Runtime
 ↓
Vue Adapter
```

---

# 18. Runtime 禁止业务化

Runtime 不负责：

```text
登录业务
订单业务
支付业务
CRM
ERP
数据库
业务 Store
权限业务
```

Runtime 只负责：

```text
Schema
State
Binding
Action
Component
Theme
Lifecycle
Error
Inspection
```

---

# 19. Reactive 标准

Phase 1 使用：

```text
@vue/reactivity
```

不得自行重新实现完整 Reactive Engine。

允许封装：

```ts
ReactiveAdapter
```

不允许：

```text
重新发明响应式系统
```

---

# 20. State Boundary

AUI State 分为：

```text
Local Runtime State
External Application State
```

Runtime 负责：

```text
Local State
Computed
Binding
```

Host / AppBridge 负责：

```text
External State
Business Services
Router
Storage
Analytics
```

---

# 21. Schema 不得直接调用业务 Service

禁止：

```json
{
  "action": "userService.createUser"
}
```

应该：

```json
{
  "action": "create-user"
}
```

然后：

```text
Schema
 ↓
Action Registry
 ↓
Host Service
```

---

# 22. Action Registry

所有 Action 必须通过：

```text
ActionRegistry
```

解析。

禁止：

```text
Schema → Function
Schema → Service
Schema → HTTP
```

---

# 23. 禁止动态代码执行

绝对禁止：

```js
eval()
```

以及：

```js
new Function()
```

也禁止通过其他方式绕过这一限制。

Schema 中的表达式必须经过：

```text
Parser
Validator
Sandboxed Evaluation
```

---

# 24. Binding 标准

Binding 只能引用受控 Context：

```text
state
props
computed
context
```

不能直接访问：

```text
window
document
globalThis
process
filesystem
network
```

除非经过明确 Host Capability。

---

# 25. Zod 标准

所有核心 Schema：

```text
Zod = Source of Truth
```

禁止：

```text
Zod Schema
+
另一份手写 TS Interface
```

造成双重定义。

推荐：

```ts
const ButtonSchema = z.object({
  disabled: z.boolean().optional()
})

type ButtonProps = z.infer<typeof ButtonSchema>
```

---

# 26. Schema Validation

任何进入 Runtime 的 Schema 必须：

```text
Validate
 ↓
Normalize
 ↓
Execute
```

禁止：

```text
Raw Schema
 ↓
直接 Render
```

---

# 27. Normalization

Normalizer 必须：

```text
Deterministic
Pure
Idempotent
```

要求：

```text
normalize(normalize(schema))
===
normalize(schema)
```

---

# 28. Error 标准

所有核心错误必须结构化。

标准：

```ts
interface AUIError {
  code: string
  path?: string
  message: string
  hint?: string
  source?: string
  severity: "info" | "warning" | "error" | "fatal"
  cause?: unknown
}
```

禁止只：

```ts
throw new Error("Something went wrong")
```

用于核心 Runtime。

---

# 29. Error Code

错误 Code 必须：

```text
稳定
可搜索
可统计
可用于 AI Repair
```

例如：

```text
SCHEMA_INVALID
COMPONENT_NOT_FOUND
ACTION_NOT_FOUND
BINDING_INVALID
CAPABILITY_UNSUPPORTED
PATCH_INVALID
RUNTIME_DISPOSE_ERROR
```

---

# 30. Component 开发标准

每个官方组件必须至少拥有：

```text
component.ts
component.schema.ts
component.tokens.ts
component.test.ts
```

组件必须同时支持：

```text
Props
Events
Tokens
A11y
Capability
Schema
```

---

# 31. Component Contract

组件必须定义：

```text
name
version
props
events
slots
tokens
accessibility
capabilities
```

禁止组件只写 Vue Props。

---

# 32. Vue Component 标准

Vue 组件负责：

```text
Rendering
Interaction
DOM
Platform Integration
```

不负责：

```text
Schema Validation
Business Logic
AI Logic
Global Business State
```

---

# 33. Token 标准

Token 层级：

```text
Primitive
 ↓
Semantic
 ↓
Component
 ↓
Style Override
 ↓
Schema / Instance Override
```

Theme / Style / Density 是独立维度。

---

# 34. Token 禁止硬编码

组件中禁止大量：

```css
color: #1677ff;
padding: 12px;
border-radius: 8px;
```

应该优先：

```css
var(--aui-color-action-primary)
var(--aui-spacing-md)
var(--aui-radius-md)
```

---

# 35. CSS 标准

优先：

```text
Token
CSS Variable
Component Scope
```

避免：

```text
!important
全局污染
深层级选择器
过度依赖 DOM 结构
```

---

# 36. Naming

文件：

```text
kebab-case
```

例如：

```text
component-schema.ts
runtime-context.ts
action-registry.ts
```

Type：

```text
PascalCase
```

例如：

```text
RuntimeContext
ActionRegistry
ComponentDefinition
```

变量：

```text
camelCase
```

例如：

```ts
runtimeContext
componentRegistry
```

常量：

```text
UPPER_SNAKE_CASE
```

例如：

```ts
DEFAULT_TIMEOUT
```

---

# 37. Boolean Naming

推荐：

```text
isLoading
isDisabled
hasError
canRender
shouldValidate
```

避免：

```text
loadingFlag
disableFlag
```

---

# 38. Function Naming

使用动词：

```text
createRuntime()
resolveBinding()
validateSchema()
normalizeSchema()
registerComponent()
executeAction()
disposeRuntime()
```

避免：

```text
runtime()
schema()
component()
```

---

# 39. 异步代码

统一：

```text
async / await
```

避免：

```text
Promise.then().then().then()
```

除非确有必要。

必须正确处理：

```text
error
abort
timeout
dispose
```

---

# 40. Abort 标准

异步 Runtime 操作必须考虑：

```text
AbortSignal
```

例如：

```ts
async function execute(
  context: ActionContext,
  signal: AbortSignal
) {}
```

组件卸载时不得继续执行无效任务。

---

# 41. Dispose 标准

所有创建资源的对象必须拥有明确生命周期。

包括：

```text
effect
subscription
event listener
timer
observer
request
worker
```

必须可以：

```text
dispose
```

---

# 42. Event Listener

禁止：

```ts
window.addEventListener(...)
```

而不保存 cleanup。

必须：

```ts
const handler = () => {}

window.addEventListener("resize", handler)

return () => {
  window.removeEventListener("resize", handler)
}
```

---

# 43. Test First

AI Agent 修改核心逻辑时：

```text
先理解已有测试
 ↓
补充测试
 ↓
实现
```

禁止：

```text
修改代码
 ↓
最后才想测试
```

---

# 44. 测试命名

测试名称必须描述行为。

推荐：

```text
should resolve binding from state
should reject invalid schema
should dispose runtime effects
should execute registered action
```

不要：

```text
test1
test2
runtimeTest
```

---

# 45. 测试结构

推荐：

```text
describe("Runtime", () => {
  describe("dispose", () => {
    it("should stop reactive effects", () => {})
  })
})
```

---

# 46. 测试原则

测试必须验证：

```text
Behavior
```

而不是：

```text
Implementation Detail
```

例如：

```text
正确：
点击 Button 后 Action 被执行

不推荐：
检查某个内部变量等于 true
```

---

# 47. Bug 修复标准

任何 Bug 修复必须：

```text
发现 Bug
 ↓
增加 Regression Test
 ↓
修复
 ↓
运行 Test
```

禁止：

```text
只修代码
不增加 Regression Test
```

---

# 48. AI 不得删除失败测试

如果测试失败：

```text
分析失败原因
 ↓
修复代码
```

不得：

```text
删除 Test
降低 Assertion
skip
only
关闭测试
```

除非任务明确要求修改错误测试，并经过 Review。

---

# 49. Snapshot

Snapshot 只能用于：

```text
结构稳定
输出明确
确实适合 Snapshot
```

禁止使用 Snapshot 掩盖行为测试缺失。

---

# 50. E2E

E2E 验证真实用户路径。

例如：

```text
打开页面
 ↓
输入数据
 ↓
触发 Action
 ↓
State 更新
 ↓
UI 更新
```

---

# 51. Visual Regression

Visual Test 用于：

```text
Component
Template
Studio
```

禁止为了通过 Visual Test：

```text
修改基准图
```

必须先确认：

```text
Expected Change
```

---

# 52. Accessibility

官方组件必须考虑：

```text
Role
ARIA
Keyboard
Focus
Label
Disabled
Error
```

A11y 不是发布后再补。

---

# 53. Git Commit

Commit 必须小而明确。

格式：

```text
feat(scope): description
fix(scope): description
refactor(scope): description
test(scope): description
docs(scope): description
perf(scope): description
build(scope): description
chore(scope): description
```

例如：

```text
feat(runtime): add schema normalization
fix(binding): prevent invalid state path
test(button): add loading behavior tests
```

---

# 54. Commit 原则

禁止：

```text
feat: update everything
fix: many changes
test: changes
```

Commit 必须可以回答：

```text
改了什么？
为什么改？
属于哪个模块？
```

---

# 55. 一个 Task 一个逻辑 Commit

推荐：

```text
Task
 ↓
Implementation
 ↓
Tests
 ↓
Commit
```

如果任务较大：

```text
Task
 ↓
Logical Subtask
 ↓
Commit
```

---

# 56. Dependency 原则

新增依赖之前必须判断：

```text
是否真的需要？
是否可以使用已有依赖？
包体积？
维护状态？
License？
Tree-shaking？
Browser / Uni 兼容？
```

AI 不得因为实现方便随意添加依赖。

---

# 57. Package Dependency

依赖方向必须遵守：

```text
protocol
  ↑
schema
  ↑
runtime
  ↑
renderer
```

实际依赖关系必须避免循环。

核心原则：

```text
Protocol 不依赖 Vue
Protocol 不依赖 Renderer
Runtime 不依赖具体 Component
```

---

# 58. Package Boundary

例如：

```text
packages/protocol
```

不能 import：

```text
packages/vue-web
```

例如：

```text
packages/runtime
```

不能直接依赖：

```text
apps/studio
```

Application 永远依赖 Package，而不是反过来。

---

# 59. Web / Uni Boundary

Web：

```text
packages/vue-web
```

Uni：

```text
packages/uni
```

禁止：

```text
Web Renderer
复制成
Uni Renderer
```

两者共享：

```text
Protocol
Runtime
Contract
Token
```

平台差异通过：

```text
Capability
Fallback
```

解决。

---

# 60. AppBridge 原则

AppBridge 是：

```text
Host Capability Boundary
```

不是：

```text
Business Framework
```

AppBridge 可以提供：

```text
Router
Storage
Notify
Analytics
Events
Abort
```

但不应该让 Schema 直接调用任意 Service。

---

# 61. Studio 原则

Studio 必须：

```text
Schema First
```

Studio 的 UI 操作必须最终转换成：

```text
JSON Patch
```

禁止 Studio 直接修改 Runtime 内部对象。

正确：

```text
User
 ↓
Studio
 ↓
JSON Patch
 ↓
Schema
 ↓
Validate
 ↓
Runtime
```

---

# 62. AI 修改 Studio Schema

AI 不能：

```text
直接修改 Canvas State
```

必须：

```text
AI
 ↓
Generate Patch
 ↓
Validate
 ↓
Preview
 ↓
Apply
```

---

# 63. JSON Patch 原则

Patch 必须：

```text
Atomic
Validated
Traceable
Reversible
```

执行前：

```text
Validate Patch
```

执行后：

```text
Validate Result Schema
```

---

# 64. AI Repair 原则

AI Repair 输入：

```text
Schema
+
Validation Error
+
Runtime Error
+
Inspection
```

输出：

```text
JSON Patch
```

而不是：

```text
重新生成整个项目
```

除非明确任务允许。

---

# 65. Runtime Inspect

开发环境：

```text
Full Inspection
```

生产环境：

```text
Default Off
```

生产启用必须：

```text
Allowlist
Redaction
Permission
```

---

# 66. 敏感信息

以下内容不得出现在：

```text
Logs
Inspection
Telemetry
AI Context
Error Message
Snapshot
```

包括：

```text
password
token
authorization
cookie
secret
credential
private key
```

---

# 67. Logging

禁止：

```ts
console.log(user)
console.log(token)
console.log(request)
```

生产代码必须：

```text
Reporter
```

统一处理。

---

# 68. Reporter

默认：

```text
NoopReporter
```

开发环境可以：

```text
ConsoleReporter
```

第三方 Telemetry 必须：

```text
Explicit Opt-in
```

不得默认上传用户数据。

---

# 69. Documentation

公共 API 必须有：

```text
Description
Example
Parameters
Return
Error
```

复杂逻辑必须说明：

```text
Why
```

而不是只说明：

```text
What
```

---

# 70. 注释原则

注释解释：

```text
Why
Constraint
Trade-off
```

不要解释明显代码：

```ts
// increment count
count++
```

没有价值。

---

# 71. TODO

允许：

```ts
// TODO(AUI-123): ...
```

必须包含：

```text
Task ID
```

禁止：

```ts
// TODO
```

这种没有归属的 TODO。

---

# 72. FIXME

必须：

```ts
// FIXME(AUI-123): ...
```

并且对应 Issue / Task。

---

# 73. Architecture Decision

重大架构决定必须记录到：

```text
.ai/decisions/
```

格式：

```text
Decision
Context
Options
Decision
Reason
Trade-offs
Consequences
```

AI Agent 不得通过代码偷偷改变架构。

---

# 74. Architecture Change

涉及以下内容时必须停止：

```text
Public API
Protocol
Schema Format
Runtime Architecture
Package Boundary
State Boundary
Action Model
Token Model
Renderer Architecture
```

执行：

```text
STOP
 ↓
Architecture Proposal
 ↓
Human Approval
 ↓
Implementation
```

---

# 75. AI Context 标准

AI Context 必须优先使用：

```text
Current Contract
Current Architecture
Current Code
Current Tests
Current Golden Examples
```

而不是：

```text
AI 自己记忆的旧架构
```

---

# 76. Golden Schema

Golden Schema 是：

```text
Canonical Example
```

AI Agent 修改 Schema / Runtime / Component Contract 后：

```text
必须运行 Golden Regression
```

---

# 77. Regression

Regression 至少覆盖：

```text
Existing Schema
Existing Component
Existing Template
Existing Action
Existing Binding
```

不能因为新增功能而破坏旧功能。

---

# 78. API Compatibility

修改 Public API 时必须判断：

```text
Breaking?
Additive?
Deprecated?
```

遵守：

```text
Patch
Bug Fix

Minor
Additive

Major
Breaking
```

---

# 79. API Stability

每个 Public API 必须属于：

```text
Experimental
Beta
Stable
Deprecated
```

AI 不得擅自把：

```text
Experimental
```

变成：

```text
Stable
```

---

# 80. Performance

AI Agent 修改核心 Runtime 后，如果涉及：

```text
Render
Reactive
Binding
Schema Parse
Normalization
```

必须考虑性能影响。

必要时增加 Benchmark。

---

# 81. Bundle Size

Renderer / Runtime 修改需要关注：

```text
Bundle Size
Tree Shaking
Dependency Size
Duplicate Dependencies
```

禁止为了一个小功能引入大型依赖。

---

# 82. Memory Leak

任何涉及：

```text
effect
event
observer
timer
subscription
async task
```

的修改必须考虑：

```text
cleanup
dispose
abort
```

---

# 83. Error Recovery

Runtime 不应因为一个局部节点错误导致整个应用无意义崩溃。

需要根据错误类型判断：

```text
Node-level Error
Component-level Error
Schema-level Error
Runtime-level Error
Fatal Error
```

---

# 84. Capability / Fallback

平台不支持某能力时：

```text
Detect
 ↓
Fallback
```

而不是：

```text
直接 Crash
```

---

# 85. Fallback 标准

Fallback 必须：

```text
Explicit
Predictable
Testable
```

禁止：

```text
silent behavior change
```

---

# 86. AI Agent 自修复机制

测试失败时：

```text
Read Error
 ↓
Locate Source
 ↓
Analyze Cause
 ↓
Patch
 ↓
Run Test
```

最多允许自动尝试：

```text
3 次
```

如果连续失败：

```text
BLOCKED
```

并输出：

```text
Failure
Hypothesis
Attempts
Remaining Risk
```

---

# 87. 不得无限循环修复

禁止：

```text
test failed
 ↓
modify
 ↓
test failed
 ↓
modify
 ↓
...
```

超过阈值必须：

```text
STOP
```

---

# 88. Review Agent

Review Agent 重点检查：

```text
Scope
Architecture
API
Type
Tests
Security
Performance
Dependency
Code Quality
```

Review Agent 不应该只检查：

```text
代码能不能运行
```

---

# 89. Review Checklist

```text
[ ] 是否符合 Task？
[ ] 是否超出 Scope？
[ ] 是否违反 Architecture？
[ ] 是否修改 Public API？
[ ] 是否有测试？
[ ] 是否有 Regression Test？
[ ] 是否存在 any？
[ ] 是否存在 eval/new Function？
[ ] 是否存在 Memory Leak？
[ ] 是否有敏感信息？
[ ] 是否增加不必要依赖？
[ ] 是否影响 Bundle？
[ ] 是否影响 Uni？
[ ] 是否影响 Schema？
```

---

# 90. Human Gate

以下任务必须 Human Review：

```text
Protocol
Schema Version
Runtime Architecture
Public API
Package Boundary
Action Model
State Boundary
Token Architecture
Renderer Architecture
AI Repair Architecture
Studio Architecture
Release
```

---

# 91. 普通任务不需要人工逐行审核

AI 可以自动完成：

```text
Bug Fix
Unit Test
Docs
Refactor
Component Implementation
CLI
Test Data
```

前提：

```text
Contract 已冻结
Architecture 不变
CI 全通过
```

---

# 92. Merge Gate

代码进入主分支前：

```text
TypeCheck
+
Lint
+
Unit
+
Contract
+
Build
```

必须全部通过。

核心模块额外：

```text
Runtime
E2E
A11y
Visual
Performance
```

---

# 93. Stop-the-Line

出现以下任何情况：

```text
Protocol 依赖 Vue
eval/new Function
Schema 直接调用 Service
Public API 未审批
Patch 非原子
Dispose 泄漏
Component 缺 Contract
Production Inspect 泄露数据
AI 修改 Runtime Internal State
删除失败测试
关闭 CI
绕过 TypeScript
```

必须：

```text
STOP THE LINE
```

---

# 94. Agent 输出标准

完成任务后必须输出：

```md
# Task Completion Report

## Task

AUI-XXXX-XXX

## Summary

完成了什么。

## Files Changed

- xxx
- xxx

## API Changes

None / ...

## Tests

- Unit: PASS
- Contract: PASS
- E2E: PASS

## Validation

- TypeCheck: PASS
- Lint: PASS
- Build: PASS

## Risks

None / ...

## Follow-up

None / AUI-XXXX-XXX

## Commit

feat(runtime): ...
```

---

# 95. Agent 不得声称未执行的验证为通过

禁止：

```text
"应该可以通过"
"理论上没问题"
"测试应该没问题"
```

如果没有实际执行：

```text
NOT RUN
```

如果失败：

```text
FAILED
```

只有实际执行成功：

```text
PASS
```

---

# 96. 完成标准

一个任务只有同时满足：

```text
Code
+
Test
+
TypeCheck
+
Lint
+
Build
+
Review
+
Acceptance
```

才可以标记：

```text
DONE
```

---

# 97. AUI Agent 核心规则

最终浓缩为：

```text
1. Read before Code
2. Contract before Implementation
3. Task before Refactor
4. Schema before Renderer
5. Validate before Execute
6. Patch before Rewrite
7. Test before Done
8. Dispose before Unmount
9. Registry before Service
10. Capability before Platform Assumption
11. Human Gate before Architecture Change
12. CI before Merge
```

---

# 98. 最终 Agent 工作模型

AUI AI Agent 不应该只是：

```text
Code Generator
```

而应该是：

```text
                ┌──────────────────┐
                │   Architecture   │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │      Task        │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │      Context     │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │      Plan        │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │      Code        │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │      Test        │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │   Self Repair    │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │     Review       │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │   Human Gate     │
                └────────┬─────────┘
                         ↓
                      MERGE
```

---

# 99. AUI 最重要原则

> **AI 可以决定"怎么实现一个已经确定的任务"，但不能擅自决定"项目应该变成什么"。**

因此：

```text
产品方向       Human
架构方向       Human
公共 Contract  Human
技术方案       AI + Human Gate
具体编码       AI
测试           AI
Debug          AI
重构           AI
文档           AI
CI             自动化
Release        Human
```

这套边界是 AUI AI-Native 开发模式的基础。

---

# 100. Rule Priority

当规则冲突时，优先级：

```text
1. Security
2. Architecture
3. Protocol / Contract
4. Task Scope
5. Testing
6. Code Style
7. Optimization
8. Convenience
```

任何：

```text
方便
更快
代码更少
实现更简单
```

都不能成为违反：

```text
Architecture
Security
Contract
Testing
```

的理由。

---

# 101. 禁止随意回退 git 代码与本地修改

AI Agent 严禁：

```text
git reset --hard
git checkout -- <file>
git clean -fd
git stash drop
rm -rf <用户已存在的本地文件 / 目录>
```

未经 Human 明确授权，不得丢弃用户已存在的本地工作树内容。

正确流程：

```text
发现冲突 / 需要重置
  ↓
先备份（git add -A + git stash create / git commit --no-verify 临时保存）
  ↓
在回复中明确告知「即将回退 X，原因 Y，影响 Z」
  ↓
等用户授权
  ↓
执行回退 / 删除
```

不允许：

```text
"为了一次性跑通，我帮你 git reset 了"
"修起来太绕，我直接 checkout 了旧版本"
"无关紧要的本地文件我清理掉了"
```

这些都属于「擅自破坏用户工作树」。AGENTS.md §93 Stop-the-Line 的延伸。

---

# 102. 每次任务执行完必须做一次代码评审并修复

每个 AI Agent Task 完成后必须：

```text
1. Read 自身 Changed Files
2. 跑 §89 Review Checklist
3. 跑 pnpm typecheck / pnpm lint / pnpm test / pnpm build
4. 修复发现的问题
5. 在 Task Completion Report（§94）里输出 review 结论
```

Review 必须覆盖：

```text
[ ] 是否符合 Task？
[ ] 是否超出 Scope？
[ ] 是否违反 Architecture？
[ ] 是否修改 Public API？
[ ] 是否有测试？
[ ] 是否有 Regression Test？
[ ] 是否存在 any / unknown 未收窄？
[ ] 是否存在 eval / new Function？
[ ] 是否存在 Memory Leak？
[ ] 是否有敏感信息？
[ ] 是否增加不必要依赖？
[ ] 是否影响 Bundle？
[ ] 是否影响 Uni？
[ ] 是否影响 Schema？
[ ] 是否引入未使用 import / export / 变量？
```

不允许：

```text
"代码能跑就行了"
"lint warning 不影响功能"
"测试 skip 一下"
"我先这样提交，TODO human 后面再看"
```

评审不过关的任务不能 DONE。

---

# 103. Bug 修复后必须记录，方便下一次避免

每个 Bug 修复必须留下三份记录：

```text
1. Regression Test
   写一个能稳定复现 Bug 的测试，先验证 fail，再修复代码，验证 pass

2. Root Cause Note
   记录根因在：
   .ai/decisions/<NNNN>-*.md  (架构 / 协议类)
   .ai/tasks/follow-up/<task-id>.md  (实现细节)

3. Memory Entry
   跨项目适用的根因：
   → User Memory /Users/mac/.minimax/memory/user.md
   → Agent Memory /Users/mac/.minimax/agents/<name>/memory/MEMORY.md
   只在本项目适用：
   → Project Memory AGENTS.md 或引用 topic file
```

Memory 三层判定流程：

```text
换用户结论会变？ → User Memory
换项目结论仍成立？ → Agent Memory
只在本项目成立？   → Project Memory
```

格式（参考 MEMORY.md 现有条目）：

```text
### <一句话根因> (<日期>)
Type: gotcha | rule | profile | project
**坑**: <现场现象>
**根因**: <技术解释>
**教训**: <通用 vs 项目特定>
**反模式**: <要避开的写法>
**适用范围**: <跨项目 / 同类型 / 本项目>
**对应代码**: path/to/file.ts(line N)
```

不允许：

```text
只改代码不写 Regression Test
只在脑子里记下「下次注意」
不写 memory，跨任务丢根因
```

---

# 104. 避免重复造轮子

新增代码 / 新增依赖前必须先检索：

```text
1. workspace 内是否已有同类型工具？
   pnpm ls <pkg-name>
   grep -r "functionName" packages/

2. 已装 dependency 是否已有对应 API？
   pnpm ls --depth 0

3. 标准库 / 已知模式是否有现成实现？
   e.g. ts-pattern / lodash / @vue/reactivity / zod
```

禁止：

```text
明明 @vue/reactivity 已经装好，自己写 Proxy 响应式
明明 zod 已经装好，自己手写类型校验
明明 ts-pattern 已经装好，自己写 if-else 链匹配
明明 changeset 已经装好，自己写 changelog 脚本
```

例外（必须有显式理由并记录到 ADR）：

```text
1. 现有实现性能 / 包体积 / 平台兼容性不达标
2. 现有实现违反项目硬性约束（AGENTS.md / PRD）
3. 现有 API 与新需求冲突，且无法扩展
```

理由 + Trade-off 必须写到 `.ai/decisions/` 留档。

---

# 105. 代码质量高标准

AUI 代码不允许出现「凑合」字样。

CI 必须通过的硬性门：

```text
pnpm typecheck     → 0 error
pnpm lint          → 0 warning（warning 也算不过）
pnpm test          → 100% pass（不允许 skip / only）
pnpm build         → 0 error
```

PR 合并前：

```text
[ ] Self Review（§89 checklist）
[ ] Review Agent（§88）独立验证
[ ] Human Gate（§90 涉及架构 / Public API 时）
[ ] 没有 unhandled TODO / FIXME
[ ] 没有废弃的代码路径
```

工程标准：

```text
[ ] 一个文件 ≤ 400 行（除非有明确理由）
[ ] 一个函数 > 60 行要拆
[ ] 嵌套 ≤ 3 层
[ ] 圈复杂度 ≤ 10
```

---

# 106. 不要写废代码和啰嗦代码

以下情况禁止出现：

```text
未被任何调用方引用的代码（包括 type / interface / function / class）
注释掉的旧代码（git history 是历史，注释不是）
仅为了对齐格式而存在的空行 / 注释
描述代码「做了什么」而不解释「为什么」的注释
冗余的类型断言（TS 已经能 infer）
防御性 null check（类型已经保证非 null）
同义词变量（userName / username 重复）
早期 return 之后还能走到的不可能分支
```

提倡：

```text
代码即文档，函数命名自解释
短函数（≤ 30 行最佳，≤ 60 行 OK）
3 次重复再抽象（Rule of Three）
优先删除，再考虑重构
```

遇到「可能以后会用」：

```text
git 历史保留即可
不写到当前 working tree
不预留死代码 / TODO 占位
```

---

# 107. 不要出现未引用的变量 / 方法

TypeScript 严格模式必须开启：

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noUnusedPrivateClassMembers": true  // TS 5.x
  }
}
```

ESLint 必须开启：

```js
{
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  }
}
```

以下情况必须立即删除：

```text
未使用的局部变量 / 常量
未引用的函数（除非 exported 且有合理外部使用预期）
未使用的私有方法 / 字段
未使用的类型 / interface / type alias
未使用的 enum 成员
参数声明但不使用（用 _ 前缀表明「有意忽略」）
```

`_` 前缀用于表示有意忽略；普通命名遗漏 → 直接删，不是加下划线。

---

# 108. 不要出现未使用的 import / export

ESLint 必须开启：

```js
{
  rules: {
    'unused-imports/no-unused-imports': 'error',     // eslint-plugin-unused-imports
    'unused-imports/no-unused-vars': 'off',          // 交给 TS noUnusedLocals
  }
}
```

以下情况必须立即清理：

```text
未使用的 import（import X from 'Y' 但 X 没用上）
未使用的 export（export const X 但外部没 import）
type-only import 没用 import type（影响运行时 bundle）
namespace import 但只用了其中一个 named export
```

例外（必须有 ADR 留档）：

```text
1. package 入口文件 (src/index.ts) 的 barrel re-export
   用于外部 `@aui/protocol` 一次性导入
2. 类型 / 常量作为公共 API 暴露（标记为 @public in jsdoc）
3. 测试 fixture 的 setup 文件中注册全局
```

每次任务完成时跑：

```bash
pnpm turbo run lint
pnpm turbo run typecheck
```

0 warning 即通过；不允许 skip / disable。

---

# 109. 补充规则生效范围

#101 ~ #108 是对 #1 ~ #100 的代码质量与流程纪律强化：

| 规则 | 对应原编号 |
| --- | --- |
| #101 禁止回退 | §93 Stop-the-Line 延伸 |
| #102 任务后评审 | §88 Review Agent + §94 Agent 输出标准 |
| #103 Bug 记录 | §47 Bug 修复标准 + §75 AI Context 标准 |
| #104 避免重复造轮子 | §56 Dependency 原则 |
| #105 代码质量高标准 | §92 Merge Gate |
| #106 不写废代码 | §11 禁止无意义重构 + §69 Documentation |
| #107 无未用变量 / 方法 | §46 测试原则（Behavior > Implementation Detail） |
| #108 无未用 import / export | §12 TypeScript 标准 + §13 TypeScript 类型原则 |

---

# END

AUI Agent 执行标准 v1.0.1（补充规则 #101-#109）