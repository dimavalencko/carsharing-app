<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useCarStore } from '@/entities/car/model/car.store';
import { useBookingStore } from '@/entities/booking/model/booking.store';
import { useAdminStore } from '@/entities/admin/model/admin.store';

const carStore = useCarStore();
const bookingStore = useBookingStore();
const adminStore = useAdminStore();

onMounted(() => {
  carStore.fetchAll();
  bookingStore.fetchAll();
  adminStore.fetchUsers();
});

const carsTotal = computed(() => carStore.cars.length);
const carsAvailable = computed(() => carStore.cars.filter(c => c.status === 'available').length);
const carsRented = computed(() => carStore.cars.filter(c => c.status === 'rented').length);
const carsMaintenance = computed(() => carStore.cars.filter(c => c.status === 'maintenance').length);
const carsReserved = computed(() => carStore.cars.filter(c => c.status === 'reserved').length);

const bookingsTotal = computed(() => bookingStore.allBookings.length);
const bookingsPending = computed(() => bookingStore.allBookings.filter(b => b.status === 'pending').length);
const bookingsActive = computed(() => bookingStore.allBookings.filter(b => b.status === 'active').length);
const bookingsCompleted = computed(() => bookingStore.allBookings.filter(b => b.status === 'completed').length);

const revenue = computed(() =>
  bookingStore.allBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
);

const usersTotal = computed(() => adminStore.users.length);

const recentBookings = computed(() =>
  [...bookingStore.allBookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)
);

const carById = computed(() => {
  const map: Record<string, string> = {};
  carStore.cars.forEach(c => { map[c.id] = `${c.brand} ${c.model}`; });
  return map;
});

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatMoney(n: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n);
}

const statusLabels: Record<string, string> = {
  pending: 'Ожидает', confirmed: 'Подтверждено', active: 'Активно',
  completed: 'Завершено', cancelled: 'Отменено',
};
const statusClass: Record<string, string> = {
  pending: 'badge--yellow', confirmed: 'badge--blue', active: 'badge--green',
  completed: 'badge--gray', cancelled: 'badge--red',
};
</script>

