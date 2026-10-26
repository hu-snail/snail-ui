<script setup lang="ts">
/**
 * steps-web-content — the default slot carries rich step bodies.
 *
 * Shows: replacing the `description` prop with arbitrary markup, including
 * a nested list and inline emphasis.
 */
import { ref } from 'vue';
import { SnSteps, SnStep } from '@snui/vue-web';

const current = ref(1);
</script>

<template>
  <div class="steps-content">
    <SnSteps v-model:current="current">
      <SnStep title="创建仓库">
        <ul class="steps-content__list">
          <li>选择归属组织</li>
          <li>设置可见性</li>
          <li>填写仓库描述</li>
        </ul>
      </SnStep>

      <SnStep title="接入流水线">
        <p class="steps-content__para">
          在仓库根目录添加 <code>.ci.yml</code>，推送到默认分支后自动生效。
        </p>
      </SnStep>

      <SnStep title="发布版本">
        <p class="steps-content__para">
          打 tag 触发构建，产物会附加到 <strong>Release</strong> 页面。
        </p>
      </SnStep>
    </SnSteps>

    <p class="steps-content__hint">
      默认插槽会完全接管步骤正文；此时 <code>description</code> prop 不再渲染。
    </p>
  </div>
</template>

<style scoped>
.steps-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.steps-content__list {
  margin: 4px 0 0;
  padding-left: 18px;
  font-size: 13px;
  line-height: 1.9;
  color: var(--sn-web-color-text-secondary);
}
.steps-content__para {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 1.8;
  color: var(--sn-web-color-text-secondary);
}
.steps-content__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
