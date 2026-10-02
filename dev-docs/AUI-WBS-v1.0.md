# AUI WBS 完整开发任务表

> **项目名称**：AUI — AI-Native Multi-End UI Framework  
> **文档版本**：v1.0  
> **文档状态**：Execution Ready  
> **开发模式**：AI Agent 主开发 + Human Architecture Gate + CI 自动验证  
> **目标版本**：v0.1.0  
> **核心目标**：完成 AUI Core + Vue Web + AUI Uni + Template System + AI Engine + Studio MVP + Ecosystem Foundation

---

# 1. 文档目的

本 WBS 用于指导 AUI 从架构设计进入实际工程开发。

与传统 WBS 不同，本项目采用：

```text
Human
负责：
架构决策
产品判断
技术冻结
接口批准
Milestone Gate
最终验收
Release

AI Agent
负责：
编码
测试
重构
Bug 修复
文档
代码分析
测试生成
静态检查
性能分析
问题修复

CI
负责：
自动验证
TypeCheck
Lint
Unit Test
Contract Test
Build
E2E
Visual
A11y
Performance
```

核心执行原则：

```text
Architecture
      ↓
Contract
      ↓
Task
      ↓
AI Implementation
      ↓
Automated Test
      ↓
Review Agent
      ↓
Human Gate
      ↓
Merge
```

---

# 2. 项目范围

## 2.1 v0.1.0 必须完成

```text
AUI Core
├── Protocol
├── Schema
├── Validation
├── Normalization
├── Runtime
├── Reactive
├── Binding
├── Action
├── Registry
├── Token
├── Theme
├── Style
├── Density
└── Error System

Vue Web
├── Renderer
├── Component Registry
├── Button
├── Input
├── Form
└── Card

AUI Uni
├── Uni Package
├── Renderer
├── Capability
├── Fallback
├── Button
├── Input
├── Form
└── Card

Template
├── Manifest
├── Registry
├── Dependency
├── Lock
├── CLI
└── Official Templates

AI Engine
├── AI Context
├── Schema Generation
├── Validation Loop
├── JSON Patch
├── Repair Loop
├── Runtime Inspection
├── Template Context
├── Golden Dataset
├── Evaluation
└── Regression

Studio MVP
├── Canvas
├── Schema Tree
├── Inspector
├── Binding Editor
├── Action Editor
├── History
├── AI
├── Template
├── Theme
└── Preview

Ecosystem Foundation
├── Package Manifest
├── Component Package
├── Theme Package
├── Plugin Foundation
└── Compatibility
```

---

# 3. 不属于 v0.1.0 核心范围

以下内容不得因为 AI 开发效率提高而提前膨胀进入 v0.1.0：

```text
React Renderer
Flutter Renderer
复杂 AST / Compiler
完整 Low-Code 平台
BPM
工作流引擎
企业级权限系统
完整 Marketplace
企业 SaaS
复杂 BI
复杂数据建模
完整 CMS
复杂表单设计器
完整 Figma Parser
完整 Screenshot-to-Code
```

这些进入后续版本。

---

# 4. WBS 编码规则

```text
AUI-{DOMAIN}-{NUMBER}
```

例如：

```text
AUI-FOUNDATION-001
AUI-PROTOCOL-001
AUI-SCHEMA-001
AUI-RUNTIME-001
AUI-WEB-001
AUI-UNI-001
AUI-TEMPLATE-001
AUI-AI-001
AUI-STUDIO-001
AUI-ECOSYSTEM-001
AUI-RELEASE-001
```

任务状态：

```text
TODO
READY
IN_PROGRESS
BLOCKED
REVIEW
PASSED
FAILED
DONE
FROZEN
DEPRECATED
```

---

# 5. AI Agent 任务标准

每一个 WBS Task 必须包含：

```text
Task ID
Task Name
Objective
Context
Dependencies
Input
Output
Files
Interface
Implementation
Tests
Acceptance
Forbidden
Commit
```

AI Agent 不允许只根据任务标题进行开发。

---

# 6. AI Agent 标准执行流程

```text
1. Read Task
        ↓
2. Read Architecture
        ↓
3. Read Contract
        ↓
4. Read Existing Code
        ↓
5. Analyze Dependencies
        ↓
6. Write Implementation Plan
        ↓
7. Implement
        ↓
8. Generate Tests
        ↓
9. Run TypeCheck
        ↓
10. Run Lint
        ↓
11. Run Unit Test
        ↓
12. Run Contract Test
        ↓
13. Run Build
        ↓
14. Fix Failures
        ↓
15. Review Own Changes
        ↓
16. Commit
        ↓
17. Review Agent
        ↓
18. Human Gate
```

