# AUI Master Plan v4.0 — 组件库形态

> ⚠️ **本文档已被 Master Plan v5.0 取代（Superseded by `dev-docs/SNUI-Master-Plan-v5.0.md`）**  
> 请勿再据此做新功能决策。仅用于历史追溯。

**项目**：AUI  
**版本**：v4.0（supersedes v3.0）  
**状态**：Superseded（被 SNUI-Master-Plan-v5.0.md 取代）  
**定位**：AI-Friendly Multi-End UI Component Library  
**架构**：Component First / Token First / DX First

---

## 1. 战略定位

AUI 不再是 v1.x 时代的 "Schema First / Runtime First" 框架，而是**传统 Vue UI 组件库形态**：

```text
Vue 3 (web)  ──→  @snui/vue-web  (naive-ui 风格 API)
uni-app      ──→  @snui/uni      (wot-ui 风格 API, easycom 注册)
                ↓
           @snui/tokens       CSS 变量 token（web + uni 共用）
                ↓
           @snui/cli          unplugin resolver + llms.txt
```

用户写法对比：

```vue
<!-- ❌ v1.x schema-driven（已废弃） -->
<AUI :schema="{ type:'Button', props:{ type:'primary' } }" />

<!-- ✅ v4.0 传统组件库 -->
<SnButton type="primary" @click="submit">提交</SnButton>
```

---

## 2. 里程碑

| 里程碑 | 时间 | 交付 | 状态 |
|---|---|---|---|
| **M0** 架构反转 | 2026-10 | ADR-0001 + PRD v2.0 + 归档旧包 + Button demo | 进行中 |
| **M1** 核心组件 | 2026-11 | P0 + P1 组件全量（~40 个）+ docs 站 + 按需加载 | 规划 |
| **M2** 主题与生态 | 2026-12 | 暗色模式 polish / 国际化 / VS Code 插件 / 模板 starter | 规划 |
| **M3** 长期打磨 | 2027 Q1 | 剩余 P2 组件 / 视觉回归 / 性能优化 | 规划 |

---

## 3. 阶段拆解

### M0 架构反转（当前阶段）

| 任务 | 说明 | 状态 |
|---|---|---|
| AUI-REV-001 | 重写 PRD v2.0 | ✅ |
| AUI-REV-002 | 写架构决策 ADR-0001 | ✅ |
| AUI-ARC-001 | 归档 protocol / runtime / schema / ai 到 `.ai/archive/v1-runtime/` | ✅ |
| AUI-ARC-002 | 重写 `@snui/vue-web` 为组件库（naive-ui 风格） | ✅ |
| AUI-ARC-003 | 重写 `@snui/uni` 为 easycom 组件库（wot-ui 风格） | ✅ |
| AUI-ARC-004 | 强化 `@snui/tokens` 加 `--sn-*` 别名层 + 静态 styles/index.css | ✅ |
| AUI-ARC-005 | 新建 `@snui/cli`（resolver + llms.txt 生成器） | ✅ |
| AUI-ARC-006 | 重写 `apps/docs` 文档站首页 + Button 文档（真实渲染） | ✅ |
| AUI-ARC-007 | 重写 `apps/preview` 为 Vue 3 + Vite demo | ✅ |
| AUI-DEMO-001 | Button 端到端跑通（web + uni + docs） | ✅ |
| AUI-REV-003 | 写 Master Plan v4.0（本文件） | ✅ |

### M1 核心组件（~40 个组件）

按 wot-ui 体系分 6 类：

**基础（10 个）**
- AUI-CORE-001 SnButton / sn-button（✅ 已完成作为 demo）
- AUI-CORE-002 SnIcon / sn-icon
- AUI-CORE-003 SnText
- AUI-CORE-004 SnLayout / sn-row + sn-col
- AUI-CORE-005 SnCell
- AUI-CORE-006 SnTransition
- AUI-CORE-007 SnConfigProvider（web only）
- AUI-CORE-008 SnPopup（uni 端对应 sn-popup）

**导航（6 个）**
- AUI-NAV-001 SnNavbar / sn-navbar
- AUI-NAV-002 SnTabbar / sn-tabbar
- AUI-NAV-003 SnTabs / sn-tabs
- AUI-NAV-004 SnPagination
- AUI-NAV-005 SnBacktop
- AUI-NAV-006 SnTour

