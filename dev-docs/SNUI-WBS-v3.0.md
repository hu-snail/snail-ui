# snail-aui WBS v3.0 — 工作分解结构

> ⚠️ **本文档已被 WBS v3.1 取代（Superseded by `dev-docs/SNUI-WBS-v3.1.md`）**  
> 请勿再据此认领 Task ID。仅用于历史追溯。

**版本**：v3.0（supersedes WBS v2.0）  
**状态**：Superseded（被 SNUI-WBS-v3.1.md 取代）  
**对应**：Master Plan v5.0  
**日期**：2026-10-03

---

## 编号约定

```text
AUI-{模块}-{编号}

模块：
  REV     文档与架构反转
  FOUND   地基任务（M1 前必须完成）
  CORE    基础组件
  NAV     导航组件
  FORM    录入组件
  FB      反馈组件
  DSP     展示组件
  API     组合式 API
  THEME   主题与 Token
  PACK    Style Pack
  AI      AI Layer（Skill / MCP / ai-meta）
  TOOL    CLI / 工具
  DOCS    文档站
  CI      CI / 发布
  PERF    性能 / 视觉回归
  STARTER 模板脚手架
```

---

## M0 架构反转（✅ 已完成）

| ID | 标题 | 状态 |
|---|---|---|
| AUI-REV-001 | 重写 PRD v2.0 | ✅ |
| AUI-REV-002 | 写架构决策 ADR-0001 | ✅ |
| AUI-REV-003 | 写 Master Plan v4.0 | ✅ |
| AUI-REV-004 | 写 WBS v2.0 | ✅ |
| AUI-REV-005 | 归档 v1.x 包到 .ai/archive/v1-runtime/ | ✅ |
| AUI-REV-006 | 重写 @snui/vue-web 为组件库 | ✅ |
| AUI-REV-007 | 重写 @snui/uni 为 easycom 组件库 | ✅ |
| AUI-REV-008 | 强化 @snui/tokens（--sn-* 别名层） | ✅ |
| AUI-REV-009 | 新建 @snui/cli（resolver + llms.txt） | ✅ |
| AUI-REV-010 | 重写 apps/docs 文档站 | ✅ |
| AUI-REV-011 | 重写 apps/preview | ✅ |
| AUI-REV-012 | Button 端到端 demo（web + uni + docs） | ✅ |

---

## M0.5 v3.0 文档基础（✅ 已完成）

| ID | 标题 | 文件 | 状态 |
|---|---|---|---|
| AUI-REV-013 | 写架构决策 ADR-0002（Style Pack 三层 + AI Layer） | .ai/decisions/0002-ai-native-style-platform.md | ✅ |
| AUI-REV-014 | 重写 PRD v3.0 | dev-docs/SNUI-PRD-v3.0.md | ✅ |
| AUI-REV-015 | 写 Architecture v3.0 | dev-docs/SNUI-Architecture-v3.0.md | ✅ |
| AUI-REV-016 | 写 Spec-01（Token + Style Pack，三层结构） | dev-docs/Spec-01-Token-StylePack.md | ✅ |
| AUI-REV-017 | 写 Spec-02（组件规范） | dev-docs/Spec-02-Component.md | ✅ |
| AUI-REV-018 | 写 Spec-03（AI Layer，含 ai-description 自动抽取） | dev-docs/Spec-03-AI-Layer.md | ✅ |
| AUI-REV-019 | 写 Spec-04（原型与应用产出） | dev-docs/Spec-04-Prototype-App.md | ✅ |
| AUI-REV-020 | 写 Spec-05（文档站 + StyleSwitcher） | dev-docs/Spec-05-Docs-StyleSwitcher.md | ✅ |
| AUI-REV-021 | 写 Master Plan v5.0 | dev-docs/SNUI-Master-Plan-v5.0.md | ✅ |
| AUI-REV-022 | 写 WBS v3.0（本文件） | dev-docs/SNUI-WBS-v3.0.md | ✅ |
| AUI-REV-023 | 写 Dev Guide v3.0 | dev-docs/SNUI-Dev-Guide-v3.0.md | ✅ |
| AUI-REV-024 | 旧文档标注 Superseded + AI-RULES.md 链接修正 | AI-RULES.md + 旧文档首行 | ✅ |

---

## M1-FOUND 地基任务（⚠️ M1 组件开始前必须全部完成）

