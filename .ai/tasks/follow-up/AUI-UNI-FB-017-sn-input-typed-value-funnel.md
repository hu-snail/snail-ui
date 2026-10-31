# AUI-UNI-FB-017 — sn-input 输入链路：合成事件重放去重失效（每键双 emit）

日期：2026-10-31
状态：DONE（commit 6663042）

## 现场

- 用户报告「input 无法输入」，后补充「圆角和边框背景能输入，其他模块都不行」。
- uni-demo H5 dev server（最新源码）实测输入链路正常：17 个 demo 块逐一真实键入全部生效
  （仅 number 字段拒插字母，浏览器原生行为）。
- 用户实际测试面 = docs 预览 iframe 的 GitHub Pages 部署站。线上行为复现（真实键入采样）：
  t=0 字段显示 `helloX`，**~150ms 后被回写清空**——旧代码 `onInput` 读 `e.target.value`
  （合成事件下 `undefined`）→ emit 进 v-model → 受控回写清空。
- 「圆角 / 边框背景」是仅有的**没有 v-model 监听**的两个 demo（radius = 静态 model-value + readonly；
  bordered-bg = 无 model 绑定）：emit 出的坏值无人接收、字段不被回写，于是“能输入”。
  这个 能/不能 分界就是旧构建的指纹。
- 线上 sn-input chunk 指纹为 `d6db7e9`（2026-10-31 17:13「读 detail.value」修复）**之前**的版本；
  部署 workflow（`uni-demo-deploy.yml`）只认 push 到 `main`。即修复早已 commit，但从未到达任何构建/部署面。

## 根因 1（用户可见）：部署面陈旧

feature 分支上的修复不会自动部署；docs 预览永远指向 Pages 上的旧构建。
**解法**：合并到 `main`（CI 自动重新部署 uni-demo H5）。本地联调可用
`UNI_DEMO_PREVIEW_BASE=http://localhost:<port> pnpm dev:docs` 让 docs 预览指向本地 dev server。

## 根因 2（代码缺陷）：事件身份去重永不生效

uni-h5 的 `useCustomEvent` 每次 emit 都**新建**合成事件对象
（`{ type, timeStamp, target: normalizeTarget(el), currentTarget, detail }`），
sn-input 里 `event === lastMirroredEvent` 的身份比对永远为 false →
H5 上每个键交付两次（镜像一次 + uni 组件级重放一次）：两次 `update:modelValue`、
两次 `input` 事件（且两个事件对象不同）。

**解法**：改为单一管道 `deliverTypingValue()` 按值去重（`lastTypedValue` memo）；
`watch(modelValue)` 在「外部写入 ≠ 上次交付值」时重置 memo，
避免「父组件外部改值后用户删回原值」被误去重（自有 v-model 回声恒等于 memo，不会误重置）。

## 根因 3（顺手修复）：空 confirm 回退到旧 model

`onConfirm` 旧实现 `readEventValue(event) || nativeValue.value`——
confirm 携带 `detail.value: ""`（用户清空后按确认）时 `""` 为 falsy，回退成旧值。
现在 `eventDetailValue(event) ?? nativeValue.value`：有 detail 就用 detail（空也生效），
仅当事件完全无 detail（测试裸派发）才回退 model。

## 回归测试

`packages/uni/src/components/sn-input/sn-input.test.ts`：

- `delivers one update per keystroke when uni replays it as a fresh synthetic event`
- `re-delivers after an external model write lands on a different value`
- `does not dedupe consecutive distinct keystrokes`
- `emits an empty confirm (not the stale model) when the detail carries an empty value`
- `reads the value from uni synthetic input events (detail.value, POJO target)`（既有）

## 经验

- uni 组件级事件的 target 是 POJO（`normalizeTarget`），text 恒在 `detail.value`；
  且每次 emit 都是新对象——**对 uni 事件做身份去重永远是死代码**，只能按值去重。
- 部署类预览（docs iframe Pages 站）诊断时先比对线上 chunk 指纹与源码修复点，
  别把「构建面过期」当成「源码 bug」修。
- 「部分 demo 能输入、部分不能」这类分界本身就是线索：能输入的恰好是不受控
  （无 v-model）的字段 = 受控回写链路坏了的典型指纹。

## Follow-up（本次未修，范围外）

- **uni-h5 运行时丢弃 `readonly`**：`uni-h5.es.js` 的 Input 渲染里，普通分支的原生
  input 根本不绑定 `readonly`（只有 disabled+fixDisabledColor 分支映射 readonly）。
  H5 端 sn-input 的 `readonly` 字段（圆角 demo、states demo 只读字段）实际可编辑，
  只有 cursor 样式生效；MP 端正常。修复方向：sn-input 在 H5 宿主对 readonly 字段
  拦截 `beforeinput`/keydown（capture 镜像机制可复用）。
