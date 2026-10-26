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
      log('start() — bar appears; width grows fast, then slow');

      later(500, () => {
        log('Increasing… width approaches but never reaches the end on its own');
      });

      later(1200, () => {
        if (kind === 'finish') {
          loadingBar.finish();
          log('finish() — sprints to 100% in the default color');
        } else {
          loadingBar.error();
          log('error() — switches to danger color, then sprints to 100%');
        }
      });

      later(2100, () => {
        log('Fade-out done; progress reset to 0 and ready to trigger again');
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
            Start → finish
          </SnButton>
          <SnButton type="error" :disabled="running" @click="run('error')">
            Start → error
          </SnButton>
        </div>

        <p class="lbf__hint">
          The bar is fixed to the top of the viewport (mounted on body); after triggering, watch the
          very top of the page.
        </p>

        <div class="lbf__panel">
          <p class="lbf__panel-title">Call trace</p>
          <ol v-if="steps.length" class="lbf__steps">
            <li v-for="(step, index) in steps" :key="index">{{ step }}</li>
          </ol>
          <p v-else class="lbf__empty">
            Click the buttons above and watch the call order of start() and the finish methods.
          </p>
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
