<script setup lang="ts">
/**
 * sn-config-provider — global configuration for @snui/uni.
 *
 * Per AUI-PRD-v3.0 §3.4 + ADR-0002 + Spec-01 §2.4:
 *   - uni 端 skin 通过组件 scoped CSS 传递（小程序 WXSS 不支持 :root）
 *   - ConfigProvider 根元素加 .snui-skin-{name} class，覆盖范围局限于本子树
 *
 * Per AGENTS.md §32, this component owns:
 *   - skin prop 提供（向下传递）
 *
 * 不负责：Schema 校验 / 业务状态 / 路由。
 */

import { provide } from 'vue'

defineOptions({ name: 'SnConfigProvider' })

const props = withDefaults(
  defineProps<{
    /** 当前激活的 Style Pack 标识（kebab-case）。'default' 或空 = 无 skin class。 */
    skin?: string
  }>(),
  { skin: '' },
)

provide('snui-skin', props.skin)
</script>

<template>
  <view
    :class="['sn-config-provider', skin && skin !== 'default' ? `snui-skin-${skin}` : '']"
  >
    <slot />
  </view>
</template>