**录入（15 个）**
- AUI-FORM-001 SnForm / sn-form
- AUI-FORM-002 SnInput / sn-input
- AUI-FORM-003 SnTextarea
- AUI-FORM-004 SnInputNumber
- AUI-FORM-005 SnSwitch / sn-switch
- AUI-FORM-006 SnCheckbox / sn-checkbox
- AUI-FORM-007 SnRadio / sn-radio
- AUI-FORM-008 SnSlider
- AUI-FORM-009 SnRate
- AUI-FORM-010 SnSearch
- AUI-FORM-011 SnPicker / sn-picker
- AUI-FORM-012 SnCalendar
- AUI-FORM-013 SnDatetimePicker
- AUI-FORM-014 SnUpload
- AUI-FORM-015 SnSignature

**反馈（14 个）**
- AUI-FB-001 SnPopup
- AUI-FB-002 SnDialog / sn-dialog
- AUI-FB-003 SnToast（useToast hook）
- AUI-FB-004 SnNotify（useNotify hook）
- AUI-FB-005 SnLoading
- AUI-FB-006 SnOverlay
- AUI-FB-007 SnActionSheet
- AUI-FB-008 SnDropMenu
- AUI-FB-009 SnPopover
- AUI-FB-010 SnTooltip
- AUI-FB-011 SnProgress
- AUI-FB-012 SnCircle
- AUI-FB-013 SnEmpty
- AUI-FB-014 SnSkeleton

**展示（12 个）**
- AUI-DSP-001 SnAvatar / sn-avatar
- AUI-DSP-002 SnBadge / sn-badge
- AUI-DSP-003 SnTag / sn-tag
- AUI-DSP-004 SnCard / sn-card
- AUI-DSP-005 SnDivider / sn-divider
- AUI-DSP-006 SnGrid
- AUI-DSP-007 SnCollapse
- AUI-DSP-008 SnSteps
- AUI-DSP-009 SnSticky
- AUI-DSP-010 SnImg / sn-img
- AUI-DSP-011 SnImagePreview
- AUI-DSP-012 SnSwiper / sn-swiper

**组合式 API（web 端，5 个）**
- AUI-API-001 useToast
- AUI-API-002 useDialog
- AUI-API-003 useNotify
- AUI-API-004 useCountDown
- AUI-API-005 useImagePreview

### M2 主题与生态

| 任务 | 说明 |
|---|---|
| AUI-THEME-001 | 暗色模式 polish + 主题切换动画 |
| AUI-THEME-002 | 主题持久化（localStorage） |
| AUI-THEME-003 | 主题自定义向导（UI 工具） |
| AUI-INTL-001 | 组件文案国际化（默认 zh-CN） |
| AUI-TOOL-001 | VS Code 插件（SnButton 自动补全） |
| AUI-TOOL-002 | `@snui/cli` 命令行：`pnpm snui docs` / `pnpm snui llms` |
| AUI-STARTER-001 | 模板：`wot-starter` for uni-app |
| AUI-STARTER-002 | 模板：`naive-starter` for Vue 3 |

### M3 长期打磨

- 视觉回归测试
- 性能基准
- 文档站优化
- 完整 type coverage

---

## 4. 治理

- **架构变更**：必须先写 ADR（参考 `.ai/decisions/0001-framework-pivot.md`）
- **Public API**：每个组件必须有 `ai-description.md` + 单测 + tokens 接入
- **Breaking change**：必须主版本号升级（changesets）
- **CI**：typecheck + lint + test + build 全部通过
- **Review**：架构变更走 Human Gate

---

## 5. 反转锁定

ADR-0001 是单向门。Phase 1 之后任何"回滚到 schema-driven"的提议必须由用户提交新 ADR 才能评估。

---

## 6. 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-08 | 初始排期 |
| v2.0 | 2026-09 | 增加 Reactive / Binding / Action 包 |
| v3.0 | 2026-09 | 完整 Phase 1+2 排期（35 任务） |
| v4.0 | 2026-10-03 | 整体推翻，定位改为组件库（ADR-0001） |
