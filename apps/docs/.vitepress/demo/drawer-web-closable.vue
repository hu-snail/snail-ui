<script setup lang="ts">
/**
 * drawer-web-closable — the close button and its two exit patterns.
 *
 * Shows: `closable` on the content panel (built-in X), and the footer-only
 * variant where `closable` stays off and the footer owns the exit.
 */
import { ref } from 'vue'
import { SnButton, SnDrawer, SnDrawerContent } from '@snui/vue-web'

const plain = ref(false)
const footerless = ref(false)
</script>

<template>
  <div class="drw-closable">
    <SnButton @click="plain = true">带关闭按钮</SnButton>
    <SnButton @click="footerless = true">不带关闭按钮</SnButton>

    <SnDrawer v-model:show="plain" placement="right" :width="340">
      <SnDrawerContent title="带关闭按钮" closable @close="plain = false">
        <p>标题右侧是一个内置的 X 按钮，点击后关闭抽屉。</p>
      </SnDrawerContent>
    </SnDrawer>

    <SnDrawer v-model:show="footerless" placement="right" :width="340">
      <SnDrawerContent title="不带关闭按钮" @close="footerless = false">
        <template #footer>
          <div class="drw-closable__footer">
            <SnButton size="small" @click="footerless = false">我知道了</SnButton>
          </div>
        </template>
        <p><code>closable</code> 默认为 <code>false</code>，标题右侧没有按钮。</p>
        <p>退出路径完全交给底部的操作区。</p>
      </SnDrawerContent>
    </SnDrawer>
  </div>
</template>

<style scoped>
.drw-closable {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
}
.drw-closable__footer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
</style>
