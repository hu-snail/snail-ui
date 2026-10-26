<script setup lang="ts">
/**
 * Demo: SnPopover — rich content via the `#header` / `#content` slots.
 *
 * The instance also receives the `header` / `content` props, so opening it
 * shows the precedence rule: a provided slot wins, the prop is only the
 * fallback. The header slot carries an SnIcon + bold title, the content slot
 * a paragraph plus an action row.
 */
import { ref } from 'vue'
import { BookOpen } from 'lucide-vue-next'
import { registerSnIcons, SnButton, SnIcon, SnPopover } from '@snui/vue-web'

registerSnIcons({ BookOpen })

const dismissed = ref(false)
</script>

<template>
  <div class="popover-slots-demo">
    <SnPopover
      trigger="click"
      placement="bottom"
      show-arrow
      :width="260"
      header="props 标题（会被插槽覆盖）"
      content="props 正文（会被插槽覆盖）"
    >
      <template #header>
        <span class="popover-slots-demo__header">
          <SnIcon :icon="BookOpen" :size="16" />
          快捷键与批量操作
        </span>
      </template>

      <template #content>
        <p class="popover-slots-demo__text">
          按住 Shift 可多选行，选中后按 Delete 批量删除，操作会写入审计日志。
        </p>
        <div class="popover-slots-demo__actions">
          <SnButton size="tiny" @click="dismissed = true">
            {{ dismissed ? '已关闭提示' : '不再提示' }}
          </SnButton>
          <SnButton size="tiny" type="primary">查看帮助文档</SnButton>
        </div>
      </template>

      <SnButton>插槽富内容</SnButton>
    </SnPopover>

    <p class="popover-slots-demo__hint">
      同时传入 header / content 与 #header / #content 时，插槽优先渲染，props 仅作为兜底；插槽内可以放图标、段落、按钮等任意内容。
    </p>
  </div>
</template>

<style scoped>
.popover-slots-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.popover-slots-demo__header {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.popover-slots-demo__text {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--sn-web-color-text-secondary, #4b4f55);
}

.popover-slots-demo__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
}

.popover-slots-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
