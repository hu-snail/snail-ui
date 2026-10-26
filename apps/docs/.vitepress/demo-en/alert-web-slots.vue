<script setup lang="ts">
/**
 * alert-web-slots — overrides the default rendering via the `header`,
 * `icon`, and `default` slots.
 */
import { CircleAlert, Rocket } from 'lucide-vue-next';
import { SnAlert, SnIcon } from '@snui/vue-web';
</script>

<template>
  <div class="alert-demo">
    <SnAlert type="success" :show-icon="false">
      <template #header>Deploy complete</template>
      A total of <strong>12</strong> services have been updated to <code>v1.4.0</code>。
    </SnAlert>

    <SnAlert type="info">
      <template #icon>
        <SnIcon :component="Rocket" />
      </template>
      <template #header>Custom icon</template>
      <code>icon</code> slot replaces the built-in type icons.
    </SnAlert>

    <SnAlert type="error" title="Body with a list">
      <template #icon>
        <SnIcon :component="CircleAlert" />
      </template>
      <ul class="alert-demo__list">
        <li>auth-service health check timed out</li>
        <li>gateway connection pool exhausted</li>
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
