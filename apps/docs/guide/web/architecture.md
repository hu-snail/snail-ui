# 架构

snail-aui 由 6 个 npm 包组成。组件库底座（tokens / vue-web / uni）+ 风格包（style-packs）+ AI 层（ai）+ CLI 工具 + 文档站。包之间单向依赖，无循环。

## 整体架构

```text
┌─────────────────────────────────────────────────────────────────┐
│                       AI 生态层                                  │
│  snail-ui.skill.md   MCP Server   ai-meta.json   llms.txt       │
│  (@snui/ai)                         (@snui/cli)                   │
└─────────────────────┬───────────────────────────────────────────┘
                      │ 读取元数据
┌─────────────────────▼───────────────────────────────────────────┐
│                      文档 / 预览层                                │
│  VitePress docs   StyleSwitcher   ThemeCopier   ComponentPreview │
│  (@snui/docs)     — Web: body.class + <style>                    │
│                   — uni: ConfigProvider skin prop                 │
└──────────┬──────────────────────────────┬────────────────────────┘
           │ import 组件                   │ 读取 Pack
┌──────────▼──────────┐       ┌───────────▼──────────────────────┐
│    组件实现层          │       │         Style Pack 层            │
│  @snui/vue-web        │       │  @snui/style-packs              │
│  @snui/uni            │       │                                  │
│                       │       │  Token + 皮肤 CSS + 资源          │
│  SnButton /           │       │  default / ios / dark /          │
│  SnConfigProvider     │       │  doodle / sticky-note /          │
│  每个组件根元素带      │       │  taobao / douyin                │
│  data-snui-component  │       │                                  │
└──────────┬────────────┘       └──────────────────────────────────┘
           │ 消费 var(--sn-*)
┌──────────▼──────────────────────────────────────────────────────┐
│                      Token 层（@snui/tokens）                    │
│                                                                  │
│  Primitive  →  Semantic  →  Component                           │
│  颜色/间距     action-primary   button-radius                    │
│  圆角/阴影     text-secondary   card-shadow                      │
│                                input-height                      │
│                                                                  │
│  Theme 轴（颜色）   Style 轴（形状）   Density 轴（尺寸间距）     │
│  CSS 变量生成：--aui-* 原始层 + --sn-* 品牌别名层                 │
└──────────────────────────────────────────────────────────────────┘
```

## 包清单

| 包 | 角色 | 依赖 |
|---|---|---|
| `@snui/tokens` | Token 三层级联 + 解析 | （叶子，零依赖） |
| `@snui/vue-web` | Web 端组件库 | `@snui/tokens` |
| `@snui/uni` | uni-app 端组件库 | `@snui/tokens` |
| `@snui/style-packs` | 官方风格包集合 | `@snui/tokens`（类型） |
| `@snui/ai` | Skill + MCP + ai-meta | `@snui/cli` + `@snui/tokens` + `@snui/style-packs` |
| `@snui/cli` | resolver + llms.txt + token-check | `@snui/vue-web` + `@snui/tokens` |
| `@snui/docs` | VitePress 文档站 | `vue-web` + `uni` + `style-packs` + `ai` |

无循环依赖。

## 三层 Token

```text
Primitive Tokens   原始值，无语义意义（颜色 / 间距 / 圆角 / 阴影 / 字号 / 动效 / 尺寸）
      ↓
Semantic Tokens    语义名，指向 Primitive 的 CSS var 引用（action-primary / text-primary）
      ↓
Component Tokens   组件级（button-radius / card-shadow / input-height-medium）
      ↓
--sn-* 别名层       品牌别名，组件实际消费（唯一消费入口）
```

**唯一消费规则**：组件 CSS 只能用 `var(--sn-*)` 变量。兜底值只允许 `transparent` / `inherit` / `currentColor`。

## 三轴独立

| 轴 | 改什么 | 禁止覆盖 |
|---|---|---|
| Theme | 颜色（Primitive + Semantic） | 圆角、间距、尺寸 |
| Style | 圆角 + 阴影 + Component Token | 颜色、间距、字号 |
| Density | 间距 + 尺寸 + 字号 | 颜色、圆角 |

三轴修改互不影响。Style Pack 实际是三个轴的组合配置。

## Style Pack 三层

| 层 | 内容 | 必需 |
|---|---|---|
| Token 层 | 颜色 / 圆角 / 间距覆盖（snCssVars()）| 所有 Pack |
| 皮肤 CSS 层 | .snui-skin-{name} 作用域 CSS（字体 / 装饰 / 特效） | 仅需视觉人格的 Pack（涂鸦 / 抖音） |
| 资源层 | 字体 / 纹理 / SVG | 少数 Pack（抖音 / Taobao） |

**硬约束**：皮肤 CSS 只能操作视觉层（颜色、阴影、字体、动画、伪元素），不能修改组件 .vue 的 DOM / Props / 行为。

## uni / 小程序平台差异

| 能力 | Web 端 | uni H5 | 微信 / 支付宝小程序 |
|---|---|---|---|
| `:root {}` CSS 变量 | ✅ | ✅ | ❌（只支持 page / 组件级） |
| `[data-theme="dark"]` | ✅ | ✅ | ❌ |
| `document.body.classList` | ✅ | ✅（H5）| ❌ |
| 动态注入 `<style>` | ✅ | ✅（H5）| ❌ |
| 皮肤 CSS（BEM class）| ✅ | ✅ | ✅（组件 scoped 级别） |

**小程序皮肤策略**：ConfigProvider 根元素 class 传递 → 组件 scoped CSS 内声明 `.snui-skin-{name}` 覆盖 → 覆盖范围局限于 ConfigProvider 的 DOM 子树。

## 包边界规则

- tokens 零运行时依赖（叶子节点）
- style-packs 只依赖 Token 类型，不依赖运行时
- vue-web / uni 只通过 CSS 变量消费 Token，不 import JS
- ai 不修改 vue-web / uni，只读元数据
- 皮肤 CSS 不修改组件 .vue（只看 data-snui-component 钩子）
- 禁止循环依赖（turbo lint 强制）

## 数据流：用户在文档站切换风格

```text
点击 StyleSwitcher → 选择 "ios" Pack
    ↓
注入 Token 层：snCssVars(pack) → <style id="snui-pack"> 替换 :root 变量
    ↓
激活皮肤：document.body.classList.add('snui-skin-ios')
    ↓
加载皮肤 CSS（如有）：<link id="snui-skin" href="/packs/ios.skin.css">
    ↓
组件 CSS：
  - 颜色/圆角/间距 → Token 层生效
  - 手写字体/偏移阴影 → 皮肤 CSS 生效（.snui-skin-ios [data-snui-component="button"]）
    ↓
ThemeCopier 展示对应代码片段，用户复制
```

## CI 流水线

```text
PR 提交
  ↓
typecheck（turbo run typecheck，0 error）
  ↓
lint（turbo run lint，0 warning）
  ↓
test（turbo run test，100% pass）
  ↓
build（turbo run build，0 error）
  ↓
token check（snui token check，无字面量颜色兜底）
  ↓
pack validate（新增/修改 Pack 时）
  ↓
Review Agent（§88 Checklist）
  ↓
Human Gate（架构变更 / Public API 变更）
  ↓
merge main
```

## 下一步

- [主题与 Token](/theme/overview)
- [风格包](/style-packs/overview)
- [AI 生态](/ai/overview)