---

# 7. AI Agent 禁止行为

AI Agent 严禁：

```text
禁止修改冻结 Protocol
禁止绕过 Schema Validator
禁止 eval
禁止 new Function
禁止执行 Schema 中任意 JS
禁止 Schema 直接调用 Business Service
禁止直接修改 Runtime 内部状态
禁止删除失败测试
禁止降低测试标准
禁止关闭 CI
禁止绕过 TypeScript
禁止修改测试以掩盖 Bug
禁止为了通过测试删除功能
禁止擅自改变公共 API
禁止引入未经批准的大型依赖
禁止扩大任务 Scope
```

如果发现架构问题：

```text
Stop
 ↓
Create Architecture Proposal
 ↓
Human Review
 ↓
Approved
 ↓
Continue
```

---

# 8. 总体 WBS

| Domain | WBS | 主要内容 | 优先级 |
|---|---|---|---|
| Foundation | AUI-FOUNDATION | Monorepo / CI / AI 工程基础 | P0 |
| Protocol | AUI-PROTOCOL | UI Protocol | P0 |
| Schema | AUI-SCHEMA | Zod Schema / Validation | P0 |
| Runtime | AUI-RUNTIME | Runtime / Context / Lifecycle | P0 |
| Reactive | AUI-REACTIVE | Vue Reactivity Adapter | P0 |
| Binding | AUI-BINDING | State / Computed / Event Binding | P0 |
| Token | AUI-TOKEN | Theme / Style / Density | P0 |
| Contract | AUI-CONTRACT | Component Contract | P0 |
| Web | AUI-WEB | Vue 3 Renderer | P0 |
| Uni | AUI-UNI | uni-app UI Library | P0 |
| Template | AUI-TEMPLATE | Template System | P0 |
| AI | AUI-AI | AI Engine | P0 |
| Studio | AUI-STUDIO | Studio MVP | P0 |
| Ecosystem | AUI-ECOSYSTEM | Package / Plugin | P1 |
| Testing | AUI-TEST | 全链路测试 | P0 |
| Release | AUI-RELEASE | RC / Release | P0 |

---

# 9. FOUNDATION

# AUI-FOUNDATION-001 Monorepo 初始化

## Objective

建立 AUI Monorepo。

## Files

```text
package.json
pnpm-workspace.yaml
turbo.json
tsconfig.json
.gitignore
.editorconfig
```

## Requirements

使用：

```text
pnpm
Turborepo
TypeScript
Vitest
Playwright
ESLint
Prettier
Changesets
VitePress
GitHub Actions
```

## Acceptance

```text
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

全部通过。

---

# AUI-FOUNDATION-002 Package Structure

建立：

```text
packages/
├── protocol
├── schema
├── tokens
├── runtime
├── vue-web
├── uni
└── ai
```

## Acceptance

所有 package：

```text
可以独立 build
可以被 workspace 引用
无循环依赖
```

---

# AUI-FOUNDATION-003 CI

建立：

```text
.github/workflows/
├── ci.yml
├── release.yml
└── visual.yml
```

CI 最低检查：

```text
TypeCheck
Lint
Unit
Contract
Build
```

---

# AUI-FOUNDATION-004 AI Development Context

建立：

```text
.ai/
├── architecture/
├── contracts/
├── tasks/
├── golden/
├── prompts/
├── decisions/
├── tests/
└── rules/
```

同时建立：

```text
AGENTS.md
AI-RULES.md
```

---

# 10. PROTOCOL

# AUI-PROTOCOL-001 UISchema

定义：

```ts
interface UISchema {
  version: string
  id?: string
  root: UINode
  state?: UIStateSchema
  actions?: UIAction[]
  metadata?: Record<string, unknown>
}
```

---

# AUI-PROTOCOL-002 UINode

定义：

```ts
interface UINode {
  id: string
  type: string
  props?: Record<string, unknown>
  children?: UINode[]
  bindings?: Record<string, UIBinding>
  events?: Record<string, UIEventBinding>
  style?: UIStyle
  accessibility?: UIAccessibility
  capability?: UICapability
}
```

---

# AUI-PROTOCOL-003 Binding

支持：

```text
state
computed
prop
event
expression
```

禁止：

```text
任意 JS
eval
new Function
动态代码执行
```

---

# AUI-PROTOCOL-004 Action

定义：

```ts
interface UIAction {
  id: string
  type: string
  params?: unknown
}
```

Schema 只引用：

```text
actionId
```

不得直接保存业务函数。

---

# AUI-PROTOCOL-005 Accessibility

支持：

```text
role
aria
keyboard
label
description
```

---

# AUI-PROTOCOL-006 Capability

定义：

```text
platform
framework
feature
fallback
```

示例：

```json
{
  "feature": "date-picker",
  "requires": ["web"],
  "fallback": "input"
}
```

---

# 11. SCHEMA

# AUI-SCHEMA-001 Zod Schema

Zod 作为：

```text
Schema Source of Truth
```

TypeScript 类型从 Zod 推导。

要求：

```text
Runtime
AI
CLI
Studio
Template
```

统一使用同一 Schema。

---

# AUI-SCHEMA-002 Validator

定义：

```ts
validate(schema): ValidationResult
```

错误必须包含：

```text
path
code
message
hint
source
severity
```

---

# AUI-SCHEMA-003 Normalizer

输入：

```text
Raw UISchema
```

输出：

```text
NormalizedSchema
```

Normalization 必须：

```text
deterministic
idempotent
pure
```

即：

```text
normalize(normalize(schema))
===
normalize(schema)
```

---

# AUI-SCHEMA-004 Schema Version

支持：

```text
Protocol Version
Runtime Version
Component Version
```

兼容规则：

```text
Patch
兼容

