# snail-aui WBS v3.1 — 工作分解结构

**版本**：v3.1（supersedes WBS v3.0）  
**状态**：Active  
**对应**：Master Plan v5.1 / PRD v3.1  
**日期**：2026-10-03

---

## 编号约定

```text
AUI-{模块}-{编号}

模块：
  REV      文档与架构反转
  FOUND    地基任务（M1 前必须完成）
  TOK-WEB  Token 别名层（@snui/tokens-web）
  TOK-MP   Token 别名层（@snui/tokens-mp）
  WEB      Web 端组件（@snui/vue-web）
  MP       uni 端组件（@snui/uni）
  THEME    主题与 Token 原始层
  PACK     Style Pack（跨端共用）
  AI       AI Layer（跨端共用）
  TOOL     CLI / 工具（跨端共用）
  DOCS     文档站（跨端共用）
  CI       CI / 发布
  PERF     性能 / 视觉回归
```

---

## M0 架构反转（✅）

详见 WBS v3.0 历史记录。

---

## M0.5 v3.0 文档基础（✅）

13 个 AUI 相关任务完成（PRD v3.0 / Architecture v3.0 / Spec 5 篇 / Master Plan v5.0 / WBS v3.0 / Dev Guide v3.0 / ADR-0002）。

---

## M0.6 v3.1 文档基础（✅ 本次完成）

| ID | 标题 | 状态 |
|---|---|---|
| AUI-REV-025 | PRD v3.1 — 双端独立 + Token 双命名空间 | ✅ |
| AUI-REV-026 | Architecture v3.1 — 端独立性原则 | ✅ |
| AUI-REV-027 | Spec-01 v1.2 — Token 双别名层 | ✅ |
| AUI-REV-028 | Spec-02 v1.1 — 端独立组件规范 | ✅ |
| AUI-REV-029 | WBS v3.1 — 双端任务拆分 | ✅ |
| AUI-REV-030 | Master Plan v5.1 — 双端里程碑 | ✅ |
| AUI-REV-031 | Dev Guide v3.1 — 端独立开发流程 | ✅ |
| AUI-REV-032 | 文档站首页 / 介绍 / architecture / theme / style-packs / ai 端独立重写 | 🔵 |

---

## M1-FOUND 地基任务（⚠️ M1 组件开始前必须全部完成）

| ID | 标题 | 状态 |
|---|---|---|
| AUI-FOUND-001 | Token 原始层命名对齐（`@snui/tokens` 输出 `--aui-*`）| ✅ |
| AUI-FOUND-002 | ComponentPreview 重建 | ✅ |
| AUI-FOUND-003 | ConfigProvider `skin` prop（web/mp 共用接口）| ✅ |
| AUI-FOUND-004 | 组件根元素 `data-snui-component` 钩子 | ✅ |

新增 v3.1 地基：

| ID | 标题 | 状态 |
|---|---|---|
| AUI-FOUND-005 | 新建 `@snui/tokens-web` 包（生成 `--sn-web-*` 别名层）| 🔵 |
| AUI-FOUND-006 | 新建 `@snui/tokens-mp` 包（生成 `--sn-mp-*` 别名层 + px→rpx 转换）| 🔵 |
| AUI-FOUND-007 | 拆分 `vue-web` 消费 `--sn-web-*`（从 `--sn-*` 切过来）| 🔵 |
| AUI-FOUND-008 | 拆分 `uni` 消费 `--sn-mp-*`（从 `--sn-*` 切过来）| 🔵 |
| AUI-FOUND-009 | `@snui/cli/tokens-check` 升级：按端校验别名前缀（web 不允许 `--sn-mp-*`，反之亦然）| 🔵 |

---

## M1-WEB Web 端组件（PC 桌面）

### 基础（10 个）

| ID | 组件 | 状态 |
|---|---|---|
| AUI-WEB-001 | SnButton | ✅（迁移到 `--sn-web-*`）|
| AUI-WEB-002 | SnIcon | 🔵 |
| AUI-WEB-003 | SnText | 🔵 |
| AUI-WEB-004 | SnLayout（Row / Col）| 🔵 |
| AUI-WEB-005 | SnConfigProvider | ✅ |
| AUI-WEB-006 | SnDivider | 🔵 |
| AUI-WEB-007 | SnDropdown | 🔵（Web 专属）|
| AUI-WEB-008 | SnTooltip | 🔵（Web 专属）|
| AUI-WEB-009 | SnSplitter | 🔵（Web 专属）|
| AUI-WEB-010 | SnLayout（Header / Sider / Content / Footer）| 🔵（Web 专属）|

