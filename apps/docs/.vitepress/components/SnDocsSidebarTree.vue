<script setup lang="ts">
/**
 * SnDocsSidebarTree — the left menu, rendered with `SnTree`.
 *
 * VitePress still owns the sidebar *data* (`useSidebar()` → the config tree for
 * the current page, already locale- and section-aware) and the aside's scroll
 * container; this component only replaces how the tree is drawn. Rendering it
 * with `SnTree` buys the library's expand switchers, connector lines, hover and
 * selection states, which the default `VPSidebarItem` list does not have.
 *
 * The default list is not removed from the DOM (it is VitePress's own slot
 * content); custom.css hides it so only one menu is on screen, and this tree
 * takes over keyboard/pointer navigation.
 *
 * Node keys: section headers have no link in the config, so they get a
 * synthetic `group:` key and are expansion-only; leaf keys are the route paths
 * themselves, which makes "select the node whose key is the current path" the
 * whole of the active-item logic.
 */
import { computed, ref, watch } from 'vue';
import { useData, useRoute, useRouter } from 'vitepress';
import { useSidebar } from 'vitepress/theme';
import type { DefaultTheme } from 'vitepress/theme';
import { SnTree } from '@snui/vue-web';
import type { SnTreeKey, SnTreeOption } from '@snui/vue-web';

const { lang } = useData();
const route = useRoute();
const router = useRouter();
const { sidebarGroups } = useSidebar();

const heading = computed(() => (lang.value === 'en-US' ? 'Contents' : '文档目录'));

/** `link` may be absolute or relative to the group's `base`. */
function resolveLink(item: DefaultTheme.SidebarItem, base: string): string | undefined {
  if (!item.link) return undefined;
  if (item.link.startsWith('/')) return item.link;
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${item.link}`;
}

function toOption(item: DefaultTheme.SidebarItem, base: string): SnTreeOption {
  const link = resolveLink(item, base);
  const children = (item.items ?? []).map((child) => toOption(child, item.base ?? base));
  const option: SnTreeOption = {
    key: link ?? `group:${item.text}`,
    label: item.text,
  };
  if (children.length > 0) option.children = children;
  return option;
}

const data = computed<SnTreeOption[]>(() =>
  (sidebarGroups.value as DefaultTheme.SidebarItem[]).map((group) => toOption(group, '/')),
);

/** The page's own path, with the `.html` / trailing slash noise removed. */
function normalise(path: string): string {
  return path.replace(/\.html$/, '').replace(/\/$/, '') || '/';
}

const selectedKeys = computed<SnTreeKey[]>(() => [normalise(route.path)]);

/**
 * Every node that owns children = the "expand all" key set. Nested groups
 * are included (the sidebar config is flat today, but nested sections would
 * otherwise stay collapsed).
 */
function expandableKeys(options: SnTreeOption[]): SnTreeKey[] {
  const keys: SnTreeKey[] = [];
  for (const option of options) {
    if (!option.children?.length) continue;
    if (option.key !== undefined) keys.push(option.key);
    keys.push(...expandableKeys(option.children));
  }
  return keys;
}

const allGroupKeys = computed<SnTreeKey[]>(() => expandableKeys(data.value));

/**
 * Requirement: the left menu is fully expanded by default.
 *
 * `default-expand-all` alone is not enough here — VitePress's `useSidebar()`
 * data can resolve after this component's setup, and the tree's uncontrolled
 * initial state is captured once. Controlling `expanded-keys` and seeding it
 * from the *actual* data (with `immediate: true`) makes it deterministic even
 * when the sidebar arrives late. Seeding is keyed by the group-key signature,
 * so a section/locale switch re-expands its groups while a plain route change
 * (or a manual collapse) is left alone; `@update` keeps the set in sync.
 */
const expandedKeys = ref<SnTreeKey[]>([]);
let seededSignature = '';
watch(
  allGroupKeys,
  (keys) => {
    if (keys.length === 0) return;
    // Re-seed when the *set* of groups changes (e.g. web ↔ uni, zh ↔ en),
    // but not on a plain route change inside the same section: that would
    // undo a group the reader just collapsed.
    const signature = keys.map(String).sort().join('\u0000');
    if (signature === seededSignature) return;
    expandedKeys.value = keys;
    seededSignature = signature;
  },
  { immediate: true },
);

function onSelect(keys: SnTreeKey[]): void {
  const key = keys[0];
  if (typeof key !== 'string' || key.startsWith('group:')) return;
  if (normalise(key) === normalise(route.path)) return;
  void router.go(key);
}
</script>

<template>
  <div class="sn-docs-tree">
    <p class="sn-docs-tree__heading">{{ heading }}</p>
    <SnTree
      :data="data"
      :selected-keys="selectedKeys"
      v-model:expanded-keys="expandedKeys"
      expand-on-click
      block-line
      show-line
      line-mode="branch"
      line-corner="rounded"
      :indent="18"
      @update:selected-keys="onSelect"
    />
  </div>
</template>

<style scoped>
.sn-docs-tree {
  display: flex;
  flex-direction: column;
  gap: 6px;
  /* 8px 而不是 12px：省下的 4px 全给菜单文字，长中文标签少折一行。 */
  padding: 4px 8px 24px;
}

.sn-docs-tree__heading {
  margin: 0 0 2px;
  padding-left: 4px;
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* SnTree ships its own row metrics; the sidebar is denser than a form-height
 * tree, so tighten the type a notch and drop the extra row padding. */
.sn-docs-tree :deep(.sn-tree) {
  font-size: 13px;
}

.sn-docs-tree :deep(.sn-tree__node-text) {
  line-height: 1.45;
}
</style>
