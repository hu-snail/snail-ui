# snail-aui 整体架构 v3.1

**版本**：v3.1  
**状态**：Active（supersedes Architecture v3.0）  
**对应**：PRD v3.1  
**日期**：2026-10-03

---

## 1. 架构全景

```text
┌─────────────────────────────────────────────────────────────────┐
│                       AI 生态层                                  │
│  snail-ui.skill.md   MCP Server   ai-meta.json   llms.txt       │
│  (@snui/ai) 跨端共用，工具按 end=web/mp 过滤                     │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                      文档 / 预览层                                │
│  VitePress docs   StyleSwitcher   ThemeCopier   ComponentPreview │
│  (@snui/docs)     端选择器 + 风格包预览                           │
└──────────┬──────────────────────────────┬────────────────────────┘
           │                              │
┌──────────▼──────────────┐    ┌───────────▼─────────────────────┐
│  Web 端层（PC 桌面）     │    │  uni 端层（移动触屏）            │
│  @snui/vue-web          │    │  @snui/uni                       │
│  @snui/tokens-web       │    │  @snui/tokens-mp                 │
│  --sn-web-*             │    │  --sn-mp-*                       │
│  SnButton / SnForm /    │    │  sn-button / sn-list /           │
│  SnTable / SnTree / ... │    │  sn-grid / sn-pull-refresh /...  │
└──────────┬───────────────┘    └────────────┬────────────────────┘
           │                                │
┌──────────▼──────────────┐    ┌───────────▼─────────────────────┐
│  Style Pack 层（共用）    │    │                                │
│  @snui/style-packs      │ ───┤                                  │
│  Token + 皮肤 CSS + 资源 │    │                                │
│  default / ios / dark / │    │                                │
│  doodle / mp-taobao /   │    │                                │
│  mp-douyin / ...        │    │                                │
└──────────┬───────────────┘    └──────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────────────────┐
│   Token 原始层（@snui/tokens）—— 跨端统一底层                       │
│   --aui-color-* / --aui-spacing-* / --aui-radius-* / ...           │
│   三轴（Theme / Style / Density）独立                              │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. 端独立性原则

**这是 v3.1 架构的第一原则**。每个端从**开发到打包发布完全独立**：

```
@snui/vue-web + @snui/tokens-web       → 独立仓库 / 独立 dist/ 独立 install / 全量分发
@snui/uni     + @snui/tokens-mp        → 独立仓库 / 独立 dist/ 独立 install / 全量分发
@snui/react-web + @snui/tokens-react  → 独立仓库 / 独立 dist/ 独立 install / 全量分发 (未来)

跨端共用：
  - @snui/tokens     （原始 --aui-* 底层定义）
  - @snui/style-packs （风格包描述）
  - @snui/ai          （Skill / MCP Server / ai-meta）
  - @snui/cli         （resolver / llms.txt / token-check / pack-validate）
  - @snui/docs        （文档站）

跨端不共用：
  - 任何组件 .vue 源代码
  - 任何组件测试代码
  - 任何组件库 CSS（含皮肤 CSS）
  - 任何 Token 别名层（@snui/tokens-web ≠ @snui/tokens-mp）
```

**未来扩展（如 React 端）** 完全按相同模式新增：`@snui/react-web` 独立包 + `@snui/tokens-react` 别名层。

---

## 3. 分层说明

### 3.1 Token 原始层（@snui/tokens）

输出 `--aui-*` 原始层。三轴独立（Theme / Style / Density）。**所有端共用**。

```text
Primitive  →  Semantic  →  Component  →  --aui-* CSS 变量
```

### 3.2 Token 别名层（@snui/tokens-web / @snui/tokens-mp / ...）

每个端**独立**包，把 `--aui-*` 映射为端专属别名：

| 端 | 别名层包 | 别名前缀 | 消费端 |
|---|---|---|---|
| Web (PC) | `@snui/tokens-web` | `--sn-web-*` | `@snui/vue-web` |
| uni (移动) | `@snui/tokens-mp` | `--sn-mp-*` | `@snui/uni` |
| React (未来) | `@snui/tokens-react` | `--sn-react-*` | `@snui/react-web` |

每个别名包独立构建产物（`dist/index.css` + `dist/index.js`），独立 npm 发布。

### 3.3 组件实现层（每端独立）

每个端包独立实现组件，**0 行源代码复用**：

| 端 | 包 | 命名 | 路径约定 |
|---|---|---|---|
| Web | `@snui/vue-web` | `Sn{Name}.vue` | `src/{name}/Sn{Name}.vue` |
| uni | `@snui/uni` | `sn-{name}.vue` | `src/components/sn-{name}/sn-{name}.vue` |
| React (未来) | `@snui/react-web` | `Sn{Name}.tsx` | `src/{name}/Sn{Name}.tsx` |

API 风格各自参考对应生态最佳实践（naive-ui / wot-ui / Mantine 等），**不要求跨端同形**。

### 3.4 Style Pack 层（跨端共用）

每个 Style Pack 描述 Token + 皮肤 CSS + 资源三层覆盖。

Pack 通过 `end` 字段标注可用端：

```ts
interface StylePackDefinition {
  name: string
  label: string
  /** 适用端。'web' / 'mp' / 'both'(默认) */
  end?: 'web' | 'mp' | 'both'
  // ... 其他字段
}
```

调用方按 `end` 过滤：

```ts
// Web 端应用 Pack
snCssVars({ end: 'web', theme: pack.theme, style: pack.style })

