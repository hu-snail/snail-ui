<script setup lang="ts">
/** Demo: SnForm + SnFormItem — form-level size / valueAlign / asteriskPosition / hideAsterisk cascade. */
import { reactive } from 'vue'
import { SnForm, SnFormItem, SnInput } from '@snui/vue-web'

const a = reactive({ a: '', b: '', c: '' })
const b = reactive({ a: '', b: '', c: '' })
const c = reactive({ a: '', b: '', c: '' })
const d = reactive({ a: '', b: '', c: '' })
</script>

<template>
  <div class="sn-demo-grid">
    <section>
      <h4>default</h4>
      <SnForm :model="a">
        <SnFormItem prop="a" label="Email" required>
          <SnInput v-model="a.a" />
        </SnFormItem>
        <SnFormItem prop="b" label="Nickname" required>
          <SnInput v-model="a.b" />
        </SnFormItem>
      </SnForm>
    </section>

    <section>
      <h4>size="small"</h4>
      <SnForm :model="b" size="small">
        <SnFormItem prop="a" label="Email" required>
          <SnInput v-model="b.a" />
        </SnFormItem>
        <SnFormItem prop="b" label="Nickname" required>
          <SnInput v-model="b.b" />
        </SnFormItem>
      </SnForm>
    </section>

    <section>
      <h4>valueAlign="right"</h4>
      <SnForm :model="c" value-align="right">
        <SnFormItem prop="a" label="Amount" required>
          <SnInput v-model="c.a" align-right />
        </SnFormItem>
        <SnFormItem prop="b" label="Quantity" required>
          <SnInput v-model="c.b" align-right />
        </SnFormItem>
      </SnForm>
    </section>

    <section>
      <h4>asteriskPosition="right" + hideAsterisk</h4>
      <SnForm :model="d" asterisk-position="right" hide-asterisk>
        <SnFormItem prop="a" label="Email" required>
          <SnInput v-model="d.a" />
        </SnFormItem>
        <SnFormItem prop="b" label="Nickname" required>
          <SnInput v-model="d.b" />
        </SnFormItem>
      </SnForm>
    </section>
  </div>
</template>

<style scoped>
.sn-demo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; }
.sn-demo-grid section h4 { margin: 0 0 12px; font-size: 13px; font-weight: 600; color: var(--vp-c-text-2); }
</style>