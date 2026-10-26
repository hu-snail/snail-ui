# snail-aui 开发指南 v3.1

**版本**：v3.1  
**状态**：Active  
**面向**：所有参与 snail-aui 开发的 AI Agent 和人工开发者  
**日期**：2026-10-03

---

## 1. 快速入门

### 1.1 环境要求

| 工具 | 版本 |
|---|---|
| Node.js | ≥ 20 |
| pnpm | ≥ 10 |
| TypeScript | 5.x strict |
| Turbo | 2.x |
| ESLint | 9.x flat config |
| Prettier | 3.x |
| Vitest | 2.x |

### 1.2 首次克隆后

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint
pnpm -r test
pnpm -r build
```

### 1.3 日常开发

```bash
# 启动文档站
pnpm --filter @snui/docs dev

# 启动本地预览（Web 端）
pnpm --filter @snui/preview dev

# 监视编译某个包
pnpm --filter @snui/vue-web dev

# 单个包测试
pnpm --filter @snui/tokens test
```

---

## 2. 接手任务前必读

```text
1. AGENTS.md
2. dev-docs/SNUI-Architecture-v3.1.md
3. dev-docs/SNUI-PRD-v3.1.md
4. 对应 Spec（Spec-01~05）
5. dev-docs/SNUI-WBS-v3.1.md
6. 相关包源码
```

---

## 3. 端独立开发流程（v3.1 重点）

### 3.1 端包清单

| 端 | 包 | 别名 Token 包 | 路径 |
|---|---|---|---|
| Web (PC) | `@snui/vue-web` | `@snui/tokens-web` | `packages/vue-web/` + `packages/tokens-web/` |
| uni (移动) | `@snui/uni` | `@snui/tokens-mp` | `packages/uni/` + `packages/tokens-mp/` |
| React (未来) | `@snui/react-web` | `@snui/tokens-react` | `packages/react-web/` + `packages/tokens-react/` |

### 3.2 端独立约束

- 每端独立 package.json / tsconfig.json / vitest.config.ts
- 每端独立构建产物到 `dist/`
- 每端独立 publish 到 npm
- **跨端 0 行复用源代码**
- TS 接口、文件命名规范各自不同（Sn 前缀 vs sn- 前缀）

### 3.3 Token 别名映射

每端维护自己的别名映射：

```ts
// packages/tokens-web/src/variables.ts
export const snWebAliasMap: ReadonlyArray<[string, string]> = [
  ['--sn-web-color-action-primary', '--aui-color-action-primary'],
  // ...
]

// packages/tokens-mp/src/variables.ts
export const snMpAliasMap: ReadonlyArray<[string, string]> = [
  ['--sn-mp-color-action-primary', '--aui-color-action-primary'],
  // 注意：rpx 转换在这里完成
  // ...
]
```

### 3.4 组件消费 Token

Web 端组件 CSS：

```css
.sn-button {
  background-color: var(--sn-web-color-action-primary);
  border-radius: var(--sn-web-button-radius);
}
```

uni 端组件 CSS：

```css
.sn-button {
  background-color: var(--sn-mp-color-action-primary);
  border-radius: var(--sn-mp-button-radius);  /* 转 rpx */
}
```

---

## 4. 新增端组件流程

### Step 1. 确认 Task ID + 端

在 WBS v3.1 中找 `AUI-WEB-*` / `AUI-MP-*` 等任务。

### Step 2. 创建文件

Web 端：

```bash
mkdir -p packages/vue-web/src/{name}
touch packages/vue-web/src/{name}/Sn{Name}.vue
touch packages/vue-web/src/{name}/Sn{Name}.test.ts
touch packages/vue-web/src/{name}/ai-description.md
```

uni 端：

```bash
mkdir -p packages/uni/src/components/sn-{name}
touch packages/uni/src/components/sn-{name}/sn-{name}.vue
touch packages/uni/src/components/sn-{name}/sn-{name}.test.ts
touch packages/uni/src/components/sn-{name}/ai-description.md
```

### Step 3. 读现有组件

不要凭空写，先读同端已有 SnButton.vue / sn-button.vue 理解模式。

### Step 4. 实现组件

按 Spec-02 §5 实现。

### Step 5. ai-description.md 标注 end

```md
<!-- SnButton ai-description.md -->
end: web   ← 或 'mp'

