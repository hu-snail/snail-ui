<script setup lang="ts">
/**
 * SnConfigProvider — global configuration for @snui/vue-web.
 *
 * Per AUI-PRD-v3.0 §3.4 + ADR-0002 + Spec-01 §2.4:
 *   - Web 端 skin prop 直接写到 document.body.classList（文档站 StyleSwitcher 也走这条路径）
 *   - App-level 接入只需用 <SnConfigProvider> 包裹根组件即可
 *
 * Per AGENTS.md §32 + §33, this component owns:
 *   - 全局 skin class 注入
 *   - 主题持久化（占位：AUI-THEME-002）
 *
 * 不负责：
 *   - Schema 校验
 *   - 业务状态
 *   - 路由
 */

import { watch, onBeforeUnmount, provide } from 'vue'

defineOptions({ name: 'SnConfigProvider' })

const props = withDefaults(
  defineProps<{
    /**
     * 当前激活的 Style Pack 标识（kebab-case）。
     * 传空字符串 / undefined 时清除已有 skin class。
     * 设为 'default' 等同于清空（默认皮肤无额外样式）。
     */
    skin?: string
  }>(),
  {
    skin: '',
  },
)

/** 给后代组件提供当前 skin（用于子组件内部局部读取）。 */
provide('snui-skin', props.skin)

const SKIN_CLASS_PREFIX = 'snui-skin-'

function applySkin(skin: string): void {
  if (typeof document === 'undefined') return
  // 移除所有 snui-skin-* class
  const cls = document.body.className
    .split(/\s+/)
    .filter((c) => c && !c.startsWith(SKIN_CLASS_PREFIX))
    .join(' ')
  document.body.className = cls.trim()
  if (skin && skin !== 'default') {
    document.body.classList.add(`${SKIN_CLASS_PREFIX}${skin}`)
  }
}

watch(
  () => props.skin,
  (next) => applySkin(next),
  { immediate: true },
)

onBeforeUnmount(() => {
  // 组件卸载时清理 body class，避免影响外层应用
  if (typeof document !== 'undefined') {
    const cls = document.body.className
      .split(/\s+/)
      .filter((c) => c && !c.startsWith(SKIN_CLASS_PREFIX))
      .join(' ')
    document.body.className = cls.trim()
  }
})
</script>

<template>
  <slot />
</template>