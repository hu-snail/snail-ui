# sn-notify: script setup 未调用 defineExpose，模板 ref 拿到空暴露对象

**Task**: feat(uni-notify) HeroUI 风格重设计（2026-11-20）· 修复 2026-11-21
**现象（uni-demo-x web 运行时）**:

```text
TypeError: $setup.notify?.show is not a function
    at onClick (notify-mp-basic.uvue:54:23)
```

**根因**: sn-notify.vue 用 `<script setup>` 重写为队列容器（ref API `show/hide/hideAll`）时，
漏掉了 `defineExpose`。script setup 组件默认 closed —— 模板 ref 绑定到的是**空暴露对象**：
truthy 但没有 `show`，于是 `notify?.show(item)` 在运行时报 "not a function"
（`?.` 只兜 null/undefined，兜不住"对象缺方法"）。

**为什么单测没拦住**: `@vue/test-utils` 的 `wrapper.vm` 会把 setup 内部绑定提升出来供测试调用
（testability 特性），所以 `wrapper.vm.show(...)` 在缺失 defineExpose 时照样"能用"，
测试全绿。只有用**真实模板 ref 链路**（函数式 ref 接收公开暴露代理）的测试才会失败。

**修复**:

1. `sn-notify.vue` 补 `defineExpose<SnNotifyInstance>({ show, hide, hideAll });`（§41 同层，
   附注释说明 script setup 默认 closed）。
2. 回归测试：`mount(Host)` + `h(SnNotify, { ref: (el) => { exposed = el } })` 函数式 ref host，
   断言 exposed 上 `show/hide/hideAll` 均为 function 且经其调用能渲染卡片。
   已验证 fail→pass（移除 defineExpose 测试失败，恢复后通过，§103）。
3. uni-x 重建（defineExpose 原样进入 .uvue，同 sn-tooltip / sn-slider 先例）、demo-x gen+check 全绿。

**教训（跨项目适用，Agent Memory 级）**:

- **反模式**: script setup 组件写完 `defineExpose` 之前就宣称"ref API 可用"；单测只用
  `wrapper.vm.xxx()` 驱动暴露面。
- **正确姿势**: 暴露面必须有**穿透 wrapper.vm 的测试**（函数式 ref host / 挂父组件拿
  `templateRef.value`），`wrapper.vm` 只当组件内部驱动器用。
- **适用范围**: 任何 Vue 3 `<script setup>` 组件库（vue-web / uni / uni-x 全适用）；
  与具体平台无关。
- **对应代码**: `packages/uni/src/components/sn-notify/sn-notify.vue`（defineExpose 处）、
  `sn-notify.test.ts`（"exposes show / hide / hideAll to a real template ref" 用例）。

**排记**: `~/.minimax/agents/*/memory/MEMORY.md` 当前不存在（§103 的 Agent Memory 落点未建），
跨项目条目先落在本文件「教训」节；如后续建库，按上节迁移。

**关联检查（未做，留作 follow-up）**: 其余含暴露方法的 uni 组件（sn-form / sn-picker-view /
sn-checkbox-group / sn-swiper 等）是否全部补了 defineExpose —— 本次仅修复 sn-notify，
未扩大 Scope（§2）；建议单独开一个 `test/exposed-surface-audit` 任务全量盘点。

**App 端备注（uni-x 报告 2026-11-21）**: 转换管线新增的 unsupported-property 规则会剥离
`pointer-events`（容器 `none` / 卡片 `auto` 都被剥）。卡片默认可命中所以功能不受影响；
仅 deck 模式下容器顶部约 16rpx 的空条带在 App 上会参与命中测试（影响可忽略）。