# SnButton — ...
```

### Step 6. 注册

```ts
// packages/vue-web/src/index.ts
export { default as Sn{Name} } from './{name}/Sn{Name}.vue'
```

```ts
// packages/uni/src/index.ts
export { default as Sn{Name} } from './components/sn-{name}/sn-{name}.vue'
```

### Step 7. 测试 + 验证

```bash
pnpm --filter @snui/vue-web test
pnpm snui token check --dir packages/vue-web/src   # 验证别名前缀
pnpm --filter @snui/vue-web build
```

### Step 8. 文档页（双端 + 双语）

```bash
touch apps/docs/components/web/{name}.md
touch apps/docs/en/components/web/{name}.md
touch apps/docs/components/uni/{name}.md
touch apps/docs/en/components/uni/{name}.md
```

---

## 5. 新增 Style Pack 流程

### Step 1. 确认 Task ID（AUI-PACK-XXX）

### Step 2. 选定 end

```ts
// 跨端 Pack
end: 'both'

// 仅 Web
end: 'web'

// 仅 uni
end: 'mp'
```

### Step 3. 创建 Pack 文件

```bash
touch packages/style-packs/src/{name}.ts
```

### Step 4. 实现

按 Spec-01 §5 实现。

### Step 5. 更新 exports + 校验

```bash
pnpm snui pack validate
```

### Step 6. 文档页

`apps/docs/style-packs/{name}.md`（中文 + 英文）

---

## 6. CI 门禁

```bash
pnpm -r typecheck       # 0 error
pnpm -r lint            # 0 warning
pnpm -r test            # 100% pass
pnpm -r build           # 0 error
pnpm snui token check --dir packages/vue-web/src   # 别名前缀校验
pnpm snui token check --dir packages/uni/src       # 别名前缀校验
pnpm snui pack validate                          # Pack 合法性
```

---

## 7. 端包添加新端指南

新增端（如 React）：

```
1. packages/tokens-{end}/                  --sn-{end}-* 别名层
2. packages/{end}/                         组件实现
3. packages/cli/src/resolver.ts            加 PUBLIC_COMPONENTS_{END}
4. packages/ai/src/mcp/tools/list-components.ts   加 {end} 分支
5. packages/ai/src/meta/aggregator.ts      加 {end} components 数组
6. apps/docs/.vitepress/config.ts          nav / sidebar 加 {end} 端
7. apps/docs/{end}/                        文档目录
8. apps/docs/en/{end}/                     英文文档
```

**严禁跨端源代码复用**。

---

## 8. 常见问题

### Q: Web 端能 import uni 端的组件吗？

**不能**。每端是独立包，跨端 import 是违规。

### Q: 风格包能同时给两端用吗？

可以——Style Pack 与端无关，只是 Token + 皮肤 CSS 描述。但应用时要按 `end` 参数传入（`snCssVars({ end: 'web' | 'mp', ... })`）。

### Q: 我想把 Button 在 Web 和 uni 都叫 SnButton，可以吗？

不行。两端命名约定不同（Web: PascalCase，uni: kebab-case）。两端都有的 Button 是按各自约定写两次：

- `@snui/vue-web` 导出 `SnButton`
- `@snui/uni` 导出 `SnButton`（在 .vue 里通过 `defineOptions` 设置 name）

但实际使用是 `<SnButton>`（Web）和 `<sn-button>`（uni）。

### Q: Token 别名层什么时候落地？

M1 阶段（FOUND-005~008）。当前 `@snui/tokens` 只输出 `--aui-*`；M1 起新增 `tokens-web` / `tokens-mp` 别名层。

---

## 9. 文档说明

| 文件 | 用途 |
|---|---|
| `dev-docs/SNUI-PRD-v3.1.md` | 产品需求（Active）|
| `dev-docs/SNUI-Architecture-v3.1.md` | 整体架构（Active）|
| `dev-docs/SNUI-Master-Plan-v5.1.md` | 里程碑规划（Active）|
| `dev-docs/SNUI-WBS-v3.1.md` | 工作分解（Active）|
| `dev-docs/Spec-01-Token-StylePack.md` | Token + Style Pack（Active）|
| `dev-docs/Spec-02-Component.md` | 组件规范（Active）|
| `dev-docs/Spec-03-AI-Layer.md` | AI Layer（Active）|
| `dev-docs/Spec-04-Prototype-App.md` | 原型与应用产出（Active）|
| `dev-docs/Spec-05-Docs-StyleSwitcher.md` | 文档站规范（Active）|
| `.ai/decisions/0002-ai-native-style-platform.md` | ADR-0002 |
| `.ai/decisions/0002-AGENTS-revision.md` | AGENTS.md 修订清单 |

---

## 10. 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-09 | Schema-Runtime 时代 |
| v3.0 | 2026-10-03 | 组件 + Style Pack + AI Layer |
| **v3.1** | 2026-10-03 | **Web / uni 端独立 + 双 Token 别名层 + 端独立性约束（Active）** |