Minor
新增能力

Major
Breaking Change
```

---

# 12. RUNTIME

# AUI-RUNTIME-001 Runtime

建立：

```ts
AUIRuntime
```

职责：

```text
Schema
State
Binding
Action
Registry
Component
Theme
Error
Inspection
Lifecycle
```

不负责：

```text
Business Store
HTTP Business Logic
权限系统
数据库
业务流程
```

---

# AUI-RUNTIME-002 RuntimeContext

包含：

```text
state
props
actions
registry
theme
platform
runtime
abortSignal
```

---

# AUI-RUNTIME-003 Lifecycle

支持：

```text
create
mount
update
unmount
dispose
```

必须保证：

```text
dispose()
不会产生内存泄漏
```

---

# AUI-RUNTIME-004 Error System

统一：

```ts
AUIError
```

错误结构：

```text
code
path
message
hint
source
severity
cause
```

---

# 13. REACTIVE

# AUI-REACTIVE-001 ReactiveAdapter

实现：

```ts
interface ReactiveAdapter {
  createState<T>(value: T): ReactiveValue<T>
  computed<T>(getter: () => T): ReactiveValue<T>
  effect(fn: () => void): StopHandle
  dispose(): void
}
```

Phase 1：

```text
@vue/reactivity
```

禁止自行实现 Reactive Engine。

---

# AUI-REACTIVE-002 State

支持：

```text
createState
read
write
subscribe
dispose
```

---

# AUI-REACTIVE-003 Computed

支持：

```text
dependency tracking
lazy evaluation
cache
invalidate
dispose
```

---

# 14. BINDING

# AUI-BINDING-001 BindingResolver

实现：

```ts
resolve(
  binding,
  context
)
```

以及：

```ts
set(
  binding,
  value,
  context
)
```

---

# AUI-BINDING-002 Safe Expression

只允许受控表达式：

```text
state.user.name
state.count
props.value
computed.total
```

禁止：

```text
eval()
new Function()
window access
document access
arbitrary import
network request
```

---

# AUI-BINDING-003 Event Binding

支持：

```text
click
input
change
submit
focus
blur
```

---

# 15. TOKEN

# AUI-TOKEN-001 Primitive Token

定义：

```text
color
spacing
radius
font
shadow
motion
size
```

---

# AUI-TOKEN-002 Semantic Token

例如：

```text
color.text.primary
color.text.secondary
color.background.surface
color.border.default
color.action.primary
```

---

# AUI-TOKEN-003 Component Token

例如：

```text
button.height
button.radius
button.padding
input.height
card.radius
```

---

# AUI-TOKEN-004 Token Cascade

正式级联：

```text
Primitive Token
      ↓
Semantic Token
      ↓
Component Token
      ↓
Style Override
      ↓
Schema / Instance Override
```

Theme / Style / Density 作为独立维度进行切换。

---

# 16. COMPONENT CONTRACT

# AUI-CONTRACT-001 ComponentDefinition

每一个官方组件必须包含：

```text
component.ts
component.schema.ts
component.tokens.ts
component.test.ts
```

---

# AUI-CONTRACT-002 Props Schema

每个组件 Props：

```text
Zod Schema
TypeScript Type
Default
Validation
```

必须保持一致。

---

# AUI-CONTRACT-003 Component Contract

Contract 至少包含：

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

---

# 17. WEB

# AUI-WEB-001 Vue Renderer

实现：

```text
UISchema
 ↓
Runtime
 ↓
Component Registry
 ↓
