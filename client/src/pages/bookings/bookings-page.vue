<script setup lang="ts">
import { onMounted } from 'vue';
import AppLayout from '@/app/layouts/AppLayout.vue';
import { useBookingStore } from '@/entities/booking/model/booking.store';
import type { Booking } from '@/shared/types';

const store = useBookingStore();

const statusLabel: Record<string, string> = {
  pending: 'Ожидает', confirmed: 'Подтверждено', active: 'Активно',
  completed: 'Завершено', cancelled: 'Отменено',
};

const statusClass: Record<string, string> = {
  pending: 'badge--yellow', confirmed: 'badge--blue', active: 'badge--green',
  completed: 'badge--gray', cancelled: 'badge--red',
};

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function canCancel(booking: Booking) {
  return booking.status === 'pending' || booking.status === 'confirmed';
}

async function cancel(id: string) {
  if (!confirm('Отменить бронирование?')) return;
  await store.cancel(id);
}

onMounted(() => store.fetchMy());
</script>

<template>
  <AppLayout>
    <div class="bookings-page">
      <h1 class="bookings-page__title">Мои бронирования</h1>

      <div v-if="store.loading" class="state-msg">Загрузка...</div>
      <div v-else-if="store.error" class="state-msg state-msg--error">{{ store.error }}</div>
      <div v-else-if="store.bookings.length === 0" class="empty-state">
        <p>У вас ещё нет бронирований</p>
        <RouterLink class="btn btn--primary" to="/cars">Выбрать автомобиль</RouterLink>
      </div>
      <div v-else class="bookings-list">
        <div v-for="booking in store.bookings" :key="booking.id" class="booking-card">
          <div class="booking-card__header">
            <div class="booking-card__car">
              <span class="car-icon">🚗</span>
              <span class="booking-card__car-id">{{ booking.carId }}</span>
            </div>
            <span class="badge" :class="statusClass[booking.status]">{{ statusLabel[booking.status] }}</span>
          </div>
          <div class="booking-card__dates">
            <div>
              <span class="booking-card__label">Начало</span>
              <span>{{ formatDate(booking.startDate) }}</span>
            </div>
            <div class="booking-card__arrow">→</div>
            <div>
              <span class="booking-card__label">Конец</span>
              <span>{{ formatDate(booking.endDate) }}</span>
            </div>
          </div>
          <div class="booking-card__footer">
            <span class="booking-card__price">{{ booking.totalPrice }} ₽</span>
            <button
              v-if="canCancel(booking)"
              class="btn btn--danger"
              @click="cancel(booking.id)"
            >
              Отменить
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped lang="scss">
.bookings-page {
  &__title {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 24px;
  }
}

.state-msg {
  text-align: center;
  padding: 48px;
  color: #6b7280;
  &--error { color: #dc2626; }
}

.empty-state {
  text-align: center;
  padding: 48px;
  color: #6b7280;

  p { margin: 0 0 16px; font-size: 16px; }
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.booking-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  &__car {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__car-id {
    font-size: 13px;
    color: #6b7280;
    font-family: monospace;
  }

  &__dates {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    font-size: 15px;
    color: #374151;

    > div {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
  }

  &__label {
    font-size: 12px;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__arrow {
    color: #d1d5db;
    font-size: 18px;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #f3f4f6;
    padding-top: 14px;
  }

  &__price {
    font-size: 18px;
    font-weight: 700;
    color: #2563eb;
  }
}

.car-icon { font-size: 28px; }

.btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  text-decoration: none;

  &--primary {
    background: #2563eb;
    color: #fff;
    &:hover { background: #1d4ed8; }
  }

  &--danger {
    background: #fee2e2;
    color: #991b1b;
    &:hover { background: #fecaca; }
  }
}

.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;

  &--green { background: #dcfce7; color: #166534; }
  &--blue { background: #dbeafe; color: #1e40af; }
  &--yellow { background: #fef9c3; color: #854d0e; }
  &--red { background: #fee2e2; color: #991b1b; }
  &--gray { background: #f3f4f6; color: #374151; }
}
</style>
