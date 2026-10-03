# snail-aui Master Plan v5.0

**版本**：v5.0  
**状态**：Active（supersedes Master Plan v4.0）  
**架构**：Component First / Token First / Style Pack First / AI Native  
**日期**：2026-10-03

---

## 1. 战略定位

snail-aui v3.0 是 **AI-Native UI 框架生态**，分三层：

```text
AI 生态层       @snui/ai — Skill + MCP Server + ai-meta
    ↑
Style Pack 层   @snui/style-packs — 可替换风格包
    ↑
组件库底座      @snui/vue-web + @snui/uni + @snui/tokens
```

用户在三个维度都能受益：
- **开发者**：直接 `<SnButton>` 使用，无需了解底层
- **设计师/PM**：在文档站切换风格包，一键复制配置
- **AI Agent**：通过 Skill + MCP 理解组件，产出高保真原型

---

## 2. 里程碑

| 里程碑 | 时间 | 交付 | 状态 |
|---|---|---|---|
| **M0** 架构反转 | 2026-10 | ADR-0001 + PRD v2.0 + Button demo | ✅ 完成 |
| **M1** 核心组件 | 2026-11 | P0+P1 ~40 组件 + docs + cli | 🔵 规划 |
| **M2** Style Pack + AI | 2026-12 | @snui/style-packs（3 Pack）+ @snui/ai（Skill+MCP）+ StyleSwitcher + ThemeCopier | 🔵 规划 |
| **M3** 风格扩展 | 2027 Q1 | doodle / sticky-note + 原型产出流程打通 | 🔵 规划 |
| **M4** 生态打磨 | 2027 Q2 | taobao / douyin + P2 组件 + VSCode 插件 + 视觉回归 | 🔵 规划 |

---

## 3. M1 核心组件（~40 个）

### 基础（10 个）

| ID | 组件 | Web | Uni | 优先级 |
|---|---|---|---|---|
| AUI-CORE-001 | Button | ✅ SnButton.vue | ✅ sn-button.vue | P0 |
| AUI-CORE-002 | Icon | SnIcon.vue | sn-icon.vue | P0 |
| AUI-CORE-003 | Text | SnText.vue | sn-text.vue | P1 |
| AUI-CORE-004 | Layout | SnRow/SnCol.vue | sn-row/sn-col.vue | P1 |
| AUI-CORE-005 | Cell | SnCell.vue | sn-cell.vue | P1 |
| AUI-CORE-006 | Transition | SnTransition.vue | — | P1 |
| AUI-CORE-007 | ConfigProvider | SnConfigProvider.vue | — | P0 |
| AUI-CORE-008 | Popup | SnPopup.vue | sn-popup.vue | P0 |
| AUI-CORE-009 | Divider | SnDivider.vue | sn-divider.vue | P1 |
| AUI-CORE-010 | Img | SnImg.vue | sn-img.vue | P1 |

### 导航（6 个）

| ID | 组件 | Web | Uni | 优先级 |
|---|---|---|---|---|
| AUI-NAV-001 | Navbar | SnNavbar.vue | sn-navbar.vue | P0 |
| AUI-NAV-002 | Tabbar | SnTabbar.vue | sn-tabbar.vue | P0 |
| AUI-NAV-003 | Tabs | SnTabs.vue | sn-tabs.vue | P1 |
| AUI-NAV-004 | Pagination | SnPagination.vue | sn-pagination.vue | P1 |
| AUI-NAV-005 | Backtop | SnBacktop.vue | sn-backtop.vue | P2 |
| AUI-NAV-006 | Segmented | SnSegmented.vue | — | P2 |

### 录入（12 个）

| ID | 组件 | Web | Uni | 优先级 |
|---|---|---|---|---|
| AUI-FORM-001 | Form | SnForm.vue | sn-form.vue | P0 |
| AUI-FORM-002 | FormItem | SnFormItem.vue | sn-form-item.vue | P0 |
| AUI-FORM-003 | Input | SnInput.vue | sn-input.vue | P0 |
| AUI-FORM-004 | Textarea | SnTextarea.vue | sn-textarea.vue | P1 |
| AUI-FORM-005 | Switch | SnSwitch.vue | sn-switch.vue | P1 |
| AUI-FORM-006 | Checkbox | SnCheckbox.vue | sn-checkbox.vue | P1 |
| AUI-FORM-007 | Radio | SnRadio.vue | sn-radio.vue | P1 |
| AUI-FORM-008 | Select | SnSelect.vue | sn-picker.vue | P1 |
| AUI-FORM-009 | Search | SnSearch.vue | sn-search.vue | P1 |
| AUI-FORM-010 | InputNumber | SnInputNumber.vue | sn-input-number.vue | P1 |
| AUI-FORM-011 | Slider | SnSlider.vue | sn-slider.vue | P2 |
| AUI-FORM-012 | Upload | SnUpload.vue | sn-upload.vue | P2 |

### 反馈（8 个）