Vue Renderer
 ↓
DOM
```

---

# AUI-WEB-002 Component Registry

实现：

```ts
register()
resolve()
has()
remove()
list()
```

---

# AUI-WEB-003 Button

支持：

```text
variant
size
disabled
loading
icon
text
click
```

必须支持：

```text
Token
A11y
Schema
Binding
Action
```

---

# AUI-WEB-004 Input

支持：

```text
value
placeholder
disabled
readonly
type
clearable
input
change
focus
blur
```

---

# AUI-WEB-005 Form

支持：

```text
fields
validation
submit
reset
disabled
loading
```

---

# AUI-WEB-006 Card

支持：

```text
title
description
header
body
footer
```

---

# AUI-WEB-007 Web E2E

必须验证：

```text
Schema
 ↓
Runtime
 ↓
Renderer
 ↓
Interaction
 ↓
State
 ↓
Event
```

---

# 18. UNI

# AUI-UNI-001 Uni Package

建立：

```text
packages/uni
```

AUI 不实现新的多端运行时。

uni-app 本身负责：

```text
H5
微信小程序
App
其他 uni-app 平台
```

AUI 负责：

```text
UI Contract
Schema
Runtime Integration
Components
Capability
Fallback
```

---

# AUI-UNI-002 Uni Renderer

建立 AUI Uni Renderer。

不得重复实现：

```text
H5 Renderer
MiniProgram Renderer
App Renderer
```

---

# AUI-UNI-003 Uni Button

适配：

```text
Button Contract
Token
A11y
Event
Capability
```

---

# AUI-UNI-004 Uni Input

实现统一 Input Contract。

---

# AUI-UNI-005 Uni Form

实现统一 Form Contract。

---

# AUI-UNI-006 Cross Platform

至少验证：

```text
H5
WeChat Mini Program
```

App 根据环境进入兼容性验证。

---

# 19. ACTION / APPBRIDGE

# AUI-ACTION-001 ActionRegistry

实现：

```ts
register()
resolve()
execute()
remove()
has()
list()
```

---

# AUI-ACTION-002 ActionHandler

统一：

```ts
type ActionHandler = (
  context: ActionContext,
  params: unknown
) => Promise<ActionResult>
```

---

# AUI-ACTION-003 AppBridge

AppBridge 是 Host Capability Boundary。

支持：

```text
router
notify
storage
analytics
event
abortSignal
```

业务 Service 不允许直接暴露给 Schema。

Schema：

```text
Action ID
```

Runtime：

```text
ActionRegistry
```

Host：

```text
Service Implementation
```

---

# 20. TEMPLATE

# AUI-TEMPLATE-001 Template Manifest

定义：

```json
{
  "name": "dashboard-basic",
  "version": "1.0.0",
  "aui": "^0.1.0",
  "dependencies": {},
  "components": [],
  "schema": "./schema.json"
}
```

---

# AUI-TEMPLATE-002 Template Registry

支持：

```text
register
resolve
list
install
remove
```

---

# AUI-TEMPLATE-003 Dependency Graph

建立：

```text
Template
 ↓
Components
 ↓
Packages
 ↓
Version
```

---

# AUI-TEMPLATE-004 Lock

生成：

```text
aui.lock
```

锁定：

```text
Template Version
Package Version
Component Version
```

---

# AUI-TEMPLATE-005 Official Templates

Phase 1：

```text
login-basic
dashboard-basic
form-basic
list-basic
```

---

# AUI-TEMPLATE-006 CLI

实现：

```bash
aui create
aui add
aui validate
aui patch
```

---

# 21. AI FOUNDATION

# AUI-AI-001 AI Context

建立统一 AI Context：

```text
Protocol
Schema
Component Contract
Tokens
Runtime API
Templates
Examples
Rules
Errors
```

---

# AUI-AI-002 AI Context Index

AI 必须可以根据任务：

```text
Task
 ↓
Relevant Contract
 ↓
Relevant Component
 ↓
Relevant Example
 ↓
Relevant Error
```

动态获取上下文。

---

# AUI-AI-003 Golden Schema

建立：

```text
.ai/golden/
```

保存：

```text
valid schemas
invalid schemas
edge cases
cross-platform schemas
expected render results
```

---

# 22. AI SCHEMA GENERATOR

# AUI-AI-004 Schema Generator

输入：

```text
Natural Language
```

输出：

```text
UISchema
```

流程：

```text
Prompt
 ↓
AI Context
 ↓
Schema Generation
 ↓
Zod Validation
 ↓
Normalization
 ↓
