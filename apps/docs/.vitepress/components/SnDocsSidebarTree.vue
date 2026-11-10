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
import { computed } from 'vue';
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
      block-line
      default-expand-all
      :indent="14"
      @update:selected-keys="onSelect"
    />
  </div>
</template>

<style scoped>
.sn-docs-tree {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 4px 12px 24px;
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

.sn-docs-tree :deep(.sn-tree__node-label) {
  line-height: 1.5;
}
</style>
