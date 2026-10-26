<script setup lang="ts">
/**
 * notification-web-types — 四种语义类型对照：info / success / warning / error
 * 各触发一条通知，观察内置图标与配色的差异。
 *
 * useNotification() 必须在其 Provider 后代组件的 setup 中调用，因此触发逻辑
 * 放在内层子组件里，并通过作用域插槽把调用入口交回本组件模板。
 * 图标走 lucide + registerSnIcons + SnIcon（禁止 emoji）。
 */
import { defineComponent } from 'vue';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-vue-next';
import {
  registerSnIcons,
  SnButton,
  SnIcon,
  SnNotificationProvider,
  useNotification,
} from '@snui/vue-web';

registerSnIcons({ Info, CircleCheck, TriangleAlert, CircleAlert });

type SemanticType = 'info' | 'success' | 'warning' | 'error';

interface TypeScenario {
  type: SemanticType;
  label: string;
  iconName: string;
  summary: string;
  title: string;
  content: string;
}

const SCENARIOS: TypeScenario[] = [
  {
    type: 'info',
    label: 'Info',
    iconName: 'Info',
    summary: 'Neutral: releases and changes that need no user action.',
    title: 'New version released',
    content: 'v0.3.0 is live — refresh the page to apply.',
  },
  {
    type: 'success',
    label: 'Success',
    iconName: 'CircleCheck',
    summary: 'Success: confirms a user submission took effect.',
    title: 'Settings saved',
    content: 'Theme and density settings saved locally.',
  },
  {
    type: 'warning',
    label: 'Warning',
    iconName: 'TriangleAlert',
    summary: 'Heads-up: does not block you, but handle it soon.',
    title: 'Storage almost full',
    content: '90% used — consider clearing old versions.',
  },
  {
    type: 'error',
    label: 'Error',
    iconName: 'CircleAlert',
    summary: 'Failure: user action required to continue.',
    title: 'Sync failed',
    content: 'Connection timed out. Check the network and retry.',
  },
];

const TypesTrigger = defineComponent({
  name: 'NotificationTypesTrigger',
  setup(_props, { slots }) {
    const notification = useNotification();

    const notify = (scenario: TypeScenario): void => {
      notification[scenario.type]({
        title: scenario.title,
        content: scenario.content,
        meta: 'Just now',
      });
    };

    return () => slots.default?.({ notify });
  },
});
</script>

<template>
  <div class="ntf-types">
    <SnNotificationProvider>
      <TypesTrigger v-slot="{ notify }">
        <div class="ntf-types__grid">
          <div v-for="scenario in SCENARIOS" :key="scenario.type" class="ntf-types__cell">
            <div class="ntf-types__head">
              <SnIcon
                :name="scenario.iconName"
                :class="['ntf-types__glyph', `ntf-types__glyph--${scenario.type}`]"
              />
              <span class="ntf-types__label">{{ scenario.label }}</span>
            </div>
            <p class="ntf-types__summary">{{ scenario.summary }}</p>
            <SnButton size="small" @click="notify(scenario)">Show one</SnButton>
          </div>
        </div>
      </TypesTrigger>
    </SnNotificationProvider>
  </div>
</template>

<style scoped>
.ntf-types {
  width: 100%;
}

.ntf-types__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(196px, 1fr));
  gap: 12px;
}

.ntf-types__cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 14px;
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-card-radius);
  background: var(--sn-web-color-background-surface);
}

.ntf-types__head {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ntf-types__glyph--info {
  color: var(--sn-web-color-feedback-info);
}

.ntf-types__glyph--success {
  color: var(--sn-web-color-feedback-success);
}

.ntf-types__glyph--warning {
  color: var(--sn-web-color-feedback-warning);
}

.ntf-types__glyph--error {
  color: var(--sn-web-color-feedback-danger);
}

.ntf-types__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--sn-web-color-text-primary);
}

.ntf-types__summary {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--sn-web-color-text-secondary);
}
</style>
