<script setup lang="ts">
/**
 * Demo: SnPopconfirm — leading icon variants.
 *
 * Three ways to control the icon area: a custom component through the `icon`
 * prop (keeps the warning-coloured default), full control through the `#icon`
 * slot (own colour and size), or turning the area off with
 * `show-icon="false"` for pure-text confirmations.
 */
import { ref } from 'vue';
import { CircleAlert } from 'lucide-vue-next';
import { registerSnIcons, SnButton, SnIcon, SnPopconfirm } from '@snui/vue-web';

registerSnIcons({ CircleAlert });

const result = ref('');
</script>

<template>
  <div class="popconfirm-icon-demo">
    <div class="popconfirm-icon-demo__row">
      <SnPopconfirm
        :icon="CircleAlert"
        placement="bottom"
        content="当前账号将失去该项目的编辑权限，成员需要重新受邀。"
        positive-text="确认移除"
        @positive-click="result = '已移除成员'"
        @negative-click="result = '已取消移除'"
      >
        <SnButton>icon prop（警示色）</SnButton>
      </SnPopconfirm>

      <SnPopconfirm
        placement="bottom"
        content="删除后不可恢复，确认继续吗？"
        positive-text="删除"
        @positive-click="result = '已删除'"
        @negative-click="result = '已取消删除'"
      >
        <template #icon>
          <SnIcon
            :icon="CircleAlert"
            :size="20"
            color="var(--sn-web-color-feedback-danger, #d03050)"
          />
        </template>
        <SnButton type="error">#icon 插槽（危险色）</SnButton>
      </SnPopconfirm>

      <SnPopconfirm
        :show-icon="false"
        placement="bottom"
        content="仅用文字说明后果，不占用图标区域，适合文案已经足够明确的场景。"
        @positive-click="result = '已确认（无图标）'"
        @negative-click="result = '已取消（无图标）'"
      >
        <SnButton>show-icon=false</SnButton>
      </SnPopconfirm>
    </div>

    <p class="popconfirm-icon-demo__result">最近一次操作：{{ result || '（尚未操作）' }}</p>
    <p class="popconfirm-icon-demo__hint">
      不传 icon 时使用内置警示图标；icon prop
      接受任意图标组件并沿用警示色，需要自定义颜色或尺寸时改用 #icon 插槽，show-icon=false
      则完全移除图标区。
    </p>
  </div>
</template>

<style scoped>
.popconfirm-icon-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.popconfirm-icon-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.popconfirm-icon-demo__result,
.popconfirm-icon-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
