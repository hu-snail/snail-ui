# AUI AI-Native 完整开发排期与执行计划 v3.0

**项目：AUI**

**版本：v3.0**

**文档性质：Master Development Plan**

**开发模式：AI Agent 主导开发 + 人类架构决策与验收**

**核心技术：Vue 3 + TypeScript + Vite + pnpm + Turborepo**

**核心架构：Schema First + Protocol First + Runtime First + AI Native**

**目标：建立 AUI Core → Web → Uni → Template → AI → Studio → Ecosystem → Marketplace 的完整产品体系**

---

# 1. 执行模式重新定义

AUI 不采用传统：

```text
产品经理
 ↓
设计师
 ↓
前端工程师
 ↓
后端工程师
 ↓
测试工程师
 ↓
发布
```

的线性开发模型。

而采用：

```text
Human
  │
  ├── Architecture
  ├── Product Decision
  ├── Technical Freeze
  └── Acceptance
          │
          ▼
      AI Agent
          │
          ├── Coding
          ├── Testing
          ├── Refactoring
          ├── Documentation
          ├── Debugging
          └── Issue Execution
          │
          ▼
     Automated CI
          │
          ▼
      AI Repair
          │
          ▼
    Human Acceptance
```

---

# 2. AI 开发模式核心原则

AI 不是“辅助写代码”。

AI 是：

> **AUI 的主要执行研发者。**

但 AI 不拥有架构最终决策权。

---

## 2.1 Human Responsibilities

人负责：

```text
产品目标
架构边界
Protocol Freeze
API Freeze
重大技术选择
设计决策
验收
Release
```

---

## 2.2 AI Responsibilities

AI 负责：

```text
代码
测试
文档
组件
样例
重构
Bug Fix
类型修复
Lint 修复
CI 修复
Benchmark
Migration
```

---

# 3. AI Agent 工作单元

所有开发任务必须变成：

```text
Task
 ↓
Context
 ↓
Constraints
 ↓
Implementation
 ↓
Tests
 ↓
Validation
 ↓
Review
 ↓
Commit
```

AI 不允许接收：

> “把 AUI 做出来。”

这种模糊任务。

必须接收：

> 明确模块 + 接口 + 输入输出 + 文件范围 + 验收标准 + 禁止事项。

---

# 4. AUI 总体目标

最终形成：

```text
                    AUI
                     │
       ┌─────────────┼─────────────┐
       │             │             │
      Core           AI        Ecosystem
       │             │             │
       │             │             │
    Runtime       Generate      Template
    Schema        Patch         Theme
    Protocol      Repair        Plugin
    Contract      Evaluate      Component
       │             │             │
       └─────────────┼─────────────┘
                     │
                 Developer
                  Tools
                     │
              ┌──────┴──────┐
              │             │
           Studio        CLI/DevTools
              │
              ▼
          Application
```

---

# 5. AI 加速后的总体排期

传统开发估算：

```text
39～50 周
```

不再作为本项目基准。

AI-Native 模式目标：

> **约 12～16 周完成第一版完整产品闭环。**

不是 12～16 周完成所有企业级成熟能力。

而是完成：

```text
Core
+
Web
+
Uni
+
Template
+
AI
+
Studio MVP
+
Ecosystem Foundation
```

形成第一个完整闭环。

---

# 6. 总体时间表

| 阶段 | 周期 | 核心结果 |
|---|---:|---|
| Phase 0 | 2～3 天 | 工程环境 |
| Phase 1 | 7～10 天 | AUI Core |
| Phase 2 | 4～6 天 | Web Components |
| Phase 3 | 5～7 天 | Uni |
| Phase 4 | 4～6 天 | Template |
| Phase 5 | 7～10 天 | AI Engine |
| Phase 6 | 10～14 天 | Studio MVP |
| Phase 7 | 5～7 天 | Ecosystem |
| Phase 8 | 3～5 天 | Release |
| Stabilization | 5～7 天 | RC |

