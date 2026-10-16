# FB-004 对标基准：11 组件 vs naive-ui 官方

> 本文件是 **Agent 内部契约**（AGENTS.md §114.4），**不得进入用户文档**。
> 数据源：`https://raw.githubusercontent.com/tusen-ai/naive-ui/main/src/<c>/demos/zhCN/index.demo-entry.md`
> 采集时间：2026-10-16

## 判定口径（用户已确认）

- **demo 尺度**：完整对标 —— 常规 demo 必须 100% 覆盖；`*-debug` 类（rtl / dark / focus / a11y / empty）能覆盖则覆盖，未覆盖必须登记。
- **props 尺度**：连同组件源码一起补齐到 1:1。
- **提交节奏**：每个组件一个 commit + push（§56）。

---

## 1. SnAlert → `n-alert`

**官方 demo（8）**：basic / bordered / closable / icon / no-icon / marquee / rtl-debug / empty-debug

**当前 demo（4）**：closable / slots / title-bordered / types

| 缺口 demo | 优先级 |
| --- | --- |
| basic | P1 |
| bordered | P1 |
| icon（自定义图标） | P1 |
| no-icon（`showIcon=false`） | P1 |
| ~~types~~ 已有 | — |
| ~~closable~~ 已有 | — |

**props 缺口**：**无**。

核验记录（`src/alert/src/Alert.tsx` line 32-55）：上游 `alertProps` 只含 `title` / `showIcon`(true) / `type`('default') / `bordered`(true) / `closable`(Boolean=falsy) / `onClose` / `onAfterLeave` / `onAfterHide`(deprecated)。**不存在 `marquee` prop** —— 官方 demo 的 `marquee.vue` 演示的是「Alert 内嵌 Marquee 组件」，属组合用法而非 Alert 的 prop。因此本组件 props 已 1:1，缺的只是 demo。

`marquee` 场景的实现方式：在 Alert 的 `default` 插槽里放跑马灯内容即可，无需新增 prop。

---

## 2. SnDialog → `n-dialog`

**官方 demo（8）**：basic / async / use-component / mask / action / use-dialog-reactive-list / focus-debug / rtl-debug

**当前 demo（2）**：basic / types

| 缺口 demo | 优先级 |
| --- | --- |
| async（异步 loading） | P1 |
| use-component（组件式调用） | P1 |
| mask（遮罩控制） | P1 |
| action（自定义底部操作区） | P1 |
| use-dialog-reactive-list | P2 |
| ~~basic~~ 已有 | — |
| ~~types~~ 已有（官方无独立 types demo，属额外覆盖） | — |

**props 缺口**：核验 `actionClass`/`actionStyle`/`closeFocusable`/`iconPlacement`/`titleClass`/`titleStyle` 语义是否 1:1。

---

## 3. SnDrawer → `n-drawer` + `n-drawer-content`

**官方 demo（14）**：basic / multiple / closable / target / slot / scroll / a11y-debug / custom-style-debug / dark-1..4-debug / resizable / rtl-debug

**当前 demo（2）**：basic / content

| 缺口 demo | 优先级 |
| --- | --- |
| multiple（多层嵌套） | P1 |
| closable（关闭按钮自定义） | P1 |
| target（指定容器） | P1 |
| slot（插槽自定义） | P1 |
| scroll（内容滚动） | P1 |
| resizable（拖拽调整尺寸） | P1 |
| ~~basic~~ 已有 | — |

**props 缺口（AUI-WEB-FB-003a）**：**已补齐** ✅

本轮新增 12 个 props / events：`defaultWidth`(251) / `defaultHeight`(251) / `resizable` / `maxWidth` / `maxHeight` / `minWidth` / `minHeight` / `autoFocus`(true) / `trapFocus`(true) / `scrollbarProps` + `update:width` / `update:height` 事件。

实现取舍：
- `resizable` 用单边手柄 + 键盘（方向键 16px、Home/End 到边界），非上游的三触发器方案。
- `scrollbarProps` 只应用滚动子集（`trigger` / `xScrollable` / `onScroll`），虚拟几何参数对原生容器无意义。
- 焦点陷阱为手写实现（Tab 循环 + autoFocus + 关闭后焦点归还），不引入 `vueuc` 依赖。

测试：58 → 73（+15，覆盖全部新增 props）。

---

## 4. SnLoading → `n-spin`

**官方 demo（6）**：basic / wrap / description / customize-icon / delay / blocking-debug

**当前 demo（3）**：basic / custom / wrapper

| 缺口 demo | 优先级 |
| --- | --- |
| description（加载描述文案） | P1 |
| customize-icon（自定义图标） | P1 |
| delay（延迟显示） | P1 |
| ~~basic~~ 已有 | — |
| ~~wrap（wrapper）~~ 已有 | — |

**props 缺口**：`show` / `description` / `customizeIcon` 语义核验。

---

## 5. SnSkeleton → `n-skeleton`

**官方 demo（3）**：basic / box / size

**当前 demo（2）**：basic / card

| 缺口 demo | 优先级 |
| --- | --- |
| box（盒子形态） | P1 |
| size（尺寸） | P1 |
| ~~basic~~ 已有 | — |

**props 缺口**：`repeat` / `sharp` / `round` / `circle` / `height` / `width` 核验。

---

## 6. SnBackTop → `n-back-top`

**官方 demo（4）**：basic / visibility-height / change-position / target-container-selector

**当前 demo（2）**：basic / control

