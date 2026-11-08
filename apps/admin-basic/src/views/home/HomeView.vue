<script setup lang="ts">
/**
 * Dashboard home: greeting, four statistic cards and a recent-activity
 * table. Data comes from the alova layer against the mock service; the
 * 401 path (revoked session) is handled globally by the request layer.
 */
import { computed, h, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DataTableColumns, DataTableRowData } from '@snui/vue-web';
import { dashboardApi } from '@/api/dashboard';
import type { ActivityItem, ActivityStatus, DashboardStats } from '@/api/types';
import { describeError } from '@/request/http';
import { useAuthStore } from '@/stores/auth';

const { t } = useI18n();
const authStore = useAuthStore();

const stats = ref<DashboardStats | null>(null);
const activities = ref<ActivityItem[]>([]);
const loading = ref(true);
const errorMessage = ref('');

const greeting = computed(() => t('home.greeting', { name: authStore.user?.nickname ?? '' }));

const STAT_CARDS = ['totalUsers', 'todayOrders', 'revenue', 'growth'] as const;
type StatCardKey = (typeof STAT_CARDS)[number];

const columns = computed<DataTableColumns>(() => [
  { title: t('home.activities.columns.user'), key: 'user' },
  { title: t('home.activities.columns.action'), key: 'action' },
  { title: t('home.activities.columns.target'), key: 'target' },
  { title: t('home.activities.columns.time'), key: 'time', width: 90 },
  {
    title: t('home.activities.columns.status'),
    key: 'status',
    width: 110,
    render: (row: DataTableRowData) => {
      const status = String(row['status'] ?? '');
      const label = t(`home.activities.status.${status}`);
      return h('span', { class: `home__status home__status--${status}` }, label);
    },
  },
]);

function statValue(card: StatCardKey): number | undefined {
  if (stats.value === null) return undefined;
  return stats.value[card];
}

onMounted(async () => {
  try {
    const [nextStats, nextActivities] = await Promise.all([
      dashboardApi.fetchStats(),
      dashboardApi.fetchActivities(),
    ]);
    stats.value = nextStats;
    activities.value = nextActivities;
  } catch (error) {
    errorMessage.value = describeError(error, t);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="home">
    <h1 class="home__greeting">{{ greeting }}</h1>

    <SnAlert v-if="errorMessage !== ''" type="error" :title="errorMessage" />

    <div class="home__stats">
      <SnCard v-for="card in STAT_CARDS" :key="card" class="home__stat-card">
        <SnStatistic :label="t(`home.stats.${card}`)" :value="statValue(card)">
          <template v-if="stats === null" #default>
            <SnSkeleton text width="96px" />
          </template>
        </SnStatistic>
      </SnCard>
    </div>

    <SnCard :title="t('home.activities.title')">
      <SnDataTable
        :columns="columns"
        :data="activities"
        :row-key="(row) => Number(row.id)"
        size="small"
        striped
        :loading="loading"
        :pagination="{ pageSize: 10 }"
      />
    </SnCard>
  </div>
</template>

<style scoped>
.home__greeting {
  margin: 0 0 var(--sn-web-spacing-6);
  font-size: var(--sn-web-font-size-xl);
  font-weight: var(--sn-web-font-weight-semibold);
}

.home__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--sn-web-spacing-4);
  margin-bottom: var(--sn-web-spacing-4);
}

.home__status {
  display: inline-block;
  padding: 2px 10px;
  border-radius: var(--sn-web-radius-full);
  font-size: var(--sn-web-font-size-sm);
  line-height: 1.6;
}

.home__status--success {
  background-color: var(--aui-color-feedback-success-soft);
  color: var(--sn-web-color-feedback-success);
}

.home__status--warning {
  background-color: var(--aui-color-feedback-warning-soft);
  color: var(--sn-web-color-feedback-warning);
}

.home__status--danger {
  background-color: var(--aui-color-feedback-danger-soft);
  color: var(--sn-web-color-feedback-danger);
}
</style>