目标：

> **约 10～14 周。**

如果 AI Agent 可以持续并行执行多个独立任务：

> **理论上可以进一步压缩到约 8～10 周。**

但不把这个作为硬性承诺。

---

# 7. 三层时间模型

每个阶段都按照：

```text
Implementation
    ↓
Automated Validation
    ↓
Human Acceptance
```

计算。

例如一个 5 天 Phase：

```text
Day 1～3
AI Implementation

Day 4
AI Testing / Repair

Day 5
Human Review / Freeze
```

---

# 8. Phase 0 — AI Development Infrastructure

## 时间

**2～3 天**

---

## Day 1

建立：

```text
pnpm
Turborepo
TypeScript
ESLint
Prettier
Vitest
Playwright
Changesets
Vite
VitePress
```

---

## Day 2

建立：

```text
Repository
Package Skeleton
CI
Docs
Playground
CLI
```

---

## Day 3

建立 AI Development Rules：

```text
AGENTS.md
ARCHITECTURE.md
CONTRIBUTING.md
DEVELOPMENT.md
TESTING.md
```

AI 每次开发前必须读取这些规则。

---

# 9. AI Agent Context Architecture

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

---

# 10. AI Coding Rule

AI 每次任务：

```text
Read Architecture
 ↓
Read Related Contract
 ↓
Read Existing Code
 ↓
Implement
 ↓
Test
 ↓
Lint
 ↓
Typecheck
 ↓
Build
```

任何一步失败：

```text
AI Self Repair
```

---

# 11. Phase 1 — AUI Core

## 时间

**7～10 天**

目标：

```text
Protocol
Schema
Runtime
Reactive
Binding
Token
Contract
```

---

## Day 1

Protocol：

```text
UISchema
UINode
UIBinding
UIAction
UIAccessibility
UICapability
```

---

## Day 2

Schema：

```text
Zod
Validator
Normalizer
Version
Error
```

---

## Day 3

Runtime：

```text
Runtime
RuntimeContext
Lifecycle
Registry
```

---

## Day 4

Reactive：

```text
ReactiveAdapter
VueReactiveAdapter
State
Computed
Effect
Dispose
```

---

## Day 5

Binding：

```text
BindingResolver
Path
Read
Write
Dependency
```

---

## Day 6

Token：

```text
Primitive
Semantic
Component
Theme
Style
Density
```

---

## Day 7

Contract：

```text
ComponentContract
Props
Events
Slots
A11y
Capabilities
```

---

## Day 8

Integration：

```text
Schema
 ↓
Validator
 ↓
Runtime
 ↓
Reactive
 ↓
Binding
```

---

## Day 9

测试：

```text
Unit
Contract
Runtime
Binding
Token
```

---

## Day 10

Human Gate：

```text
API Review
Architecture Review
Golden Schema
Freeze
```

---

# 12. Phase 1 验收

必须完成：

```text
[✓] Schema
[✓] Validator
[✓] Normalizer
[✓] Runtime
[✓] Reactive
[✓] Binding
[✓] Token
[✓] Contract
[✓] Tests
[✓] Build
```

---

# 13. Phase 2 — Vue Web Renderer

## 时间

**4～6 天**

---

## Day 11

Renderer：

```text
VueRenderer
ComponentRegistry
NodeRenderer
```

---

## Day 12

Button：

```text
Button
Variants
Size
Disabled
Loading
Events
```

---

## Day 13

Input：

```text
Input
Value
Binding
Validation
Events
```

---

## Day 14

Form：

```text
Form
FormItem
Validation
Submit
```

---

## Day 15

Card：

```text
Card
Header
Body
Footer
```

---

## Day 16

E2E：

```text
Schema
 ↓
Runtime
 ↓
Renderer
 ↓
Browser
```

---

# 14. Web Renderer 验收

完成：