// uni 端应用 Pack
snCssVars({ end: 'mp', theme: pack.theme, style: pack.style })
```

### 3.5 文档站 / AI 跨端共用

文档站和 `@snui/ai` 都按 `end` 区分内容：

- 文档站：左侧导航分 `Web 组件` 和 `uni-app 组件`
- MCP Server：`list_components({ end: 'web' | 'mp' })` 过滤
- ai-meta.json：components 数组按 `end` 字段分组

---

## 4. 包结构（v3.1）

```
snail-aui/
├── packages/
│   ├── tokens/          # @snui/tokens       — Token 三层级联（统一 --aui-* 底层）
│   ├── tokens-web/      # @snui/tokens-web   — --sn-web-* 别名层（Web 端独立包）
│   ├── tokens-mp/       # @snui/tokens-mp    — --sn-mp-* 别名层（uni 端独立包）
│   ├── vue-web/         # @snui/vue-web      — Web 端组件库（独立包）
│   ├── uni/             # @snui/uni           — 移动端组件库（独立包）
│   ├── style-packs/     # @snui/style-packs   — 跨端共用风格包
│   ├── ai/              # @snui/ai            — 跨端共用 Skill + MCP + ai-meta
│   └── cli/             # @snui/cli           — 跨端共用 resolver + llms.txt + token-check + pack-validate
├── apps/docs/           # VitePress 文档站
├── dev-docs/            # 产品 / 架构 / Spec / WBS
└── .ai/decisions/       # ADR
```

依赖方向：
- `tokens-web` → `tokens`（类型 + 读取）
- `tokens-mp` → `tokens`（类型 + 读取）
- `vue-web` → `tokens-web`（消费 `--sn-web-*`）
- `uni` → `tokens-mp`（消费 `--sn-mp-*`）
- `style-packs` → `tokens`（类型）
- `ai` → `cli` + `tokens` + `style-packs`（读元数据）
- `cli` → `vue-web` + `tokens` + `style-packs`（读元数据 + 校验）

无循环依赖。每个包独立构建产物。

---

## 5. 数据流

### 5.1 用户在 Web 端应用 Pack

```text
@snui/tokens-web snCssVars({ end: 'web', theme, style })
    ↓
输出 :root { --aui-* + --sn-web-* } CSS
    ↓
注入 <style id="snui-pack">
    ↓
@snui/vue-web 组件消费 var(--sn-web-color-action-primary)
    ↓
视觉变化
```

### 5.2 用户在 uni 端应用 Pack

```text
@snui/tokens-mp snCssVars({ end: 'mp', theme, style })
    ↓
输出（小程序：page 级注入）CSS variables
    ↓
ConfigProvider :skin="mp-ios"
    ↓
@snui/uni 组件消费 var(--sn-mp-color-action-primary)
    ↓
视觉变化
```

---

## 6. 包边界规则

| 规则 | 说明 |
|---|---|
| `tokens` 零运行时依赖（统一底层）| 叶子节点 |
| `tokens-web` / `tokens-mp` 只读 `tokens` 类型 + 静态 CSS | 不修改 `tokens` |
| `vue-web` 只通过 `var(--sn-web-*)` 消费 | 不 import `tokens-web` JS |
| `uni` 只通过 `var(--sn-mp-*)` 消费 | 不 import `tokens-mp` JS |
| `style-packs` 只依赖 `tokens` 类型 | 不依赖任何端包 |
| `ai` 跨端共用 | 按 `end` 字段过滤元数据 |
| 禁止跨端组件源代码复用 | 0 行复制 / 0 行 import 跨端组件 |
| 禁止循环依赖 | turbo lint 强制校验 |

---

## 7. 未来扩展模式

新增端时按 v3.1 模式新增独立包：

| 步骤 | 任务 |
|---|---|
| 1 | 新建 `packages/tokens-{end}/`（生成 `--sn-{end}-*` 别名层） |
| 2 | 新建 `packages/{end}/`（组件实现，0 行复用其他端） |
| 3 | 更新 `@snui/style-packs` Pack `end` 字段（如适用） |
| 4 | 更新 `@snui/cli` 公共组件列表（按端） |
| 5 | 更新 `@snui/ai` MCP 工具输出 |
| 6 | 更新 `@snui/docs` 端导航 |

每个新端是**自包含**的，不破坏现有端。

---

## 8. CI 流水线

```text
PR 提交
  ↓
typecheck（turbo run typecheck，每端包独立）
  ↓
lint（turbo run lint，每端包独立）
  ↓
test（turbo run test，每端包独立）
  ↓
build（turbo run build，每端包独立产生 dist/）
  ↓
token check（pnpm snui token check --dir packages/{end}/src）
  ↓
pack validate（如修改 @snui/style-packs）
  ↓
ai-meta generate（每端元数据独立聚合）
  ↓
Review Agent
  ↓
Human Gate（Public API / 端独立性破坏时）
  ↓
merge main
```

---

## 9. 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-09 | Schema-Runtime 三段式（Superseded） |
| v2.0 | 2026-10-03 | Component First（Superseded） |
| v3.0 | 2026-10-03 | Style Pack + AI Layer（Superseded） |
| **v3.1** | 2026-10-03 | **双端独立 + Token 双命名空间 + 端独立性原则（Active）** |