这四个任务是整个 v3.0 核心功能（风格切换、文档预览）的基础。不做好，后续工作全部空转。

| ID | 标题 | 为什么必须做 | 状态 |
|---|---|---|---|
| AUI-FOUND-001 | Token 命名对齐：统一 `--sn-*` 变量名与 `@snui/tokens` 实际输出 | 组件依赖硬编码兜底值，风格切换无效 | 🔵 |
| AUI-FOUND-002 | 重建 ComponentPreview.vue（移除 v1 schema renderer） | 文档站组件预览不可用 | 🔵 |
| AUI-FOUND-003 | ConfigProvider 双端 `skin` prop（web: body.class；uni: 向下传递） | uni 端无风格切换路径 | 🔵 |
| AUI-FOUND-004 | 所有组件根元素添加 `data-snui-component="{name}"` 皮肤钩子 | 皮肤 CSS 无法选择组件 | 🔵 |

### AUI-FOUND-001 详细验收标准

- `snCssVars()` 输出包含所有 `SnButton` 消费的 `--aui-button-*` 变量
- `packages/tokens/src/component.ts` 补全：button-height-{tiny/small/medium/large}、button-radius、button-font-size、button-focus-ring、input-height-{small/medium/large}、input-radius、card-padding、card-radius、card-shadow
- `packages/tokens/src/resolver.ts` 对应输出
- `packages/tokens/styles/index.css` 对应默认值
- `SnButton.vue` / `sn-button.vue` CSS 中无字面量颜色兜底值（兜底值只允许 `transparent` / `inherit` / `currentColor`）
- `pnpm snui token check` 通过（AUI-TOOL-005，与本任务同批）

### AUI-FOUND-002 详细验收标准

- 移除 `createVueRenderer`、`UISchema`、`framework-web.js` 等 schema renderer 依赖
- ComponentPreview.vue 直接 import `@snui/vue-web` 组件并 mount 到 div
- `apps/docs/public/framework-web.js` 和 `framework-uni.js` 不再通过 esbuild schema renderer 方式构建
- Button 文档页、Input 文档页、Card 文档页预览正常渲染

### AUI-FOUND-003 详细验收标准

- Web 端：`SnConfigProvider` 接收 `skin?: string` prop，响应式设置 `document.body.classList`
- uni 端：`sn-config-provider` 接收 `skin?: string` prop，根元素携带 `snui-skin-{name}` class
- 单元测试：skin prop 变化时 class 正确更新

### AUI-FOUND-004 详细验收标准

- `SnButton.vue` 根元素：`data-snui-component="button"`
- `sn-button.vue` 根元素：同上
- 后续所有新组件必须在创建时同步添加

---

## M1 核心组件

### 基础组件（CORE）

| ID | 组件 | Web | Uni | 状态 |
|---|---|---|---|---|
| AUI-CORE-001 | Button | ✅ SnButton.vue | ✅ sn-button.vue | ✅（需 FOUND-001/004 补齐）|
| AUI-CORE-002 | Icon | SnIcon.vue | sn-icon.vue | 🔵 |
| AUI-CORE-003 | Text | SnText.vue | sn-text.vue | 🔵 |
| AUI-CORE-004 | Layout（Row/Col） | SnRow/SnCol.vue | sn-row/sn-col.vue | 🔵 |
| AUI-CORE-005 | Cell | SnCell.vue | sn-cell.vue | 🔵 |
| AUI-CORE-006 | Transition | SnTransition.vue | — | 🔵 |
| AUI-CORE-007 | ConfigProvider（含 skin prop） | SnConfigProvider.vue | sn-config-provider.vue | 🔵（FOUND-003）|
| AUI-CORE-008 | Popup | SnPopup.vue | sn-popup.vue | 🔵 |
| AUI-CORE-009 | Divider | SnDivider.vue | sn-divider.vue | 🔵 |
| AUI-CORE-010 | Img | SnImg.vue | sn-img.vue | 🔵 |

### 导航组件（NAV）

| ID | 组件 | Web | Uni | 状态 |
|---|---|---|---|---|
| AUI-NAV-001 | Navbar | SnNavbar.vue | sn-navbar.vue | 🔵 |
| AUI-NAV-002 | Tabbar | SnTabbar.vue | sn-tabbar.vue | 🔵 |
| AUI-NAV-003 | Tabs | SnTabs.vue | sn-tabs.vue | 🔵 |
| AUI-NAV-004 | Pagination | SnPagination.vue | sn-pagination.vue | 🔵 |
| AUI-NAV-005 | Backtop | SnBacktop.vue | sn-backtop.vue | 🔵 |
| AUI-NAV-006 | Segmented | SnSegmented.vue | — | 🔵 |