```text
Button
Input
Form
Card
```

并且：

```text
Schema → UI
```

稳定运行。

---

# 15. Phase 3 — AUI Uni

## 时间

**5～7 天**

---

## Day 17

建立：

```text
packages/uni
UniRenderer
UniComponentRegistry
```

---

## Day 18

实现：

```text
Button
Input
```

---

## Day 19

实现：

```text
Form
Card
```

---

## Day 20

实现：

```text
Binding
Action
Event
```

---

## Day 21

Capability：

```text
Web
H5
Mini Program
App
```

---

## Day 22

Cross Platform Testing。

---

## Day 23

Human Gate：

```text
Same Schema
 ↓
Web
 ↓
Uni
```

---

# 16. Phase 3 验收标准

核心要求：

```text
Same Schema
```

能够进入：

```text
Vue Web
```

以及：

```text
Vue + uni-app
```

而不需要重新定义业务 Schema。

---

# 17. Phase 4 — Template System

## 时间

**4～6 天**

---

## Day 24

Template Manifest：

```text
id
version
schema
dependencies
metadata
```

---

## Day 25

Template Registry：

```text
register
resolve
validate
```

---

## Day 26

Template CLI：

```bash
aui template
aui template add
aui template list
```

---

## Day 27

官方模板：

```text
login-basic
dashboard-basic
form-basic
list-basic
```

---

## Day 28

Lock：

```text
aui.lock
```

---

## Day 29

Dependency Graph。

---

# 18. Template 验收

至少：

```text
4 Templates
+
Registry
+
Lock
+
CLI
```

跑通。

---

# 19. Phase 5 — AI Engine

## 时间

**7～10 天**

这是整个项目的关键阶段。

---

# 20. AI Day 1

AI Context：

```text
Protocol
Schema
Contract
Token
Template
Error
```

---

# 21. AI Day 2

Schema Generator。

输入：

```text
自然语言
```

输出：

```text
AUI Schema
```

---

# 22. AI Day 3

Validator Loop：

```text
Generate
 ↓
Validate
 ↓
Normalize
```

---

# 23. AI Day 4

Patch：

```text
User Intent
 ↓
JSON Patch
```

---

# 24. AI Day 5

Repair：

```text
Error
 ↓
AI Diagnosis
 ↓
Patch
 ↓
Validate
```

---

# 25. AI Day 6

Runtime Integration：

```text
AI
 ↓
Schema
 ↓
Runtime
 ↓
Render
```

---

# 26. AI Day 7

Template Context：

```text
AI
 ↓
Template Search
 ↓
Template Selection
 ↓
Schema
```

---

# 27. AI Day 8

Evaluation：

建立：

```text
Golden Prompts
Golden Schemas
Golden Patches
```

---

# 28. AI Day 9

Regression：

```text
Prompt
 ↓
Generate
 ↓
Validate
 ↓
Compare
```

---

# 29. AI Day 10

Human Gate：

检查：

```text
安全
稳定
Schema 合法
Patch 合法
Runtime 不被 AI 直接修改
```

---

# 30. AI 最终闭环

必须实现：

```text
User
 ↓
AI
 ↓
Schema
 ↓
Validate
 ↓
Runtime
 ↓
Render
 ↓
Error
 ↓
AI Repair
 ↓
Patch
 ↓
Validate
 ↓
Commit
```

---

# 31. Phase 6 — AUI Studio MVP

## 时间

**10～14 天**

Studio 是最大的一块，但 AI Coding 可以显著压缩实现时间。

---

# 32. Studio Day 1～2

基础 UI：

```text
Toolbar
Sidebar
Canvas
Inspector
Console
```

---

# 33. Studio Day 3

Schema Tree：

```text
Root
 ├── Header
 ├── Form
 └── Button
```

---

# 34. Studio Day 4

Node 操作：

```text
Add
Delete
Move
Duplicate
Wrap
```

---

