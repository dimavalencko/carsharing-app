<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppLayout from '@/app/layouts/AppLayout.vue';
import { useCarStore } from '@/entities/car/model/car.store';
import { useBookingStore } from '@/entities/booking/model/booking.store';
import { useAuthStore } from '@/entities/auth/model/auth.store';
import { useProfileStore } from '@/entities/profile/model/profile.store';

const route = useRoute();
const router = useRouter();
const carStore = useCarStore();
const bookingStore = useBookingStore();
const auth = useAuthStore();
const profileStore = useProfileStore();

const slug = String(route.params.slug ?? '');

const today = new Date().toISOString().slice(0, 10);
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

const startDate = ref(today);
const endDate = ref(tomorrow);
const bookingSuccess = ref(false);
const bookingError = ref('');

const car = computed(() => carStore.currentCar);

const durationDays = computed(() => {
  if (!startDate.value || !endDate.value) return 0;
  const ms = new Date(endDate.value).getTime() - new Date(startDate.value).getTime();
  return Math.max(1, Math.ceil(ms / 86400000));
});

const totalPrice = computed(() =>
  car.value ? car.value.pricePerDay * durationDays.value : 0
);

const hasLicense = computed(() => profileStore.license?.isExpired === false);

const canBook = computed(() =>
  car.value?.status === 'available' && auth.isAuthenticated && hasLicense.value
);

const categoryLabel: Record<string, string> = {
  economy: 'Эконом', comfort: 'Комфорт', business: 'Бизнес', premium: 'Премиум',
};

const statusLabel: Record<string, string> = {
  available: 'Доступен', rented: 'Арендован', reserved: 'Забронирован', maintenance: 'На обслуживании',
};

const statusClass: Record<string, string> = {
  available: 'badge--green', rented: 'badge--red', reserved: 'badge--yellow', maintenance: 'badge--gray',
};

async function book() {
  if (!car.value) return;
  bookingError.value = '';
  try {
    await bookingStore.create({
      carId: car.value.id,
      startDate: startDate.value,
      endDate: endDate.value,
    });
    bookingSuccess.value = true;
  } catch (e: any) {
    bookingError.value = e.response?.data?.message || 'Ошибка при бронировании';
  }
}

onMounted(async () => {
  await carStore.fetchBySlug(slug);
  if (auth.isAuthenticated && !profileStore.license && !profileStore.licenseLoading) {
    profileStore.fetchLicense();
  }
});
</script>

<template>
  <AppLayout>
    <div v-if="carStore.loading" class="state-msg">Загрузка...</div>
    <div v-else-if="carStore.error || !car" class="state-msg state-msg--error">
      {{ carStore.error || 'Автомобиль не найден' }}
    </div>
    <div v-else class="detail">
      <button class="back-btn" @click="router.back()">← Назад</button>
      <div class="detail__grid">
        <div class="detail__img">
          <img v-if="car.imageUrl" :src="car.imageUrl" :alt="`${car.brand} ${car.model}`" class="detail__photo" />
          <span v-else class="car-icon">🚗</span>
        </div>
        <div class="detail__info">
          <div class="detail__title-row">
            <h1>{{ car.brand }} {{ car.model }}</h1>
            <span class="badge" :class="statusClass[car.status]">{{ statusLabel[car.status] }}</span>
          </div>
          <dl class="detail__specs">
            <dt>Год выпуска</dt><dd>{{ car.year }}</dd>
            <dt>Категория</dt><dd>{{ categoryLabel[car.category] }}</dd>
            <dt>Цена в день</dt><dd class="price">{{ car.pricePerDay }} ₽</dd>
          </dl>
        </div>

        <div class="booking-form">
          <h2 class="booking-form__title">Забронировать</h2>
          <div v-if="bookingSuccess" class="booking-form__success">
            Бронирование создано!
            <RouterLink to="/bookings">Мои бронирования →</RouterLink>
          </div>
          <template v-else>
            <div v-if="bookingError" class="booking-form__error">{{ bookingError }}</div>
            <div v-if="!auth.isAuthenticated" class="booking-form__hint">
              <RouterLink to="/login">Войдите</RouterLink>, чтобы забронировать автомобиль
            </div>
            <template v-else-if="!hasLicense">
              <div class="booking-form__no-license">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/>
                  <circle cx="9" cy="16" r="2"/><path d="M13 16h4M13 14h2"/>
                </svg>
                <p>Для аренды автомобиля необходимо добавить <strong>водительское удостоверение</strong> в профиле</p>
                <RouterLink to="/profile" class="booking-form__license-link">Добавить права →</RouterLink>
              </div>
            </template>
            <template v-else>
              <div class="form-field">
                <label>Дата начала</label>
                <input v-model="startDate" type="date" :min="today" />
              </div>
              <div class="form-field">
                <label>Дата окончания</label>
                <input v-model="endDate" type="date" :min="startDate" />
              </div>
              <div class="booking-form__summary">
                {{ durationDays }} дн. × {{ car.pricePerDay }} ₽ =
                <strong>{{ totalPrice }} ₽</strong>
              </div>
              <button
                class="btn btn--primary"
                :disabled="!canBook || bookingStore.loading"
                @click="book"
              >
                {{ bookingStore.loading ? 'Бронирование...' : 'Забронировать' }}
              </button>
              <p v-if="car.status !== 'available'" class="booking-form__hint">
                Автомобиль недоступен для бронирования
              </p>
            </template>
          </template>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped lang="scss">