### 表单（15 个）

| ID | 组件 | 备注 |
|---|---|---|
| AUI-WEB-FORM-001 | SnForm | 通用 |
| AUI-WEB-FORM-002 | SnFormItem | 通用 |
| AUI-WEB-FORM-003 | SnInput | 通用 |
| AUI-WEB-FORM-004 | SnTextarea | Web 端常用 |
| AUI-WEB-FORM-005 | SnInputNumber | 通用 |
| AUI-WEB-FORM-006 | SnSelect | Web 端常用（带搜索）|
| AUI-WEB-FORM-007 | SnCascader | Web 专属 |
| AUI-WEB-FORM-008 | SnTreeSelect | Web 专属 |
| AUI-WEB-FORM-009 | SnDatePicker | Web 专属 |
| AUI-WEB-FORM-010 | SnTimePicker | Web 专属 |
| AUI-WEB-FORM-011 | SnDateRangePicker | Web 专属 |
| AUI-WEB-FORM-012 | SnColorPicker | Web 专属 |
| AUI-WEB-FORM-013 | SnAutoComplete | Web 专属 |
| AUI-WEB-FORM-014 | SnSlider | 通用 |
| AUI-WEB-FORM-015 | SnSwitch | 通用 |
| AUI-WEB-FORM-016 | SnCheckbox / SnRadio | 通用 |

### 数据（10 个）

| ID | 组件 | 备注 |
|---|---|---|
| AUI-WEB-DATA-001 | SnTable | Web 专属（带排序 / 筛选 / 虚拟滚动 / 列固定）|
| AUI-WEB-DATA-002 | SnVirtualList | Web 专属 |
| AUI-WEB-DATA-003 | SnTree | Web 专属 |
| AUI-WEB-DATA-004 | SnDataPicker | Web 专属 |
| AUI-WEB-DATA-005 | SnFilterPanel | Web 专属 |
| AUI-WEB-DATA-006 | SnTransfer | Web 专属 |
| AUI-WEB-DATA-007 | SnDescriptions | Web 专属 |
| AUI-WEB-DATA-008 | SnPagination | 通用 |
| AUI-WEB-DATA-009 | SnEmpty | 通用 |
| AUI-WEB-DATA-010 | SnStatistic | Web 专属 |

### 反馈（8 个）

| ID | 组件 | 备注 |
|---|---|---|
| AUI-WEB-FB-001 | SnDialog | 通用 |
| AUI-WEB-FB-002 | useToast / SnMessageProvider | 通用 |
| AUI-WEB-FB-003 | SnDrawer | Web 专属 |
| AUI-WEB-FB-004 | useNotify / SnNotification | 通用 |
| AUI-WEB-FB-005 | SnPopover | 通用 |
| AUI-WEB-FB-006 | SnLoading | 通用 |
| AUI-WEB-FB-007 | SnSkeleton | 通用 |
| AUI-WEB-FB-008 | SnAlert | Web 专属 |

### 导航（8 个）

| ID | 组件 | 备注 |
|---|---|---|
| AUI-WEB-NAV-001 | SnMenu / SnSubMenu | Web 专属 |
| AUI-WEB-NAV-002 | SnTabs | 通用 |
| AUI-WEB-NAV-003 | SnBreadcrumb | Web 专属 |
| AUI-WEB-NAV-004 | SnSteps | Web 专属 |
| AUI-WEB-NAV-005 | SnSegmented | 通用 |
| AUI-WEB-NAV-006 | SnAffix | Web 专属 |
| AUI-WEB-NAV-007 | SnAnchor | Web 专属 |
| AUI-WEB-NAV-008 | SnBackTop | Web 专属 |

### 布局（5 个）

| ID | 组件 | 备注 |
|---|---|---|
| AUI-WEB-LAYOUT-001 | SnCard | 通用 |
| AUI-WEB-LAYOUT-002 | SnGrid | 通用 |
| AUI-WEB-LAYOUT-003 | SnSpace | Web 专属 |
| AUI-WEB-LAYOUT-004 | SnLayout | Web 专属 |
| AUI-WEB-LAYOUT-005 | SnCollapse | Web 专属 |

