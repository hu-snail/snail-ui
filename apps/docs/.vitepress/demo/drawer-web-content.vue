<script setup lang="ts">
/**
 * drawer-web-content — SnDrawerContent's three rows, including custom slots
 * and the rule that an absent `footer` slot renders no footer at all.
 */
import { ref } from 'vue'
import { SnButton, SnDrawer, SnDrawerContent } from '@snui/vue-web'

const showFull = ref(false)
const showNoFooter = ref(false)
const showBare = ref(false)
</script>

<template>
  <div class="drw-content">
    <div class="drw-content__bar">
      <SnButton type="primary" @click="showFull = true">完整三段</SnButton>
      <SnButton @click="showNoFooter = true">无 footer</SnButton>
      <SnButton @click="showBare = true">不带插槽</SnButton>
    </div>

    <!-- header / body / footer all present, with a custom header slot. -->
    <SnDrawer v-model:show="showFull" :width="400">
      <SnDrawerContent :title="'被插槽覆盖'">
        <template #header>
          <strong>自定义 header</strong>
        </template>
        <p>正文。header / body / footer 三段都在。</p>
        <template #footer>
          <SnButton @click="showFull = false">取消</SnButton>
          <SnButton type="primary" @click="showFull = false">保存</SnButton>
        </template>
      </SnDrawerContent>
    </SnDrawer>

    <!-- No `footer` slot ⇒ no footer element at all. -->
    <SnDrawer v-model:show="showNoFooter" :width="400">
      <SnDrawerContent title="没有 footer">
        <p>不提供 <code>footer</code> 插槽时，底部元素完全不渲染。</p>
      </SnDrawerContent>
    </SnDrawer>

    <!-- No default slot ⇒ SnDrawer builds a bare SnDrawerContent from title. -->
    <SnDrawer v-model:show="showBare" title="由 title 组装" :width="320" />
  </div>
</template>

<style scoped>
.drw-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
}
.drw-content__bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
