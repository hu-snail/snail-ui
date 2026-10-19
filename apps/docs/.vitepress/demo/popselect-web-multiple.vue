<script setup lang="ts">
/**
 * Demo: SnPopselect — multiple selection, scrollable menu, controlled value.
 */
import { ref } from 'vue'
import { SnButton, SnPopselect } from '@snui/vue-web'

const options = [
  '用户研究',
  '可用性测试',
  '数据分析',
  '竞品调研',
  'A/B 实验',
  '问卷调研',
  '访谈纪要',
  '需求评审',
  '设计走查',
  '上线复盘',
]

const selected = ref<string[]>(['可用性测试', '数据分析'])
</script>

<template>
  <div class="popselect-multi-demo">
    <div class="popselect-multi-demo__row">
      <SnPopselect
        v-model:value="selected"
        :options="options"
        multiple
        scrollable
        placement="bottom"
      >
        <SnButton>
          已选 {{ selected.length }} 项（点击编辑）
        </SnButton>
      </SnPopselect>
    </div>
    <p class="popselect-multi-demo__state">
      value = [{{ selected.join(', ') || '空' }}]
    </p>
    <p class="popselect-multi-demo__hint">
      multiple 模式下选择后菜单保持打开，可连续勾选 / 取消；scrollable 限制菜单高度并在超出时滚动。
    </p>
  </div>
</template>

<style scoped>
.popselect-multi-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popselect-multi-demo__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.popselect-multi-demo__state {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}

.popselect-multi-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