Static Check
```

---

# AUI-AI-005 Generator Constraints

AI 生成 Schema 不允许：

```text
未知 Component
未知 Action
非法 Binding
非法 Expression
非法 Token
非法 Event
未知 Capability
```

---

# 23. AI VALIDATION LOOP

# AUI-AI-006 Validator Loop

完整闭环：

```text
Generate
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

# AUI-AI-007 JSON Patch

Phase 1 使用：

```text
RFC 6902 JSON Patch
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

Patch 必须：

```text
atomic
validated
traceable
reversible
```

---

# AUI-AI-008 AI Repair

输入：

```text
Schema
Error
Runtime Inspection
```

输出：

```text
JSON Patch
```

AI 不允许直接修改 Runtime 内部状态。

---

# 24. RUNTIME INSPECTION

# AUI-AI-009 runtime.inspect()

支持：

```ts
runtime.inspect()
```

获取：

```text
nodes
errors
renderStats
```

开发环境允许更完整信息。

生产环境：

```text
default off
```

---

# AUI-AI-010 Production Redaction

禁止泄露：

```text
password
token
authorization
cookie
secret
credential
```

---

# 25. AI EVALUATION

# AUI-AI-011 Evaluation Dataset

建立：

```text
.ai/golden/
```

分类：

```text
Simple UI
Form
Dashboard
List
Interaction
Binding
Action
Responsive
Accessibility
Cross Platform
Invalid Schema
```

---

# AUI-AI-012 Evaluation

指标：

```text
Schema Validity
Component Validity
Binding Validity
Action Validity
Render Success
Patch Success
Repair Success
Regression Rate
```

不允许只看：

```text
LLM Output Quality
```

必须看：

```text
Runtime Executability
```

---

# AUI-AI-013 Regression

每次：

```text
Prompt
Schema
Component Contract
Runtime
Validator
```

发生重大变化，都运行 AI Regression。

---

# 26. STUDIO

# AUI-STUDIO-001 Studio Shell

建立：

```text
apps/studio
```

技术目标：

```text
Vue
AUI
Schema-first
```

---

# AUI-STUDIO-002 Canvas

Canvas 输入：

```text
UISchema
```

输出：

```text
Rendered UI
```

---

# AUI-STUDIO-003 Schema Tree

支持：

```text
Select
Add
Delete
Move
Duplicate
Rename
```

所有修改最终转化为：

```text
JSON Patch
```

---

# AUI-STUDIO-004 Inspector

支持：

```text
Props
Style
Tokens
Events
Accessibility
Capability
```

---

# AUI-STUDIO-005 Binding Editor

支持：

```text
State
Computed
Binding
Expression
```

必须经过 Schema Validator。

---

# AUI-STUDIO-006 Action Editor

支持：

```text
Action
Params
Event
Execution
```

---

# AUI-STUDIO-007 History

历史系统基于：

```text
JSON Patch
```

支持：

```text
Undo
Redo
Replay
```

---

# AUI-STUDIO-008 AI

Studio AI 支持：

```text
Generate
Modify
Explain
Repair
Optimize
```

所有 AI 修改：

```text
AI
 ↓
Patch
 ↓
Validate
 ↓
Preview
 ↓
Accept
```

---

# AUI-STUDIO-009 Template

支持：

```text
Template Search
Template Preview
Template Insert
Template Replace
```

---

# AUI-STUDIO-010 Theme

支持：

```text
Theme
Style
Density
```

三个维度独立切换。

---

# AUI-STUDIO-011 Preview

至少支持：

```text
Desktop
Mobile
Web
Uni
```

---

# 27. ECOSYSTEM

# AUI-ECOSYSTEM-001 Package Manifest

统一 Package Manifest。

包含：

```text
name
version
auiVersion
components
tokens
capabilities
dependencies
peerDependencies
```

---

# AUI-ECOSYSTEM-002 Component Package

第三方组件必须遵循：

```text
Contract
Zod
Token
A11y
Capability
```

---

# AUI-ECOSYSTEM-003 Theme Package

支持：

```text
Theme Token
Style
Density
Component Tokens
```

---

# AUI-ECOSYSTEM-004 Plugin Foundation

Plugin 只提供受控扩展点。

禁止：

```text
修改 Runtime 核心内部状态
```

---

# AUI-ECOSYSTEM-005 Compatibility

建立：

```text
AUI Version
Protocol Version
Runtime Version
Component Version
Plugin Version
```

兼容性检查。

---

# 28. TESTING

# AUI-TEST-001 Unit

覆盖：

```text
Protocol
Schema
Validator
Normalizer
Runtime
Reactive
Binding
Token
Action
```

目标：

```text
核心模块 ≥ 90%
```

---

# AUI-TEST-002 Contract

验证：

```text
Component Contract
Schema
Runtime
Renderer
```

---

# AUI-TEST-003 Runtime

验证：

```text
Lifecycle
State
Binding
Action
Dispose
Error
```

---

# AUI-TEST-004 Component

每个官方组件：

```text
Props
Events
Binding
Token
A11y
Capability
```

---

# AUI-TEST-005 E2E

完整链路：

```text
Schema
 ↓
