<script setup lang="ts">
/**
 * button-web-interactive — 一组可直接复用的「按钮 + 异步动作」交互场景。
 *
 * 每个场景都只用了 `SnButton` 的三个能力：`loading`（spinner 且吞掉点击）、
 * `icon`（lucide 图标）、`type`（颜色语义）。定时器统一登记，卸载时清空
 * （AGENTS.md §41）。
 */
import { onBeforeUnmount, ref } from 'vue'
import { Check, Copy, Download, ShoppingCart, Star, Trash2 } from 'lucide-vue-next'
import { SnButton } from '@snui/vue-web'

const timers = new Set<number>()

function later(fn: () => void, ms: number): void {
  const id = window.setTimeout(() => {
    timers.delete(id)
    fn()
  }, ms)
  timers.add(id)
}

onBeforeUnmount(() => {
  timers.forEach((id) => window.clearTimeout(id))
  timers.clear()
})

/* ① 提交表单：loading → 成功文案 → 复位 */
const submitting = ref(false)
const submitted = ref(false)
function submit(): void {
  if (submitting.value) return
  submitting.value = true
  later(() => {
    submitting.value = false
    submitted.value = true
    later(() => {
      submitted.value = false
    }, 1800)
  }, 1200)
}

/* ② 下载：loading → 完成 */
const downloading = ref(false)
const downloaded = ref(false)
function download(): void {
  if (downloading.value || downloaded.value) return
  downloading.value = true
  later(() => {
    downloading.value = false
    downloaded.value = true
    later(() => {
      downloaded.value = false
    }, 2000)
  }, 1500)
}

/* ③ 收藏：图标 + 计数切换 */
const starred = ref(false)
const starCount = ref(128)
function toggleStar(): void {
  starred.value = !starred.value
  starCount.value += starred.value ? 1 : -1
}

/* ④ 复制：短暂的成功反馈后复位 */
const copied = ref(false)
async function copy(): Promise<void> {
  try {
    await navigator.clipboard.writeText('pnpm add @snui/vue-web')
  } catch {
    // 非安全上下文 / 无权限时也给出同样的视觉反馈：这个场景演示的是按钮反馈。
  }
  copied.value = true
  later(() => {
    copied.value = false
  }, 1600)
}

/* ⑤ 加入购物车：loading → 数量 +1 */
const adding = ref(false)
const cartCount = ref(0)
function addToCart(): void {
  if (adding.value) return
  adding.value = true
  later(() => {
    adding.value = false
    cartCount.value += 1
    later(() => {
      cartCount.value -= 1
    }, 1200)
  }, 900)
}

/* ⑥ 删除需要二次确认：第一次点击进入确认态，确认后 loading → 已删除 */
const confirmingDelete = ref(false)
const deleting = ref(false)
const deleted = ref(false)
function requestDelete(): void {
  if (deleting.value || deleted.value) return
  confirmingDelete.value = true
  later(() => {
    confirmingDelete.value = false
  }, 3000)
}
function confirmDelete(): void {
  confirmingDelete.value = false
  deleting.value = true
  later(() => {
    deleting.value = false
    deleted.value = true
  }, 1100)
}
function restore(): void {
  deleted.value = false
  deleting.value = false
  confirmingDelete.value = false
}
</script>

<template>
  <div class="actions-demo">
    <div class="actions-demo__row">
      <span class="actions-demo__label">Submit form</span>
      <SnButton
        type="primary"
        :loading="submitting"
        :icon="submitted ? Check : undefined"
        @click="submit"
      >
        {{ submitting ? 'Submitting…' : submitted ? 'Submitted' : 'Submit' }}
      </SnButton>
      <span class="actions-demo__state">
        {{ submitting ? 'loading' : submitted ? 'success' : 'idle' }}
      </span>
    </div>

    <div class="actions-demo__row">
      <span class="actions-demo__label">Download file</span>
      <SnButton
        :loading="downloading"
        :type="downloaded ? 'success' : 'default'"
        :icon="downloaded ? Check : Download"
        @click="download"
      >
        {{ downloading ? 'Downloading…' : downloaded ? 'Downloaded' : 'Download' }}
      </SnButton>
      <span class="actions-demo__state">report-2026-q4.pdf · 2.4 MB</span>
    </div>

    <div class="actions-demo__row">
      <span class="actions-demo__label">Favorite</span>
      <SnButton
        :type="starred ? 'warning' : 'default'"
        :icon="Star"
        :aria-label="starred ? 'Unfavorite' : 'Favorite'"
        @click="toggleStar"
      >
        {{ starred ? 'Favorited' : 'Favorite' }} · {{ starCount }}
      </SnButton>
      <span class="actions-demo__state">Toggle-style interaction: no loading; icon and label switch instantly</span>
    </div>

    <div class="actions-demo__row">
      <span class="actions-demo__label">Copy command</span>
      <SnButton
        :type="copied ? 'success' : 'default'"
        :icon="copied ? Check : Copy"
        @click="copy"
      >
        {{ copied ? 'Copied' : 'Copy' }}
      </SnButton>
      <span class="actions-demo__state">pnpm add @snui/vue-web</span>
    </div>

    <div class="actions-demo__row">
      <span class="actions-demo__label">Add to cart</span>
      <SnButton
        type="primary"
        :loading="adding"
        :icon="ShoppingCart"
        @click="addToCart"
      >
        {{ adding ? 'Adding…' : 'Add to cart' }}
      </SnButton>
      <span class="actions-demo__state">
        Cart {{ cartCount > 0 ? cartCount : 0 }} 
      </span>
    </div>

    <div class="actions-demo__row">
      <span class="actions-demo__label">Delete (with confirmation)</span>
      <template v-if="deleted">
        <SnButton :icon="Trash2" disabled>Deleted</SnButton>
        <SnButton text size="small" @click="restore">Undo</SnButton>
      </template>
      <template v-else-if="confirmingDelete">
        <SnButton type="error" @click="confirmDelete">Confirm deletion</SnButton>
        <SnButton text size="small" @click="confirmingDelete = false">Cancel</SnButton>
      </template>
      <SnButton v-else type="error" :icon="Trash2" @click="requestDelete">Delete</SnButton>
      <span class="actions-demo__state">
        {{ deleted ? 'done' : deleting ? 'loading' : confirmingDelete ? 'confirm' : 'idle' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.actions-demo {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.actions-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--sn-web-color-border-subtle, var(--sn-web-color-border-default));
}

.actions-demo__row:last-child {
  border-bottom: none;
}

.actions-demo__label {
  flex: 0 0 120px;
  font-size: 13px;
  font-weight: 500;
  color: var(--sn-web-color-text-primary);
}

.actions-demo__state {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}

@media (max-width: 640px) {
  .actions-demo__label {
    flex-basis: 100%;
  }
}
</style>