# snail-aui 开发指南 v3.0

**版本**：v3.0  
**状态**：Active  
**面向**：所有参与 snail-aui 开发的 AI Agent 和人工开发者  
**日期**：2026-10-03

---

## 1. 快速入门

### 1.1 环境要求

| 工具 | 版本 | 说明 |
|---|---|---|
| Node.js | ≥ 20.0.0 | `engines` 字段强制 |
| pnpm | ≥ 10.0.0 | workspace 管理 |
| TypeScript | 5.x strict | `tsconfig.base.json` 共享配置 |
| Turbo | 2.x | Monorepo 并行构建，使用 `tasks`（非 `pipeline`）|
| ESLint | 9.x flat config | 根目录 `eslint.config.js`，非 `.eslintrc` |
| Prettier | 3.x | 根目录 `.prettierrc` |
| Vitest | 2.x | 自动发现 `packages/*/src/**/*.{test,spec}.ts` |

### 1.2 首次克隆后

```bash
pnpm install             # 安装依赖（lockfile 不变）
pnpm typecheck           # 类型检查全量（0 error）
pnpm lint                # lint 全量（0 warning）
pnpm test                # 单元测试全量（100% pass）
pnpm build               # 构建所有包
```

### 1.3 日常开发

```bash
# 启动文档站开发服务
pnpm dev:docs

# 启动组件预览页
pnpm dev:preview

# 监视编译某个包
pnpm --filter @snui/vue-web dev

# 只跑某个包的测试
pnpm --filter @snui/tokens test
```

---

## 2. 接手任务前必读

在开始任何任务前，必须按顺序读取：

```text
1. AGENTS.md                     项目执行标准（最高优先级）
2. dev-docs/SNUI-Architecture-v3.0.md  当前架构全景
3. dev-docs/SNUI-PRD-v3.0.md     产品需求
4. 对应 Spec 文件（Spec-01 ~ Spec-05）
5. dev-docs/SNUI-WBS-v3.0.md     找到当前 Task ID
6. 相关包源码（不要凭印象开写）
```

不得跳过任何一步直接写代码。

---

## 3. 包说明

### 3.1 @snui/tokens（`packages/tokens/`）

- **性质**：零运行时依赖，叶子节点
- **产物**：TypeScript 类型 + CSS 变量生成函数 + 静态 `styles/index.css`
- **不得修改**：token 变量名（是 Public API，变更需 Human Gate）
- **扩展方式**：新增 Semantic/Component Token 字段，通过 PR 审批

### 3.2 @snui/style-packs（`packages/style-packs/`）

- **性质**：纯 TS 数据，零运行时，零依赖
- **每个 Pack**：一个 TS 文件 + 子路径导出
- **约束**：Pack 只能覆盖 Token，不允许修改组件 .vue
- **校验**：`pnpm snui pack validate` 通过才能合并

### 3.3 @snui/vue-web（`packages/vue-web/`）

- **性质**：Vue 3 组件库，Web 端
- **每个组件**：`Sn{Name}.vue` + `Sn{Name}.test.ts` + `ai-description.md`
- **样式规则**：只能用 `var(--sn-*)` 变量，禁止硬编码
- **按需加载**：ESM tree-shake + unplugin-vue-components resolver

### 3.4 @snui/uni（`packages/uni/`）

- **性质**：uni-app 组件库，easycom 注册
- **路径约定**：`src/components/sn-{name}/sn-{name}.vue`
- **尺寸单位**：优先 `rpx`

### 3.5 @snui/ai（`packages/ai/`）

- **性质**：AI Layer，包含 Skill 文件、MCP Server、ai-meta 生成器
- **MCP Server**：只读，不修改项目文件
- **启动**：`npx @snui/ai` 或 `pnpm snui mcp`

### 3.6 @snui/cli（`packages/cli/`）

- **性质**：构建工具，不进 bundle
- **核心命令**：`snui docs` / `snui llms` / `snui ai-meta` / `snui new` / `snui pack validate`

---

## 4. 新增组件流程

### Step 1. 确认 Task ID

在 WBS v3.0 中找到对应的 `AUI-CORE-XXX` 或 `AUI-FORM-XXX` 等 Task ID。

### Step 2. 创建文件

**Web 端**：

```bash
pnpm snui new SnFoo   # 脚手架生成
# 或手动创建：
mkdir packages/vue-web/src/foo
touch packages/vue-web/src/foo/SnFoo.vue
touch packages/vue-web/src/foo/SnFoo.test.ts
touch packages/vue-web/src/foo/ai-description.md
```

**Uni 端**：

```bash
mkdir packages/uni/src/components/sn-foo
touch packages/uni/src/components/sn-foo/sn-foo.vue
touch packages/uni/src/components/sn-foo/sn-foo.test.ts
touch packages/uni/src/components/sn-foo/ai-description.md
```

### Step 3. 读现有组件参考实现

不要凭空写，先读 `packages/vue-web/src/button/SnButton.vue` 理解模式。

### Step 4. 写组件实现

按 Spec-02 规范实现：
- Props / Events / Slots 完整声明
- 只用 `var(--sn-*)` 变量
- A11y 属性完整

### Step 5. 写 Token（如有新增）

如果组件需要新的 CSS 变量：

1. 在 `packages/tokens/src/component.ts` 中添加字段
2. 在 `packages/tokens/src/resolver.ts` 的 `emitComponentBindings` 中添加输出
3. 在 `packages/tokens/styles/index.css` 中添加默认值
4. 在 `packages/tokens/src/component.test.ts` 中添加测试

Token 变更属于 Public API，需要 Human Gate 审批。

