<script setup lang="ts">
/**
 * Demo: SnPopconfirm — custom action row through the `#action` slot.
 *
 * The slot replaces the two built-in buttons, so the demo owns the closing
 * behaviour: `v-model:show` keeps the bubble controlled and each custom
 * button decides when to collapse it. The row also carries a "don't ask
 * again" checkbox, a common companion of a destructive confirmation.
 */
import { ref } from 'vue';
import { SnButton, SnCheckbox, SnPopconfirm } from '@snui/vue-web';

const show = ref(false);
const dontAskAgain = ref(false);
const log = ref('');

function cancel(): void {
  show.value = false;
  log.value = '已取消，文档未删除';
}

function confirm(): void {
  show.value = false;
  log.value = dontAskAgain.value ? '已删除，并记住不再提示' : '已删除';
}
</script>

<template>
  <div class="popconfirm-action-demo">
    <div class="popconfirm-action-demo__row">
      <SnPopconfirm
        v-model:show="show"
        placement="bottom"
        show-arrow
        content="删除后该文档及其历史版本都会从工作区移除。"
      >
        <template #action>
          <div class="popconfirm-action-demo__action">
            <SnCheckbox v-model="dontAskAgain" size="small" label="不再提示" />
            <div class="popconfirm-action-demo__buttons">
              <SnButton size="tiny" @click="cancel">再想想</SnButton>
              <SnButton size="tiny" type="primary" @click="confirm">确认删除</SnButton>
            </div>
          </div>
        </template>

        <SnButton type="error">删除文档</SnButton>
      </SnPopconfirm>

      <span class="popconfirm-action-demo__state">{{ log || '（尚未操作）' }}</span>
    </div>

    <p class="popconfirm-action-demo__hint">
      #action 插槽整体替换内置的「取消 / 确定」按钮区，关闭时机由调用方决定：本例用 v-model:show
      受控，自定义按钮自行收起气泡；复选框的取值可以在确认回调里一并提交给业务。
    </p>
  </div>
</template>

<style scoped>
.popconfirm-action-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.popconfirm-action-demo__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.popconfirm-action-demo__action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}

.popconfirm-action-demo__buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.popconfirm-action-demo__state,
.popconfirm-action-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