---

## M1-MP uni 端组件（移动触屏）

### 基础（8 个）

| ID | 组件 | 状态 |
|---|---|---|
| AUI-MP-001 | sn-button | ✅（迁移到 `--sn-mp-*`）|
| AUI-MP-002 | sn-icon | 🔵 |
| AUI-MP-003 | sn-cell | 🔵（移动端列表行）|
| AUI-MP-004 | sn-config-provider | ✅ |
| AUI-MP-005 | sn-divider | 🔵 |
| AUI-MP-006 | sn-tag | 🔵（移动端常用）|
| AUI-MP-007 | sn-avatar | 🔵（移动端常用）|
| AUI-MP-008 | sn-badge | 🔵（移动端常用）|

### 表单（10 个）

| ID | 组件 | 备注 |
|---|---|---|
| AUI-MP-FORM-001 | sn-form | 通用 |
| AUI-MP-FORM-002 | sn-input | 通用 |
| AUI-MP-FORM-003 | sn-search | mp 常用 |
| AUI-MP-FORM-004 | sn-textarea | mp 常用 |
| AUI-MP-FORM-005 | sn-switch | mp 常用 |
| AUI-MP-FORM-006 | sn-checkbox / sn-radio | 通用 |
| AUI-MP-FORM-007 | sn-stepper | mp 专属 |
| AUI-MP-FORM-008 | sn-picker | mp 专属 |
| AUI-MP-FORM-009 | sn-datetime-picker | mp 专属 |
| AUI-MP-FORM-010 | sn-slider | mp 常用 |

### 反馈（8 个）

| ID | 组件 | 备注 |
|---|---|---|
| AUI-MP-FB-001 | sn-dialog | 通用 |
| AUI-MP-FB-002 | useToast / sn-toast | 通用 |
| AUI-MP-FB-003 | useNotify / sn-notify | 通用 |
| AUI-MP-FB-004 | sn-action-sheet | mp 专属 |
| AUI-MP-FB-005 | sn-loading | 通用 |
| AUI-MP-FB-006 | sn-skeleton | mp 常用 |
| AUI-MP-FB-007 | sn-empty | 通用 |
| AUI-MP-FB-008 | sn-notice-bar | mp 常用 |

### 导航（10 个）

| ID | 组件 | 备注 |
|---|---|---|
| AUI-MP-NAV-001 | sn-navbar | mp 专属 |
| AUI-MP-NAV-002 | sn-tabbar | mp 专属 |
| AUI-MP-NAV-003 | sn-tabs | 通用 |
| AUI-MP-NAV-004 | sn-sidebar | mp 专属 |
| AUI-MP-NAV-005 | sn-index-bar | mp 专属 |
| AUI-MP-NAV-006 | sn-back-top | 通用 |
| AUI-MP-NAV-007 | sn-segmented-control | mp 常用 |
| AUI-MP-NAV-008 | sn-pagination | mp 常用 |
| AUI-MP-NAV-009 | sn-steps | mp 常用 |
| AUI-MP-NAV-010 | sn-anchor | mp 常用 |

### 列表与滚动（12 个）

| ID | 组件 | 备注 |
|---|---|---|
| AUI-MP-LIST-001 | sn-list | mp 专属 |
| AUI-MP-LIST-002 | sn-grid | mp 专属 |
| AUI-MP-LIST-003 | sn-pull-refresh | mp 专属 |
| AUI-MP-LIST-004 | swiper | mp 专属 |
| AUI-MP-LIST-005 | swiper-indicator | mp 专属 |
| AUI-MP-LIST-006 | sticky-tabs | mp 专属 |
| AUI-MP-LIST-007 | lazy-image | mp 专属 |
| AUI-MP-LIST-008 | sn-waterfall | mp 专属 |
| AUI-MP-LIST-009 | sn-infinite-list | mp 专属 |
| AUI-MP-LIST-010 | sn-back-top-listener | mp 常用 |
| AUI-MP-LIST-011 | sn-swipe-action | mp 专属 |
| AUI-MP-LIST-012 | sn-sticky | mp 常用 |

### 业务（5 个）

