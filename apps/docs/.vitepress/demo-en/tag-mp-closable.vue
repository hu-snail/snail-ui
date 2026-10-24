<script setup lang="ts">
/** Demo: sn-tag (uni-end) — closable, icons and the inline "new tag" input. */
import { ref, onBeforeUnmount } from 'vue'
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue'
import { registerSnIcons, clearSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry'
import { Check, Star } from '@snui/uni-src/components/sn-icon/sn-icon-set'

registerSnIcons({ Check, Star })

const visible = ref(true)
const tags = ref(['Frontend', 'Backend', 'Design'])
const draftTags = ref<string[]>([])

function hide(): void {
  visible.value = false
}

function remove(tag: string): void {
  tags.value = tags.value.filter((item) => item !== tag)
}

function addTag(payload: { value: string }): void {
  const value = payload.value.trim()
  if (value) draftTags.value.push(value)
}

onBeforeUnmount(() => clearSnIcons())
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo-row">
      <SnTag v-if="visible" type="primary" closable @close="hide">Close me</SnTag>
      <SnTag v-else type="primary">Closed</SnTag>
    </view>

    <view class="sn-demo-row">
      <SnTag type="success" icon="Check">Verified</SnTag>
      <SnTag type="warning" icon="Star">Starred</SnTag>
    </view>

    <view class="sn-demo-row">
      <SnTag
        v-for="tag in tags"
        :key="tag"
        type="primary"
        variant="light"
        closable
        @close="remove(tag)"
      >
        {{ tag }}
      </SnTag>
    </view>

    <view class="sn-demo-row">
      <SnTag dynamic type="primary" variant="plain" @confirm="addTag" />
      <SnTag v-for="tag in draftTags" :key="tag" type="primary" closable @close="draftTags = draftTags.filter((t) => t !== tag)">
        {{ tag }}
      </SnTag>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.sn-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
</style>