### 录入组件（FORM）

| ID | 组件 | Web | Uni | 状态 |
|---|---|---|---|---|
| AUI-FORM-001 | Form | SnForm.vue | sn-form.vue | 🔵 |
| AUI-FORM-002 | FormItem | SnFormItem.vue | sn-form-item.vue | 🔵 |
| AUI-FORM-003 | Input | SnInput.vue | sn-input.vue | 🔵 |
| AUI-FORM-004 | Textarea | SnTextarea.vue | sn-textarea.vue | 🔵 |
| AUI-FORM-005 | Switch | SnSwitch.vue | sn-switch.vue | 🔵 |
| AUI-FORM-006 | Checkbox | SnCheckbox.vue | sn-checkbox.vue | 🔵 |
| AUI-FORM-007 | Radio | SnRadio.vue | sn-radio.vue | 🔵 |
| AUI-FORM-008 | Select / Picker | SnSelect.vue | sn-picker.vue | 🔵 |
| AUI-FORM-009 | Search | SnSearch.vue | sn-search.vue | 🔵 |
| AUI-FORM-010 | InputNumber | SnInputNumber.vue | sn-input-number.vue | 🔵 |
| AUI-FORM-011 | Slider | SnSlider.vue | sn-slider.vue | 🔵 |
| AUI-FORM-012 | Upload | SnUpload.vue | sn-upload.vue | 🔵 |

### 反馈组件（FB）

| ID | 组件 | Web | Uni | 状态 |
|---|---|---|---|---|
| AUI-FB-001 | Dialog | SnDialog.vue | sn-dialog.vue | 🔵 |
| AUI-FB-002 | Toast（useToast） | useToast.ts | useToast.ts | 🔵 |
| AUI-FB-003 | Loading | SnLoading.vue | sn-loading.vue | 🔵 |
| AUI-FB-004 | Skeleton | SnSkeleton.vue | sn-skeleton.vue | 🔵 |
| AUI-FB-005 | Empty | SnEmpty.vue | sn-empty.vue | 🔵 |
| AUI-FB-006 | Progress | SnProgress.vue | sn-progress.vue | 🔵 |
| AUI-FB-007 | Notify（useNotify） | useNotify.ts | useNotify.ts | 🔵 |
| AUI-FB-008 | ActionSheet | SnActionSheet.vue | sn-action-sheet.vue | 🔵 |

### 展示组件（DSP）

| ID | 组件 | Web | Uni | 状态 |
|---|---|---|---|---|
| AUI-DSP-001 | Card | SnCard.vue | sn-card.vue | 🔵 |
| AUI-DSP-002 | Avatar | SnAvatar.vue | sn-avatar.vue | 🔵 |
| AUI-DSP-003 | Badge | SnBadge.vue | sn-badge.vue | 🔵 |
| AUI-DSP-004 | Tag | SnTag.vue | sn-tag.vue | 🔵 |
| AUI-DSP-005 | Swiper | SnSwiper.vue | sn-swiper.vue | 🔵 |
| AUI-DSP-006 | Collapse | SnCollapse.vue | sn-collapse.vue | 🔵 |

### 组合式 API（API，Web 端）

| ID | Hook | 文件 | 状态 |
|---|---|---|---|
| AUI-API-001 | useToast | packages/vue-web/src/use-toast/ | 🔵 |
| AUI-API-002 | useDialog | packages/vue-web/src/use-dialog/ | 🔵 |
| AUI-API-003 | useNotify | packages/vue-web/src/use-notify/ | 🔵 |
| AUI-API-004 | useImagePreview | packages/vue-web/src/use-image-preview/ | 🔵 |

### M1 文档与工具

