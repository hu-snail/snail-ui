# sn-waterfall — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-waterfall
> component. Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware
> listing. **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §112.3a — never surfaces in
> the user-facing docs): **AUI 追加组件**（AUI-MP-LIST-008）。wot-ui 82 个组件
> 无瀑布流（.ai/reference/wot-ui-api-spec.json 核验），无 1:1 参考面；放置
> 算法与 prop 面对齐 web 端 `SnWaterfall`（AUI-WEB-DD-030），同一份纯函数
> （`waterfall-assign.ts`，两端同源同测试）。

## Purpose

瀑布流（图片优先的多列砌墙容器）：默认插槽的每个直接子节点被包进一个
`.sn-waterfall__item` 盒，按「最短列优先」放入 N 列——高项不再把邻居往下
推、留下旁边的大洞。典型用途：图片墙、种草 / 商品 feed、卡片墙。

核心保证（与 web 端同契约）：

- **阅读序**：列内顺序 = 插槽顺序，从未乱序。
- **append-only**：已上屏的项永不挪列；迟到加载的图片只撑长自己那一列。
- **无测量兜底**：无 selector query 环境（SSR / happy-dom）round-robin
  均衡分列，而不是崩溃或单列长龙。

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-waterfall :columns="2" lazy-load>
  <sn-img v-for="p in photos" :key="p.id" :src="p.src" mode="widthFix" />
</sn-waterfall>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnWaterfall } from '@snui/uni/components/sn-waterfall/sn-waterfall.vue';
```

## Props

| Name             | Type               | Default | Description                                                                                                                                                   |
| ---------------- | ------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `columns`        | `number`           | `3`     | 逻辑列数（整数 ≥ 1，小数向下取整，`0` / `NaN` / `Infinity` 回退 `1`）。`minColumnWidth` 模式下仅作测量前的初始猜测；`masonry=false` 时忽略。                  |
| `minColumnWidth` | `string \| number` | `''`    | 最小列宽（数字 = rpx，字符串原样透传）。设置后列数跟随实测容器宽度（响应式模式）；`columns` 退为测量前猜测。                                                  |
| `columnGap`      | `string \| number` | `16`    | 列间距（数字 = rpx），经 `--sn-waterfall-column-gap` 应用为根节点 `column-gap`。                                                                              |
| `rowGap`         | `string \| number` | `16`    | 列内项间距（数字 = rpx），经 `--sn-waterfall-row-gap` 应用为每列 `row-gap`。                                                                                  |
| `masonry`        | `boolean`          | `true`  | 便捷关闭开关：`false` 渲染普通垂直单列堆叠（项恢复 `margin-bottom`）。                                                                                        |
| `lazyLoad`       | `boolean`          | `false` | 容器级图片懒加载配置：级联给内部 `sn-img`（未显式传 `lazyLoad` 的图片继承容器配置，显式传入优先），交给原生 `<image lazy-load>`，滚动到可视区前后才发起请求。 |
| `customClass`    | `string`           | `''`    | 根节点自定义类名。                                                                                                                                            |
| `customStyle`    | `string`           | `''`    | 根节点自定义内联样式。                                                                                                                                        |

## Slots

| Name      | Params | Description                                                   |
| --------- | ------ | ------------------------------------------------------------- |
| `default` | `()`   | 瀑布流内容：每个直接子节点成为一个 `.sn-waterfall__item` 盒。 |

## Events

无。纯布局容器，几何由测量 + 放置规则决定，不对外发事件。

## Layout model

```text
root (.sn-waterfall, flex row, column-gap)
├── column 1 (.sn-waterfall__column, flex column, row-gap)  ← flex: 1 1 0
│   └── item (.sn-waterfall__item)  ← 插槽子节点
├── column 2 …
└── column N …
```

- **放置是 JS**（`./waterfall-assign` 纯函数，两端同源同测试）：新项进当前
  最短列，平手靠左。
- **列内布局是平台自己的**（flex column + `row-gap`）：无逐帧 JS 定位、无
  绝对定位、无 transform 记账，滚动只是合成。
- **append-only**：已放置的项永不挪列。追加数据或图片迟到解析不会移动已
  上屏内容（也不会重启进行中的图片请求）。代价是列「尽可能均衡」而非最优。
- **测量是 selector query，且只测待测项**：MP / App 端无 ResizeObserver，
  `uni.createSelectorQuery().selectAll()` 是唯一批量拿盒子高度的跨端 API；
  组件查询 `.sn-waterfall__item--pending`（还没有可用高度的项），因此一轮的
  代价是 O(新增) 而不是 O(墙长)。挂载后、子项变化后各跑一轮，无待测项时整轮
  跳过。第一轮测量回来完整重排一次（packOnce），之后只有新增 key 触发增量放置。
  测到 0（图片还没有盒子高度）的项会在后续轮次重测一次；再往后高度只作后续放置
  的参考，宿主要重新对齐可调 `refresh()`。
- **Keying**：子项 vnode 的 `key`（v-for 的 `:key`）是放置身份（前缀
  `k:`）；无 key 回退索引（前缀 `#`），成员关系按位置算——feed 追加数据请
  给 key。

