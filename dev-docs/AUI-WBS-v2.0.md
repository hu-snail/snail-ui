# AUI WBS v2.0 — 工作分解结构

> ⚠️ **本文档已被 WBS v3.0 取代（Superseded by `dev-docs/SNUI-WBS-v3.0.md`）**  
> 请勿再据此认领 Task ID。仅用于历史追溯。

**项目**：AUI  
**版本**：v2.0（supersedes v1.0）  
**状态**：Superseded（被 SNUI-WBS-v3.0.md 取代）  
**对应**：Master Plan v4.0

---

## 编号约定

```text
AUI-{模块}-{编号}

模块：
  REV  架构反转
  ARC  架构 / 包骨架
  DEMO 端到端 demo
  CORE 基础组件
  NAV  导航组件
  FORM 录入组件
  FB   反馈组件
  DSP  展示组件
  API  组合式 API
  THEME 主题与 token
  INTL 国际化
  TOOL CLI / 工具
  STARTER 模板脚手架
  DOCS 文档站
  CLI  CLI 包
  PREV preview 应用
  CI   CI / 发布
```

---

## M0 架构反转（已完成）

| ID | 标题 | 类型 | 包 | 状态 |
|---|---|---|---|---|
| AUI-REV-001 | 重写 PRD v2.0 | 文档 | dev-docs/ | ✅ |
| AUI-REV-002 | 写架构决策 ADR-0001 | 文档 | .ai/decisions/ | ✅ |
| AUI-REV-003 | 写 Master Plan v4.0 | 文档 | dev-docs/ | ✅ |
| AUI-REV-004 | 写 WBS v2.0 | 文档 | dev-docs/ | ✅ |
| AUI-ARC-001 | 归档 v1.x 包 | git mv | packages/ → .ai/archive/v1-runtime/ | ✅ |
| AUI-ARC-002 | 重写 @snui/vue-web | 包 | packages/vue-web/ | ✅ |
| AUI-ARC-003 | 重写 @snui/uni | 包 | packages/uni/ | ✅ |
| AUI-ARC-004 | 强化 @snui/tokens | 包 | packages/tokens/ | ✅ |
| AUI-ARC-005 | 新建 @snui/cli | 包 | packages/cli/ | ✅ |
| AUI-ARC-006 | 重写 docs 首页 | 文档 | apps/docs/ | ✅ |
| AUI-ARC-007 | 重写 preview | 应用 | apps/preview/ | ✅ |
| AUI-DEMO-001 | Button 端到端 demo | 组件 | web + uni + docs | ✅ |
| AUI-CLI-001 | unplugin resolver 实现 | 工具 | packages/cli/ | ✅ |
| AUI-CLI-002 | llms.txt 生成器 | 工具 | packages/cli/ | ✅ |
| AUI-DOCS-001 | web Button 文档页 | 文档 | apps/docs/components/web/button.md | ✅ |
| AUI-DOCS-002 | uni Button 文档页 | 文档 | apps/docs/components/uni/button.md | ✅ |
| AUI-DOCS-003 | web Quick Start | 文档 | apps/docs/guide/web/quick-start.md | ✅ |
| AUI-DOCS-004 | uni Quick Start | 文档 | apps/docs/guide/uni/quick-start.md | ✅ |
| AUI-PREV-001 | preview Vue 3 + Vite 接入 | 应用 | apps/preview/ | ✅ |

---

## M1 核心组件

### 基础组件（CORE）

| ID | 组件 | web 文件 | uni 文件 | 说明 |
|---|---|---|---|---|
| AUI-CORE-001 | Button | ✅ SnButton.vue | ✅ sn-button.vue | DEMO 已完成 |
| AUI-CORE-002 | Icon | SnIcon.vue | sn-icon.vue | name / size / color |
| AUI-CORE-003 | Text | SnText.vue | — | type / size / ellipsis |
| AUI-CORE-004 | Layout | SnRow.vue / SnCol.vue | sn-row / sn-col | flex 布局 |
| AUI-CORE-005 | Cell | SnCell.vue | sn-cell | title / value / arrow |
| AUI-CORE-006 | Transition | SnTransition.vue | — | fade / slide / zoom |
| AUI-CORE-007 | ConfigProvider | SnConfigProvider.vue | — | 全局配置 |
| AUI-CORE-008 | Popup | SnPopup.vue | sn-popup | 弹出层 |

### 导航组件（NAV）

| ID | 组件 | web 文件 | uni 文件 |
|---|---|---|---|
| AUI-NAV-001 | Navbar | SnNavbar.vue | sn-navbar |
| AUI-NAV-002 | Tabbar | SnTabbar.vue | sn-tabbar |
| AUI-NAV-003 | Tabs | SnTabs.vue | sn-tabs |
| AUI-NAV-004 | Pagination | SnPagination.vue | sn-pagination |
| AUI-NAV-005 | Backtop | SnBacktop.vue | sn-backtop |
| AUI-NAV-006 | Tour | SnTour.vue | sn-tour |

### 录入组件（FORM）

