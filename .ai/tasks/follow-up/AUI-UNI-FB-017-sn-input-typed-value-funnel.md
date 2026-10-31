# AUI-UNI-FB-017 — sn-input 输入链路：合成事件重放去重失效（每键双 emit）

日期：2026-10-31
状态：DONE（commit 6663042）

## 现场

- 用户报告「input 无法输入」。
- uni-demo H5 dev server（最新源码）实测输入链路正常（text / number / textarea / clear-再输入全通）。
- docs 端 uni 预览 iframe 的是 GitHub Pages 部署站（`uni-demo-deploy.yml` 只在 push 到 `main` 时部署），
  线上 sn-input chunk 指纹为 `d6db7e9`（2026-10-31 17:13「读 detail.value」修复）**之前**的版本：
  `onInput` 仍读 `e.target.value`，uni 合成事件下为 `undefined` → 每敲一键 model 被写坏、字段清空。
  即：修复早已 commit，但从未到达任何构建/部署面（部署站、本地 dist、docs public bundle 全部过期）。

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