<template>
  <div class="dashboard">
    <div class="page-header">
      <h1 class="page-title">Дашборд</h1>
      <p class="page-subtitle">Общая статистика системы</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card stat-card--blue">
        <div class="stat-card__icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
            <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        </div>
        <div class="stat-card__body">
          <div class="stat-card__value">{{ carsTotal }}</div>
          <div class="stat-card__label">Всего автомобилей</div>
        </div>
      </div>

      <div class="stat-card stat-card--green">
        <div class="stat-card__icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div class="stat-card__body">
          <div class="stat-card__value">{{ carsAvailable }}</div>
          <div class="stat-card__label">Доступно сейчас</div>
        </div>
      </div>

      <div class="stat-card stat-card--purple">
        <div class="stat-card__icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <div class="stat-card__body">
          <div class="stat-card__value">{{ bookingsTotal }}</div>
          <div class="stat-card__label">Всего бронирований</div>
        </div>
      </div>

      <div class="stat-card stat-card--orange">
        <div class="stat-card__icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="stat-card__body">
          <div class="stat-card__value">{{ usersTotal }}</div>
          <div class="stat-card__label">Пользователей</div>
        </div>
      </div>
    </div>

    <div class="dashboard-row">
      <div class="info-card">
        <div class="info-card__header">
          <h2 class="info-card__title">Состояние автопарка</h2>
        </div>
        <div class="fleet-stats">
          <div class="fleet-item">
            <div class="fleet-item__bar">
              <div
                class="fleet-item__fill fleet-item__fill--available"
                :style="{ width: carsTotal ? (carsAvailable / carsTotal * 100) + '%' : '0%' }"
              />
            </div>
            <div class="fleet-item__info">
              <span class="fleet-item__label">Доступны</span>
              <span class="fleet-item__count fleet-item__count--available">{{ carsAvailable }}</span>
            </div>
          </div>
          <div class="fleet-item">
            <div class="fleet-item__bar">
              <div
                class="fleet-item__fill fleet-item__fill--rented"
                :style="{ width: carsTotal ? (carsRented / carsTotal * 100) + '%' : '0%' }"
              />
            </div>
            <div class="fleet-item__info">
              <span class="fleet-item__label">В аренде</span>
              <span class="fleet-item__count fleet-item__count--rented">{{ carsRented }}</span>
            </div>
          </div>
          <div class="fleet-item">
            <div class="fleet-item__bar">
              <div
                class="fleet-item__fill fleet-item__fill--reserved"
                :style="{ width: carsTotal ? (carsReserved / carsTotal * 100) + '%' : '0%' }"
              />
            </div>
            <div class="fleet-item__info">
              <span class="fleet-item__label">Зарезервированы</span>
              <span class="fleet-item__count fleet-item__count--reserved">{{ carsReserved }}</span>
            </div>
          </div>
          <div class="fleet-item">
            <div class="fleet-item__bar">
              <div
                class="fleet-item__fill fleet-item__fill--maintenance"
                :style="{ width: carsTotal ? (carsMaintenance / carsTotal * 100) + '%' : '0%' }"
              />
            </div>
            <div class="fleet-item__info">
              <span class="fleet-item__label">Обслуживание</span>
              <span class="fleet-item__count fleet-item__count--maintenance">{{ carsMaintenance }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="info-card">
        <div class="info-card__header">
          <h2 class="info-card__title">Бронирования</h2>
        </div>
        <div class="booking-stats">
          <div class="bstat">
            <span class="bstat__dot bstat__dot--yellow"></span>
            <span class="bstat__label">Ожидают подтверждения</span>
            <span class="bstat__val">{{ bookingsPending }}</span>
          </div>
          <div class="bstat">
            <span class="bstat__dot bstat__dot--green"></span>
            <span class="bstat__label">Активные аренды</span>
            <span class="bstat__val">{{ bookingsActive }}</span>
          </div>
          <div class="bstat">
            <span class="bstat__dot bstat__dot--gray"></span>
            <span class="bstat__label">Завершённые</span>
            <span class="bstat__val">{{ bookingsCompleted }}</span>
          </div>
          <div class="bstat bstat--revenue">
            <span class="bstat__label">Выручка (завершённые)</span>
            <span class="bstat__val bstat__val--big">{{ formatMoney(revenue) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="info-card info-card--full">
      <div class="info-card__header">
        <h2 class="info-card__title">Последние бронирования</h2>
        <RouterLink to="/admin/bookings" class="info-card__link">Все бронирования →</RouterLink>
      </div>

      <div v-if="bookingStore.loading" class="loading-text">Загрузка...</div>

      <div v-else-if="recentBookings.length === 0" class="empty-text">Бронирований пока нет</div>

      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Автомобиль</th>
            <th>Начало</th>
            <th>Конец</th>
            <th>Сумма</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in recentBookings" :key="b.id">
            <td>{{ carById[b.carId] || b.carId.slice(0, 8) + '…' }}</td>
            <td>{{ formatDate(b.startDate) }}</td>
            <td>{{ formatDate(b.endDate) }}</td>
            <td>{{ formatMoney(b.totalPrice) }}</td>
            <td>
              <span class="badge" :class="statusClass[b.status]">{{ statusLabels[b.status] }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  margin-bottom: 4px;
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
  border: 1px solid #e2e8f0;

  &__icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__value {
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
    color: #0f172a;
  }

  &__label {
    font-size: 13px;
    color: #64748b;
    margin-top: 4px;
  }

  &--blue .stat-card__icon { background: #dbeafe; color: #1d4ed8; }
  &--green .stat-card__icon { background: #dcfce7; color: #16a34a; }
  &--purple .stat-card__icon { background: #ede9fe; color: #7c3aed; }
  &--orange .stat-card__icon { background: #ffedd5; color: #ea580c; }
}

.dashboard-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
  overflow: hidden;

  &--full { grid-column: 1 / -1; }

  &__header {
    padding: 18px 20px 14px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-size: 15px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  &__link {
    font-size: 13px;
    color: #2563eb;
    text-decoration: none;

    &:hover { text-decoration: underline; }
  }
}

.fleet-stats {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.fleet-item {
  &__bar {
    height: 6px;
    background: #f1f5f9;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 6px;
  }

  &__fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.6s ease;

    &--available { background: #22c55e; }
    &--rented { background: #3b82f6; }
    &--reserved { background: #f59e0b; }
    &--maintenance { background: #ef4444; }
  }

  &__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__label {
    font-size: 13px;
    color: #64748b;
  }

  &__count {
    font-size: 14px;
    font-weight: 600;

    &--available { color: #16a34a; }
    &--rented { color: #2563eb; }
    &--reserved { color: #d97706; }
    &--maintenance { color: #dc2626; }
  }
}

.booking-stats {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bstat {
  display: flex;
  align-items: center;
  gap: 10px;

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;

    &--yellow { background: #f59e0b; }
    &--green { background: #22c55e; }
    &--gray { background: #94a3b8; }
  }

  &__label {
    flex: 1;
    font-size: 13px;
    color: #64748b;
  }

  &__val {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;

    &--big {
      font-size: 16px;
      color: #16a34a;
    }
  }

  &--revenue {
    margin-top: 8px;
    padding-top: 12px;
    border-top: 1px solid #f1f5f9;
  }
}

.data-table {
  width: 100%;
  border-collapse: collapse;

  th {
    padding: 10px 16px;
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
    padding: 12px 16px;
    font-size: 14px;
    color: #1e293b;
    border-bottom: 1px solid #f1f5f9;

    &:last-child { border-bottom: none; }
  }

  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #f8fafc; }
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

.loading-text, .empty-text {
  padding: 24px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
}
</style>
