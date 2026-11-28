# AUI-UNI-FB-012 — uni host 不得通过 globalThis 读取（classic uni-app 小程序上恒为 undefined）

- 状态：OPEN（sn-qr-code 已修复并留源码护栏；其余组件待迁移）
- 组件：`packages/uni/src/components/sn-qr-code/sn-qr-code.vue`（已修，参照实现）；受影响同类清单见下
- 类型：运行时缺陷（系统性模式缺陷），Public API 无变更

## 现场

用户报告 uni 端 `sn-qr-code` 在微信小程序（classic uni-app 与 uni-app x 两个 demo 工程均）不渲染。修复 TextEncoder 后仍空白。

## 根因（编译器契约，不是代码笔误）

uni-app Vue3 / uni-app x 编译器把源码里的 **free 标识符 `uni`** 重写为注入的 API 模块（编译产物中为 `require(".../common/vendor.js")` 的 `e.index.xxx`）。这条重写通道只认 free identifier。

`globalThis.uni` **不会被重写**，而在 classic uni-app 编译到微信小程序后 **app-service 全局上根本没有 `uni` 属性**（WeChat DevTools 3.17.6 app-service 实测：`typeof globalThis.uni === 'undefined'`，`typeof document === 'object'`、`typeof TextEncoder === 'function'` 均为 devtools 特有环境）。于是所有 `(globalThis as { uni?... }).uni` 读取返回 `null`：

```text
sn-qr-code 旧 getUni(): globalThis.uni → null
  → tryLegacySurface(): uni.createCanvasContext 不存在 → null
  → tryW3cSurface(): MP 上无 W3C 元素 → null
  → acquireSurface() === null → 永不绘制 → 画布空白
```

H5 / uni-app x 不受影响（uni-app x 注入 globalThis.uni；H5 有 window.uni）——这正是该缺陷长期漏测的原因。

## 修法（sn-qr-code 参照实现）

```ts
declare const uni: UniHost | undefined; // 类型层声明，构建时擦除

function getUni(): UniHost | null {
  try {
    return uni ?? null; // free identifier → 编译器重写 → 各端真实 uni API
  } catch {
    const host = globalThis as { uni?: UniHost }; // vitest 桩通道（未 stub 时 free 标识符在此抛 ReferenceError）
    return host.uni ?? null;
  }
}
```

- 用 try/catch 而非 `typeof uni`：UTS（uni-app x App）对命名空间对象的 typeof 语义不可靠。
- uni-x transform 已加 patch 剥离 `declare const uni` 行（UTS 无 ambient 声明，`uni` 是内建命名空间）。
- 源码护栏：`sn-qr-code.test.ts` 「should read the uni host through the free identifier」断言 `return uni ?? null` 存在——该缺陷只存在于编译产物中，happy-dom 单测无法行为级复现，源码约定是唯一可自动化的防线。

## 受影响同类清单（待逐组件迁移 + 验证）

以下读取点在 classic uni-app MP 上拿到 `null`（部分有静默降级，部分功能失效）：

| 组件 | 读取点 | MP 上的后果（预估，逐个验证） |
| ---- | ------ | ----------------------------- |
| sn-curtain | `globalThis.uni.navigateTo` 守卫查找 | 广告幕布 `to` 跳转静默失效 |
| sn-floating-panel | `globalThis.uni.getSystemInfoSync` | 锚点测量失效，退化静态锚 |
| sn-image-preview | `globalThis as { uni?: UniHost }` | 待验证（可能影响关闭/测量） |
| sn-paging | `globalThis.uni.createSelectorQuery`（946） | 待验证（有 document 探测分流） |
| sn-captcha | `globalThis.uni.createSelectorQuery` | 滑块坐标测量失效 |
| sn-fit-swiper | `globalThis.uni` 高度测量 | 自适应高度不生效 |
| sn-resize | globalThis 查找 | 待验证 |
| sn-rich-text / sn-rich-text-node | globalThis uni host | 待验证 |
| sn-scratchcard | globalThis 查找 | 待验证 |
| sn-segmented | globalThis 查找 | 待验证 |
| sn-sidebar (scroll) | globalThis 查找 | 待验证 |
| sn-signature | globalThis 查找 | 签名板画布解析失效（MP） |
| sn-slide-verify | globalThis 查找 | 待验证 |
| sn-text | globalThis 查找 | 待验证 |
| sn-waterfall | `globalThis.uni`（314） | 列测量失效 |

已确认正确的参照：`sn-img.vue` / `sn-navbar.vue` 用 free identifier + `typeof uni.xxx` 守卫（编译器重写通道，MP 正常）；`sn-icon-mp.ts` 已在注释中记录过该编译器事实并走 `$scope` 回退。

## 执行清单

1. 逐组件套用 sn-qr-code 的 getUni 形态（free identifier 优先 + globalThis 回退）。
2. 每组件补一条源码护栏断言（同 sn-qr-code.test.ts 形态）。
3. uni-x `declare` 剥离 patch 按组件补齐。
4. 微信开发者工具逐组件冒烟（页面截图 + console 无 ReferenceError）。
5. 完成后在本文件记录 FIXED 并更新本条至 User/Agent Memory（跨项目通用编译器契约）。

## Memory Entry（跨项目，待 memory 归档）

### uni free identifier vs globalThis.uni (2026-11-15)
Type: gotcha
**坑**: 组件在微信小程序上 canvas / 跳转 / 测量等 uni API 调用静默失效，H5 与 uni-app x 正常。
**根因**: uni-app 编译器只把 free 标识符 `uni` 重写为注入 API 模块；`globalThis.uni` 在 classic uni-app 小程序 app-service 上从未被赋值。
**教训**: uni 端源码访问 uni API 必须写 free identifier `uni.xxx`（类型层 `declare const uni` 供 tsc）；globalThis 读取仅可作为测试桩回退通道。
**反模式**: `const host = globalThis as { uni?: ... }; host.uni?.xxx` 作为唯一获取通道。
**适用范围**: 跨项目（所有 uni-app / uni-app x 工程）。
**对应代码**: packages/uni/src/components/sn-qr-code/sn-qr-code.vue (getUni)
