<script setup lang="ts">
/**
 * menu-web-collapsed — SnMenu `collapsed` mode.
 *
 * When `collapsed` is true, vertical mode renders an icon-only bar
 * (width = `collapsedWidth`). Items with children display their
 * subtree in a CSS popover anchored to the right of the bar that
 * opens on hover / focus-within — no portal, no JS popover manager.
 *
 * Use cases: dashboard sidebars, navigation rail, icon navbars where
 * screen real estate is tight and the user wants quick switching rather
 * than reading every item label.
 */
import { ref } from 'vue';
import { SnMenu } from '@snui/vue-web';
import { Home, Settings, Lightbulb, ShieldCheck, Flame, Menu as MenuIcon } from 'lucide-vue-next';

const active = ref<string | number | null>('home');
const collapsed = ref(false);

const items = [
  { key: 'home', label: 'Home', icon: Home },
  {
    key: 'settings',
    label: 'Settings',
    icon: Settings,
    children: [
      { key: 'general', label: 'General', href: '/settings/general' },
      { key: 'privacy', label: 'Privacy', href: '/settings/privacy' },
      { key: 'security', label: 'Security', href: '/settings/security' },
    ],
  },
  { key: 'tips', label: 'Tip', icon: Lightbulb },
  {
    key: 'safe',
    label: 'Guard',
    icon: ShieldCheck,
    children: [
      { key: 'rules', label: 'Rules', href: '/safe/rules' },
      { key: 'logs', label: 'Logs', href: '/safe/logs' },
    ],
  },
  { key: 'trending', label: 'Trends', icon: Flame },
  { key: 'more', label: 'More', icon: MenuIcon },
];
</script>

<template>
  <div class="sn-menu-collapsed-demo">
    <button type="button" class="sn-menu-collapsed-demo__toggle" @click="collapsed = !collapsed">
      {{ collapsed ? 'Expand' : 'Collapse' }}
    </button>
    <div class="sn-menu-collapsed-demo__stage">
      <SnMenu
        mode="vertical"
        :options="items"
        v-model:value="active"
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        style="border: 1px solid var(--vp-c-divider); border-radius: 8px"
      />
    </div>
    <p class="sn-menu-collapsed-demo__hint" style="max-width: 240px; text-align: center">
      Hover the icons with submenus (Settings / Guard) → a submenu popover pops out on the right
    </p>
    <p class="sn-menu-collapsed-demo__active">
      Selected:<code>{{ active }}</code>
    </p>
  </div>
</template>

<style scoped>
.sn-menu-collapsed-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}
.sn-menu-collapsed-demo__toggle {
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: var(--vp-c-text-1);
}
.sn-menu-collapsed-demo__stage {
  /* Right padding leaves room for the hover popover (popover width ~180px
   * + 8px offset from the menu's right edge). Without this, the popover
   * gets clipped by the demo card's border. */
  padding: 16px 220px 16px 24px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  display: flex;
  justify-content: flex-start;
}
.sn-menu-collapsed-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
  text-align: center;
}
.sn-menu-collapsed-demo__active {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-1);
}
.sn-menu-collapsed-demo__active code {
  background: var(--vp-c-bg-soft);
  padding: 1px 6px;
  border-radius: 3px;
  font-family: ui-monospace, monospace;
}
</style>
