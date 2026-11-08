# AUI-UNI-FB-017 — sn-input 真实 Chrome 无法输入（uni-input 陈旧 state2 回写）+ ExFAT 监听失效

日期：2026-10-31 ～ 11-01
状态：DONE

## 现场（时间线还原）

1. 用户报告「input 无法输入」，后补充「圆角和边框背景能输入，其他模块都不行」。
2. 前一轮（6663042 等）在 **WebKit 内置浏览器 + happy-dom** 里验证"全部正常"，据此把矛头指向
   部署站陈旧——**对真实 Chrome 的判断是错的**：用户在真实 Chrome 上对 5174 依然无法输入。
3. 真实 Chrome（playwright-core + channel:'chrome'）复现：
   - 裸 `<input>` / 注入的同位置克隆（脱离 Vue 管理）：正常；
   - Vue 管理的 sn-input 字段：keydown/keypress/beforeinput/input 全部触发、无 preventDefault、
     `data:"a"` 存在，**但字段值从不变化**——Blink 的键入编辑命令被整体丢弃；
   - `document.execCommand('insertText')` 在同一字段可用 → 键事件编辑管线特有的问题。
4. 部署站（GitHub Pages）独立确认仍是 `d6db7e9` 之前的构建（真实键入 ~150ms 后清空），
   与本问题叠加但相互独立。

## 根因 1（本 bug 核心）：uni-input 陈旧 state2 回写吃掉键入字符

uni-h5 的 Input 组件渲染读取**内部 `state2.value`**（不是 `value` prop），其自身字段监听在
**bubble 相位**才把 DOM 值同步进 `state2`。而 sn-input 为了计数器/清空按钮的实时性，每个键都会
重渲染（`lastTypedValue` 驱动）——重渲染级联到 uni-input 时，uni 自己的监听器还没跑，
**渲染读到的是陈旧的 `state2`，uni-h5-vue 的 patchDOMProp 随即把陈旧文本写回字段**，
Blink 刚插入的字符被覆盖。HTML 规范在**每个事件监听器回调结束后**运行微任务检查点，
Chrome 逐键命中；WebKit 的时序恰好幸免——这就是"内置浏览器全绿、真实 Chrome 全挂"的原因。

证据链：裸 uni-input + 相同绑定（`data-sn-bisect` 对照）正常；同位置脱离 Vue 管理的克隆正常；
属性全消融、invoker 摘除均不影响 → 唯一变量是 Vue 对该元素的活动性补丁。

## 修复（sn-input-field.vue 子组件 + 三重防线）

1. **uni-input 隔离进 `SnInputField` 子组件**：uni-input 的 vnode 的 props 在键入期间全部
   身份/值稳定（外部写入才变化的 `value`、缓存的 `nativeClass`），父组件每键重渲染在
   `shouldUpdateComponent` 处被拦下，不再级联触碰字段。
2. **回显抑制（externalValue / boundNativeValue）**：`value` prop 只跟随外部模型写入；
   自有 v-model 回声不改变该 prop（同时省掉每键一轮 vdom 往返）。
3. **capture 相位 $triggerInput 同步**：字段镜像在 capture 相位调用 uni 自己暴露的
   `$triggerInput({value})`，把 `state2` 与 DOM 从捕获时刻起锁定一致——此后任何重渲染的
   回写都是同值 no-op。对残余级联的兜底防线。

回归测试 105/105（含 5 条链路回归）；真实 Chrome 17 个 demo 块逐一真实键入（含中文）
16/16 可输入块全部生效（number 字段拒插字母为浏览器原生行为）。

## 根因 2（dev 基础设施）：ExFAT 卷上 vite 监听完全失效

仓库位于 `/Volumes/JZ-miniGo`（**ExFAT**）——FSEvents 在 ExFAT 上不可用，chokidar 收不到任何
文件事件 → vite 永不失效模块 → **dev server 自启动起一直服务陈旧编译产物**（重启也一样，
因为失效依赖根本不存在的文件事件）。这解释了：

- 用户在 5174 上"怎么改都不生效"的体感；
- 8f3ee5b 的 watch 重包含修复"无效"（ExFAT 下没有事件，重包含 glob 无济于事）；
- 本轮调试中大量"修复无效"的假象——**修复从未到达浏览器**。

**修复**：`apps/uni-demo/vite.config.ts` 的 `server.watch` 加 `usePolling: true, interval: 300`
（外置卷上轮询是唯一可靠方式），并补上 `preserveSymlinks` 解析出的真实路径
（`packages/uni/src/**` 等）的重包含。**在这个仓库里改组件源码后，dev server 必须能感知——
卷格式不变的话此配置不能删。**

## 经验

- **"部分模块能输入、部分不能"的分界 = 不受控字段幸存** —— 受控回写链路坏了的指纹；
  但同款分界也可能来自"陈旧构建"，两层层叠时先用 chunk 指纹 + 全新浏览器会话分离变量。
- **WebKit/happy-dom 全绿 ≠ Chrome 可用**：涉及原生输入框受控循环的组件，必须用真实
  Chrome 验证（playwright-core + channel:'chrome' 即可，无需装浏览器）。
- **ExFAT/网络卷上开发：vite 必须 usePolling**；否则"改了没生效"会被误诊为代码问题，
  且污染所有基于 dev server 的实验结论（本轮多处实验因此作废）。
- **受控输入组件包第三方输入器（uni-input 等）时**：绝不能假设"父级重渲染不会发生在
  键入中途"——必须把第三方组件的 vnode props 做到键入期间全稳定，或让其内部状态与 DOM
  在最早相位锁步。

## Follow-up（未修，另行登记）

- uni-h5 运行时丢弃 `readonly`：H5 端 readonly 字段实际可编辑（MP 正常）。
- 部署站陈旧：合并 main 触发 `uni-demo-deploy.yml` 后消失；本地联调用
  `UNI_DEMO_PREVIEW_BASE=http://localhost:5174 pnpm dev:docs`。
