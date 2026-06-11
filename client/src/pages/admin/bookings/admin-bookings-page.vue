<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useBookingStore } from '@/entities/booking/model/booking.store';
import { useCarStore } from '@/entities/car/model/car.store';
import AppPagination from '@/shared/ui/AppPagination.vue';
import type { Booking, BookingStatus } from '@/shared/types';

const bookingStore = useBookingStore();
const carStore = useCarStore();

onMounted(async () => {
  await Promise.all([bookingStore.fetchAll(), carStore.fetchAll()]);
});

const filterStatus = ref<BookingStatus | ''>('');
const searchQuery = ref('');

const carById = computed(() => {
  const map: Record<string, string> = {};
  carStore.cars.forEach(c => { map[c.id] = `${c.brand} ${c.model}`; });
  return map;
});

const filteredBookings = computed(() => {
  return [...bookingStore.allBookings]
    .filter(b => {
      const matchesSt = !filterStatus.value || b.status === filterStatus.value;
      const q = searchQuery.value.toLowerCase();
      const carName = (carById.value[b.carId] || '').toLowerCase();
      const matchesQ = !q || carName.includes(q) || b.id.toLowerCase().includes(q);
      return matchesSt && matchesQ;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});

const currentPage = ref(1);
const pageSize = ref(20);
const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredBookings.value.slice(start, start + pageSize.value);
});
watch(filteredBookings, () => { currentPage.value = 1; });

const actionLoading = ref<string | null>(null);

async function doAction(id: string, action: 'confirm' | 'start' | 'complete' | 'cancel') {
  actionLoading.value = id;
  try {
    await bookingStore[action](id);
  } finally {
    actionLoading.value = null;
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatMoney(n: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n);
}

const statusLabels: Record<BookingStatus, string> = {
  pending: 'Ожидает', confirmed: 'Подтверждено', active: 'Активно',
  completed: 'Завершено', cancelled: 'Отменено',
};
const statusClass: Record<BookingStatus, string> = {
  pending: 'badge--yellow', confirmed: 'badge--blue', active: 'badge--green',
  completed: 'badge--gray', cancelled: 'badge--red',
};

function availableActions(b: Booking): { label: string; action: 'confirm' | 'start' | 'complete' | 'cancel'; color: string }[] {
  const actions = [];
  if (b.status === 'pending') {
    actions.push({ label: 'Подтвердить', action: 'confirm' as const, color: 'btn-action--confirm' });
    actions.push({ label: 'Отменить', action: 'cancel' as const, color: 'btn-action--cancel' });
  }
  if (b.status === 'confirmed') {
    actions.push({ label: 'Начать аренду', action: 'start' as const, color: 'btn-action--start' });
    actions.push({ label: 'Отменить', action: 'cancel' as const, color: 'btn-action--cancel' });
  }
  if (b.status === 'active') {
    actions.push({ label: 'Завершить', action: 'complete' as const, color: 'btn-action--complete' });
  }
  return actions;
}

const statusCounts = computed(() => ({
  all: bookingStore.allBookings.length,
  pending: bookingStore.allBookings.filter(b => b.status === 'pending').length,
  confirmed: bookingStore.allBookings.filter(b => b.status === 'confirmed').length,
  active: bookingStore.allBookings.filter(b => b.status === 'active').length,
  completed: bookingStore.allBookings.filter(b => b.status === 'completed').length,
  cancelled: bookingStore.allBookings.filter(b => b.status === 'cancelled').length,
}));
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Бронирования</h1>
        <p class="page-subtitle">Управление всеми бронированиями</p>
      </div>
    </div>

    <!-- Status tabs -->
    <div class="status-tabs">
      <button
        class="status-tab"
        :class="{ 'status-tab--active': filterStatus === '' }"
        @click="filterStatus = ''"
      >
        Все <span class="tab-count">{{ statusCounts.all }}</span>
      </button>
      <button
        class="status-tab"
        :class="{ 'status-tab--active': filterStatus === 'pending' }"
        @click="filterStatus = 'pending'"
      >
        Ожидают <span class="tab-count tab-count--yellow">{{ statusCounts.pending }}</span>
      </button>
      <button
        class="status-tab"
        :class="{ 'status-tab--active': filterStatus === 'confirmed' }"
        @click="filterStatus = 'confirmed'"
      >
        Подтверждены <span class="tab-count tab-count--blue">{{ statusCounts.confirmed }}</span>
      </button>
      <button
        class="status-tab"
        :class="{ 'status-tab--active': filterStatus === 'active' }"
        @click="filterStatus = 'active'"
      >
        Активные <span class="tab-count tab-count--green">{{ statusCounts.active }}</span>
      </button>
      <button
        class="status-tab"
        :class="{ 'status-tab--active': filterStatus === 'completed' }"
        @click="filterStatus = 'completed'"
      >
        Завершены <span class="tab-count">{{ statusCounts.completed }}</span>
      </button>
      <button
        class="status-tab"
        :class="{ 'status-tab--active': filterStatus === 'cancelled' }"
        @click="filterStatus = 'cancelled'"
      >
        Отменены <span class="tab-count">{{ statusCounts.cancelled }}</span>
      </button>
    </div>

    <!-- Search -->
    <div class="search-bar">
      <input
        v-model="searchQuery"
        class="filter-input"
        placeholder="Поиск по автомобилю или ID брони..."
      />
      <span class="filter-count">{{ filteredBookings.length }} записей</span>
    </div>

    <div class="table-card">
      <div v-if="bookingStore.loading" class="state-msg">Загрузка...</div>
      <div v-else-if="filteredBookings.length === 0" class="state-msg">Бронирования не найдены</div>
      <template v-else>
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Автомобиль</th>
              <th>Период</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th>Создано</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in paginatedBookings" :key="b.id">
            <td class="id-cell">{{ b.id.slice(0, 8) }}…</td>
            <td>{{ carById[b.carId] || '—' }}</td>
            <td class="date-cell">
              <span>{{ formatDate(b.startDate) }}</span>
              <span class="date-sep">—</span>
              <span>{{ formatDate(b.endDate) }}</span>
            </td>
            <td class="price-cell">{{ formatMoney(b.totalPrice) }}</td>
            <td>
              <span class="badge" :class="statusClass[b.status]">{{ statusLabels[b.status] }}</span>
            </td>
            <td class="secondary-cell">{{ formatDate(b.createdAt) }}</td>
            <td>
              <div class="actions">
                <button
                  v-for="a in availableActions(b)"
                  :key="a.action"
                  class="btn-action"
                  :class="a.color"
                  :disabled="actionLoading === b.id"
                  @click="doAction(b.id, a.action)"
                >
                  {{ actionLoading === b.id ? '...' : a.label }}
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
        <AppPagination
          :total="filteredBookings.length"
          :current-page="currentPage"
          :page-size="pageSize"
          @update:current-page="currentPage = $event"
          @update:page-size="pageSize = $event; currentPage = 1"
        />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page { display: flex; flex-direction: column; gap: 20px; }

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px;
}