# 35. Studio Day 5

Inspector：

```text
Props
Tokens
Style
Density
```

---

# 36. Studio Day 6

Binding Editor：

```text
State
Computed
Binding
```

---

# 37. Studio Day 7

Action Editor：

```text
Action
Registry
AppBridge
```

---

# 38. Studio Day 8

History：

```text
Undo
Redo
Diff
```

底层：

```text
JSON Patch
```

---

# 39. Studio Day 9

AI：

```text
Natural Language
 ↓
AI
 ↓
Patch
 ↓
Preview
```

---

# 40. Studio Day 10

Template：

```text
Template
 ↓
Insert
 ↓
Edit
```

---

# 41. Studio Day 11

Theme：

```text
Theme
Style
Density
```

---

# 42. Studio Day 12

Preview：

```text
Web
Uni
```

---

# 43. Studio Day 13

E2E。

---

# 44. Studio Day 14

Human Gate。

---

# 45. Studio MVP 验收

用户必须能够：

```text
创建页面
 ↓
选择组件
 ↓
编辑属性
 ↓
修改 Schema
 ↓
预览
 ↓
AI 修改
 ↓
Undo
 ↓
Redo
 ↓
保存
```

---

# 46. Phase 7 — Ecosystem Foundation

## 时间

**5～7 天**

---

# 47. Package Manifest

定义：

```text
name
version
protocol
runtime
dependencies
capabilities
```

---

# 48. Component Package

支持：

```text
Component
Contract
Schema
Token
Tests
```

---

# 49. Theme Package

支持：

```text
Theme
Tokens
Style
Density
```

---

# 50. Plugin Foundation

建立：

```text
Plugin
Registry
Capability
Permission
```

---

# 51. Compatibility

检查：

```text
Protocol
Runtime
Component
Platform
```

---

# 52. Phase 8 — Release

## 时间

**3～5 天**

---

## Day 1

完整：

```text
Typecheck
Lint
Unit
Contract
E2E
```

---

## Day 2

```text
Visual
A11y
Performance
Bundle
```

---

## Day 3

```text
Docs
CLI
Examples
Templates
```

---

## Day 4

```text
Changeset
Release
Package
```

---

## Day 5

RC：

```text
v0.1.0
```

---

# 53. Stabilization Sprint

## 时间

**5～7 天**

这段时间禁止主动增加大型新功能。

只允许：

```text
Bug
Performance
Compatibility
Documentation
Developer Experience
Security
```

---

# 54. 第一阶段最终目标

约：

> **10～14 周**

形成：

```text
AUI Core
+
Vue Web
+
AUI Uni
+
Template
+
AI
+
Studio MVP
+
Ecosystem Foundation
```

---

# 55. 第二阶段路线

第一版闭环完成后再进入：

```text
AUI v0.2+
```

增加：

```text
更多组件
更多 Template
更强 AI
DevTools
Marketplace
```

---

# 56. Component Expansion

第一批：

```text
Button
Input
Form
Card
```

第二批：

```text
Select
Checkbox
Radio
Switch
Textarea
DatePicker
Upload
```

第三批：

```text
Table
Pagination
Tabs
Dialog
Drawer
Dropdown
Menu
Tree
```

---

# 57. AI Expansion

第二阶段：

```text
Screenshot → Schema
Figma → Schema
Existing UI → Schema
Schema → Optimization
Schema → Accessibility Repair
Schema → Responsive Optimization
```

---

# 58. DevTools

Phase 2：

```text
Vue DevTools Integration
```

支持：

```text
Schema Tree
Runtime
Binding
Action
Errors
Performance
```

---

# 59. Marketplace

第二阶段再建设：

```text
Registry
Publishing
Search
Version
Download
Install
Update
```

---

# 60. Enterprise

不要阻塞 v1 Core。

作为独立路线：

