# AUI-DOCS-FB-013 — AutoComplete 弹层被 overflow:hidden 祖先裁剪

日期：2026-11-11

## 现场现象

组件文档站（SnDocPage demo 卡片 `overflow: hidden`）里，AutoComplete 的候选
菜单在卡片底边被裁断（嵌套 label 高亮 demo），只显示前两项的一部分。

## 根因

SnAutoComplete 是弹层组件家族里**唯一没有 Teleport 到 body 的**：
菜单 `position: absolute` 留在组件内（z-index: 100），任何 `overflow: hidden`
祖先都会裁掉它——z-index 无法解决裁剪（层叠上下文再高也被 overflow 剪）。
SnSelect / SnCascader / SnDatePicker / SnTimePicker / SnColorPicker 均已
Teleport + fixed 定位。

## 修复

镜像 SnSelect 模式改造 SnAutoComplete（AUI 无公开 API 变化）：

- 菜单 `<Teleport to="body">` + `position: fixed`，坐标由 `repositionMenu()`
  从触发器 rect 计算（`menuStyle`），底部优先、空间不足翻转到上方；
- `--sn-web-auto-complete-menu-gap` 钩子从 CSS margin 迁到 JS 读取，仍然生效；
- 外点关闭补 `menuEl.contains(target)` 判断（菜单在 body 下）；
- `useOverlayFollow` 滚动跟随接线不变。

## 回归测试

`SnAutoComplete.test.ts` 全量改为 body 查询（`menuOnBody()` /
`bodyOptions()`）——菜单必须出现在 `document.body` 才能通过，即 Teleport
行为的回归守卫；29/29 通过，vue-web 全量 2971/2971 通过。

## 教训（反模式）

新增弹层类组件时，菜单一律 Teleport + fixed 定位（照抄 SnSelect 的
reposition/useOverlayFollow 接线），不要 absolute-in-flow——文档卡片、
卡片组件、弹窗里的 `overflow: hidden` 都会成为裁剪源。
