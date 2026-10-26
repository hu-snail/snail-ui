<script setup lang="ts">
/**
 * SnDescriptionsItem — one label/content entry of a `<SnDescriptions>`
 * table (AUI-WEB-DD-005).
 *
 * Reference library: naive-ui `n-descriptions-item`
 *   (https://www.naiveui.com/zh-CN/light/components/descriptions)
 * Per AGENTS.md §112, props + slots mirror n-descriptions-item 1:1:
 *   label / span / label-class / label-style / content-class /
 *   content-style; slots: label / default.
 *
 * This component renders nothing on its own — the parent flattens its
 * default slot, reads each item's props + slot vnodes, and lays them out
 * as the table's th/td cells.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnDescriptionsItem label="名称">AUI</SnDescriptionsItem>
 *   <SnDescriptionsItem>
 *     <template #label>名称</template>
 *     AUI
 *   </SnDescriptionsItem>
 */

import type { CSSProperties } from 'vue'

defineOptions({ name: 'SnDescriptionsItem' })

withDefaults(
  defineProps<{
    /** Label text. Use the `label` slot for rich label content. */
    label?: string
    /** How many columns of the parent grid this entry occupies. */
    span?: number
    /** Class applied to the rendered label cell / inline label span. */
    labelClass?: string
    /** Style applied to the rendered label cell / inline label span. */
    labelStyle?: string | CSSProperties
    /** Class applied to the rendered content cell / inline content span. */
    contentClass?: string
    /** Style applied to the rendered content cell / inline content span. */
    contentStyle?: string | CSSProperties
  }>(),
  {
    span: 1,
  },
)

defineSlots<{
  /** Description content. */
  default?(): unknown
  /** Label content — overrides the `label` prop. */
  label?(): unknown
}>()
</script>

<template>
  <!-- Renderless: `<SnDescriptions>` renders label/content cells. -->
</template>