```text
Enterprise
 ├── Organization
 ├── Workspace
 ├── Permission
 ├── Audit
 ├── Private Components
 ├── Private Templates
 └── Private AI Context
```

---

# 61. AI Agent 并行策略

因为开发主体是 AI，所以不能使用：

```text
Task A
 ↓
Task B
 ↓
Task C
```

这种纯串行方式。

应采用：

```text
                    Architecture
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
       Agent A        Agent B        Agent C
       Schema         Runtime        Tokens
          │              │              │
          └──────────────┼──────────────┘
                         ↓
                       Merge
                         ↓
                       Tests
```

---

# 62. Agent 分工

推荐：

```text
Agent 1
Architecture / Protocol

Agent 2
Runtime

Agent 3
Components

Agent 4
Testing

Agent 5
Docs

Agent 6
AI Engine
```

不一定需要 6 个独立模型实例。

可以是同一个 AI 系统在不同任务上下文中运行。

---

# 63. AI Merge Gate

所有 AI 代码进入主分支之前必须：

```text
Typecheck
Lint
Unit
Contract
Build
```

必要时：

```text
E2E
Visual
A11y
Performance
```

---

# 64. AI 禁止事项

AI 不允许：

```text
修改冻结 Protocol
绕过 Validator
使用 eval
使用 new Function
直接访问 Business API
直接修改 Runtime Internal State
删除失败测试
关闭 CI
绕过 TypeScript
```

---

# 65. AI 修改架构的权限

普通 Agent：

```text
NO
```

架构 Agent：

```text
Proposal Only
```

最终：

```text
Human Approval
```

---

# 66. AI Coding Loop

每个 Task：

```text
1. Understand
2. Plan
3. Inspect
4. Implement
5. Test
6. Fix
7. Review
8. Commit
```

---

# 67. 自动任务完成标准

AI 不能说：

> “代码写完了。”

必须提供：

```text
Changed Files
Implemented
Tests Added
Tests Passed
Typecheck
Lint
Build
Known Issues
```

---

# 68. Definition of Ready

Task 开始前：

```text
[ ] Goal
[ ] Input
[ ] Output
[ ] API
[ ] Files
[ ] Dependencies
[ ] Tests
[ ] Acceptance
[ ] Forbidden
```

---

# 69. Definition of Done

```text
[ ] Code
[ ] Tests
[ ] Typecheck
[ ] Lint
[ ] Build
[ ] Docs
[ ] Review
[ ] No Architecture Violation
```

---

# 70. Master Dependency Graph

```text
                    Protocol
                       │
              ┌────────┴────────┐
              ↓                 ↓
            Schema           Contract
              │                 │
              └────────┬────────┘
                       ↓
                    Runtime
                       │
            ┌──────────┴──────────┐
            ↓                     ↓
        Vue Web                  Uni
            │                     │
            └──────────┬──────────┘
                       ↓
                    Template
                       │
                       ↓
                  AI Context
                       │
                       ↓
                   AI Engine
                       │
              ┌────────┴────────┐
              ↓                 ↓
           Studio            DevTools
              │                 │
              └────────┬────────┘
                       ↓
                   Ecosystem
                       │
                       ↓
                  Marketplace
                       │
                       ↓
                  Enterprise
```

---

# 71. Critical Path

真正关键路径：

```text
Protocol
 ↓
Schema
 ↓
Runtime
 ↓
Contract
 ↓
Web Renderer
 ↓
Uni Renderer
 ↓
Template
 ↓
AI
 ↓
Studio
```

---

# 72. 可并行路径

可以提前执行：

```text
Docs
CLI
Playground
Testing
Template Design
AI Research
Studio UX
Component Design
```

但不得提前冻结不存在的 Core API。

---

# 73. 时间压缩原则

AI 可以压缩：

```text
Coding
Testing
Refactoring
Documentation
Boilerplate
Component Implementation
```

不能随意压缩：

```text
Architecture Review
API Freeze
Integration
Acceptance
Performance Validation
Security
```

