<script setup lang="ts">
/**
 * float-button-web-group — `SnFloatButtonGroup`: one trigger, N actions.
 *
 * `open` is bound with `v-model:open` below, but nobody clicks the trigger in
 * a screenshot — so the group is also documented here in its controlled form:
 * the outer buttons flip the same `open` flag the trigger uses.
 *
 * The group is `fixed: false` + `container` (the stage element), so it stays
 * inside the module instead of jumping to the browser corner.
 */
import { ref, useTemplateRef } from 'vue';
import { Bell, MessageSquare, Star } from 'lucide-vue-next';
import { SnButton, SnFloatButton, SnFloatButtonGroup } from '@snui/vue-web';

const open = ref(false);

const stageRef = useTemplateRef<HTMLElement>('stage');

function fillValue(): HTMLElement | null {
  return stageRef.value;
}

/* The `container` prop accepts a selector or an element; a getter keeps the
 * reference reactive so the group mounts once the stage exists. */
const container = () => fillValue();
</script>

<template>
  <div class="float-group-demo">
    <p class="float-group-demo__hint">
      <code>SnFloatButtonGroup</code> 拥有整组的定位：子按钮只负责内容，
      <code>v-model:open</code> 控制展开状态。
    </p>

    <div class="float-group-demo__toolbar">
      <SnButton size="small" type="primary" :disabled="open" @click="open = true">
        展开按钮组
      </SnButton>
      <SnButton size="small" :disabled="!open" @click="open = false">收起</SnButton>
      <span class="float-group-demo__state">当前：{{ open ? '展开' : '收起' }}</span>
    </div>

    <div ref="stage" class="float-group-demo__stage">
      <span class="float-group-demo__stage-label">position: relative 的容器</span>

      <SnFloatButtonGroup
        v-model:open="open"
        :fixed="false"
        :container="container()"
        :right="16"
        :bottom="16"
        trigger-tooltip="更多操作"
      >
        <SnFloatButton :icon="MessageSquare" tooltip="评论" />
        <SnFloatButton :icon="Bell" tooltip="通知" badge="3" />
        <SnFloatButton :icon="Star" tooltip="收藏" />
      </SnFloatButtonGroup>
    </div>
  </div>
</template>

<style scoped>
.float-group-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.float-group-demo__hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}

.float-group-demo__hint code {
  padding: 0 4px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  font-size: 12px;
}

.float-group-demo__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.float-group-demo__state {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.float-group-demo__stage {
  position: relative;
  min-height: 220px;
  padding: 12px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.float-group-demo__stage-label {
  font-size: 12px;
  color: var(--vp-c-text-3);
}
</style>
