<script setup lang="ts">
/**
 * Demo: SnPopconfirm — default texts, custom texts, custom icon and veto.
 */
import { ref } from 'vue';
import { CircleCheck } from 'lucide-vue-next';
import { registerSnIcons, SnButton, SnIcon, SnPopconfirm } from '@snui/vue-web';

registerSnIcons({ CircleCheck });

const result = ref('');

function onPositive() {
  result.value = '已确认执行';
}
function onNegative() {
  result.value = '已取消';
}
function onVetoPositive() {
  // 返回 false 阻止关闭（例如校验未通过时）。
  result.value = '确认被拦截，弹层保持打开';
  return false;
}
</script>

<template>
  <div class="popconfirm-demo">
    <section class="popconfirm-demo__block">
      <h4 class="popconfirm-demo__title">默认确认框</h4>
      <div class="popconfirm-demo__row">
        <SnPopconfirm
          content="确定删除该文件吗？删除后不可恢复。"
          @positive-click="onPositive"
          @negative-click="onNegative"
        >
          <SnButton type="error">删除文件</SnButton>
        </SnPopconfirm>
        <SnPopconfirm
          content="确认提交本次修改吗？"
          positive-text="提交"
          negative-text="再想想"
          show-arrow
        >
          <SnButton>自定义按钮文案</SnButton>
        </SnPopconfirm>
      </div>
    </section>

    <section class="popconfirm-demo__block">
      <h4 class="popconfirm-demo__title">自定义图标 + 阻止关闭</h4>
      <div class="popconfirm-demo__row">
        <SnPopconfirm content="该资源当前状态良好，确认要继续下线操作吗？">
          <template #icon>
            <SnIcon :icon="CircleCheck" :size="20" />
          </template>
          <SnButton>自定义图标（#icon 插槽）</SnButton>
        </SnPopconfirm>
        <SnPopconfirm
          content="点击「确定」会被回调拦截，弹层不会关闭。"
          @positive-click="onVetoPositive"
        >
          <SnButton>返回 false 阻止关闭</SnButton>
        </SnPopconfirm>
      </div>
    </section>

    <p class="popconfirm-demo__result">最近一次操作：{{ result || '（尚未操作）' }}</p>
  </div>
</template>

<style scoped>
.popconfirm-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.popconfirm-demo__block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popconfirm-demo__title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--sn-web-color-text-secondary, #4b4f55);
}

.popconfirm-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.popconfirm-demo__result {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
