# AUI-UNI-FB-023 follow-up — 滑动操作 demo 整页被横向拖动，宽度超出视口

## 现象

uni 端「滑动操作」demo 真机（mp-weixin）截图：整页内容左移、左侧卡片被裁，
右侧留下一条空白画布；滑开一行后删除胶囊停在屏幕中间而不是右缘。页面可以
横向拖动，松手后停在偏移位置。

## 根因

两件事叠加：

1. `apps/uni-demo/src/App.vue` 为修 uni-app x **web** 的弹层气泡裁剪，加了
   元素选择器全量重置：

   ```css
   uni-app uni-view {
     overflow: visible !important;
   }
   view {
     overflow: visible !important;
   }
   ```

   标准 uni-app H5 / MP 的 `view` 默认就是 `visible`，这条规则对它们没有
   放开作用，只会反向覆盖组件自己的裁剪声明。

2. `sn-swipe-action` 的 root 依赖 `overflow: hidden` 把闭合态驻外
   （`translateX(±100%)`）的动作区裁出滚动区域。root 的普通 `overflow:
hidden` 输给上面的 `!important` 后，动作区计入页面 scrollable overflow：
   390px 视口上 document scrollWidth = 552px（card 场景单钮 83px + cell-group
   双钮 139px）。`@touchmove` 里的 `event.preventDefault()` 在 mp 原生层
   不阻断页面横移，于是滑动行时整页被一起拖走。

## 修复

- `sn-swipe-action` root 的裁剪提升为 `overflow: hidden !important`：root
  clip 是手势 / 布局契约的前提，不能被宿主级 reset 改写。两条声明同为
  `!important` 时，scoped class 选择器按特异性胜出。
- demo App.vue 的全局 reset 收窄为 `#ifdef UNI_APP_X` + `#ifdef WEB`
  （`WEB` 在标准 uni-app H5 里同样为真，必须再叠 `UNI_APP_X`）：只有
  uni-app x web 运行时会给每个 view 注入 `overflow: hidden`，只有它需要
  这条全量放开；标准 H5 / MP / App 不再受影响。

## 验证

- H5（390×844）：修复前 `document.scrollWidth = 552`、`.sn-swipe-action`
  computed `overflow: visible`；修复后 `390`、`hidden`。模拟左滑后行打开
  （content translateX -88px），`document.scrollLeft` 保持 `0`。
- mp-weixin 构建：`app.wxss` 不再含 `view{overflow:visible!important}`；
  组件 wxss 为 `.sn-swipe-action[data-v-*]{…overflow:hidden!important}`；
  模拟器页面 / `.page` / `.module__body` 宽度均为 390。
- `@snui/uni`：swipe-action 单测 50/50、typecheck、lint、build 通过；
  `@snui/uni-demo-x check` 通过。
- 既有 `sn-avatar-group` 单测 8 个失败与本修复无关（组件源码 / 测试均未
  改动，属分支既有状态）。

## 通用教训

**宿主级的元素选择器 `!important` reset 会覆盖组件自身的裁剪契约**。需要
全量放开 overflow 时，必须按平台 / 作用域收窄；组件侧对「正确性依赖的
裁剪」可以显式 `!important`，让同为 important 的 class 选择器按特异性
自保。

## 反模式

- 为了修某个端（uni-app x web）的弹层，把 `view { overflow: visible
!important }` 写进共享 App.vue，让所有端一起丢掉组件裁剪；
- 只在 demo 页加 `overflow-x: hidden` 掩盖页面横移，不修 root 的 clip 契约。