Runtime
 ↓
Renderer
 ↓
User Interaction
 ↓
State Change
 ↓
Action
```

---

# AUI-TEST-006 Visual

验证：

```text
Button
Input
Form
Card
Template
Studio
```

---

# AUI-TEST-007 Accessibility

验证：

```text
ARIA
Keyboard
Focus
Label
Role
Contrast
```

---

# AUI-TEST-008 Performance

指标：

```text
Initial Render
Schema Parse
Normalization
Runtime Create
Binding Update
Component Render
```

---

# 29. RELEASE

# AUI-RELEASE-001 Full Validation

必须通过：

```text
TypeCheck
Lint
Unit
Contract
Runtime
Component
E2E
Visual
A11y
Build
Performance
AI Regression
```

---

# AUI-RELEASE-002 Bundle

检查：

```text
Core Size
Renderer Size
Tree Shaking
Duplicate Dependencies
```

---

# AUI-RELEASE-003 Documentation

必须完成：

```text
Architecture
Getting Started
Protocol
Schema
Runtime
Components
Templates
AI
Studio
CLI
FAQ
Migration
```

---

# AUI-RELEASE-004 Changeset

所有 Public API 修改必须有：

```text
Changeset
```

---

# AUI-RELEASE-005 RC

发布：

```text
v0.1.0-rc.1
```

进行：

```text
内部验证
Golden Regression
E2E
Cross Platform
Performance
Security
```

---

# AUI-RELEASE-006 v0.1.0

满足：

```text
Core Stable
Web Stable
Uni Beta
Template Stable
AI Beta
Studio Beta
Ecosystem Experimental
```

---

# 30. Milestone

## M0 Engineering Foundation

```text
AUI-FOUNDATION-001
AUI-FOUNDATION-002
AUI-FOUNDATION-003
AUI-FOUNDATION-004
```

Gate：

```text
pnpm install
typecheck
lint
test
build
```

---

# M1 Core

```text
Protocol
Schema
Validator
Runtime
Reactive
Binding
Token
Contract
```

Gate：

```text
Golden Schema
Runtime Test
Contract Test
```

---

# M2 Web

```text
Renderer
Button
Input
Form
Card
E2E
```

Gate：

```text
Schema → Runtime → Vue → DOM
```

---

# M3 Uni

```text
Uni Package
Renderer
Components
Capability
Fallback
Cross Platform
```

Gate：

```text
H5
WeChat Mini Program
```

---

# M4 Template

```text
Manifest
Registry
Dependency
Lock
CLI
Official Templates
```

Gate：

```text
aui create
aui add
aui validate
```

---

# M5 AI

```text
Context
Generator
Validator
Patch
Repair
Inspect
Evaluation
Regression
```

Gate：

```text
Natural Language
 ↓
Schema
 ↓
Validate
 ↓
Render
 ↓
Error
 ↓
Patch
 ↓
Valid
```

---

# M6 Studio

```text
Canvas
Tree
Inspector
Binding
Action
History
AI
Template
Theme
Preview
```

Gate：

```text
Studio
 ↓
Schema
 ↓
Runtime
 ↓
Renderer
```

---

# M7 Ecosystem

```text
Manifest
Package
Theme
Plugin
Compatibility
```

---

# M8 Release

```text
Full Test
Performance
A11y
Security
Docs
Changeset
RC
```

---

# 31. AI 并行执行模型

推荐：

```text
Agent 1
Architecture / Protocol

Agent 2
Schema / Runtime

Agent 3
Components / Renderer

Agent 4
Testing / QA

Agent 5
AI Engine

Agent 6
Docs / CLI
```

并发原则：

```text
一个 Agent = 一个明确 Scope
```

禁止多个 Agent 同时修改：

```text
同一个核心接口
同一个公共类型
同一个 Runtime 文件
```

---

# 32. Agent Dependency

```text
Protocol
    ↓
Schema
    ↓
Runtime
    ↓
Contract
    ↓
Renderer
    ↓
Template
    ↓
AI
    ↓
Studio
```

可以并行：

```text
Docs
Testing
CLI
Template Design
Golden Dataset
Component Design
Studio UX
```

---

# 33. Critical Path

核心关键路径：

```text
Protocol
 ↓