.page-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.status-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.status-tab {
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;

  &:hover { border-color: #3b82f6; color: #1d4ed8; }

  &--active {
    background: #1d4ed8;
    border-color: #1d4ed8;
    color: #fff;

    .tab-count { background: rgba(255,255,255,0.25); color: #fff; }
  }
}

.tab-count {
  background: #f1f5f9;
  color: #475569;
  border-radius: 100px;
  padding: 1px 7px;
  font-size: 12px;
  font-weight: 600;

  &--yellow { background: #fef9c3; color: #854d0e; }
  &--blue { background: #dbeafe; color: #1d4ed8; }
  &--green { background: #dcfce7; color: #166534; }
}

.search-bar {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  outline: none;

  &:focus { border-color: #3b82f6; }
}

.filter-count {
  font-size: 13px;
  color: #94a3b8;
  white-space: nowrap;
}

.table-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;

  th {
    padding: 11px 14px;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  td {
    padding: 12px 14px;
    font-size: 14px;
    color: #1e293b;
    border-bottom: 1px solid #f1f5f9;
  }

  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #f8fafc; }
}

.id-cell {
  font-family: monospace;
  font-size: 12px;
  color: #94a3b8;
}

.date-cell {
  font-size: 13px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
}

.date-sep { color: #94a3b8; }

.price-cell {
  font-weight: 600;
  color: #1d4ed8;
}

.secondary-cell {
  font-size: 13px;
  color: #94a3b8;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;

  &--yellow { background: #fef9c3; color: #854d0e; }
  &--blue { background: #dbeafe; color: #1d4ed8; }
  &--green { background: #dcfce7; color: #166534; }
  &--gray { background: #f1f5f9; color: #475569; }
  &--red { background: #fee2e2; color: #991b1b; }
}

.actions { display: flex; gap: 6px; flex-wrap: wrap; }

.btn-action {
  padding: 5px 10px;
  border-radius: 6px;
  border: none;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
  white-space: nowrap;

  &:disabled { opacity: 0.5; cursor: not-allowed; }

  &--confirm { background: #dbeafe; color: #1d4ed8; &:hover:not(:disabled) { background: #bfdbfe; } }
  &--start   { background: #dcfce7; color: #166534; &:hover:not(:disabled) { background: #bbf7d0; } }
  &--complete { background: #f1f5f9; color: #475569; &:hover:not(:disabled) { background: #e2e8f0; } }
  &--cancel  { background: #fee2e2; color: #991b1b; &:hover:not(:disabled) { background: #fecaca; } }
}

.state-msg {
  padding: 40px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
}
</style>
