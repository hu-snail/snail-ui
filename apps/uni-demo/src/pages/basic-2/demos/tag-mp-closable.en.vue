<script setup lang="ts">
/** Demo: sn-tag (uni-end) — closable filter chips + the dynamic "new tag" input. */
import { ref } from 'vue';
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';

/** Selected filters: tap close to remove; tap the dashed tag to restore all. */
const filters = ref(['Tech', 'Outdoor', 'Food', 'Movies']);

function removeFilter(filter: string): void {
  filters.value = filters.value.filter((item) => item !== filter);
}

function resetFilters(): void {
  filters.value = ['Tech', 'Outdoor', 'Food', 'Movies'];
}

/** Dynamic add: confirmed values join the list, each closable in turn. */
const added = ref<string[]>([]);

function addTag(payload: { value: string }): void {
  const value = payload.value.trim();
  if (value !== '') added.value.push(value);
}

function removeAdded(tag: string): void {
  added.value = added.value.filter((item) => item !== tag);
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <template v-if="filters.length > 0">
        <SnTag
          v-for="filter in filters"
          :key="filter"
          type="primary"
          variant="light"
          closable
          @close="removeFilter(filter)"
        >
          {{ filter }}
        </SnTag>
      </template>
      <SnTag v-else variant="dashed" @click="resetFilters">Cleared, tap to restore</SnTag>
    </view>

    <view class="sn-demo__row">
      <SnTag dynamic type="primary" variant="plain" @confirm="addTag" />
      <SnTag
        v-for="tag in added"
        :key="tag"
        type="primary"
        closable
        @close="removeAdded(tag)"
      >
        {{ tag }}
      </SnTag>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-5);
  align-items: flex-start;
}

.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-4) var(--sn-mp-spacing-5);
  align-items: center;
}
</style>
