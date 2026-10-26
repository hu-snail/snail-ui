<script setup lang="ts">
/** Demo: SnTransfer — renderSourceLabel / renderTargetLabel 自定义行渲染 + 面板标题定制。 */
import { h, ref } from 'vue';
import type { VNodeChild } from 'vue';
import { UserRound, UserRoundCheck } from 'lucide-vue-next';
import { registerSnIcons, SnIcon, SnTransfer } from '@snui/vue-web';

interface DemoOption {
  label: string;
  value: string;
  disabled?: boolean;
}

registerSnIcons({ UserRound, UserRoundCheck });

/** 本地造 18 条成员数据，含 2 条锁定（disabled）项。 */
const MEMBERS: Array<{ name: string; dept: string; locked?: boolean }> = [
  { name: 'Chen Xiao', dept: 'Engineering' },
  { name: 'Lin Lan', dept: 'Engineering' },
  { name: 'Zhou Hang', dept: 'Engineering', locked: true },
  { name: 'Su Wan', dept: 'Design' },
  { name: 'Zhao Lei', dept: 'Design' },
  { name: 'He Yu', dept: 'Design', locked: true },
  { name: 'Wang Ke', dept: 'Marketing' },
  { name: 'Zheng Chu', dept: 'Marketing' },
  { name: 'Gao Xiang', dept: 'Marketing' },
  { name: 'Sun Yue', dept: 'Operations' },
  { name: 'Wu Di', dept: 'Operations' },
  { name: 'Xu Jing', dept: 'Operations' },
  { name: 'Li Ang', dept: 'Finance' },
  { name: 'Yang Liu', dept: 'Finance' },
  { name: 'Hu Die', dept: 'HR' },
  { name: 'Guo Tao', dept: 'HR' },
  { name: 'Deng Qi', dept: 'Support' },
  { name: 'Feng Yue', dept: 'Support' },
];

const options: DemoOption[] = MEMBERS.map((member, index) => {
  const option: DemoOption = {
    label: `${member.name} · ${member.dept}`,
    value: `member-${index + 1}`,
  };
  if (member.locked === true) option.disabled = true;
  return option;
});

const target = ref<string[]>(['member-1', 'member-2', 'member-4']);

/** 源面板行：成员图标 + 姓名 + 部门。 */
function renderSourceLabel({ option }: { option: DemoOption }): VNodeChild {
  const [name, dept] = option.label.split(' · ');
  return h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } }, [
    h(SnIcon, { icon: UserRound, size: 14 }),
    h('span', null, name),
    h(
      'span',
      {
        style: {
          padding: '0 6px',
          borderRadius: '999px',
          fontSize: '12px',
          lineHeight: '18px',
          color: 'var(--sn-web-color-text-tertiary)',
          backgroundColor: 'var(--sn-web-color-background-subtle)',
        },
      },
      dept,
    ),
  ]);
}

/** 目标面板行：强调色图标 + 姓名 + 已加入标记。 */
function renderTargetLabel({ option }: { option: DemoOption }): VNodeChild {
  const [name] = option.label.split(' · ');
  return h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } }, [
    h(SnIcon, {
      icon: UserRoundCheck,
      size: 14,
      style: { color: 'var(--sn-web-color-action-primary)' },
    }),
    h('span', null, name),
    h(
      'span',
      {
        style: {
          padding: '0 6px',
          borderRadius: '999px',
          fontSize: '12px',
          lineHeight: '18px',
          color: 'var(--sn-web-color-action-primary)',
          backgroundColor:
            'color-mix(in srgb, var(--sn-web-color-action-primary) 12%, transparent)',
        },
      },
      'Joined',
    ),
  ]);
}
</script>

<template>
  <div class="transfer-demo">
    <SnTransfer
      v-model:value="target"
      :options="options"
      source-title="Candidates"
      target-title="Project members"
      :render-source-label="renderSourceLabel"
      :render-target-label="renderTargetLabel"
    />
    <p class="transfer-demo__hint">
      Selected {{ target.length }}: {{ target.join(', ') || '(none)' }}
    </p>
  </div>
</template>

<style scoped>
.transfer-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transfer-demo__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
