# sn-toast：outside-close 闪退 + MP demo 间距（2026-11-25）

Type: gotcha · rule

**坑**（设备实测，微信小程序 uni-demo-x 轻提示页）:
1. 点任意按钮开 toast，toast "闪一下就关闭"；点 toast 本体也立刻消失。
2. 基础用法 / 图标尺寸模块里按钮完全贴在一起（`sn-demo--stack` 的
   `gap: 16rpx` 全部失效），但同 demo 内 **native view 行**（图标行的
   `sn-toast-demo__row`）间距正常。
3. 纵向排版 toast `duration=0` 常驻不消失。

**根因**:
1. **闪退**：`sn-toast` 在 `onMounted` 里把自身注册进
   `utils/outside-close` 的全局关闭队列。uni-x 转换管线会**剥掉所有
   `pointer-events` 声明**（uni-app x 不支持），于是 toast 挂载后的
   全屏 fixed 根节点拦截整页触摸；任何 tap（包括点在 toast 盒子上，
   盒子的 `@tap` 不 stop 冒泡）都冒到 `DemoPageShell` 根的
   `@click="closeOutside"` → `requestClose()` → 瞬时关闭。wot-ui 的
   wd-toast 是 duration 驱动的瞬态提示，**不参与** closeOutside。
   同类高危组件：任何"全屏 fixed + 依赖 pointer-events 穿透"的弹层
   （MP 上 pointer-events 全部失效，穿透语义不成立）。
2. **间距**：组件页 MP-WEIXIN 条件块里有
   `.demo-host { display: block; width: 100% }`（修 host 收缩的设备实测
   回归），uni-app x 编译器把它**加特异性**为
   `.demo-host[class].data-v-page`（0,3,0），压过 demo 根 scoped 规则
   `.sn-demo--stack.data-v-demo`（0,2,0）→ 根被拍平成块流，flex+gap
   全失。而 demo **内层** view 带不上 `demo-host`，不受影响 —— 这就是
   "native view 行有间距、组件按钮行没有"的原因。
3. **常驻**：demo 源码 `:duration="0"`（演示"0 = 不自动关"），只能靠
   `@click` 关；在根因 1 修复前点关链路也被 closeOutside 抢跑。

**教训**:
- **瞬态反馈类组件（toast/loading 提示）不要进 outside-close 队列**；
  该队列只适合"点外部关闭"语义的浮层（tooltip / popover / drop-menu /
  swipe-action / fab）。组件头注释已写明该约束，勿回加。
- **MP 组件页的 `.demo-host[class]` 规则会压掉 demo 根的一切 display
  声明** —— demo 根不要依赖自身的 display/flex 布局语义，需要 flex+gap
  时下沉到内层 view 承载（本次 10 个 toast demo 的修法）。
- MP 上 `pointer-events` 被 uni-x 管线整体丢弃，"透明遮罩让点击穿透"
  的写法在 MP 端一律不成立。

**反模式**:
```ts
// ✗ 瞬态提示注册进 outside-close：任何 tap 都会杀掉它
onMounted(() => registerOutsideClosable(uid, () => requestClose()));
// ✗ demo 根上声明 flex + gap（页面 .demo-host[class] 会拍平它）
<view class="sn-demo sn-demo--stack">…</view>
// ✓ 内层承载 stack
<view class="sn-demo"><view class="sn-demo--stack">…</view></view>
```

**适用范围**: 本项目（uni-x 管线 + demo 脚手架约定）。

**对应代码**:
- `packages/uni/src/components/sn-toast/sn-toast.vue`（"Deliberately NOT
  in the outside-close queue" 段）
- `packages/uni/src/utils/outside-close.ts`
- `apps/uni-demo/src/pages/feedback-2/demos/toast-mp-basic.vue`（内层
  stack 注释）
- 组件页规则：`apps/uni-demo/src/pages/feedback-2/toast.vue` MP-WEIXIN
  `.demo-host` 块

**回归测试**: `packages/uni/src/components/sn-toast/sn-toast.test.ts`
> "stays open when the page dispatches closeOutside"（修复前红 → 修复后绿）。

**Follow-up（未做，需单独任务）**:
- 系统性修法候选：组件页 `.module__body` 改 `display: flex; flex-direction:
  column`（flex item 自动块级化，host 铺满列宽），可整体替换
  `.demo-host { display: block }` 且不再压 demo 根布局 —— 但影响**全部**
  组件页 + H5/MP 两端，需设备实测回归（swipe 右锚定、DemoModuleHead 徽标
  行）后才能动 `scripts/gen-pages.mjs` 模板。
- `packages/uni` 全量 vitest 有 8 个 **预存在** 的
  `sn-avatar-group` 失败（max-count 裁剪 / overflow 断言，HEAD 即失败，
  与本次改动无关）。
