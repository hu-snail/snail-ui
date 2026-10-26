<script setup lang="ts">
/**
 * SnDialer (uni-end) — 大转盘（业务组件 AUI-BIZ-003）。
 *
 * Reference library: lime-ui `l-dialer`
 *   (https://limeuix.qcoon.cn/components/dialer)
 * Prop 语义对齐参考：prizeList / turns / duration / size / 扇区配色；
 * 中奖结果由宿主通过 `run(index)` 指定（参考库无概率配置，行为一致）。
 *
 * ## 实现
 *
 * 扇区 = 顶半圆盘按 360/n 旋转堆叠（后写的盖住先写的，任意扇区数下
 * 每个扇区颜色都由最上层半圆盘决定）；奖品沿半径排布；指针点击后由
 * 宿主调用 `run(index)`，转盘以 ease-out 旋转 `turns` 圈 + 归位偏移，
 * 结束派发 `done(index)`。纯 transform 过渡，双端安全。
 *
 * Per AGENTS.md §116.2: class 选择器、hover-class 按压态、文字 <text>。
 *
 * Not responsible for: 概率 / 库存等业务规则 —— 由宿主决定 index。
 */

import { computed, onBeforeUnmount, ref } from 'vue'

defineOptions({ name: 'SnDialer' })

export interface SnDialerPrize {
  /** 奖品 id。 */
  id: string
  /** 奖品名。 */
  name: string
  /** 奖品图（可选）。 */
  img?: string
  /** 本扇区背景色（优先于 prizeBgColors）。 */
  color?: string
}

const props = withDefaults(
  defineProps<{
    /** 奖品列表（2-12 项）。 */
    prizeList?: SnDialerPrize[]
    /** 旋转圈数。 */
    turns?: number
    /** 旋转时长（秒）。 */
    duration?: number
    /** 转盘直径（rpx / px 长度字符串）。 */
    size?: string
    /** 交替扇区背景色。 */
    prizeBgColors?: string[]
    /** 扇区描边色。 */
    borderColor?: string
    /** 奖品名字号。 */
    fontSize?: string
    /** 奖品名颜色。 */
    color?: string
    /** 根节点自定义类名。 */
    customClass?: string
    /** 根节点自定义样式。 */
    customStyle?: string
  }>(),
  {
    prizeList: () => [],
    turns: 5,
    duration: 3,
    size: '600rpx',
    prizeBgColors: () => ['#FFF0A3', '#FFFCE6'],
    borderColor: '#FFD752',
    fontSize: '24rpx',
    color: 'var(--sn-mp-color-text-primary)',
    customClass: '',
    customStyle: '',
  },
)

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'done', index: number): void
}>()

defineSlots<{
  /** 自定义奖品内容（{ item, index }）。 */
  prize?(props: { item: SnDialerPrize; index: number }): unknown
  /** 自定义指针（默认中心 GO 按钮）。 */
  pointer?(): unknown
}>()

const rotation = ref(0)
const spinning = ref(false)
let settleTimer: ReturnType<typeof setTimeout> | null = null

/** 解析长度（数值 + 单位），供扇区几何计算。 */
function parseLength(input: string): { value: number; unit: string } {
  const match = /^(-?[\d.]+)(rpx|px|%)?$/.exec(input.trim())
  if (match === null) return { value: 600, unit: 'rpx' }
  return { value: Number(match[1]), unit: match[2] ?? 'rpx' }
}

const count = computed(() => Math.min(12, Math.max(0, props.prizeList.length)))
/** Non-optional view of the prop list — the template never sees `undefined`. */
const prizes = computed<SnDialerPrize[]>(() => props.prizeList)
const sectorCount = computed(() => (count.value >= 2 ? count.value : 0))
const angle = computed(() => (sectorCount.value > 0 ? 360 / sectorCount.value : 360))

const rootClass = computed(() => ['sn-dialer', props.customClass])
const rootStyle = computed(() => {
  const parts = [`width: ${props.size}`, `height: ${props.size}`, `border-color: ${props.borderColor}`]
  if (props.customStyle !== '') parts.push(props.customStyle)
  return parts.join('; ')
})

const wheelStyle = computed(
  () => `transform: rotate(${rotation.value}deg); transition: transform ${props.duration}s cubic-bezier(0.12, 0.8, 0.25, 1)`,
)

