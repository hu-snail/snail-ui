<script setup lang="ts">
/** Demo: SnTransfer — renderSourceLabel / renderTargetLabel 自定义行渲染 + 面板标题定制。 */
import { h, ref } from 'vue'
import type { VNodeChild } from 'vue'
import { UserRound, UserRoundCheck } from 'lucide-vue-next'
import { registerSnIcons, SnIcon, SnTransfer } from '@snui/vue-web'

interface DemoOption {
  label: string
  value: string
  disabled?: boolean
}

registerSnIcons({ UserRound, UserRoundCheck })

/** 本地造 18 条成员数据，含 2 条锁定（disabled）项。 */
const MEMBERS: Array<{ name: string; dept: string; locked?: boolean }> = [
  { name: '陈晓', dept: '研发' },
  { name: '林岚', dept: '研发' },
  { name: '周航', dept: '研发', locked: true },
  { name: '苏婉', dept: '设计' },
  { name: '赵磊', dept: '设计' },
  { name: '何雨', dept: '设计', locked: true },
  { name: '王珂', dept: '市场' },
  { name: '郑楚', dept: '市场' },
  { name: '高翔', dept: '市场' },
  { name: '孙悦', dept: '运营' },
  { name: '吴迪', dept: '运营' },
  { name: '徐静', dept: '运营' },
  { name: '李昂', dept: '财务' },
  { name: '杨柳', dept: '财务' },
  { name: '胡蝶', dept: '人事' },
  { name: '郭涛', dept: '人事' },
  { name: '邓琪', dept: '客服' },
  { name: '冯越', dept: '客服' },
]

const options: DemoOption[] = MEMBERS.map((member, index) => {
  const option: DemoOption = {
    label: `${member.name} · ${member.dept}`,
    value: `member-${index + 1}`,
  }
  if (member.locked === true) option.disabled = true
  return option
})

const target = ref<string[]>(['member-1', 'member-2', 'member-4'])

/** 源面板行：成员图标 + 姓名 + 部门。 */
function renderSourceLabel({ option }: { option: DemoOption }): VNodeChild {
  const [name, dept] = option.label.split(' · ')
  return h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } }, [
    h(SnIcon, { icon: UserRound, size: 14 }),
    h('span', null, name),
    h('span', {
      style: {
        padding: '0 6px',
        borderRadius: '999px',
        fontSize: '12px',
        lineHeight: '18px',
        color: 'var(--sn-web-color-text-tertiary)',
        backgroundColor: 'var(--sn-web-color-background-subtle)',
      },
    }, dept),
  ])
}

/** 目标面板行：强调色图标 + 姓名 + 已加入标记。 */
function renderTargetLabel({ option }: { option: DemoOption }): VNodeChild {
  const [name] = option.label.split(' · ')
  return h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } }, [
    h(SnIcon, {
      icon: UserRoundCheck,
      size: 14,
      style: { color: 'var(--sn-web-color-action-primary)' },
    }),
    h('span', null, name),
    h('span', {
      style: {
        padding: '0 6px',
        borderRadius: '999px',
        fontSize: '12px',
        lineHeight: '18px',
        color: 'var(--sn-web-color-action-primary)',
        backgroundColor: 'color-mix(in srgb, var(--sn-web-color-action-primary) 12%, transparent)',
      },
    }, '已加入'),
  ])
}
</script>

<template>
  <div class="transfer-demo">
    <SnTransfer
      v-model:value="target"
      :options="options"
      source-title="候选成员"
      target-title="项目成员"
      :render-source-label="renderSourceLabel"
      :render-target-label="renderTargetLabel"
    />
    <p class="transfer-demo__hint">已选 {{ target.length }} 人：{{ target.join('、') || '（空）' }}</p>
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
