<script setup lang="ts">
/**
 * Demo: SnCheckbox — custom slots (`indicator` / `icon` / default scope).
 *
 * Shows the three supported customization layers:
 *   1. `indicator` — replace the whole box (tag / card style)
 *   2. `icon`      — keep the box, swap the tick glyph
 *   3. default     — rich label content with the checked state in scope
 */
import { ref } from 'vue';
import { Check } from 'lucide-vue-next';
import { SnCheckbox } from '@snui/vue-web';

const tags = ref<string[]>(['tag-1']);
const cards = ref<string[]>(['card-1']);
const glyph = ref(true);
const rich = ref(true);

function toggleTag(value: string, checked: boolean): void {
  tags.value = checked ? [...tags.value, value] : tags.value.filter((v) => v !== value);
}

function toggleCard(value: string, checked: boolean): void {
  cards.value = checked ? [...cards.value, value] : cards.value.filter((v) => v !== value);
}
</script>

<template>
  <div class="cb-slot-demo">
    <section class="cb-slot-demo__block">
      <h4>标签形态（indicator 插槽）</h4>
      <div class="cb-slot-demo__row">
        <SnCheckbox
          v-for="tag in ['tag-1', 'tag-2', 'tag-3']"
          :key="tag"
          :model-value="tags.includes(tag)"
          @update:model-value="(checked: unknown) => toggleTag(tag, Boolean(checked))"
        >
          <template #indicator="{ checked }">
            <span class="tag-chip" :class="{ 'tag-chip--on': checked }">
              This is a tag checkbox {{ tag.slice(-1) }}
            </span>
          </template>
        </SnCheckbox>
      </div>
    </section>

    <section class="cb-slot-demo__block">
      <h4>卡片形态（indicator 插槽 + 默认插槽）</h4>
      <div class="cb-slot-demo__row">
        <SnCheckbox
          v-for="card in [
            { id: 'card-1', title: 'Checkbox Card 1' },
            { id: 'card-2', title: 'Checkbox Card 2' },
          ]"
          :key="card.id"
          :model-value="cards.includes(card.id)"
          @update:model-value="(checked: unknown) => toggleCard(card.id, Boolean(checked))"
        >
          <template #indicator="{ checked }">
            <span class="card-box" :class="{ 'card-box--on': checked }">
              <Check v-if="checked" :size="11" :stroke-width="3" />
            </span>
          </template>
          <template #default="{ checked }">
            <span class="card-text" :class="{ 'card-text--on': checked }">
              <strong>{{ card.title }}</strong>
              <em>this is a text</em>
            </span>
          </template>
        </SnCheckbox>
      </div>
    </section>

    <section class="cb-slot-demo__block">
      <h4>自定义勾选图标（icon 插槽）</h4>
      <SnCheckbox v-model="glyph">
        <template #icon><Check :size="10" :stroke-width="3" /></template>
        保留方框，替换对勾字形
      </SnCheckbox>
    </section>

    <section class="cb-slot-demo__block">
      <h4>默认插槽作用域（checked / disabled / indeterminate）</h4>
      <SnCheckbox v-model="rich">
        <template #default="{ checked, disabled, indeterminate }">
          状态：checked={{ checked }} · disabled={{ disabled }} · indeterminate={{ indeterminate }}
        </template>
      </SnCheckbox>
    </section>
  </div>
</template>

<style scoped>
.cb-slot-demo {
  display: grid;
  gap: 20px;
  justify-items: start;
}
.cb-slot-demo__block {
  display: grid;
  gap: 10px;
  justify-items: start;
}
.cb-slot-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
.cb-slot-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

/* Tag chip — the indicator slot owns the whole visual. */
.tag-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border: 1px solid transparent;
  border-radius: var(--sn-web-radius-sm, 4px);
  background: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition:
    background-color 0.18s ease-out,
    color 0.18s ease-out,
    box-shadow 0.18s ease-out;
}
.tag-chip--on {
  background: var(--sn-web-color-action-primary-soft);
  color: var(--sn-web-color-action-primary);
  box-shadow: 0 0 0 1px var(--sn-web-color-action-primary);
}

/* Card box — the small square that carries the tick. */
.card-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: 3px;
  color: var(--sn-web-color-text-on-primary);
  background: var(--sn-web-color-background-surface);
  transition:
    background-color 0.18s ease-out,
    border-color 0.18s ease-out,
    box-shadow 0.18s ease-out;
}
.card-box--on {
  background: var(--sn-web-color-action-primary);
  border-color: var(--sn-web-color-action-primary);
  box-shadow: 0 0 0 3px var(--sn-web-color-action-primary-soft);
}

.card-text {
  display: grid;
  gap: 2px;
  font-size: 13px;
}
.card-text strong {
  font-weight: 600;
  color: var(--sn-web-color-text-primary);
}
.card-text em {
  font-style: normal;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.card-text--on strong {
  color: var(--sn-web-color-action-primary);
}
</style>
