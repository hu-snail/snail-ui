# Waterfall 瀑布流（uni 端 / 移动端）

`sn-waterfall` 是 `@snui/uni`（移动端 / 小程序 / H5）的瀑布流容器：默认插槽的每个直接子节点被包进一个盒子，按「最短列优先」放入 N 列——高项不再把邻居往下推、旁边留洞。专为图片墙 / 种草 feed / 卡片墙设计，内置容器级图片懒加载配置。基于 easycom 自动注册（`components/sn-waterfall/sn-waterfall.vue` → `<sn-waterfall>`），几何值走 `rpx`。

核心保证：

- **阅读序**：列内顺序 = 插槽顺序，从不乱序。
- **append-only**：已上屏的项永不挪列；迟到加载的图片只撑长自己那一列。
- **无测量兜底**：无测量能力的环境（SSR / 服务端渲染 / 单元测试）按 round-robin 均衡分列，而不是崩溃或单列长龙。

## 基础用法

`columns` 指定列数；配合 `sn-img`（`mode="widthFix"` 让高度跟随图片真实比例）即是标准的图片瀑布流。给 `v-for` 的项加 `:key` 保持身份稳定。

<Demo name="waterfall-mp-basic" description="双列图片墙：列数、列间距与列内间距，项按最短列优先放置。" />

## 图片懒加载配置

容器的 `lazyLoad` 经 provide/inject 级联给内部所有 `sn-img`：**图片未显式传 `lazyLoad` 时继承容器配置，显式传入优先**。这就是「一处开关，整墙懒加载」——原生 `<image lazy-load>` 只在滚动区域内生效，而瀑布流正该活在 `scroll-view` / 页面滚动里。

<Demo name="waterfall-mp-lazy-load" description="容器 lazy-load 一处开启，内部图片继承；单张显式关闭仍然优先。" />

`lazyLoad` 的三条契约：

1. `<sn-waterfall lazy-load>` 内部的 `<sn-img>` 自动继承，无需逐张书写；
2. 某张图片显式写 `:lazy-load="false"` 时以它为准（例如首屏大图不参与懒加载）；
3. 瀑布流**之外**的 `sn-img` 完全不受影响，保持 wd-img 缺省值（关）。

> 与 append-only 放置配合是这套配置的关键：图片迟到解析只会撑长自己所在列，不会把整墙重排、也不会重启其他图片的进行中请求。

## 响应式列数

`minColumnWidth` 打开响应式模式：列数跟随**实测容器宽度**，`columns` 退为测量前的初始猜测（首帧 / SSR 用）。适合横竖屏切换、平板 / 桌面 H5 等多宽档场景。

<Demo name="waterfall-mp-responsive" description="min-column-width 响应式列数，随容器宽度自动增删列。" />

## 关闭瀑布流

`masonry=false` 渲染普通垂直单列堆叠（项恢复 `margin-bottom`），语义即「关掉砌墙」。

<Demo name="waterfall-mp-masonry-off" description="masonry=false 退化为一列垂直堆叠。" />

## Props

| 属性           | 类型             | 默认值 | 说明                                                                                                                                   |
| -------------- | ---------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| columns        | number           | 3      | 逻辑列数（整数 ≥ 1，小数向下取整，`0` / `NaN` / `Infinity` 回退 `1`）。`minColumnWidth` 模式下仅作测量前猜测；`masonry=false` 时忽略。 |
| minColumnWidth | string \| number | ''     | 最小列宽（数字按 rpx，字符串透传）。设置后列数跟随实测容器宽度（响应式模式）。                                                         |
| columnGap      | string \| number | 16     | 列间距（数字按 rpx），经 `--sn-waterfall-column-gap` 应用为根节点 `column-gap`。                                                       |
| rowGap         | string \| number | 16     | 列内项间距（数字按 rpx），经 `--sn-waterfall-row-gap` 应用为每列 `row-gap`。                                                           |
| masonry        | boolean          | true   | 便捷关闭开关：`false` 渲染普通垂直单列堆叠。                                                                                           |
| lazyLoad       | boolean          | false  | 容器级图片懒加载配置：级联给内部 `sn-img`（未显式传的图片继承，显式传入优先），交原生 `<image lazy-load>`。                            |
| customClass    | string           | ''     | 根节点自定义类名。                                                                                                                     |
| customStyle    | string           | ''     | 根节点自定义内联样式。                                                                                                                 |

