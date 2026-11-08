<script setup lang="ts">
/** Demo: SnTree — indent-guide connector style (`line-mode="guide"`). */
import { SnTree } from '@snui/vue-web';
import type { SnTreeOption } from '@snui/vue-web';

/** Monorepo shape from the reference: no icons, plain labels. */
const data: SnTreeOption[] = [
  {
    key: 'apps',
    label: 'apps',
    children: [
      {
        key: 'frontend',
        label: 'frontend',
        children: [
          { key: 'frontend-package', label: 'package.json' },
          { key: 'frontend-tsconfig', label: 'tsconfig.json' },
          {
            key: 'frontend-src',
            label: 'src',
            children: [
              {
                key: 'frontend-app',
                label: 'app',
                children: [
                  { key: 'layout', label: 'layout.tsx' },
                  { key: 'page', label: 'page.tsx' },
                ],
              },
            ],
          },
        ],
      },
      {
        key: 'api',
        label: 'api',
        children: [
          { key: 'api-package', label: 'package.json' },
          { key: 'api-src', label: 'src' },
        ],
      },
    ],
  },
  {
    key: 'packages',
    label: 'packages',
    children: [
      {
        key: 'react',
        label: 'react',
        children: [
          { key: 'react-package', label: 'package.json' },
          { key: 'react-src', label: 'src' },
        ],
      },
    ],
  },
];

const expanded = ['apps', 'frontend', 'frontend-src', 'frontend-app', 'api', 'packages', 'react'];
</script>

<template>
  <div class="sn-demo">
    <p class="sn-demo__hint">
      line-mode="guide" 只画每个层级的竖向缩进引导线，不画横向分叉线；引导线贯穿整个子树，可与
      line-style（实线 / 虚线）、line-color 组合。
    </p>
    <section class="sn-demo__col">
      <p class="sn-demo__label">缩进引导线 + 实线</p>
      <SnTree
        :data="data"
        :default-expanded-keys="expanded"
        show-line
        line-mode="guide"
        :indent="20"
      />
    </section>
    <section class="sn-demo__col">
      <p class="sn-demo__label">缩进引导线 + 虚线</p>
      <SnTree
        :data="data"
        :default-expanded-keys="expanded"
        show-line
        line-mode="guide"
        line-style="dashed"
        :indent="20"
      />
    </section>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 24px 32px;
}
.sn-demo__hint {
  flex: 1 1 100%;
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.sn-demo__col {
  flex: 1 1 220px;
  max-width: 260px;
}
.sn-demo__label {
  margin: 0 0 8px;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
