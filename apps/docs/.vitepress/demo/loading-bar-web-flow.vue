<script setup lang="ts">
/**
 * loading-bar-web-flow — 完整流程对照：
 *   开始 → 完成：start() → 宽度递增 → finish() → 淡出复位
 *   开始 → 出错：start() → 宽度递增 → error()（危险色）→ 淡出复位
 *
 * useLoadingBar() 必须在 Provider 后代组件的 setup 中调用，因此这里把定时器
 * 与轨迹日志放在内层子组件，通过作用域插槽把状态与触发入口交回模板。
 * 定时器统一登记，组件卸载时全部清理。
 */
import { defineComponent, onBeforeUnmount, ref } from 'vue';
import { SnButton, SnLoadingBarProvider, useLoadingBar } from '@snui/vue-web';

/** 只有这两种收尾方式，顺序推进由内部定时器驱动。 */
type FlowKind = 'finish' | 'error';

const FlowTrigger = defineComponent({
  name: 'LoadingBarFlowTrigger',
  setup(_props, { slots }) {
    const loadingBar = useLoadingBar();
    const steps = ref<string[]>([]);
    const running = ref(false);
    const timers: ReturnType<typeof setTimeout>[] = [];

    const later = (delay: number, task: () => void): void => {
      timers.push(setTimeout(task, delay));
    };

    const log = (text: string): void => {
      steps.value = [...steps.value, text];
    };

    const run = (kind: FlowKind): void => {
      steps.value = [];
      running.value = true;

      loadingBar.start();
      log('start() — 进度条出现，宽度以先快后慢的节奏递增');

      later(500, () => {
        log('递增中…宽度逐步逼近但不会自行到达终点');
      });

      later(1200, () => {
        if (kind === 'finish') {
          loadingBar.finish();
          log('finish() — 按默认色冲刺到 100%');
        } else {
          loadingBar.error();
          log('error() — 切换为危险色后冲刺到 100%');
        }
      });

      later(2100, () => {
        log('淡出完成，进度复位为 0，可以再次触发');
        running.value = false;
      });
    };

    onBeforeUnmount(() => {
      for (const timer of timers) {
        clearTimeout(timer);
      }
      timers.length = 0;
    });

    return () => slots.default?.({ steps: steps.value, run, running: running.value });
  },
});
</script>

<template>
  <div class="lbf">
    <SnLoadingBarProvider>
      <FlowTrigger v-slot="{ steps, run, running }">
        <div class="lbf__actions">
          <SnButton type="primary" :disabled="running" @click="run('finish')">
            开始 → 完成
          </SnButton>
          <SnButton type="error" :disabled="running" @click="run('error')"> 开始 → 出错 </SnButton>
        </div>

        <p class="lbf__hint">进度条固定在视口顶部（挂载到 body），触发后请看页面最上沿。</p>

        <div class="lbf__panel">
          <p class="lbf__panel-title">调用轨迹</p>
          <ol v-if="steps.length" class="lbf__steps">
            <li v-for="(step, index) in steps" :key="index">{{ step }}</li>
          </ol>
          <p v-else class="lbf__empty">点击上方按钮，观察 start() 与收尾方法的调用顺序。</p>
        </div>
      </FlowTrigger>
    </SnLoadingBarProvider>
  </div>
</template>

<style scoped>
.lbf {
  width: 100%;
}

.lbf__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.lbf__hint {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}

.lbf__panel {
  margin-top: 12px;
  padding: 12px 14px;
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-card-radius);
  background: var(--sn-web-color-background-surface);
}

.lbf__panel-title {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--sn-web-color-text-primary);
}

.lbf__steps {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--sn-web-color-text-secondary);
}

.lbf__empty {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
