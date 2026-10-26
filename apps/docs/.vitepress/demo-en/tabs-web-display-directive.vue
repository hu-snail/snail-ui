<script setup lang="ts">
/**
 * tabs-web-display-directive — whether a hidden pane stays mounted.
 */
import { ref } from 'vue';
import { SnTabPane, SnTabs, SnButton } from '@snui/vue-web';

const directive = ref<'if' | 'show'>('if');
const active = ref('a');
const mountCount = ref(0);

function onPaneMount(): void {
  mountCount.value += 1;
}
</script>

<template>
  <div class="tabs-dd">
    <div class="tabs-dd__bar">
      <span class="tabs-dd__cap">displayDirective</span>
      <SnButton
        size="small"
        :type="directive === 'if' ? 'primary' : 'default'"
        @click="directive = 'if'"
      >
        if
      </SnButton>
      <SnButton
        size="small"
        :type="directive === 'show' ? 'primary' : 'default'"
        @click="directive = 'show'"
      >
        show
      </SnButton>
      <span class="tabs-dd__count">
        Panel B mount count:<code>{{ mountCount }}</code>
      </span>
    </div>

    <SnTabs v-model:value="active" type="line">
      <SnTabPane name="a" tab="Panel A" display-directive="show"> Content of panel A </SnTabPane>
      <SnTabPane :name="'b'" tab="Panel B" :display-directive="directive">
        <span>Content of panel B (switch tabs to watch the mount count change)</span>
      </SnTabPane>
    </SnTabs>

    <p class="tabs-dd__hint">
      <code>if</code> unmounts the panel when you switch away and remounts on return (the count
      increases); <code>show</code> keep-alive only toggles visibility — state inside the panel is
      preserved.
    </p>
  </div>
</template>

<style scoped>
.tabs-dd {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
}
.tabs-dd__bar {
  display: flex;
  align-items: center;
  gap: 10px;
}
.tabs-dd__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.tabs-dd__count {
  margin-left: auto;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.tabs-dd__hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--sn-web-color-text-secondary);
}
</style>
