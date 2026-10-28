<script setup lang="ts">
/**
 * TooltipProbe — live geometry probe for SnTooltip placement detachment.
 * Scrolls each trigger into view, hovers it programmatically, then reads
 * the bubble's viewport rect vs the trigger rect and renders the main-axis
 * gap. A gap larger than 1px that no arrow fills is the "分离" bug.
 */
import { nextTick, ref } from 'vue';
import { SnTooltip } from '@snui/vue-web';

const placements = ['top', 'tl', 'left'] as const;

interface Reading {
  placement: string;
  bubble: string;
  trigger: string;
  gapMain: number;
  arrowSeen: boolean;
}

const readings = ref<Reading[]>([]);
const probing = ref(false);

async function probe(placement: string): Promise<void> {
  const trigger = document.querySelector<HTMLElement>(`[data-probe-trigger="${placement}"]`);
  if (!trigger) return;
  // Bring the trigger into the viewport first — a below-the-fold trigger
  // legitimately flips / clamps, which would pollute the measurement.
  trigger.scrollIntoView({ block: 'center' });
  await new Promise((r) => setTimeout(r, 120));
  trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  await nextTick();
  await new Promise((r) => setTimeout(r, 350)); // settle delay + animation
  const bubble = document.body.querySelector<HTMLElement>('.sn-tooltip');
  if (!bubble) {
    readings.value.push({ placement, bubble: 'NO BUBBLE', trigger: '-', gapMain: -1, arrowSeen: false });
    trigger.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await nextTick();
    await new Promise((r) => setTimeout(r, 250));
    return;
  }
  const b = bubble.getBoundingClientRect();
  const t = trigger.getBoundingClientRect();
  const arrow = bubble.querySelector<HTMLElement>('.sn-tooltip__arrow');
  let gapMain: number;
  if (placement === 'left') gapMain = t.left - b.right;
  else if (placement === 'right') gapMain = b.left - t.right;
  else if (placement === 'top' || placement === 'tl' || placement === 'tr') gapMain = t.top - b.bottom;
  else gapMain = b.top - t.bottom;
  const fmt = (r: DOMRect): string =>
    `${Math.round(r.top)} / ${Math.round(r.left)} / ${Math.round(r.width)} / ${Math.round(r.height)}`;
  readings.value.push({
    placement,
    bubble: fmt(b),
    trigger: fmt(t),
    gapMain: Math.round(gapMain * 10) / 10,
    arrowSeen: arrow !== null,
  });
  trigger.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
  await nextTick();
  await new Promise((r) => setTimeout(r, 250));
}

async function probeAll(): Promise<void> {
  probing.value = true;
  readings.value = [];
  for (const p of placements) {
    await probe(p);
  }
  probing.value = false;
}
</script>

<template>
  <div class="probe">
    <h2>Tooltip geometry probe</h2>
    <button type="button" class="probe__run" :disabled="probing" @click="probeAll">
      {{ probing ? 'Probing…' : 'Run probe' }}
    </button>

    <div class="probe__stage">
      <div v-for="p in placements" :key="p" class="probe__row">
        <SnTooltip :content="p" :placement="p">
          <button type="button" class="probe__btn" :data-probe-trigger="p">{{ p }}</button>
        </SnTooltip>
      </div>
    </div>

    <table v-if="readings.length" class="probe__table">
      <thead>
        <tr>
          <th>placement</th>
          <th>bubble(t/l/w/h)</th>
          <th>trigger(t/l/w/h)</th>
          <th>main-axis gap</th>
          <th>arrow</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in readings" :key="r.placement">
          <td>{{ r.placement }}</td>
          <td>{{ r.bubble }}</td>
          <td>{{ r.trigger }}</td>
          <td :class="{ bad: r.gapMain > 1 }">{{ r.gapMain }}px</td>
          <td>{{ r.arrowSeen ? 'yes' : 'NO' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.probe {
  display: grid;
  gap: 16px;
  padding: 24px;
  max-width: 720px;
}
.probe__run {
  justify-self: start;
  padding: 8px 16px;
}
.probe__stage {
  display: grid;
  gap: 24px;
  justify-items: start;
  padding: 12px;
}
.probe__btn {
  padding: 8px 20px;
}
.probe__table {
  border-collapse: collapse;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.probe__table th,
.probe__table td {
  border: 1px solid #ddd;
  padding: 4px 8px;
  text-align: left;
}
.probe__table td.bad {
  color: #d03050;
  font-weight: 700;
}
</style>
