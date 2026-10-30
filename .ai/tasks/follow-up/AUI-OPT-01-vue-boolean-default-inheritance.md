# AUI-OPT-01 follow-up — Vue boolean prop 默认值会吃掉 cell-group 继承

## 现象

`sn-cell-group` 的 `card` / `border` / `center` 继承失效：cell 上不出现
`sn-cell--card` / `--border` / `--center`，三个继承测试红。组件源码与上一次
全绿提交完全一致（`git diff` 为空），fail 却稳定复现。

## 根因

`sn-cell.vue` 的 `withDefaults` defaults 对象里删掉了
`border: undefined` / `center: undefined` / `card: undefined` 三个键。

Vue 3 对 **boolean 类型 prop** 有一条特殊规则（Boolean casting）：props 声明中
**没有** `default` 键时，缺省传入会被强制转换为 `false`，而不是 `undefined`。
因此：

```ts
const effectiveCard = computed(() => props.card ?? group?.card.value ?? false);
```

`props.card` 已经是 `false`（Vue 强转），`??` 右侧的 group 回退永远不执行 →
组级 card 永远无法下发给行。

只在 defaults 里显式写 `card: undefined` 才能让 props.card 保持 `undefined`，
`??` 才会落到 group 上。

## 为什么会被删

修 `TS2379`（`exactOptionalPropertyTypes: true`）时，把 defaults 里所有
`xxx: undefined` 一并删掉。但真正的错误源只有两个对象型 prop：

- `prefixIconData?: IconData`（类型缺 `| undefined`）
- `suffixIconData?: IconData`

它们才需要在类型声明上补 `| undefined`；boolean prop 的类型本来就含
`| undefined`（`card?: boolean | undefined`），写 `undefined` 哨兵不报错，
删掉反而引入行为回归。

## 教训

1. **`?? group?.x.value` 继承模式的 boolean prop 必须在 defaults 里显式写
   `x: undefined`**，否则 Vue 的布尔强转让它永远短路。
2. 修 TS 错误时不要"顺手清理"defaults：`undefined` 条目在 Vue 里是**语义**
   （区分「未传」和「传 false」），不是冗余。
3. 改组件 defaults 后**必须重跑组件测试**——types/props 默认值属于行为面，
   typecheck 干净不代表行为正确。

## 反模式

```ts
// ❌ 缺 undefined 哨兵 → group 继承静默失效
withDefaults(defineProps<{ card?: boolean | undefined }>(), {
  card: false,           // 或干脆不写这个键
});

// ✅ 让「未传」保持 undefined，?? 才能落到 group
withDefaults(defineProps<{ card?: boolean | undefined }>(), {
  card: undefined,
});
```

## 适用范围

跨项目（任何 Vue 3 里用 `?? group?.x.value` 做 provide/inject 继承的组件）。
本项目内已修复：`packages/uni/src/components/sn-cell/sn-cell.vue`（commit
61d927f），并配 3 条 group 继承回归测试守着。

## 对应代码

- `packages/uni/src/components/sn-cell/sn-cell.vue` — defaults 段 `border` /
  `center` / `card` 三个 `undefined` 哨兵
- `packages/uni/src/components/sn-cell/sn-cell.test.ts` — `sn-cell-group >
  inherits card / border / center` 三条测试
