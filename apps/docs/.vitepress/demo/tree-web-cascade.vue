<script setup lang="ts">
/** Demo: SnTree — checkable + cascade with indeterminate parents. */
import { ref } from 'vue';
import { SnTree } from '@snui/vue-web';
import type { SnTreeOption } from '@snui/vue-web';

const checked = ref<string[]>([]);

const data: SnTreeOption[] = [
  {
    key: 'assets',
    label: '静态资源',
    children: [
      { key: 'images', label: '图片' },
      { key: 'fonts', label: '字体' },
      { key: 'videos', label: '视频' },
    ],
  },
  {
    key: 'scripts',
    label: '脚本',
    children: [{ key: 'vendor', label: '第三方库' }],
  },
  { key: 'config', label: '配置文件' },
];
</script>

<template>
  <div class="sn-demo">
    <SnTree
      v-model:checked-keys="checked"
      :data="data"
      checkable
      cascade
      :default-expanded-keys="['assets', 'scripts']"
    />
    <p class="sn-demo__hint">勾选：{{ checked.join('、') || '无' }}</p>
  </div>
</template>

<style scoped>
.sn-demo {
  max-width: 320px;
}
.sn-demo__hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