## Methods

| Name      | Signature  | Description                                                                                                                                  |
| --------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `refresh` | `(): void` | 强制全部项重测（每项重置为「待测」并重排一次标记），随后新的高度参与下次放置。图片解析晚于内置两次测量的宿主用它重新对齐高度（`ref` 调用）。 |

## Performance

两条热点路径都是「渲染期 JS」与「每批新增的原生测量」，两端按 O(n) 实现会随
feed 增长劣化（原生往返累计 n²）：

| 路径            | 旧实现                                          | 现实现                                               | 实测                                                               |
| --------------- | ----------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------ |
| 每渲染放置判定  | `join('\u0000')` 签名串（阵列 + 长字符串分配）  | 逐键早退比较（追加 O(1) 失配，内容变化 O(n) 零分配） | n=1000：0.143ms → 0.0135ms；每渲染分配 ~4000 → ~1 个数组           |
| 测量请求量      | 每轮 `selectAll('.sn-waterfall__item')` 整墙    | 每轮只请求 `.sn-waterfall__item--pending`            | 10 页 × 20 项：1100 → 200 盒（5.5×）；500 项墙追加 20 项：500 → 20 |
| 无关重渲染      | 每次更新一轮整墙查询                            | O(1) 计数门：无待测项直接跳过                        | 行距 / 父级状态变化 → 0 次查询                                     |
| 并发轮次        | 挂载 + 立即追加各起一轮，互相竞争               | `scheduleMeasure` 合并为一轮                         | —                                                                  |
| 固定列数挂载    | 无论如何都做容器测量 + `getSystemInfoSync` 探测 | 两者只在 `minColumnWidth` 模式发生                   | 固定模式：0 次容器查询 / 0 次视口探测                              |
| 长生命周期 feed | 离场项的高度永不释放                            | 放置重建时剪除离场 key 的高度与池化条目              | —                                                                  |
| 每项包装        | `:nodes="[entry.node]"` 每项每渲染一个 1 元数组 | `:node="entry.node"` 直传                            | n 个数组 → 0                                                       |

## Image lazy loading

容器自身不加载任何内容。`lazyLoad` 经 provide/inject
（`./sn-waterfall-types` 的 `SN_WATERFALL_KEY`）级联给内部 `sn-img`：

```vue
<sn-waterfall :columns="2" lazy-load>
  <!-- 未传 lazyLoad 的图片继承容器的 lazy-load="true" -->
  <sn-img v-for="p in photos" :key="p.id" :src="p.src" mode="widthFix" />
  <!-- 显式传入优先 -->
  <sn-img :src="hero.src" mode="widthFix" :lazy-load="false" />
</sn-waterfall>
```

原生 `<image lazy-load>` 只在滚动区域内生效——瀑布流正该活在
`scroll-view` / 页面滚动里。配上 append-only 放置，迟到加载的图片只撑长
自己那一列，不引发整墙重排。瀑布流外的 `sn-img` 不受容器配置影响，保持
wd-img 缺省（关）。

## Fallbacks (explicit, AGENTS.md §85)

- **无 selector query**（happy-dom / SSR / 宿主残缺 / 抛错宿主）：静默
  round-robin——列均衡、阅读序从左到右，静态布局而非崩溃。
- **响应式模式无测量宽度**：用 `columns` 作猜测（SSR 渲染真网格而非单列
  长龙）；rpx 的 `minColumnWidth` 在拿到 `windowWidth` 前不参与计算。
- **字符串几何**：CSS 收到原字符串；放置数学按 `parseFloat` 读 px 近似
  （`parsePx`），只影响相对列评分，误差不超出其舍入。

## Tokens Consumed (end: mp)

无 `--sn-mp-*` 颜色别名：布局容器不自己着色（无背景 / 边框 / 文字 /
阴影），无可 token 化的颜色。仅两个组件作用域自定义属性（rpx），由 props
内联、`<style scoped>` 内有字面回退：

| Custom property             | Default | Use                 |
| --------------------------- | ------- | ------------------- |
| `--sn-waterfall-column-gap` | `16rpx` | 列间 `column-gap`。 |
| `--sn-waterfall-row-gap`    | `16rpx` | 列内 `row-gap`。    |

宿主可在根（或任意祖先）重指而不动 props。全部长度 rpx（750 设计稿）。

## uni-x Porting Notes

- 模板使用 `view` + `flex` 布局，无伪元素依赖；`column-gap` / `row-gap`
  在 uvue 上如不支持则退化为无列间距（place placement 不受影响）。
- `uni.createSelectorQuery` 在 uni-app x (uvue) 侧 API 同名；若宿主不可用，
  走 round-robin 兜底，不抛错。

## Versioning

`@snui/uni@0.1.0` — initial release. 列表滚动批次（AUI-MP-LIST-008）。
放置数学实现于 `./waterfall-assign.ts`（纯函数，单测
`waterfall-assign.test.ts`，与 web 端 `packages/vue-web/src/waterfall/` 同源）。