## Events

无。纯布局容器，几何由测量 + 放置规则决定，不对外发事件。

## Slots

| 插槽名  | 说明                                                          |
| ------- | ------------------------------------------------------------- |
| default | 瀑布流内容：每个直接子节点成为一个 `.sn-waterfall__item` 盒。 |

## 布局模型

```text
root (.sn-waterfall, flex row, column-gap)
├── column 1 (.sn-waterfall__column, flex column, row-gap)  ← flex: 1 1 0
│   └── item (.sn-waterfall__item)  ← 插槽子节点
├── column 2 …
└── column N …
```

- **放置是 JS**：新项进当前最短列，平手靠左。
- **列内布局是平台自己的**（flex column + `row-gap`）：无逐帧 JS 定位、无绝对定位、无 transform 记账，滚动只是合成。
- **测量是 selector query，且只测待测项**：移动端无 ResizeObserver，`uni.createSelectorQuery` 只批量量「还没有可用高度」的项；挂载后、子项变化后各跑一轮，无待测项时整轮跳过。第一轮测量回来完整重排一次，之后只有新增 key 触发增量放置。
- **Keying**：子项 `:key` 是放置身份；无 key 回退索引，成员关系按位置算——feed 追加数据请给 key。

## 方法

| 方法      | 签名       | 说明                                                                                                                                                |
| --------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `refresh` | `(): void` | 强制全部项重测，随后新的高度参与下次放置。图片解析晚于内置测量策略（每项最多两次）的宿主用它重新对齐高度，例如占位图 → 真图切换之后（`ref` 调用）。 |

## 性能

两条热点路径是「每次渲染的 JS」与「每批新增的原生测量」，都按 O(n) 实现会随 feed 增长劣化（原生往返累计 n²）。当前实现与旧实现的实测对比：

| 路径           | 旧实现                                     | 现实现                                          | 实测                                                               |
| -------------- | ------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------------ |
| 每渲染放置判定 | `join('\0')` 签名串（数组 + 长字符串分配） | 逐键早退比较（追加 O(1)，内容变化 O(n) 零分配） | n=1000：0.143ms → 0.0135ms；每渲染分配 ~4000 → ~1 个数组           |
| 测量请求量     | 每轮 `selectAll` 整墙                      | 每轮只请待测项                                  | 10 页 × 20 项：1100 → 200 盒（5.5×）；500 项墙追加 20 项：500 → 20 |
| 无关重渲染     | 每次更新一轮整墙查询                       | O(1) 计数门，无待测项直接跳过                   | 行距 / 父级状态变化 → 0 次查询                                     |
| 固定列数挂载   | 一律做容器测量 + `getSystemInfoSync` 探测  | 只在 `minColumnWidth` 模式发生                  | 固定模式：0 次容器查询 / 0 次视口探测                              |
| 离场项         | 高度永不释放                               | 放置重建时剪除离场 key 的高度与池化条目         | —                                                                  |

## 主题变量

| 变量                      | 默认值 | 用途                |
| ------------------------- | ------ | ------------------- |
| --sn-waterfall-column-gap | 16rpx  | 列间 `column-gap`。 |
| --sn-waterfall-row-gap    | 16rpx  | 列内 `row-gap`。    |

宿主可在根（或任意祖先）重指而不动 props。全部长度 rpx（750 设计稿）。

## 无障碍

- 根节点是纯布局容器，不拦截交互；可点区域由插槽内容（如 `sn-img`）自行承担。
- 装饰性几何（列包装）不参与朗读树。

## 暗色模式

容器不自己着色（无背景 / 边框 / 文字 / 阴影），因此暗色下无需适配、也不会有浅色漏出；图片与内容的颜色由插槽内容（如 `sn-img`、`sn-card`）各自的语义 token 决定。

## 相关

- 图片：[`sn-img`](/components/uni/img)（懒加载与加载 / 失败态）
- 分页列表：[`sn-paging`](/components/uni/paging)（瀑布流可作其内容）
- 宫格：[`sn-grid`](/components/uni/grid)