| ID | 组件 | web 文件 | uni 文件 |
|---|---|---|---|
| AUI-FORM-001 | Form | SnForm.vue | sn-form |
| AUI-FORM-002 | Input | SnInput.vue | sn-input |
| AUI-FORM-003 | Textarea | SnTextarea.vue | sn-textarea |
| AUI-FORM-004 | InputNumber | SnInputNumber.vue | sn-input-number |
| AUI-FORM-005 | Switch | SnSwitch.vue | sn-switch |
| AUI-FORM-006 | Checkbox | SnCheckbox.vue | sn-checkbox |
| AUI-FORM-007 | Radio | SnRadio.vue | sn-radio |
| AUI-FORM-008 | Slider | SnSlider.vue | sn-slider |
| AUI-FORM-009 | Rate | SnRate.vue | sn-rate |
| AUI-FORM-010 | Search | SnSearch.vue | sn-search |
| AUI-FORM-011 | Picker | SnPicker.vue | sn-picker |
| AUI-FORM-012 | Calendar | SnCalendar.vue | sn-calendar |
| AUI-FORM-013 | DatetimePicker | SnDatetimePicker.vue | sn-datetime-picker |
| AUI-FORM-014 | Upload | SnUpload.vue | sn-upload |
| AUI-FORM-015 | Signature | SnSignature.vue | sn-signature |

### 反馈组件（FB）

| ID | 组件 | web 文件 | uni 文件 |
|---|---|---|---|
| AUI-FB-001 | Popup | — | sn-popup |
| AUI-FB-002 | Dialog | SnDialog.vue | sn-dialog |
| AUI-FB-003 | Toast | useToast + SnMessageProvider | useToast |
| AUI-FB-004 | Notify | useNotify + SnNotification | useNotify |
| AUI-FB-005 | Loading | SnLoading.vue | sn-loading |
| AUI-FB-006 | Overlay | SnOverlay.vue | sn-overlay |
| AUI-FB-007 | ActionSheet | SnActionSheet.vue | sn-action-sheet |
| AUI-FB-008 | DropMenu | SnDropMenu.vue | sn-drop-menu |
| AUI-FB-009 | Popover | SnPopover.vue | sn-popover |
| AUI-FB-010 | Tooltip | SnTooltip.vue | — |
| AUI-FB-011 | Progress | SnProgress.vue | sn-progress |
| AUI-FB-012 | Circle | SnCircle.vue | sn-circle |
| AUI-FB-013 | Empty | SnEmpty.vue | sn-empty |
| AUI-FB-014 | Skeleton | SnSkeleton.vue | sn-skeleton |

### 展示组件（DSP）

| ID | 组件 | web 文件 | uni 文件 |
|---|---|---|---|
| AUI-DSP-001 | Avatar | SnAvatar.vue | sn-avatar |
| AUI-DSP-002 | Badge | SnBadge.vue | sn-badge |
| AUI-DSP-003 | Tag | SnTag.vue | sn-tag |
| AUI-DSP-004 | Card | SnCard.vue | sn-card |
| AUI-DSP-005 | Divider | SnDivider.vue | sn-divider |
| AUI-DSP-006 | Grid | SnGrid.vue | sn-grid |
| AUI-DSP-007 | Collapse | SnCollapse.vue | sn-collapse |
| AUI-DSP-008 | Steps | SnSteps.vue | sn-steps |
| AUI-DSP-009 | Sticky | SnSticky.vue | sn-sticky |
| AUI-DSP-010 | Img | SnImg.vue | sn-img |
| AUI-DSP-011 | ImagePreview | useImagePreview + SnImagePreview | useImagePreview |
| AUI-DSP-012 | Swiper | SnSwiper.vue | sn-swiper |

### 组合式 API（API, web only）

| ID | Hook | 文件 |
|---|---|---|
| AUI-API-001 | useToast | packages/vue-web/src/use-toast/ |
| AUI-API-002 | useDialog | packages/vue-web/src/use-dialog/ |
| AUI-API-003 | useNotify | packages/vue-web/src/use-notify/ |
| AUI-API-004 | useCountDown | packages/vue-web/src/use-count-down/ |
| AUI-API-005 | useImagePreview | packages/vue-web/src/use-image-preview/ |

---

## M2 主题与生态

| ID | 标题 | 类型 |
|---|---|---|
| AUI-THEME-001 | 暗色模式 polish | 增强 |
| AUI-THEME-002 | 主题持久化 | 工具 |
| AUI-THEME-003 | 主题自定义向导 | 工具 |
| AUI-INTL-001 | 组件文案国际化 | i18n |
| AUI-TOOL-001 | VS Code 插件 | 工具 |
| AUI-CLI-003 | `pnpm snui docs` 命令 | CLI |
| AUI-CLI-004 | `pnpm snui llms` 命令 | CLI |
| AUI-CLI-005 | `pnpm snui new SnFoo` 脚手架 | CLI |
| AUI-STARTER-001 | uni-app 模板 starter | 模板 |
| AUI-STARTER-002 | Vue 3 web 模板 starter | 模板 |

---

## M3 长期打磨

| ID | 标题 |
|---|---|
| AUI-PERF-001 | 视觉回归测试 |
| AUI-PERF-002 | 性能基准（render / bundle size） |
| AUI-DOCS-005 | 文档站交互优化 |
| AUI-DOCS-006 | 完整 type coverage |

---

## CI 任务

| ID | 标题 |
|---|---|
| AUI-CI-001 | turbo pipeline 适配（typecheck / lint / test / build） |
| AUI-CI-002 | changesets 发布流程 |
| AUI-CI-003 | pre-commit hook（format + typecheck） |

---

## 变更日志

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-08 | 初始 WBS（35 任务） |
| v2.0 | 2026-10-03 | 整体推翻，重组为组件库形态（ADR-0001） |
