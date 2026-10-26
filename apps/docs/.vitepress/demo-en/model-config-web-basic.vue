<script setup lang="ts">
/**
 * Demo: 模型配置页 — 厂商 / 模型 / 参数。
 *
 * 演示添加自定义厂商、编辑接口地址与凭证、增删模型、切换激活模型，以及
 * 参数面板随所选模型能力自动启用或禁用「思考程度」。
 */
import { ref } from 'vue';
import { SnModelConfig } from '@snui/templates-src/web/index';
import type { SnAiModelParams, SnAiVendor } from '@snui/templates-src/shared/types';

const vendors = ref<SnAiVendor[]>([
  {
    id: 'v-open',
    name: 'Cloud service',
    baseUrl: 'https://api.example.com/v1',
    hasCredential: true,
    models: [
      {
        id: 'm-deep',
        name: 'Deep',
        vendorId: 'v-open',
        tags: ['Reasoning'],
        supportsThinking: true,
        supportsVision: true,
        contextWindow: 128000,
      },
      {
        id: 'm-fast',
        name: 'Fast',
        vendorId: 'v-open',
        tags: ['Low latency'],
        supportsThinking: false,
        contextWindow: 32000,
      },
    ],
  },
]);

const activeVendorId = ref('v-open');
const activeModelId = ref('m-deep');
const params = ref<SnAiModelParams>({ temperature: 0.7, topP: 1, maxTokens: 4096, stream: true });
const search = ref('');
const testingVendorId = ref<string | undefined>(undefined);

/** 模拟连接测试：短暂展示加载态后结束。 */
function onTest(payload: { vendorId: string }): void {
  testingVendorId.value = payload.vendorId;
  setTimeout(() => {
    testingVendorId.value = undefined;
  }, 1200);
}
</script>

<template>
  <div class="sn-demo sn-demo--model-config">
    <SnModelConfig
      v-model:vendors="vendors"
      v-model:active-vendor-id="activeVendorId"
      v-model:active-model-id="activeModelId"
      v-model:params="params"
      v-model:search="search"
      :testing-vendor-id="testingVendorId"
      @test-connection="onTest"
    />
  </div>
</template>

<style scoped>
.sn-demo--model-config {
  max-width: 960px;
}
</style>
