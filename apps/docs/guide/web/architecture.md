# 架构

snail-aui v3.1 是端独立的 AI-Native UI 框架生态。Web（PC）和 uni（移动）从开发到打包发布完全独立，0 行源代码跨端复用。Style Pack / AI Layer / docs 跨端共用，按 `end` 区分内容。

## 双端独立架构

```text
┌──────────────────────────────────────────────────────────────────────┐
│  AI 生态层（跨端共用，按 end 过滤）                                       │
│  snail-ui.skill.md   MCP Server   ai-meta.json   llms.txt               │
│  (@snui/ai)                                                                │
└────────────┬──────────────────────────────────────────┬───────────────┘
             │                                          │
┌────────────▼──────────────┐            ┌───────────▼────────────────┐
│  Web 端层（桌面）                  │            │  uni 端层（移动）              │
│                               │            │                          │
│  @snui/vue-web              │            │  @snui/uni                 │
│    SnButton / SnForm /      │            │    sn-button / sn-list /  │
│    SnTable / SnTree / ...   │            │    sn-grid / sn-pull-...   │
│      ↓                       │            │      ↓                     │
│  @snui/tokens-web           │            │  @snui/tokens-mp          │
│    --sn-web-color-action-    │            │    --sn-mp-color-action-   │
│    primary  → --aui-color-  │            │    primary  → --aui-color- │
│    action-primary           │            │    action-primary          │
└─────────────┬──────────────┘            └──────────────┬───────────────┘
              │                                        │
              └────────────────┬───────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────────┐
│  Style Pack 层（跨端共用，按 end 过滤）                                     │
│  @snui/style-packs   default(both) / dark(both) / ios(both) /          │
│                      mp-taobao(mp) / mp-douyin(mp)                      │
│      ↓                                                                   │
│  @snui/tokens         统一底层 --aui-* 原始层                          │
│  Primitive  →  Semantic  →  Component  →  --aui-*                     │
│                       (Theme / Style / Density 三轴独立)                │
└──────────────────────────────────────────────────────────────────────┘
```

## 包结构

| 包 | 角色 | 端 |
|---|---|---|
| `@snui/tokens` | 统一 Token 三层级联，输出 `--aui-*` | 跨端共用底层 |
| `@snui/tokens-web` | `--sn-web-*` 别名层 | Web 独立包 |
| `@snui/tokens-mp` | `--sn-mp-*` 别名层（含 px→rpx 转换）| uni 独立包 |
| `@snui/vue-web` | Web 端组件库（SnButton / SnTable / ...）| Web 端独立 |
| `@snui/uni` | uni 端组件库（sn-button / sn-list / ...）| uni 端独立 |
| `@snui/style-packs` | 风格包描述（含 `end` 字段）| 跨端共用 |
| `@snui/ai` | Skill + MCP + ai-meta | 跨端共用 |
| `@snui/cli` | resolver + llms.txt + token-check + pack-validate | 跨端共用 |
| `@snui/docs` | VitePress 文档站 | 跨端共用 |

## 端独立性原则（v3.1 最高优先级）

> 每个端从开发到打包发布**完全独立**。

- 独立源代码目录（`packages/vue-web/` / `packages/uni/`）
- 独立构建产物（`dist/`）和独立 npm 包发布
- 独立 TypeScript 类型（`.d.ts`）
- 独立 Token 别名（`@snui/tokens-web` ≠ `@snui/tokens-mp`）
- **跨端 0 行源代码复用**
- 跨端共用层仅限元数据 + 工具（tokens / style-packs / ai / cli / docs）

未来扩展新端（React、Flutter、...）按相同模式：

```
@snui/tokens-{end}/   --sn-{end}-* 别名层
@snui/{end}/          端组件实现（0 行复用）
```

## 三层 Token（统一底层 @snui/tokens）

```text
Primitive  →  Semantic  →  Component  →  --aui-* 原始层
原始值          语义名          组件级          跨端统一
                       ↓
        ┌─────────────────┴──────────────────┐
        ↓                                    ↓
@snui/tokens-web              @snui/tokens-mp
--sn-web-* 别名层            --sn-mp-* 别名层 (含 rpx 转换)
        ↓                                    ↓
   @snui/vue-web                       @snui/uni
   Web 端组件消费                       uni 端组件消费
```