| ID | 组件 | Web | Uni | 优先级 |
|---|---|---|---|---|
| AUI-FB-001 | Dialog | SnDialog.vue | sn-dialog.vue | P0 |
| AUI-FB-002 | Toast（useToast） | useToast | useToast | P0 |
| AUI-FB-003 | Loading | SnLoading.vue | sn-loading.vue | P0 |
| AUI-FB-004 | Skeleton | SnSkeleton.vue | sn-skeleton.vue | P1 |
| AUI-FB-005 | Empty | SnEmpty.vue | sn-empty.vue | P1 |
| AUI-FB-006 | Progress | SnProgress.vue | sn-progress.vue | P1 |
| AUI-FB-007 | Notify（useNotify） | useNotify | useNotify | P1 |
| AUI-FB-008 | ActionSheet | SnActionSheet.vue | sn-action-sheet.vue | P2 |

### 展示（6 个）

| ID | 组件 | Web | Uni | 优先级 |
|---|---|---|---|---|
| AUI-DSP-001 | Card | SnCard.vue | sn-card.vue | P0 |
| AUI-DSP-002 | Avatar | SnAvatar.vue | sn-avatar.vue | P1 |
| AUI-DSP-003 | Badge | SnBadge.vue | sn-badge.vue | P1 |
| AUI-DSP-004 | Tag | SnTag.vue | sn-tag.vue | P1 |
| AUI-DSP-005 | Swiper | SnSwiper.vue | sn-swiper.vue | P1 |
| AUI-DSP-006 | Collapse | SnCollapse.vue | sn-collapse.vue | P2 |

### 组合式 API（Web 端，4 个）

| ID | Hook | 说明 |
|---|---|---|
| AUI-API-001 | useToast | 命令式 Toast |
| AUI-API-002 | useDialog | 命令式 Dialog |
| AUI-API-003 | useNotify | 命令式 Notify |
| AUI-API-004 | useImagePreview | 命令式图片预览 |

---

## 4. M2 Style Pack + AI Layer

| ID | 任务 | 包 | 说明 |
|---|---|---|---|
| AUI-PACK-001 | `StylePackDefinition` 类型定义 | @snui/style-packs | 接口 + 类型 |
| AUI-PACK-002 | default Pack（已有基础强化） | @snui/style-packs | MODERN_STYLE 封装为 Pack |
| AUI-PACK-003 | dark Pack | @snui/style-packs | DARK_THEME 封装 |
| AUI-PACK-004 | ios Pack | @snui/style-packs | iOS HIG 风格 |
| AUI-PACK-005 | pack validate CLI | @snui/cli | `pnpm snui pack validate` |
| AUI-AI-001 | snail-ui.skill.md 初版 | @snui/ai | AI 行为契约 |
| AUI-AI-002 | MCP Server 基础 4 工具 | @snui/ai | list/meta/pack/preview |
| AUI-AI-003 | ai-meta.json 生成器 | @snui/ai + @snui/cli | `pnpm snui ai-meta` |
| AUI-DOCS-010 | StyleSwitcher.vue | @snui/docs | 在线 Pack 切换 |
| AUI-DOCS-011 | ThemeCopier.vue | @snui/docs | 复制 snCssVars 代码 |
| AUI-DOCS-012 | 组件页 StylePackPreview | @snui/docs | 多风格并排预览 |
| AUI-DOCS-013 | Style Pack 文档页 | @snui/docs | 3 Pack × 中英文 |
| AUI-DOCS-014 | AI 生态文档页 | @snui/docs | Skill + MCP + 原型指南 |

---

## 5. M3 风格扩展

| ID | 任务 |
|---|---|
| AUI-PACK-006 | doodle Pack |
| AUI-PACK-007 | sticky-note Pack |
| AUI-AI-004 | render_preview 沙箱完善 |
| AUI-AI-005 | 高保真原型端到端验证（Button → Form → Page） |

---

## 6. M4 生态打磨

| ID | 任务 |
|---|---|
| AUI-PACK-008 | taobao Pack |
| AUI-PACK-009 | douyin Pack |
| AUI-PERF-001 | 视觉回归测试 |
| AUI-PERF-002 | Bundle size 基准 |
| AUI-TOOL-001 | VSCode 插件（组件自动补全） |
| AUI-STARTER-001 | uni-app Starter Template |
| AUI-STARTER-002 | Vue 3 Web Starter Template |

---

## 7. 治理

- **架构变更**：必须先写 ADR（`.ai/decisions/`），Human Gate 审批后执行
- **Public API**：每个组件必须有 `ai-description.md` + 单测 + Token 接入
- **Style Pack**：不允许修改组件 .vue 文件，只能覆盖 Token
- **Breaking change**：changesets 升 major 版本
- **CI 门禁**：typecheck + lint（0 warning）+ test（100% pass）+ build

---

## 8. 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-08 | 初始排期 |
| v2.0 | 2026-09 | 增加 Reactive / Binding / Action 包 |
| v3.0 | 2026-09 | 完整 Phase 1+2 排期（35 任务） |
| v4.0 | 2026-10-03 | 推翻，改为组件库（ADR-0001）|
| v5.0 | 2026-10-03 | 新增 Style Pack + AI Layer（ADR-0002）|