.state-msg {
  text-align: center;
  padding: 48px;
  color: #6b7280;
  &--error { color: #dc2626; }
}

.back-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 24px;
  &:hover { color: #111827; }
}

.detail {
  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr;
    gap: 24px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__img {
    background: linear-gradient(135deg, #dbeafe, #ede9fe);
    border-radius: 12px;
    height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  &__photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 12px;
  }

  &__info {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  &__title-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;

    h1 {
      font-size: 22px;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }
  }

  &__specs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 24px;
    margin: 0;

    dt { font-size: 13px; color: #6b7280; }
    dd { font-size: 15px; font-weight: 500; color: #111827; margin: 0; }
    .price { color: #2563eb; font-size: 18px; font-weight: 700; }
  }
}

.car-icon { font-size: 72px; }

.booking-form {
  grid-column: 1 / -1;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 400px;

  &__title {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }

  &__error {
    background: #fee2e2;
    color: #991b1b;
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 14px;
  }

  &__success {
    background: #dcfce7;
    color: #166534;
    padding: 14px;
    border-radius: 6px;
    font-size: 14px;

    a { color: #15803d; font-weight: 600; }
  }

  &__hint {
    font-size: 14px;
    color: #6b7280;
    margin: 0;

    a { color: #2563eb; }
  }

  &__no-license {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
    padding: 8px 0;

    svg { stroke: #f59e0b; }

    p {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
      line-height: 1.5;
      strong { color: #111827; }
    }
  }

  &__license-link {
    display: inline-block;
    padding: 8px 18px;
    background: #fffbeb;
    border: 1.5px solid #fde68a;
    border-radius: 8px;
    color: #b45309;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.15s;

    &:hover { background: #fef3c7; }
  }

  &__summary {
    font-size: 15px;
    color: #374151;

    strong { color: #2563eb; font-size: 18px; }
  }
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label { font-size: 14px; font-weight: 500; color: #374151; }

  input {
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    color: #111827;
    outline: none;
    &:focus { border-color: #2563eb; }
  }
}

.btn {
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;

  &--primary {
    background: #2563eb;
    color: #fff;
    &:hover:not(:disabled) { background: #1d4ed8; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }
}

.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;

  &--green { background: #dcfce7; color: #166534; }
  &--red { background: #fee2e2; color: #991b1b; }
  &--yellow { background: #fef9c3; color: #854d0e; }
  &--gray { background: #f3f4f6; color: #374151; }
}
</style>
