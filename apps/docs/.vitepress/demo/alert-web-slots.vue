<script setup lang="ts">
/**
 * alert-web-slots — overrides the default rendering via the `header`,
 * `icon`, and `default` slots.
 */
import { CircleAlert, Rocket } from 'lucide-vue-next'
import { SnAlert, SnIcon } from '@snui/vue-web'
</script>

<template>
  <div class="alert-demo">
    <SnAlert type="success" :show-icon="false">
      <template #header>部署完成</template>
      共 <strong>12</strong> 个服务已更新到 <code>v1.4.0</code>。
    </SnAlert>

    <SnAlert type="info">
      <template #icon>
        <SnIcon :component="Rocket" />
      </template>
      <template #header>自定义图标</template>
      <code>icon</code> 插槽替代了内置的类型图标。
    </SnAlert>

    <SnAlert type="error" title="带列表的正文">
      <template #icon>
        <SnIcon :component="CircleAlert" />
      </template>
      <ul class="alert-demo__list">
        <li>auth-service 健康检查超时</li>
        <li>gateway 连接池耗尽</li>
      </ul>
    </SnAlert>
  </div>
</template>

<style scoped>
.alert-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.alert-demo__list {
  margin: 0;
  padding-left: 18px;
}
.alert-demo__list li + li {
  margin-top: 4px;
}
</style>
