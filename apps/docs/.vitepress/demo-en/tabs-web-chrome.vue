<script setup lang="ts">
/**
 * tabs-web-chrome — SnTabs `type="chrome"`: a browser-style tab strip.
 *
 * Rounded-top tabs sit on a tinted strip whose bottom hairline runs under the
 * inactive tabs; the active tab opens onto the content surface. The close
 * affordance is revealed on hover / on the active tab (like a browser), and
 * the trailing `+` appends a tab.
 */
import { ref } from 'vue'
import { SnTabs, SnTabPane } from '@snui/vue-web'

interface BrowserTab {
  name: string
  label: string
  url: string
}

const active = ref<string>('docs')

const tabs = ref<BrowserTab[]>([
  { name: 'docs', label: 'Component docs', url: 'snui.dev/components/web/tabs' },
  { name: 'design', label: 'Design draft', url: 'Figma · UI Kit v3.1' },
  { name: 'issues', label: 'Issues', url: '12 pending' },
  { name: 'repo', label: 'Repository', url: 'github.com/snail-aui' },
])

function onClose(name: string | number): void {
  const index = tabs.value.findIndex((tab) => tab.name === name)
  if (index === -1) return
  const removingActive = active.value === name
  tabs.value.splice(index, 1)
  if (!removingActive) return
  const next = tabs.value[Math.min(index, tabs.value.length - 1)]
  active.value = next ? next.name : ''
}

function onAdd(): void {
  const index = tabs.value.length + 1
  const name = `tab-${index}`
  tabs.value.push({ name, label: `New tab ${index}`, url: 'about:blank' })
  active.value = name
}
</script>

<template>
  <div class="tabs-demo">
    <SnTabs
      v-model:value="active"
      type="chrome"
      closable
      addable
      @close="onClose"
      @add="onAdd"
    >
      <SnTabPane v-for="tab in tabs" :key="tab.name" :name="tab.name" :tab="tab.label">
        <div class="tabs-demo__page">
          <span class="tabs-demo__page-title">{{ tab.label }}</span>
          <span class="tabs-demo__page-url">{{ tab.url }}</span>
        </div>
      </SnTabPane>
    </SnTabs>
    <p class="tabs-demo__state">
      Current:<code>{{ active }}</code> · {{ tabs.length }} tags
    </p>
  </div>
</template>

<style scoped>
.tabs-demo {
  width: 100%;
}
.tabs-demo__page {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 4px 4px;
}
.tabs-demo__page-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--sn-web-color-text-primary);
}
.tabs-demo__page-url {
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
.tabs-demo__state {
  margin: 16px 0 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.tabs-demo__state code {
  background: var(--sn-web-color-background-subtle);
  padding: 1px 6px;
  border-radius: 3px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
</style>