| ID | 标题 | 状态 |
|---|---|---|
| AUI-DOCS-001 | 所有 P0+P1 组件 Web 文档页（中英文） | 🔵 |
| AUI-DOCS-002 | 所有 P0+P1 组件 Uni 文档页（中英文） | 🔵 |
| AUI-TOOL-001 | @snui/cli 补充 `bin` 入口（`pnpm snui *` 命令可用） | 🔵 |
| AUI-TOOL-002 | `pnpm snui docs` 命令（含 auto 区域自动抽取）| 🔵 |
| AUI-TOOL-003 | `pnpm snui llms` 命令 | 🔵 |
| AUI-TOOL-004 | `pnpm snui new SnFoo` 脚手架 | 🔵 |
| AUI-TOOL-005 | `pnpm snui token check` 命令（检查无字面量颜色兜底） | 🔵 |
| AUI-THEME-001 | 暗色模式完善（dark token 覆盖完整） | 🔵 |

---

## M2 Style Pack + AI Layer

| ID | 标题 | 包 | 状态 |
|---|---|---|---|
| AUI-PACK-001 | StylePackDefinition 类型 + 包骨架 | @snui/style-packs | 🔵 |
| AUI-PACK-002 | default Pack | @snui/style-packs | 🔵 |
| AUI-PACK-003 | dark Pack | @snui/style-packs | 🔵 |
| AUI-PACK-004 | ios Pack | @snui/style-packs | 🔵 |
| AUI-PACK-005 | pack validate CLI 命令 | @snui/cli | 🔵 |
| AUI-AI-001 | snail-ui.skill.md 初版 | @snui/ai | 🔵 |
| AUI-AI-002 | MCP Server（4 工具）| @snui/ai | 🔵 |
| AUI-AI-003 | ai-meta.json 生成器 | @snui/ai + @snui/cli | 🔵 |
| AUI-DOCS-010 | StyleSwitcher.vue（Web 端） | @snui/docs | 🔵 |
| AUI-DOCS-011 | ThemeCopier.vue | @snui/docs | 🔵 |
| AUI-DOCS-012 | StylePackPreview（组件页内嵌） | @snui/docs | 🔵 |
| AUI-DOCS-013 | Style Pack 文档页（3 Pack × 中英文） | @snui/docs | 🔵 |
| AUI-DOCS-014 | AI 生态文档页（Skill + MCP + 原型指南） | @snui/docs | 🔵 |

---

## M3 风格扩展

| ID | 标题 | 状态 |
|---|---|---|
| AUI-PACK-006 | doodle Pack（Token + 皮肤 CSS） | 🔵 |
| AUI-PACK-007 | sticky-note Pack（Token + 皮肤 CSS） | 🔵 |
| AUI-AI-004 | render_preview 沙箱完善 | 🔵 |
| AUI-AI-005 | 高保真原型端到端验证（Button → Form → Page 链路） | 🔵 |

---

## M4 生态打磨

| ID | 标题 | 状态 |
|---|---|---|
| AUI-PACK-008 | taobao Pack（Token + 皮肤 CSS） | 🔵 |
| AUI-PACK-009 | douyin Pack（Token + 皮肤 CSS + 资源） | 🔵 |
| AUI-PERF-001 | 视觉回归测试（Playwright + 截图比对） | 🔵 |
| AUI-PERF-002 | Bundle size 基准 | 🔵 |
| AUI-TOOL-006 | VSCode 插件（组件自动补全） | 🔵 |
| AUI-STARTER-001 | uni-app Starter Template | 🔵 |
| AUI-STARTER-002 | Vue 3 Web Starter Template | 🔵 |

---

## CI 任务

| ID | 标题 | 状态 |
|---|---|---|
| AUI-CI-001 | turbo pipeline（typecheck / lint / test / build） | ✅ |
| AUI-CI-002 | changesets 发布流程 | ✅ |
| AUI-CI-003 | pre-commit hook（format + typecheck） | 🔵 |
| AUI-CI-004 | pack validate 加入 CI 门禁 | 🔵 |
| AUI-CI-005 | token check 加入 CI 门禁 | 🔵 |
| AUI-CI-006 | ai-meta.json 自动生成加入 build pipeline | 🔵 |

---

## 状态图例

```text
✅  已完成（DONE）
🔵  待做（TODO / READY）
🟡  进行中（IN_PROGRESS）
🔴  阻塞（BLOCKED）
⬛  已取消（CANCELLED）
```

---

## 变更日志

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-08 | 初始（Schema-Runtime，35 任务） |
| v2.0 | 2026-10-03 | 重组为组件库形态（ADR-0001） |
| v3.0 | 2026-10-03 | 新增地基任务 FOUND-001~004；新增 Style Pack / AI Layer 任务；修正 CLI bin 缺失；补齐 M0.5 文档任务 |
