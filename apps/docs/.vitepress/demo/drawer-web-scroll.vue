<script setup lang="ts">
/**
 * drawer-web-scroll — a body that scrolls while header and footer stay put.
 *
 * Shows: `nativeScrollbar` with a long body, and the resulting three-band
 * layout (fixed header / scrolling body / fixed footer).
 */
import { ref } from 'vue'
import { SnButton, SnDrawer, SnDrawerContent } from '@snui/vue-web'

const open = ref(false)

const items = Array.from({ length: 40 }, (_, i) => `配置项 ${i + 1}`)
</script>

<template>
  <div class="drw-scroll">
    <SnButton type="primary" @click="open = true">打开长内容抽屉</SnButton>

    <SnDrawer v-model:show="open" placement="right" :width="400">
      <SnDrawerContent title="滚动内容" closable @close="open = false">
        <template #footer>
          <div class="drw-scroll__footer">
            <SnButton size="small" @click="open = false">取消</SnButton>
            <SnButton size="small" type="primary" @click="open = false">保存</SnButton>
          </div>
        </template>

        <p>头部与底部固定，中间区域独立滚动。</p>
        <ul class="drw-scroll__list">
          <li v-for="item in items" :key="item">{{ item }}</li>
        </ul>
      </SnDrawerContent>
    </SnDrawer>
  </div>
</template>

<style scoped>
.drw-scroll {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.drw-scroll__list {
  margin: 0;
  padding-left: 18px;
  line-height: 2;
}
.drw-scroll__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
