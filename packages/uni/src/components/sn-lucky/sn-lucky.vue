<script setup lang="ts">
/**
 * SnLucky (uni-end) — 九宫格抽奖（业务组件 AUI-BIZ-004）。
 *
 * Reference library: lime-ui `l-lucky-grid`
 *   (https://limeuix.qcoon.cn/components/lucky)
 * Prop 语义对齐参考：rows / cols / prizes / gutter / cellHeight / speed；
 * 流程一致 —— `play()` 开始循环高亮，宿主拿到结果后 `stop(index)` 减速落定，
 * 派发 `end(index)`。支持 rows/cols ≥ 3 的任意网格（奖励沿周长分布）。
 *
 * Per AGENTS.md §116.2: class 选择器、hover-class 按压态、文字 <text>；
 * 定时器全部登记并在卸载时清理（§41）。
 *
 * Not responsible for: 中奖概率 / 库存 —— index 由宿主决定。
 */

import { computed, onBeforeUnmount, ref } from 'vue'

defineOptions({ name: 'SnLucky' })

export interface SnLuckyPrize {
  /** 奖品名。 */
  name: string
  /** 奖品图（可选）。 */
  img?: string
  /** 激活时格子背景色（可选）。 */
  color?: string
}

const props = withDefaults(
  defineProps<{
    /** 行数（≥3）。 */
    rows?: number
    /** 列数（≥3）。 */
    cols?: number
    /** 奖品列表（沿周长顺序排列，不足的格子显示占位）。 */
    prizes?: SnLuckyPrize[]
    /** 格子间距。 */
    gutter?: string
    /** 格子高度。 */
    cellHeight?: string
    /** 循环高亮步进间隔（ms）。 */
    speed?: number
    /** 根节点自定义类名。 */
    customClass?: string
    /** 根节点自定义样式。 */
    customStyle?: string
  }>(),
  {
    rows: 3,
    cols: 3,
    prizes: () => [],
    gutter: '8rpx',
    cellHeight: '120rpx',
    speed: 60,
    customClass: '',
    customStyle: '',
  },
)

const emit = defineEmits<{
  (e: 'start'): void
  (e: 'end', index: number): void
}>()

defineSlots<{
  /** 自定义奖品格（{ item, index, isActive }）。 */
  prize?(props: { item: SnLuckyPrize | null; index: number; isActive: boolean }): unknown
  /** 自定义抽奖按钮（{ isPlaying }）。 */
  button?(props: { isPlaying: boolean }): unknown
}>()

const rows = computed(() => Math.max(3, props.rows))
const cols = computed(() => Math.max(3, props.cols))

/** 周长格子的顺时针行走序：上行 → 右列 → 下行（反向）→ 左列（反向）。 */
const order = computed<{ row: number; col: number }[]>(() => {
  const r = rows.value
  const c = cols.value
  const cells: { row: number; col: number }[] = []
  for (let col = 1; col <= c; col++) cells.push({ row: 1, col })
  for (let row = 2; row <= r - 1; row++) cells.push({ row, col: c })
  for (let col = c; col >= 1; col--) cells.push({ row: r, col })
  for (let row = r - 1; row >= 2; row--) cells.push({ row, col: 1 })
  return cells
})

const perimeterCount = computed(() => order.value.length)
const activeIndex = ref(-1)
const playing = ref(false)
let cycleTimer: ReturnType<typeof setInterval> | null = null
const chainTimers: ReturnType<typeof setTimeout>[] = []

function clearTimers(): void {
  if (cycleTimer !== null) {
    clearInterval(cycleTimer)
    cycleTimer = null
  }
  for (const timer of chainTimers) clearTimeout(timer)
  chainTimers.length = 0
}

/** 开始循环高亮（宿主拿到结果后调用 stop(index) 落定）。 */
function play(): void {
  if (playing.value || perimeterCount.value === 0) return
  playing.value = true
  emit('start')
  let step = 0
  cycleTimer = setInterval(() => {
    step += 1
    activeIndex.value = step % perimeterCount.value
  }, Math.max(16, props.speed))
}

/** 停止到指定奖品索引：再绕一圈并逐步减速落定。 */
function stop(index: number): void {
  if (!playing.value) return
  const total = perimeterCount.value
  const target = Math.min(total - 1, Math.max(0, Math.round(index)))
  clearTimers()
  const from = activeIndex.value < 0 ? 0 : activeIndex.value
  const steps = ((target - from + total) % total) + total
  let walked = 0
  const walk = (): void => {
    walked += 1
    activeIndex.value = (from + walked) % total
    if (walked >= steps) {
      playing.value = false
      emit('end', target)
      return
    }
    const remain = steps - walked
    const delay = Math.max(16, props.speed) + Math.max(0, total - remain) * 14
    chainTimers.push(setTimeout(walk, delay))
  }
  const delay = Math.max(16, props.speed)
  chainTimers.push(setTimeout(walk, delay))
}

function onButtonTap(): void {
  if (!playing.value) play()
}

onBeforeUnmount(clearTimers)

defineExpose({ play, stop })

const rootClass = computed(() => ['sn-lucky', props.customClass])
const rootStyle = computed(() => {
  const parts = [`gap: ${props.gutter}`, `padding: ${props.gutter}`]
  if (props.customStyle !== '') parts.push(props.customStyle)
  return parts.join('; ')
})