| ID | 组件 | 备注 |
|---|---|---|
| AUI-MP-BIZ-001 | sn-card | mp 专属 |
| AUI-MP-BIZ-002 | sn-countdown | mp 常用 |
| AUI-MP-BIZ-003 | sn-progress | mp 常用 |
| AUI-MP-BIZ-004 | sn-circle | mp 常用 |
| AUI-MP-BIZ-005 | sn-rate | mp 常用 |

---

## M2 Style Pack + AI Layer（跨端共用）

| ID | 标题 | 状态 |
|---|---|---|
| AUI-PACK-001 | StylePackDefinition 类型 + `end` 字段 | 🔵 |
| AUI-PACK-002 | default Pack（`end: 'both'`）| 🔵 |
| AUI-PACK-003 | dark Pack（`end: 'both'`）| 🔵 |
| AUI-PACK-004 | ios Pack（`end: 'both'`）| 🔵 |
| AUI-PACK-005 | mp-taobao Pack（`end: 'mp'`）| 🔵 |
| AUI-PACK-006 | mp-douyin Pack（`end: 'mp'`）| 🔵 |
| AUI-PACK-007 | pack validate CLI 按 `end` 字段校验 | 🔵 |
| AUI-AI-001 | snail-ui.skill.md（带 `end` 分类）| 🔵 |
| AUI-AI-002 | MCP Server 4 工具按 end 过滤 | 🔵 |
| AUI-AI-003 | ai-meta.json components 按 end 分组 | 🔵 |
| AUI-DOCS-010 | StyleSwitcher 按 end 过滤 Pack | 🔵 |
| AUI-DOCS-011 | ThemeCopier 按 end 生成 snippet | 🔵 |
| AUI-DOCS-012 | StylePackPreview（端专属 Pack）| 🔵 |
| AUI-DOCS-013 | Style Pack 文档页（按 end 列表）| 🔵 |
| AUI-DOCS-014 | AI 生态文档页（端感知）| 🔵 |
| AUI-DOCS-015 | 文档站首页 / 介绍 / architecture / style-packs / ai 端独立重写 | 🔵 |

---

## M3 风格扩展 + 高保真

| ID | 标题 | 状态 |
|---|---|---|
| AUI-PACK-008 | doodle Pack（`end: 'both'`）| 🔵 |
| AUI-PACK-009 | sticky-note Pack（`end: 'both'`）| 🔵 |
| AUI-PACK-010 | wechat Pack（`end: 'mp'`）| 🔵 |
| AUI-AI-004 | render_preview 沙箱实装 | 🔵 |

---

## M4 生态打磨

| ID | 标题 | 状态 |
|---|---|---|
| AUI-EXP-001 | 新增 `@snui/react-web` 端（按 v3.1 端独立模式）| 🔵 |
| AUI-EXP-002 | 新增 `@snui/tokens-react` 别名层 | 🔵 |
| AUI-PERF-001 | 视觉回归（每端独立 screenshot 套件）| 🔵 |
| AUI-PERF-002 | Bundle size 基准（每端独立）| 🔵 |
| AUI-TOOL-001 | VSCode 插件（端感知自动补全）| 🔵 |
| AUI-STARTER-001 | uni-app Starter Template | 🔵 |
| AUI-STARTER-002 | Vue 3 Web Starter Template | 🔵 |

---

## CI 任务

| ID | 标题 | 状态 |
|---|---|---|
| AUI-CI-001 | turbo pipeline（每端独立 typecheck / lint / test / build）| ✅ |
| AUI-CI-002 | changesets 发布流程 | ✅ |
| AUI-CI-003 | pre-commit hook | 🔵 |
| AUI-CI-004 | token-check 按端校验别名前缀 | 🔵（依赖 FOUND-009）|
| AUI-CI-005 | ai-meta.json 自动生成（按端分组）| 🔵 |

---

## 状态图例

```text
✅  已完成（DONE）
🔵  待做（TODO / READY）
🟡  进行中（IN_PROGRESS）
🔴  阻塞（BLOCKED）
```

---

## 变更日志

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-08 | 初始（Schema-Runtime） |
| v2.0 | 2026-10-03 | 重组为组件库形态 |
| v3.0 | 2026-10-03 | 新增 Style Pack + AI Layer 任务 |
| **v3.1** | 2026-10-03 | **Web / uni 端独立任务拆分；新增 `tokens-web` / `tokens-mp` 别名层包；引入未来 React 端扩展路径** |