| 缺口 demo | 优先级 |
| --- | --- |
| visibility-height | P1 |
| change-position | P1 |
| target-container-selector | P1 |
| ~~basic~~ 已有 | — |

**props 缺口**：`target`（容器选择器）/ `listenTo` / `right` / `bottom` 已核。

---

## 7. SnAnchor → `n-anchor`

**官方 demo（5）**：basic / ignore-gap / affix / scrollto / max-height-debug

**当前 demo（2）**：basic / variants

| 缺口 demo | 优先级 |
| --- | --- |
| ignore-gap | P1 |
| affix | P1 |
| scrollto | P1 |
| ~~basic~~ 已有 | — |

**props 缺口**：`showRail` / `scrollTo` / `internalScrollable` / `offsetTarget` 核验。

---

## 8. SnAffix → `n-affix`

**官方 demo（2）**：basic / position

**当前 demo（2）**：basic / position

✅ **demo 已齐**。仅核验 props 语义（`top` / `bottom` / `offsetTop` / `offsetBottom` / `triggerTop` / `triggerBottom` / `target` / `listenTo`）。

---

## 9. SnTooltip → `n-tooltip`（继承 `n-popover`）

**官方 demo（7）**：basic / trigger / event / placement / body-style / arrow / rtl-debug
**Popover 补充参考（19）**：basic / trigger / delay / no-arrow / event / placement / raw-content / style / trigger-width / manual-position / slots …

**当前 demo（3）**：basic / content-slot / controlled

| 缺口 demo | 优先级 |
| --- | --- |
| trigger（多触发方式） | P1 |
| event（事件回调） | P1 |
| placement（12 方位） | P1 |
| body-style（内容样式） | P1 |
| arrow（箭头控制） | P1 |
| ~~basic~~ 已有 | — |

**props 缺口（重要）**：
- **自造 prop 待清理**：`wrapped` —— naive-ui 无此 prop，§112.1 违规。
- 缺失：`raw` / `arrowClass` / `arrowStyle` / `arrowWrapperClass` / `arrowWrapperStyle` / `animated` / `arrowPointToCenter` / `contentClass` / `contentStyle` / `displayDirective` / `duration` / `flip` / `keepAliveOnHover` / `overlap` / `scrollable` / `to` / `width` / `zIndex` / `onClickoutside`。
- `delay`：naive-ui 是 `number`（`100`），sn 扩展了 `[number, number]` —— 属追加，保留但需标注。

---

## 10. SnSteps → `n-steps`

**官方 demo（9）**：basic / size / vertical / content-placement / content / custom-icon / click / vertical-debug / rtl-debug

**当前 demo（5）**：basic / clickable / content-bottom / status / vertical

| 缺口 demo | 优先级 |
| --- | --- |
| size | P1 |
| content-placement | P1 |
| content（内容插槽） | P1 |
| custom-icon | P1 |
| ~~basic~~ 已有 | — |
| ~~click~~ 已有（clickable） | — |
| ~~vertical~~ 已有 | — |

**props 缺口**：`size` / 自定义 icon 支持核验。

---

## 11. SnTabs → `n-tabs`

**官方 demo（27）**：basic / segment / card / flex-label / prefix / size / display-directive / addable / before-leave / no-pane / update-bar-manually / bar-width / trigger / placement / line-debug / style-inherit-debug / shadow-debug / unkeyed-debug / addable-debug / suffix-width-debug / animation-debug / animationx-debug / none-debug / modal-debug / show-scroll-button / center-active-tab / rtl-debug

**当前 demo（4）**：basic / card-segment / line / placement-closable

| 缺口 demo | 优先级 |
| --- | --- |
| size | P1 |
| display-directive | P1 |
| addable | P1 |
| before-leave | P1 |
| no-pane | P1 |
| bar-width | P1 |
| trigger | P1 |
| placement（已有部分） | P1 |
| flex-label | P2 |
| prefix | P2 |
| show-scroll-button | P2 |
| center-active-tab | P2 |
| ~~basic~~ 已有 | — |
| ~~segment~~ 已有 | — |
| ~~card~~ 已有 | — |

**props 缺口**：`addable` / `barWidth` / `displayDirective` / `trigger` / `showScrollButton` / `centerActiveTab` / `paneClass` / `paneStyle` / `addTabClass` / `addTabStyle` / `tabClass` / `tabStyle` / `tabsPadding` 等。

---

## 汇总

| 组件 | 官方 demo | 当前 demo | 缺口 | props 缺口 |
| --- | --- | --- | --- | --- |
| SnAlert | 8 | 4 | 5 | 1 |
| SnDialog | 8 | 2 | 5 | 核验 |
| SnDrawer | 14 | 2 | 6+ | 8 |
| SnLoading | 6 | 3 | 3 | 核验 |
| SnSkeleton | 3 | 2 | 2 | 核验 |
| SnBackTop | 4 | 2 | 3 | 核验 |
| SnAnchor | 5 | 2 | 3 | 核验 |
| SnAffix | 2 | 2 | 0 | 核验 |
| SnTooltip | 7 | 3 | 5 | 19 + 清理 `wrapped` |
| SnSteps | 9 | 5 | 4 | 2 |
| SnTabs | 27 | 4 | 12+ | 13+ |

**debug 类 demo 登记**（本轮不强制，未覆盖需保留在本表）：alert rtl/empty、dialog focus/rtl、drawer a11y/custom-style/dark-1..4/rtl、anchor max-height、steps vertical/rtl、tabs line/style-inherit/shadow/unkeyed/addable/suffix-width/animation/animationx/none/modal/rtl。
