<script setup lang="ts">
/** Demo: SnTreeSelect — indent-guide connector style (`line-mode="guide"`). */
import { ref } from 'vue';
import { SnTreeSelect } from '@snui/vue-web';

const solidValue = ref<string | null>(null);
const dashedValue = ref<string | null>(null);

/** Monorepo shape from the reference: plain labels, no icons. */
const options = [
  {
    label: 'apps',
    value: 'apps',
    children: [
      {
        label: 'frontend',
        value: 'frontend',
        children: [
          { label: 'package.json', value: 'frontend-package' },
          { label: 'tsconfig.json', value: 'frontend-tsconfig' },
          {
            label: 'src',
            value: 'frontend-src',
            children: [
              {
                label: 'app',
                value: 'frontend-app',
                children: [
                  { label: 'layout.tsx', value: 'layout' },
                  { label: 'page.tsx', value: 'page' },
                ],
              },
            ],
          },
        ],
      },
      {
        label: 'api',
        value: 'api',
        children: [
          { label: 'package.json', value: 'api-package' },
          { label: 'src', value: 'api-src' },
        ],
      },
    ],
  },
  {
    label: 'packages',
    value: 'packages',
    children: [
      {
        label: 'react',
        value: 'react',
        children: [
          { label: 'package.json', value: 'react-package' },
          { label: 'src', value: 'react-src' },
        ],
      },
    ],
  },
];
</script>

<template>
  <div class="sn-demo">
    <p class="sn-demo__hint">
      line-mode="guide" draws vertical indent guides only, with no horizontal branches; solid /
      dashed and a custom color are supported.
    </p>
    <section class="sn-demo__col">
      <p class="sn-demo__label">Indent guides + solid</p>
      <SnTreeSelect
        v-model="solidValue"
        :options="options"
        show-line
        line-mode="guide"
        default-expand-all
        placeholder="Choose a file"
        style="width: 240px"
      />
    </section>
    <section class="sn-demo__col">
      <p class="sn-demo__label">Indent guides + dashed</p>
      <SnTreeSelect
        v-model="dashedValue"
        :options="options"
        show-line
        line-mode="guide"
        line-style="dashed"
        default-expand-all
        placeholder="Choose a file"
        style="width: 240px"
      />
    </section>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
}
.sn-demo__hint {
  flex: 1 1 100%;
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.sn-demo__col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sn-demo__label {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