## 双端 Component Token 字段差异

不同端有不同的 Component Token 字段，按场景独立：

| 字段 | Web（`--sn-web-*`）| uni（`--sn-mp-*`）|
|---|---|---|
| button-radius | ✅ 6px | ✅ 24rpx |
| button-height-medium | ✅ 36px | ✅ 72rpx |
| table-row-height | ✅ 32px | ❌ |
| list-item-height | ❌ | ✅ 88rpx |
| sidebar-item-height | ❌ | ✅ 100rpx |
| dropdown-item-padding | ✅ 8px 16px | ❌ |

`tokens-web` 和 `tokens-mp` 各自独立维护字段映射，互不影响。

## 三轴独立

| 轴 | 改什么 | 禁止 |
|---|---|---|
| Theme | 颜色 | 圆角、间距、尺寸 |
| Style | 圆角 + 阴影 + Component Token | 颜色、间距、字号 |
| Density | 间距 + 尺寸 + 字号 | 颜色、圆角 |

Style Pack 是 Theme + Style + Density 的组合。

## Style Pack 三层

| 层 | 内容 | 必需 |
|---|---|---|
| Token | 颜色 / 圆角 / 间距覆盖（snCssVars()）| ✅ 所有 Pack |
| Skin CSS | `.snui-skin-{name}` 作用域 CSS | 仅需视觉人格的 Pack |
| Resources | 字体 / 纹理 | 少数 Pack |

皮肤 CSS 不能修改组件 .vue / Props / 行为，只能操作视觉层。

## uni / 小程序平台差异

| 能力 | Web | uni H5 | 微信 / 支付宝小程序 |
|---|---|---|---|
| `:root {}` CSS 变量 | ✅ | ✅ | ❌（只支持 page / 组件级）|
| `[data-theme="dark"]` | ✅ | ✅ | ❌ |
| `document.body.classList` | ✅ | ✅（H5）| ❌ |
| 动态注入 `<style>` | ✅ | ✅（H5）| ❌ |
| Skin CSS (BEM class) | ✅ | ✅ | ✅（组件 scoped 级别）|

小程序走 `ConfigProvider` 根元素 class 传递 + 组件 scoped CSS 覆盖。

## 端独立性技术实现

```ts
// tokens-web/src/variables.ts (Web 端别名映射)
export const snWebAliasMap = [
  ['--sn-web-color-action-primary', '--aui-color-action-primary'],
  // ...
]

// tokens-mp/src/variables.ts (uni 端别名映射，含 rpx 转换)
export const snMpAliasMap = [
  ['--sn-mp-color-action-primary', '--aui-color-action-primary'],
  // 注意：px 自动转 rpx
  // ...
]
```

组件消费：

```css
/* Web 端 */
.sn-button { background: var(--sn-web-color-action-primary); }

/* uni 端 */
.sn-button { background: var(--sn-mp-color-action-primary); }
```

## 跨端共用层

| 跨端共用 | 怎么按端过滤 |
|---|---|
| `@snui/style-packs` | Pack 的 `end: 'web' \| 'mp' \| 'both'` 字段 |
| `@snui/ai` Skill 文件 | 按端列组件清单 |
| `@snui/ai` MCP `list_components` | 输入 `end` 字段 |
| `@snui/ai` ai-meta.json | components 数组按 end 分组 |
| `@snui/docs` 文档站 | 导航按 Web / uni 分组 |

## CI 流水线

```text
PR 提交
  ↓
typecheck（每端包独立）
  ↓
lint（每端包独立）
  ↓
test（每端包独立）
  ↓
build（每端包独立产出 dist/）
  ↓
token check（每端独立，验证 --sn-{end}-* 别名前缀正确性）
  ↓
pack validate（跨端 Pack 合法性）
  ↓
ai-meta generate（按端分组）
  ↓
Review Agent
  ↓
Human Gate（端独立性破坏 / Public API 变更）
  ↓
merge main
```

## 下一步

- [Web 端架构详情](#) — 详见各 Spec
- [Token 级联](/theme/cascade)
- [风格包](/style-packs/overview)
- [AI 生态](/ai/overview)