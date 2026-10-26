# Spec-01：Token 系统与 Style Pack 规范

**版本**：v1.2  
**状态**：Active（supersedes v1.1）  
**对应**：PRD v3.1 / ADR-0002  
**日期**：2026-10-03

---

## 1. Token 三层级联（@snui/tokens，统一底层）

```text
Primitive Tokens   原始设计值，无语义
              ──  @snui/tokens 输出
              ↓
Semantic Tokens    语义名 → Primitive CSS 变量引用
              ↓
Component Tokens   组件级
              ↓
--aui-* CSS 变量  原始层（跨端统一）

              ┌─────────────────────────┐
              │ @snui/tokens-web          │
              │   --sn-web-button-radius  │
              │     → var(--aui-button-radius) │
              ├─────────────────────────┤
              │ @snui/tokens-mp           │
              │   --sn-mp-button-radius   │
              │     → var(--aui-button-radius) │
              └─────────────────────────┘
```

**关键变更**：v3.1 在统一底层之上增加两个独立别名层包，按端区分。

---

## 2. 端别名层包（v3.1 新增）

### 2.1 设计

```text
@snui/tokens   --aui-button-radius: 6px        (统一底层)
   │
   ├─→ @snui/tokens-web   --sn-web-button-radius: var(--aui-button-radius)   (Web 独立 dist)
   │
   └─→ @snui/tokens-mp    --sn-mp-button-radius: var(--aui-button-radius)    (uni 独立 dist)
```

### 2.2 包结构

```text
packages/tokens-web/
├── src/
│   ├── index.ts        # 生成 --sn-web-* 别名层的工具函数
│   └── variables.ts    # 显式列出所有 --sn-web-* 别名映射
├── styles/
│   └── index.css       # @snui/vue-web 消费入口：import '@snui/tokens-web/styles'
├── package.json
└── tsconfig.json

packages/tokens-mp/
├── src/
│   ├── index.ts        # 生成 --sn-mp-* 别名层
│   └── variables.ts
├── styles/
│   └── index.css       # @snui/uni 消费入口：import '@snui/tokens-mp/styles'
├── package.json
└── tsconfig.json
```

### 2.3 别名映射表（每个端独立维护）

**`tokens-web/src/variables.ts`**：

```ts
export const snWebAliasMap: ReadonlyArray<[string, string]> = [
  // ['--sn-web-button-radius', '--aui-button-radius'],
  // ['--sn-web-button-height-medium', '--aui-button-height-medium'],
  // ...
]

export function renderSnWebStyles(): string {
  return snWebAliasMap.map(([a, b]) => `  ${a}: var(${b});`).join('\n')
}
```

**`tokens-mp/src/variables.ts`**：

```ts
export const snMpAliasMap: ReadonlyArray<[string, string]> = [
  // ['--sn-mp-button-radius', '--aui-button-radius'],
  // ['--sn-mp-button-height-medium', '--aui-button-height-medium'],
  // 注意：rpx 单位的 token 会在这里做 px → rpx 转换
  // ...
]
```

### 2.4 rpx 转换（仅 tokens-mp）

移动端使用 `rpx` 单位。tokens-mp 在生成别名时把 px 值转为 rpx：

```ts
// 示例：--aui-button-height-medium: 36px → --sn-mp-button-height-medium: 72rpx
// 转换规则：rpx = (px / 375) * 750 (假设设计稿 375 宽)
// 实际工程化由 tokens-mp 内部处理
```

---

## 3. 三层级联

```text
Primitive Tokens   原始值，无语义（颜色 / 间距 / 圆角 / 阴影 / 字号 / 动效 / 尺寸）
      ↓
Semantic Tokens    语义名 → Primitive CSS 变量引用（action-primary / text-primary）
      ↓
Component Tokens   组件级（button-radius / card-shadow / input-height-medium）
      ↓
--aui-* 原始层     跨端统一
      ↓
--sn-{end}-* 别名层  按端独立消费入口
```

**唯一消费规则**：

- `@snui/vue-web` 组件只能用 `var(--sn-web-*)`
- `@snui/uni` 组件只能用 `var(--sn-mp-*)`
- 兜底值只允许 `transparent` / `inherit` / `currentColor`

### 三轴独立

| 轴 | 改什么 | 禁止 |
|---|---|---|
| Theme | 颜色（Primitive + Semantic）| 圆角、间距、尺寸 |
| Style | 圆角 + 阴影 + Component Token | 颜色、间距、字号 |
| Density | 间距 + 尺寸 + 字号 | 颜色、圆角 |