---

# 74. 为什么不能压缩成 2～3 周

即使 AI 完成大部分编码，仍然需要：

```text
Architecture
Integration
Cross-platform
Testing
Regression
API Stabilization
```

这些是系统复杂度决定的，而不是编码速度决定的。

所以目标：

> **10～14 周完成第一版完整闭环**

比“2～3 周完成整个 AUI”更适合作为正式项目目标。

---

# 75. 版本路线

## v0.0.x

```text
Engineering
```

---

## v0.1.0

```text
AUI Core
Vue Web
Uni
Template
AI
Studio MVP
```

---

## v0.2.0

```text
More Components
More Templates
DevTools
AI Improvements
```

---

## v0.3.0

```text
AI Screenshot
Figma
Advanced Studio
```

---

## v0.4.0

```text
Ecosystem
Plugin
Package
```

---

## v0.5.0

```text
Marketplace
```

---

## v1.0.0

```text
Stable Framework
```

---

# 76. v1.0 前必须完成

```text
Protocol Stable
Schema Stable
Runtime Stable
Web Stable
Uni Stable
Component Contracts Stable
Template Stable
AI Guardrails
Studio Stable
Compatibility
Performance
Accessibility
Security
Documentation
```

---

# 77. 不进入 v1.0 的能力

以下可以继续迭代，但不阻塞第一版：

```text
React
Flutter
复杂 AST Compiler
大型低代码系统
复杂 BPM
企业 SaaS
完整 Marketplace 商业系统
```

---

# 78. React / Flutter 路线

不是 Core Phase。

未来：

```text
packages/
├── vue-web
├── uni
├── react
└── flutter
```

统一：

```text
Protocol
Schema
Contract
Token
```

不同：

```text
Renderer
Runtime Adapter
Platform Capability
```

---

# 79. 长期架构

最终：

```text
                 AUI Protocol
                      │
                   Schema
                      │
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
    Vue Web          Uni           React
       │              │              │
       └──────────────┼──────────────┘
                      │
                 AI / Studio
```

---

# 80. 总体项目闭环

```text
Architecture
      ↓
Task
      ↓
AI Agent
      ↓
Code
      ↓
Test
      ↓
CI
      ↓
AI Repair
      ↓
Human Review
      ↓
Freeze
      ↓
Next Task
```

---

# 81. 产品闭环

```text
User
 ↓
AI / Studio
 ↓
Schema
 ↓
Runtime
 ↓
Web / Uni
 ↓
Application
 ↓
Feedback
 ↓
Template
 ↓
AI Context
 ↓
AI
```

---

# 82. 开发闭环

```text
Requirement
 ↓
Architecture
 ↓
Protocol
 ↓
Schema
 ↓
Runtime
 ↓
Renderer
 ↓
Component
 ↓
Template
 ↓
AI
 ↓
Studio
 ↓
Ecosystem
```

---

# 83. 最终项目结构

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
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---

# 84. 最终时间线

```text
Week 1
├── Engineering
├── Protocol
├── Schema
└── Runtime

Week 2
├── Reactive
├── Binding
├── Tokens
├── Contract
└── Web Components

Week 3
├── Uni
├── Cross Platform
└── Template

Week 4
├── Template Registry
├── Lock
└── AI Context

Week 5
├── AI Generate
├── AI Patch
└── AI Validate

Week 6
├── AI Repair
├── AI Evaluation
└── AI Regression

Week 7
├── Studio Foundation
├── Canvas
└── Schema Editor

Week 8
├── Inspector
├── Binding
├── Action
└── History

Week 9
├── Studio AI
├── Template
└── Preview

Week 10
├── Ecosystem
├── Package
└── Plugin

Week 11
├── Integration
├── E2E
├── Visual
└── A11y

Week 12
├── Performance
├── Security
├── Documentation
└── RC

Week 13～14
└── Stabilization / Release
```

