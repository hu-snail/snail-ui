<script setup lang="ts">
/**
 * steps-web-content-bottom — `contentPlacement="bottom"` puts the title
 * (and description) under the indicator row. Common for onboarding /
 * feature-intro flows where each step needs a wider caption.
 */
import { ref } from 'vue';
import { SnSteps, SnStep } from '@snui/vue-web';

const current = ref(1);
</script>

<template>
  <div class="steps-demo">
    <SnSteps v-model:current="current" content-placement="bottom">
      <SnStep title="选择模板" description="从模板库挑选起点" />
      <SnStep title="配置样式" description="选择风格包与主题" />
      <SnStep title="连接数据" description="绑定数据源与字段" />
      <SnStep title="生成预览" description="确认后导出可用工程" />
    </SnSteps>
  </div>
</template>

<style scoped>
.steps-demo {
  width: 100%;
}
</style>