### Step 6. 写测试

按 Spec-02 §4 写单元测试，确保：
- Props / Events / Slots / A11y 全覆盖
- `disabled` / `loading` 等边界状态覆盖

### Step 7. 写 ai-description.md

按 Spec-02 §3 格式填写。Props / Events / Slots / Tokens 表格必须完整。

### Step 8. 更新 index.ts 和 resolver.ts

```ts
// packages/vue-web/src/index.ts
export { default as SnFoo } from './foo/SnFoo.vue'

// packages/cli/src/resolver.ts
const PUBLIC_COMPONENTS = [..., 'SnFoo']
```

### Step 9. 写文档页（必须，§110）

```bash
touch apps/docs/components/web/foo.md
touch apps/docs/en/components/web/foo.md
touch apps/docs/components/uni/foo.md
touch apps/docs/en/components/uni/foo.md
```

更新 `apps/docs/.vitepress/config.ts` 两处 sidebar（zh + en）。

### Step 10. 验证

```bash
pnpm typecheck    # 0 error
pnpm lint         # 0 warning
pnpm test         # 100% pass
pnpm build        # 0 error
```

---

## 5. 新增 Style Pack 流程

### Step 1. 确认 Task ID（AUI-PACK-XXX）

### Step 2. 创建 Pack 文件

```bash
touch packages/style-packs/src/{name}.ts
```

### Step 3. 实现 Pack

参考 Spec-01 §2.3 规范和 `ios.ts` 实现：
- `name`：kebab-case
- `style.component` 只覆盖 `ComponentTokens` 已声明字段
- `theme` 只覆盖颜色
- `density` 只覆盖间距/尺寸

### Step 4. 更新 index.ts 和 package.json exports

```ts
// packages/style-packs/src/index.ts
export { fooBarPack } from './foo-bar.js'
```

```json
// packages/style-packs/package.json "exports"
"./foo-bar": { "types": "./dist/foo-bar.d.ts", "import": "./dist/foo-bar.js" }
```

### Step 5. 运行 pack validate

```bash
pnpm snui pack validate
```

### Step 6. 写文档页

`apps/docs/style-packs/{name}.md`（中英文各一份）

---

## 6. CI / PR 规则

### 6.1 CI 门禁（全部必须通过）

```bash
pnpm typecheck   # 0 error（turbo run typecheck）
pnpm lint        # 0 warning（turbo run lint）
pnpm test        # 100% pass（turbo run test）
pnpm build       # 0 error（turbo run build）
```

组件相关额外：
- `pnpm snui pack validate`（新增或修改 Style Pack 时）

### 6.2 PR 要求

- 每个 PR 只做一件事（单一 Task ID）
- Commit message 格式：`feat(scope): description`
- 不允许 `git push --force` 到 main
- 不允许 `skip test`、`skip lint`
- 新增组件必须同时包含文档页（中英文 + 双端）

### 6.3 Human Gate 触发条件

以下情况必须等 Human 审批后再合并：
- Token 变量名变更（Public API）
- Package 边界变更
- 新增外部依赖
- Architecture 变更（需先写 ADR）

---

## 7. 常见问题

### Q: 新增组件的 Token 变量在哪里声明？

在 `packages/tokens/src/component.ts` 的 `ComponentTokens` 接口里添加字段，然后在 `resolver.ts` 和 `styles/index.css` 同步添加默认值。

### Q: 文档站 StyleSwitcher 切换后 ComponentPreview 没有变化？

检查 iframe 是否与父页面同域（开发环境下应该同域）。确认 `snCssVars()` 注入的 `<style id="snui-pack">` 在 `<head>` 里，而不是只在 shadow DOM 里。

### Q: 如何为已有组件添加 Style Pack 支持？

组件本身无需修改——只要组件 CSS 全部通过 `var(--sn-*)` 变量，Style Pack 覆盖 Token 后会自动生效。

### Q: uni 端组件测试跑不起来？

检查 `packages/uni/vitest.config.ts` 的 `environment`（应为 `happy-dom`），以及是否有 uni 特有 API 需要 mock（如 `uni.showToast`）。

### Q: MCP Server 如何本地调试？

```bash
cd packages/ai
pnpm dev   # 监视编译
node dist/bin/mcp-server.js   # 手动运行
```

---

## 8. 文档说明

| 文件 | 用途 |
|---|---|
| `AGENTS.md` | AI Agent 执行标准（最高优先级） |
| `AI-RULES.md` | 快速参考（链接到最新文档） |
| `dev-docs/SNUI-PRD-v3.0.md` | 产品需求 |
| `dev-docs/SNUI-Architecture-v3.0.md` | 整体架构 |
| `dev-docs/SNUI-Master-Plan-v5.0.md` | 里程碑规划 |
| `dev-docs/SNUI-WBS-v3.0.md` | 工作分解（Task 索引）|
| `dev-docs/Spec-01-Token-StylePack.md` | Token + Style Pack 规范 |
| `dev-docs/Spec-02-Component.md` | 组件开发规范 |
| `dev-docs/Spec-03-AI-Layer.md` | AI Layer 规范 |
| `dev-docs/Spec-04-Prototype-App.md` | 原型与应用产出规范 |
| `dev-docs/Spec-05-Docs-StyleSwitcher.md` | 文档站规范 |
| `.ai/decisions/` | 架构决策记录（ADR）|

---

## 9. 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-09 | 初始版本（Schema-Runtime 时代） |
| v2.0 | 2026-10-03 | Component First 重写 |
| v3.0 | 2026-10-03 | 新增 Style Pack + AI Layer 流程 |