const midRows = computed(() => rows.value - 2)

/** 周长序号：格子坐标 → 0..P-1，不在周长上的返回 -1。 */
function orderIndex(row: number, col: number): number {
  return order.value.findIndex((cell) => cell.row === row && cell.col === col)
}

function prizeAt(index: number): SnLuckyPrize | null {
  return props.prizes[index] ?? null
}

function cellClass(index: number): (string | Record<string, boolean>)[] {
  return ['sn-lucky__cell', { 'sn-lucky__cell--active': activeIndex.value === index }]
}

function cellStyle(index: number): string {
  const active = activeIndex.value === index
  const background = active ? (prizeAt(index)?.color ?? 'var(--sn-mp-color-action-primary-soft)') : 'var(--sn-mp-color-background-surface)'
  return `background-color: ${background}`
}
</script>

<template>
  <view :class="rootClass" :style="rootStyle">
    <view class="sn-lucky__row">
      <view
        v-for="col in cols"
        :key="`top-${col}`"
        :class="cellClass(orderIndex(1, col))"
        :style="cellStyle(orderIndex(1, col))"
      >
        <slot
          name="prize"
          :item="prizeAt(orderIndex(1, col))"
          :index="orderIndex(1, col)"
          :is-active="activeIndex === orderIndex(1, col)"
        >
          <image
            v-if="prizeAt(orderIndex(1, col))?.img !== undefined"
            class="sn-lucky__img"
            :src="prizeAt(orderIndex(1, col))?.img"
            mode="aspectFit"
          />
          <text class="sn-lucky__name">{{ prizeAt(orderIndex(1, col))?.name ?? '' }}</text>
        </slot>
      </view>
    </view>

    <view class="sn-lucky__middle">
      <view class="sn-lucky__side">
        <view
          v-for="row in midRows"
          :key="`left-${row}`"
          :class="cellClass(orderIndex(row + 1, 1))"
          :style="cellStyle(orderIndex(row + 1, 1))"
        >
          <slot
            name="prize"
            :item="prizeAt(orderIndex(row + 1, 1))"
            :index="orderIndex(row + 1, 1)"
            :is-active="activeIndex === orderIndex(row + 1, 1)"
          >
            <text class="sn-lucky__name">{{ prizeAt(orderIndex(row + 1, 1))?.name ?? '' }}</text>
          </slot>
        </view>
      </view>

      <view
        class="sn-lucky__button"
        :hover-class="playing ? 'none' : 'sn-lucky__button--down'"
        @tap="onButtonTap"
      >
        <slot name="button" :is-playing="playing">
          <text class="sn-lucky__button-text">{{ playing ? '抽奖中' : '立即抽奖' }}</text>
        </slot>
      </view>

      <view class="sn-lucky__side">
        <view
          v-for="row in midRows"
          :key="`right-${row}`"
          :class="cellClass(orderIndex(row + 1, cols))"
          :style="cellStyle(orderIndex(row + 1, cols))"
        >
          <slot
            name="prize"
            :item="prizeAt(orderIndex(row + 1, cols))"
            :index="orderIndex(row + 1, cols)"
            :is-active="activeIndex === orderIndex(row + 1, cols)"
          >
            <text class="sn-lucky__name">{{ prizeAt(orderIndex(row + 1, cols))?.name ?? '' }}</text>
          </slot>
        </view>
      </view>
    </view>

    <view class="sn-lucky__row">
      <view
        v-for="col in cols"
        :key="`bottom-${col}`"
        :class="cellClass(orderIndex(rows, cols + 1 - col))"
        :style="cellStyle(orderIndex(rows, cols + 1 - col))"
      >
        <slot
          name="prize"
          :item="prizeAt(orderIndex(rows, cols + 1 - col))"
          :index="orderIndex(rows, cols + 1 - col)"
          :is-active="activeIndex === orderIndex(rows, cols + 1 - col)"
        >
          <text class="sn-lucky__name">{{ prizeAt(orderIndex(rows, cols + 1 - col))?.name ?? '' }}</text>
        </slot>
      </view>
    </view>
  </view>
</template>

<style scoped>
.sn-lucky {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.sn-lucky__row,
.sn-lucky__middle,
.sn-lucky__side {
  display: flex;
  flex-direction: row;
}

.sn-lucky__side {
  flex-direction: column;
  flex: 1;
}

.sn-lucky__cell {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: var(--sn-lucky-cell, 120rpx);
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  box-sizing: border-box;
  overflow: hidden;
  transition: background-color 0.12s;
}

.sn-lucky__cell--active {
  border-color: var(--sn-mp-color-action-primary);
}

.sn-lucky__row .sn-lucky__cell {
  flex: 1;
}

.sn-lucky__img {
  width: 48rpx;
  height: 48rpx;
}

.sn-lucky__name {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-xs);
  text-align: center;
}

.sn-lucky__button {
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0 var(--sn-mp-spacing-2);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-action-primary);
}

.sn-lucky__button--down {
  opacity: 0.85;
}

.sn-lucky__button-text {
  color: #ffffff;
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
}
</style>