---

# 85. 最终 Milestone

| Milestone | 目标 |
|---|---|
| M0 | AI 开发环境 |
| M1 | Protocol |
| M2 | Schema |
| M3 | Runtime |
| M4 | Web |
| M5 | Uni |
| M6 | Template |
| M7 | AI |
| M8 | Studio |
| M9 | Ecosystem |
| M10 | RC |
| M11 | v0.1 |

---

# 86. 最终成功标准

第一版不是以：

> “写了多少代码”

作为完成标准。

而是：

```text
Natural Language
       ↓
      AI
       ↓
     Schema
       ↓
    Validate
       ↓
    Runtime
       ↓
   Web / Uni
       ↓
   Application
```

然后：

```text
User Request
       ↓
    AI Patch
       ↓
    Validate
       ↓
 Atomic Commit
       ↓
 Runtime Update
       ↓
    Preview
```

完整跑通。

---

# 87. 最终架构冻结原则

以下内容属于 AUI 核心冻结对象：

```text
Protocol
Schema
Component Contract
Runtime
Reactive Adapter
Binding
Action Registry
AppBridge
Token
Theme
Style
Density
JSON Patch
Runtime Inspect
```

AI、Studio、Marketplace 不得反向破坏这些边界。

---

# 88. 最终项目定位

AUI 不做：

```text
传统 UI Library
```

也不直接做：

```text
大型 Low-Code Platform
```

第一阶段定位：

> **AI-native Schema-first UI Framework。**

核心能力：

```text
Schema
+
Runtime
+
Renderer
+
AI
+
Template
+
Studio
```

---

# 89. 最终开发策略

AUI 的开发策略最终冻结为：

```text
人：
决定“做什么”和“架构应该是什么”

AI：
负责“怎么实现”

自动化：
负责“有没有做对”

人：
负责“是否接受”
```

即：

```text
Human Architecture
        ↓
AI Implementation
        ↓
Automated Verification
        ↓
AI Repair
        ↓
Human Acceptance
        ↓
Release
```

---

# 90. 总结

传统项目：

```text
10 人 × 12 个月
```

并不是 AUI 的目标开发模式。

AUI 采用：

```text
1 个架构决策者
+
AI Coding Agents
+
Automated CI
+
Golden Tests
```

将大量：

```text
Coding
Testing
Refactoring
Documentation
Component Work
Boilerplate
```

交给 AI。

因此：

> **AUI 第一版完整闭环目标周期调整为约 10～14 周。**

其中最重要的不是“让 AI 尽快写完”，而是：

```text
Architecture Freeze
        ↓
AI Parallel Development
        ↓
Automated Testing
        ↓
AI Repair
        ↓
Human Gate
```

这套机制保证速度提升以后，架构不会失控。

最终第一阶段交付：

```text
AUI Core
+
Vue Web
+
AUI Uni
+
Template
+
AI Engine
+
Studio MVP
+
Ecosystem Foundation
```

形成真正可使用的：

> **AUI AI-Native UI Development Platform v0.1**

然后再进入：

```text
v0.2
More Components

v0.3
Advanced AI

v0.4
Advanced Studio

v0.5
Ecosystem

v1.0
Stable
```

---

# 91. 本文档执行优先级

从现在开始，所有 AUI 开发任务均以本 Master Plan 为上层约束。

执行层级：

```text
AUI Master Plan
       ↓
Phase Plan
       ↓
Workstream Plan
       ↓
Epic
       ↓
Task
       ↓
AI Agent Task
       ↓
Code
       ↓
Test
       ↓
Acceptance
```

任何 AI Agent 不得跳过上层架构直接扩大 Scope。

**Master Plan 决定路线。**

**Phase Plan 决定阶段。**

**WBS 决定任务。**

**AI Agent 执行任务。**

**CI 验证实现。**

**Human Gate 决定是否进入下一阶段。**