<script setup lang="ts">
/** Demo: SnDropdown — built-in arrow icon, custom `icon` prop and `#icon` slot. */
import { SnButton, SnDropdown, SnIcon } from '@snui/vue-web';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-vue-next';

const options = [
  { label: '编辑', key: 'edit' },
  { label: '复制', key: 'copy' },
  { label: '删除', key: 'delete' },
];
</script>

<template>
  <div class="demo-row">
    <SnDropdown trigger="click" :options="options">
      <SnButton>默认箭头</SnButton>
    </SnDropdown>

    <SnDropdown trigger="click" :options="options" :icon="ChevronsUpDown">
      <SnButton>自定义图标</SnButton>
    </SnDropdown>

    <SnDropdown trigger="click" :options="options">
      <template #icon="{ open }">
        <SnIcon :icon="open ? ChevronUp : ChevronDown" :size="14" />
      </template>
      <SnButton>自定义插槽</SnButton>
    </SnDropdown>

    <SnDropdown trigger="click" :options="options" :show-arrow="false">
      <SnButton>隐藏箭头</SnButton>
    </SnDropdown>
  </div>
</template>

<style scoped>
/* Stage is a centered flex container: pin the row width so buttons wrap on
   their own instead of shrink-to-fitting. */
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
  width: 100%;
}
</style>