function sectorStyle(index: number): string {
  const { value, unit } = parseLength(props.size)
  const prize = props.prizeList[index]
  const background = prize?.color ?? props.prizeBgColors[index % props.prizeBgColors.length]
  return [
    'position: absolute',
    'top: 0',
    'left: 0',
    'right: 0',
    'height: 50%',
    `border-top-left-radius: ${value / 2}${unit}`,
    `border-top-right-radius: ${value / 2}${unit}`,
    'transform-origin: 50% 100%',
    `transform: rotate(${index * angle.value}deg)`,
    `background-color: ${background ?? 'var(--sn-mp-color-background-subtle)'}`,
  ].join('; ')
}

function prizeWrapStyle(index: number): string {
  const { value, unit } = parseLength(props.size)
  return [
    'position: absolute',
    'left: 50%',
    'top: 50%',
    `transform: translate(-50%, -50%) rotate(${(index + 0.5) * angle.value}deg) translateY(${-value * 0.31}${unit})`,
    'display: flex',
    'flex-direction: column',
    'align-items: center',
  ].join('; ')
}

function prizeNameStyle(): string {
  return `font-size: ${props.fontSize}; color: ${props.color}`
}

/** 开始旋转到指定奖品索引（指针位于正上方）。 */
function run(index: number): void {
  if (spinning.value) return
  const n = sectorCount.value
  if (n === 0) return
  const target = Math.min(n - 1, Math.max(0, Math.round(index)))
  spinning.value = true
  const targetMod = (360 - ((target + 0.5) * angle.value)) % 360
  const currentMod = ((rotation.value % 360) + 360) % 360
  let delta = targetMod - currentMod
  if (delta <= 0) delta += 360
  rotation.value = rotation.value + Math.max(1, props.turns) * 360 + delta
  settleTimer = setTimeout(() => {
    spinning.value = false
    emit('done', target)
  }, Math.max(0.1, props.duration) * 1000)
}

function onPointerTap(): void {
  if (spinning.value) return
  emit('click')
}

onBeforeUnmount(() => {
  if (settleTimer !== null) clearTimeout(settleTimer)
})

defineExpose({ run })
</script>

<template>
  <view :class="rootClass" :style="rootStyle" role="img" aria-label="dialer">
    <view class="sn-dialer__wheel" :style="wheelStyle">
      <view v-for="index in sectorCount" :key="`s-${index}`" :style="sectorStyle(index - 1)" />
      <view v-for="index in sectorCount" :key="`p-${index}`" class="sn-dialer__prize" :style="prizeWrapStyle(index - 1)">
        <slot name="prize" :item="prizes[index - 1]!" :index="index - 1">
          <image
            v-if="prizes[index - 1]?.img !== undefined && prizes[index - 1]?.img !== ''"
            class="sn-dialer__prize-img"
            :src="prizes[index - 1]?.img"
            mode="aspectFit"
          />
          <text class="sn-dialer__prize-name" :style="prizeNameStyle()">{{ prizes[index - 1]?.name }}</text>
        </slot>
      </view>
    </view>
    <view
      class="sn-dialer__pointer"
      :hover-class="spinning ? 'none' : 'sn-dialer__pointer--down'"
      :hover-stay-time="80"
      @tap="onPointerTap"
    >
      <slot name="pointer">
        <text class="sn-dialer__pointer-text">GO</text>
      </slot>
    </view>
  </view>
</template>

<style scoped>
.sn-dialer {
  position: relative;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  border: 10rpx solid var(--sn-mp-color-border-default);
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--sn-mp-color-background-surface);
}

.sn-dialer__wheel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.sn-dialer__prize-img {
  width: 56rpx;
  height: 56rpx;
}

.sn-dialer__prize-name {
  margin-top: 4rpx;
  font-weight: var(--sn-mp-font-weight-medium);
}

.sn-dialer__pointer {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 27%;
  height: 27%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 4rpx solid #ffffff;
  background-color: var(--sn-mp-color-action-primary);
}

.sn-dialer__pointer--down {
  opacity: 0.85;
}

.sn-dialer__pointer-text {
  color: #ffffff;
  font-size: var(--sn-mp-font-size-lg);
  font-weight: var(--sn-mp-font-weight-bold);
}
</style>
