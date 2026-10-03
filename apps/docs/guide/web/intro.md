# 介绍

snail-aui v3.1 是面向 **Vue 3（Web 端，PC 桌面）** + **uni-app（移动端，触屏）** 的 AI-Native UI 框架生态。

**最关键的设计原则：端独立**。

> Web 端（PC）和 uni 端（移动）从开发到打包发布**完全独立**。  
> 每端独立源代码、独立构建、独立 npm 包、独立 Token 别名。  
> **跨端 0 行源代码复用**。

未来新增端（React、Flutter、...）按相同模式扩展：`@snui/tokens-{end}` 别名层 + `@snui/{end}` 独立组件包。

## 两端差异

| 维度 | Web 端（PC 桌面） | uni 端（移动触屏） |
|---|---|---|
| 典型应用 | 管理后台、CRM、ERP、IDE-like、低代码平台 | 邮箱/内容/O2O、企业 App |
| 操作方式 | 鼠标 + 键盘 | 触屏 + 手势 |
| 分辨率 | 1280×720+，自适应 4K | 320-414 宽优先 |
| 组件清单 | 信息密度型（Table / Tree / Pagination / Cascader / DatePicker ...） | 流式布局型（List / PullRefresh / swiper / sticky-tabs / lazy-image ...） |
| 命名空间 | SnButton / SnForm / SnTable ... | sn-button / sn-list / sn-grid ... |
| Token 别名 | `var(--sn-web-*)` | `var(--sn-mp-*)` |
| 尺寸单位 | px | rpx（自动转换）|
| API 风格 | naive-ui 风格（配置驱动） | wot-ui 风格（事件驱动） |

**少量共享**：Button / ConfigProvider / Icon 是两端的最低公约数组件。

## 跨端共用层

| 共用 | 怎么区分端 |
|---|---|
| `@snui/tokens` 统一底层 | 输出 `--aui-*` 原始层（端无关）|
| `@snui/style-packs` | 每个 Pack 标注 `end: web / mp / both` |
| `@snui/ai` Skill + MCP | 工具输出按 `end` 过滤 |
| `@snui/ai` ai-meta.json | components 数组按 end 分组 |
| `@snui/cli` | resolver 按端、token-check 按端 |
| `@snui/docs` | 左侧导航 Web / uni 两个分组 |

## 30 秒看懂

```text
@snui/tokens         --aui-* 原始层（端无关）
        ↑              ↑
   ┌────┴─────┐    ┌────┴──────┐
   │         │    │          │
@snui/tokens-web  @snui/tokens-mp
--sn-web-* 别名    --sn-mp-* 别名（含 rpx 转换）
   ↑                     ↑
@snui/vue-web         @snui/uni
SnButton / SnTable    sn-button / sn-list / sn-pull-refresh
（独立桌面分支）         （独立移动分支）

跨端共用（无关）：
   @snui/style-packs   @snui/ai   @snui/cli   @snui/docs
```

## Style Pack / AI 与端的关系

- Style Pack **跨端共用**，但每个 Pack 标注 `end: web / mp / both` 字段
- 应用 Style Pack 时调用 `snCssVars({ end: 'web' | 'mp', theme, style })` —— `end` 决定输出 `--sn-web-*` 还是 `--sn-mp-*`
- AI 工具（Skill / ai-meta）按端分类组件清单
- MCP `list_components({ end })` 按端过滤

## 已交付

- **M0**：架构反转 + Button demo ✅
- **M0.5**：ADR-0002（Style Pack + AI Layer）✅
- **M0.6**：ADR-0003（端独立拆分 + Token 双别名）✅ —— 本次 PRD v3.1 / Spec-01~02 / WBS v3.1 / Master Plan v5.1 / Dev Guide v3.1
- **M1（下一步）**：`@snui/tokens-web` / `@snui/tokens-mp` 别名层 + 每端第一批 ~10 个组件
- **M2**：Style Pack（默认 3 + mp 端 2）+ AI Layer + StyleSwitcher / ThemeCopier
- **M3**：doodle / sticky-note / wechat Pack + render_preview 沙箱
- **M4**：React 端扩展（按相同模式）+ VSCode 插件 + 视觉回归

## 下一步

- [Web 端快速开始](/guide/web/quick-start)
- [uni-app 端快速开始](/guide/uni/quick-start)
- [架构](/guide/web/architecture)
- [主题与 Token](/theme/overview)
- [风格包](/style-packs/overview)
- [AI 生态](/ai/overview)