Schema
 ↓
Runtime
 ↓
Component Contract
 ↓
Web Renderer
 ↓
Uni
 ↓
Template
 ↓
AI Engine
 ↓
Studio
 ↓
Integration
 ↓
RC
```

---

# 34. AI Agent Daily Output

每个 Agent 每个任务必须产生：

```text
1. Code
2. Test
3. Validation Result
4. Changed Files
5. Risk
6. Commit
```

提交报告：

```text
Task:
AUI-RUNTIME-001

Implemented:
...

Files:
...

Tests:
...

TypeCheck:
PASS

Lint:
PASS

Build:
PASS

Risk:
...

Commit:
...
```

---

# 35. Definition of Ready

Task 只有满足以下条件才能交给 AI：

```text
[ ] Objective 明确
[ ] Dependency 明确
[ ] Contract 明确
[ ] Files 明确
[ ] Acceptance 明确
[ ] Forbidden 明确
[ ] Test 明确
```

否则：

```text
NOT READY
```

---

# 36. Definition of Done

任务只有满足：

```text
[ ] Code 完成
[ ] Unit Test
[ ] Contract Test
[ ] TypeCheck
[ ] Lint
[ ] Build
[ ] Self Review
[ ] Documentation
[ ] No Forbidden Pattern
[ ] Commit
```

才可以：

```text
DONE
```

---

# 37. Stop-the-Line Rules

出现以下任何情况：

```text
Protocol 依赖 Vue
eval / new Function
Schema 直接调用 Business Service
Patch 非原子
Runtime Dispose 泄漏
Component 没有 Zod Contract
AI 修改 Runtime 内部状态
Production Inspect 泄露敏感数据
删除失败测试
关闭 CI
绕过 TypeScript
```

立即：

```text
STOP
```

禁止继续向后推进。

---

# 38. API Stability

所有公共 API 必须标记：

```text
Experimental
Beta
Stable
Deprecated
```

v0.1：

```text
Protocol
Beta

Runtime
Beta

Web Components
Beta

Uni
Experimental / Beta

AI
Beta

Studio
Beta

Ecosystem
Experimental
```

---

# 39. AI 开发时间模型

本项目不按照传统：

```text
一个开发者
一个模块
串行开发
```

计算。

采用：

```text
Critical Path
+
Agent Parallelism
+
Human Gate
+
CI Capacity
```

目标：

```text
8–12 周
```

其中：

```text
核心工程
2–3 周

Web + Uni
1–2 周

Template
1 周

AI Engine
1–2 周

Studio MVP
2 周

Integration + Release
1–2 周
```

任务可以大量并行，因此不能简单将所有 WBS 天数相加。

---

# 40. 推荐执行节奏

## Week 1

```text
Foundation
Protocol
Schema
Runtime
```

## Week 2

```text
Reactive
Binding
Token
Contract
Web Renderer
```

## Week 3

```text
Web Components
Uni
Cross Platform
```

## Week 4

```text
Template
CLI
Dependency
Lock
AI Context
```

## Week 5

```text
AI Generator
Validator
Patch
```

## Week 6

```text
AI Repair
Runtime Inspect
Evaluation
Regression
```

## Week 7

```text
Studio
Canvas
Schema Tree
```

## Week 8

```text
Inspector
Binding
Action
History
```

## Week 9

```text
Studio AI
Template
Theme
Preview
```

## Week 10

```text
Ecosystem
Package
Plugin
Compatibility
```

## Week 11

```text
Integration
E2E
Visual
A11y
Cross Platform
```

## Week 12

```text
Performance
Security
Documentation
RC
```

## Week 13–14

```text
Stabilization
Bug Fix
Compatibility
AI Regression
Release
```

---

# 41. 最终项目结构

```text
aui/
│
├── apps/
│   ├── docs/
│   ├── playground/
│   ├── studio/
│   └── cli/
│
├── packages/
│   ├── protocol/
│   ├── schema/
│   ├── tokens/
│   ├── runtime/
│   ├── vue-web/
│   ├── uni/
│   └── ai/
│
├── templates/
│   ├── login-basic/
│   ├── dashboard-basic/
│   ├── form-basic/
│   └── list-basic/
│
├── tests/
│   ├── unit/
│   ├── contract/
│   ├── runtime/
│   ├── e2e/
│   ├── visual/
│   ├── a11y/
│   ├── ai/
│   └── performance/
│
├── .ai/
│   ├── architecture/
│   ├── contracts/
│   ├── tasks/
│   ├── golden/
│   ├── prompts/
│   └── rules/
│
├── .changeset/
│
├── AGENTS.md
├── ARCHITECTURE.md
├── DEVELOPMENT.md
├── TESTING.md
├── RELEASE.md
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---

