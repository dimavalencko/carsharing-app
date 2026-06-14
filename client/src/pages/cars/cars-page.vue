<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppLayout from '@/app/layouts/AppLayout.vue';
import { useCarStore } from '@/entities/car/model/car.store';
import type { CarCategory } from '@/shared/types';

const store = useCarStore();
const router = useRouter();

const categoryFilter = ref<CarCategory | ''>('');
const onlyAvailable = ref(false);

const categories: { value: CarCategory | ''; label: string }[] = [
  { value: '', label: 'Все категории' },
  { value: 'economy', label: 'Эконом' },
  { value: 'comfort', label: 'Комфорт' },
  { value: 'business', label: 'Бизнес' },
  { value: 'premium', label: 'Премиум' },
];

const filtered = computed(() => {
  let list = onlyAvailable.value
    ? store.cars.filter(c => c.status === 'available')
    : store.cars;
  if (categoryFilter.value) {
    list = list.filter(c => c.category === categoryFilter.value);
  }
  return list;
});

const categoryLabel: Record<string, string> = {
  economy: 'Эконом', comfort: 'Комфорт', business: 'Бизнес', premium: 'Премиум',
};

const statusLabel: Record<string, string> = {
  available: 'Доступен', rented: 'Арендован', reserved: 'Забронирован', maintenance: 'На обслуживании',
};

const statusClass: Record<string, string> = {
  available: 'badge--green', rented: 'badge--red', reserved: 'badge--yellow', maintenance: 'badge--gray',
};

onMounted(async () => {
  await store.fetchAll();
});
</script>

<template>
  <AppLayout>
    <div class="cars-page">
      <div class="cars-page__header">
        <h1>Автомобили</h1>
        <div class="cars-page__filters">
          <select v-model="categoryFilter" class="filter-select">
            <option v-for="cat in categories" :key="cat.value" :value="cat.value">
              {{ cat.label }}
            </option>
          </select>
          <label class="filter-checkbox">
            <input v-model="onlyAvailable" type="checkbox" />
            Только доступные
          </label>
        </div>
      </div>

      <div v-if="store.loading" class="state-msg">Загрузка...</div>
      <div v-else-if="store.error" class="state-msg state-msg--error">{{ store.error }}</div>
      <div v-else-if="filtered.length === 0" class="state-msg">Автомобили не найдены</div>
      <div v-else class="cars-grid">
        <article
          v-for="car in filtered"
          :key="car.id"
          class="car-card"
          @click="router.push({ name: 'car-detail', params: { slug: car.slug } })"
        >
          <div class="car-card__img">
            <img v-if="car.imageUrl" :src="car.imageUrl" :alt="`${car.brand} ${car.model}`" class="car-card__photo" />
            <span v-else class="car-icon">🚗</span>
          </div>
          <div class="car-card__body">
            <div class="car-card__top">
              <h3 class="car-card__name">{{ car.brand }} {{ car.model }}</h3>
              <span class="badge" :class="statusClass[car.status]">{{ statusLabel[car.status] }}</span>
            </div>
            <p class="car-card__meta">{{ car.year }} · {{ categoryLabel[car.category] }}</p>
            <p class="car-card__price">{{ car.pricePerDay }} ₽ / день</p>
          </div>
        </article>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped lang="scss">
.cars-page {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;

    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }
  }

  &__filters {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  background: #fff;
  cursor: pointer;

  &:focus { outline: none; border-color: #2563eb; }
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;

  input { cursor: pointer; }
}

.state-msg {
  text-align: center;
  padding: 48px;
  color: #6b7280;

  &--error { color: #dc2626; }
}

.cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.car-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: box-shadow 0.15s, transform 0.15s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    transform: translateY(-2px);
  }

  &__img {
    height: 260px;
    background: linear-gradient(135deg, #dbeafe, #ede9fe);
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
  }

  &__body {
    padding: 16px;
  }

  &__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 6px;
  }

  &__name {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }

  &__meta {
    font-size: 13px;
    color: #6b7280;
    margin: 0 0 8px;
  }

  &__price {
    font-size: 16px;
    font-weight: 700;
    color: #2563eb;
    margin: 0;
  }
}

.car-icon { font-size: 48px; }

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;

  &--green { background: #dcfce7; color: #166534; }
  &--red { background: #fee2e2; color: #991b1b; }
  &--yellow { background: #fef9c3; color: #854d0e; }
  &--gray { background: #f3f4f6; color: #374151; }
}
</style>