---

## 4. 端独立的 ComponentToken 字段

按端可能有不同字段：

| 字段 | Web（`--sn-web-*`） | uni（`--sn-mp-*`） |
|---|---|---|
| button-radius | ✅ | ✅ |
| button-height-medium | ✅ 36px | ✅ 72rpx |
| table-row-height | ✅ | ❌ |
| list-item-height | ❌ | ✅ 88rpx |
| dropdown-item-padding | ✅ 8px 16px | ❌ |
| sidebar-item-height | ❌ | ✅ 100rpx |

每个端独立维护各自的 ComponentToken 字段映射，互不影响。

---

## 5. Style Pack 系统（跨端共用）

### 5.1 StylePackDefinition 接口（带 end 字段）

```ts
export interface StylePackDefinition {
  name: string          // kebab-case 唯一标识
  label: string         // 用户可见显示名
  description?: string
  /** 适用端。默认 'both'（两端都可用） */
  end?: 'web' | 'mp' | 'both'

  // Token 层（端无关）
  theme?: ThemeDefinition
  style: StyleDefinition
  density?: DensityDefinition

  // 皮肤 CSS 层（端无关，但应用时按 end 注入）
  skinCss?: string

  // 资源层
  resources?: ReadonlyArray<string>

  previewImage?: string
}
```

### 5.2 端专属 Pack 示例

```ts
// mp-taobao（仅移动端可用）
export const mpTaobaoPack: StylePackDefinition = {
  name: 'mp-taobao',
  label: '淘宝风格（移动）',
  description: '橙红主色，圆润圆角，密集布局，适合电商 App',
  end: 'mp',  // ← 仅移动端
  theme: { /* ... */ },
  style: { /* ... */ },
  skinCss: '/packs/mp-taobao.skin.css',
}
```

```ts
// mp-douyin（仅移动端）
export const mpDouyinPack: StylePackDefinition = {
  name: 'mp-douyin',
  label: '抖音风格（移动）',
  description: '深色底，红青主色，霓虹 glow',
  end: 'mp',
  // ...
}
```

跨端共用 Pack（两端都用）：

```ts
export const defaultPack: StylePackDefinition = {
  name: 'default',
  end: 'both',  // 默认值，可省略
  // ...
}
```

---

## 6. 应用 Style Pack（按端）

```ts
import { snCssVars } from '@snui/tokens'

// Web 端应用
const css = snCssVars({
  end: 'web',
  theme: pack.theme,
  style: pack.style,
  density: pack.density,
})

// uni 端应用
const css = snCssVars({
  end: 'mp',
  theme: pack.theme,
  style: pack.style,
  density: pack.density,
})
```

`snCssVars()` 内部按 `end` 选择输出 `--sn-web-*` 或 `--sn-mp-*` 别名层（实际由 tokens-web / tokens-mp 的 CSS 文件负责，js 函数只生成 `--aui-*` 原始层 + 端无关的 alias 选择）。

---

## 7. 文档站 / AI 端感知

| 模块 | Web 处理 | uni 处理 |
|---|---|---|
| 文档站左侧导航 | "Web 组件" 分组 | "uni-app 组件" 分组 |
| 文档站 StyleSwitcher | 列出 `end: 'web' \| 'both'` 的 Pack | 列出 `end: 'mp' \| 'both'` 的 Pack |
| MCP `list_components` | `end: 'web'` 返回 SnButton / SnTable / ... | `end: 'mp'` 返回 sn-button / sn-list / ... |
| MCP `get_style_pack` | 验证 `pack.end` 包含 'web' | 验证 `pack.end` 包含 'mp' |
| ai-meta.json | components 分组 `web: [...]` / `mp: [...]` | 同 |

---

## 8. 未来扩展（React 端）

完全按 v3.1 模式：

1. 新建 `packages/tokens-react/` —— 生成 `--sn-react-*` 别名层
2. 新建 `packages/react-web/` —— React 组件实现
3. 更新 `@snui/style-packs` Pack `end` 字段（如果 Pack 也支持 React）
4. 更新 `@snui/cli` 公共组件列表
6. 更新 `@snui/docs` 端导航（加 "React 组件" 分组）

**未来端与现有端 0 行源代码复用**。

---

## 9. 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-10-03 | 初始（Style Pack = Token only） |
| v1.1 | 2026-10-03 | Style Pack = Token + 皮肤 CSS + 资源三层 |
| **v1.2** | 2026-10-03 | **双端独立 + 双 Token 别名层 + end 字段（Active）** |