# 42. WBS 总执行顺序

最终执行顺序：

```text
                    ┌───────────────┐
                    │   Foundation  │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │    Protocol   │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │ Schema/Zod    │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │    Runtime    │
                    └───────┬───────┘
                            ↓
              ┌─────────────┴─────────────┐
              ↓                           ↓
        ┌───────────┐               ┌───────────┐
        │    Web    │               │    Uni    │
        └─────┬─────┘               └─────┬─────┘
              └─────────────┬─────────────┘
                            ↓
                    ┌───────────────┐
                    │    Template   │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │   AI Engine   │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │  Studio MVP   │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │   Ecosystem   │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │ Test / RC     │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │   v0.1.0      │
                    └───────────────┘
```

---

# 43. v0.1.0 最终验收清单

## Core

```text
[ ] Protocol
[ ] Schema
[ ] Validator
[ ] Normalizer
[ ] Runtime
[ ] Reactive
[ ] Binding
[ ] Action
[ ] Registry
[ ] Token
[ ] Error
```

## Web

```text
[ ] Renderer
[ ] Button
[ ] Input
[ ] Form
[ ] Card
[ ] E2E
```

## Uni

```text
[ ] Package
[ ] Renderer
[ ] Components
[ ] Capability
[ ] Fallback
[ ] H5
[ ] WeChat
```

## Template

```text
[ ] Manifest
[ ] Registry
[ ] Dependency
[ ] Lock
[ ] CLI
[ ] Official Templates
```

## AI

```text
[ ] Context
[ ] Generator
[ ] Validator
[ ] Patch
[ ] Repair
[ ] Inspect
[ ] Golden
[ ] Evaluation
[ ] Regression
```

## Studio

```text
[ ] Canvas
[ ] Tree
[ ] Inspector
[ ] Binding
[ ] Action
[ ] History
[ ] AI
[ ] Template
[ ] Theme
[ ] Preview
```

## Quality

```text
[ ] Unit
[ ] Contract
[ ] Runtime
[ ] Component
[ ] E2E
[ ] Visual
[ ] A11y
[ ] Performance
[ ] Security
[ ] AI Regression
```

---

# 44. 最终判断标准

AUI v0.1.0 不是以：

```text
代码写完
```

作为完成标准。

而是：

```text
Schema 可以定义
        ↓
Schema 可以验证
        ↓
Runtime 可以执行
        ↓
Renderer 可以渲染
        ↓
用户可以交互
        ↓
Action 可以执行
        ↓
错误可以被发现
        ↓
Runtime 可以 Inspect
        ↓
AI 可以理解错误
        ↓
AI 可以生成 Patch
        ↓
Patch 可以验证
        ↓
UI 可以恢复正确
        ↓
Golden Regression 通过
```

形成完整闭环：

```text
              ┌──────────────┐
              │   AI Generate │
              └───────┬──────┘
                      ↓
              ┌──────────────┐
              │   Validate   │
              └───────┬──────┘
                      ↓
              ┌──────────────┐
              │   Normalize  │
              └───────┬──────┘
                      ↓
              ┌──────────────┐
              │    Render    │
              └───────┬──────┘
                      ↓
              ┌──────────────┐
              │   Inspect    │
              └───────┬──────┘
                      ↓
                  Error?
                 ↙      ↘
               No        Yes
               ↓          ↓
             Done       AI Repair
                          ↓
                       JSON Patch
                          ↓
                       Validate
                          ↓
                        Render
```

**这才是 AUI 的核心工程闭环。**

---

# 45. 下一阶段 WBS 拆解规则

本文件是 **L1/L2 WBS**。

下一层必须继续拆成：

```text
L1 Domain
   ↓
L2 Module
   ↓
L3 Feature
   ↓
L4 AI Task
```

例如：

```text
AUI-RUNTIME
    ↓
AUI-RUNTIME-001 Runtime
    ↓
AUI-RUNTIME-001-01 RuntimeContext
    ↓
AUI-RUNTIME-001-01-001
```

最终 AI Task 必须达到：

```text
单 Agent
单目标
有限文件
明确接口
明确测试
明确验收
可独立 Commit
```

即：

> **一个 AI Agent 接到任务后，不需要重新理解整个 AUI 项目，就可以完成该任务。**

下一份执行文档应在本 WBS 基础上继续生成：

```text
AUI-AI-TASKS-L4.md
```

把 **Foundation → Protocol → Schema → Runtime → Web → Uni → Template → AI → Studio** 全部继续拆成真正可以直接复制给 AI Agent 执行的 Task Card。