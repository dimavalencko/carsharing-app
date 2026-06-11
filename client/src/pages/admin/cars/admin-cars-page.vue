<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCarStore } from '@/entities/car/model/car.store';
import type { Car, CarCategory, CarStatus, CreateCarDto, UpdateCarDto } from '@/shared/types';

const store = useCarStore();

onMounted(() => store.fetchAll());

const searchQuery = ref('');
const filterCategory = ref<CarCategory | ''>('');
const filterStatus = ref<CarStatus | ''>('');

const filteredCars = computed(() => {
  return store.cars.filter(c => {
    const q = searchQuery.value.toLowerCase();
    const matchesSearch = !q || `${c.brand} ${c.model} ${c.licensePlate}`.toLowerCase().includes(q);
    const matchesCat = !filterCategory.value || c.category === filterCategory.value;
    const matchesSt = !filterStatus.value || c.status === filterStatus.value;
    return matchesSearch && matchesCat && matchesSt;
  });
});

const showModal = ref(false);
const editingCar = ref<Car | null>(null);
const modalError = ref('');
const modalLoading = ref(false);

const form = ref<CreateCarDto & { status?: CarStatus }>({
  brand: '', model: '', year: new Date().getFullYear(),
  category: 'economy', pricePerDay: 0, licensePlate: '', city: '',
  color: '', vin: '', mileage: undefined, imageUrl: '', description: '',
});

function openCreate() {
  editingCar.value = null;
  form.value = {
    brand: '', model: '', year: new Date().getFullYear(),
    category: 'economy', pricePerDay: 0, licensePlate: '', city: '',
    color: '', vin: '', mileage: undefined, imageUrl: '', description: '',
  };
  modalError.value = '';
  showModal.value = true;
}

function openEdit(car: Car) {
  editingCar.value = car;
  form.value = {
    brand: car.brand, model: car.model, year: car.year,
    category: car.category, status: car.status, pricePerDay: car.pricePerDay,
    licensePlate: car.licensePlate, city: car.city,
    color: car.color ?? '', vin: car.vin ?? '',
    mileage: car.mileage, imageUrl: car.imageUrl ?? '', description: car.description ?? '',
  };
  modalError.value = '';
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingCar.value = null;
}

async function submitForm() {
  if (!form.value.brand || !form.value.model || !form.value.licensePlate || !form.value.city) {
    modalError.value = 'Заполните все обязательные поля';
    return;
  }
  modalLoading.value = true;
  modalError.value = '';
  try {
    if (editingCar.value) {
      const dto: UpdateCarDto = { ...form.value };
      await store.updateCar(editingCar.value.id, dto);
    } else {
      const { status: _s, ...dto } = form.value;
      await store.createCar(dto as CreateCarDto);
    }
    closeModal();
  } catch (e: any) {
    modalError.value = e.response?.data?.message || 'Ошибка сохранения';
  } finally {
    modalLoading.value = false;
  }
}

async function changeStatus(car: Car, status: CarStatus) {
  try {
    await store.updateCarStatus(car.id, status);
  } catch {
  }
}

const deleteConfirmId = ref<string | null>(null);

async function confirmDelete() {
  if (!deleteConfirmId.value) return;
  try {
    await store.deleteCar(deleteConfirmId.value);
  } finally {
    deleteConfirmId.value = null;
  }
}

const categoryLabels: Record<CarCategory, string> = {
  economy: 'Эконом', comfort: 'Комфорт', business: 'Бизнес', premium: 'Премиум',
};

const statusClass: Record<CarStatus, string> = {
  available: 'badge--green', rented: 'badge--blue',
  reserved: 'badge--yellow', maintenance: 'badge--red',
};

const categoryClass: Record<CarCategory, string> = {
  economy: 'cat--economy', comfort: 'cat--comfort',
  business: 'cat--business', premium: 'cat--premium',
};

function formatMoney(n: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n);
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Автомобили</h1>
        <p class="page-subtitle">Управление автопарком</p>
      </div>
      <button class="btn-primary" @click="openCreate">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Добавить автомобиль
      </button>
    </div>

    <!-- Фильтры -->
    <div class="filters">
      <input
        v-model="searchQuery"
        class="filter-input"
        placeholder="Поиск по марке, модели, номеру..."
      />
      <select v-model="filterCategory" class="filter-select">
        <option value="">Все категории</option>
        <option value="economy">Эконом</option>
        <option value="comfort">Комфорт</option>
        <option value="business">Бизнес</option>
        <option value="premium">Премиум</option>
      </select>
      <select v-model="filterStatus" class="filter-select">
        <option value="">Все статусы</option>
        <option value="available">Доступен</option>
        <option value="rented">В аренде</option>
        <option value="reserved">Зарезервирован</option>
        <option value="maintenance">Обслуживание</option>
      </select>
      <span class="filter-count">{{ filteredCars.length }} из {{ store.cars.length }}</span>
    </div>

    <!-- Таблица -->
    <div class="table-card">
      <div v-if="store.loading" class="state-msg">Загрузка...</div>
      <div v-else-if="filteredCars.length === 0" class="state-msg">Автомобили не найдены</div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Автомобиль</th>
            <th>Категория</th>
            <th>Год</th>
            <th>Город</th>
            <th>Цена/сутки</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="car in filteredCars" :key="car.id">
            <td>
              <div class="car-cell">
                <strong>{{ car.brand }} {{ car.model }}</strong>
                <span class="car-plate">{{ car.licensePlate }}</span>
              </div>
            </td>
            <td><span class="cat-badge" :class="categoryClass[car.category]">{{ categoryLabels[car.category] }}</span></td>
            <td>{{ car.year }}</td>
            <td>{{ car.city }}</td>
            <td class="price-cell">{{ formatMoney(car.pricePerDay) }}</td>
            <td>
              <select
                class="status-select"
                :class="statusClass[car.status]"
                :value="car.status"
                @change="changeStatus(car, ($event.target as HTMLSelectElement).value as CarStatus)"
              >
                <option value="available">Доступен</option>
                <option value="rented">В аренде</option>
                <option value="reserved">Зарезервирован</option>
                <option value="maintenance">Обслуживание</option>
              </select>
            </td>
            <td>
              <div class="actions">
                <button class="action-btn action-btn--edit" @click="openEdit(car)" title="Редактировать">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button class="action-btn action-btn--delete" @click="deleteConfirmId = car.id" title="Удалить">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6"/><path d="M14 11v6"/>
                    <path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal__header">
            <h2 class="modal__title">{{ editingCar ? 'Редактировать автомобиль' : 'Добавить автомобиль' }}</h2>
            <button class="modal__close" @click="closeModal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="modal__body">
            <div v-if="modalError" class="form-error">{{ modalError }}</div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Марка *</label>
                <input v-model="form.brand" class="form-input" placeholder="Toyota" />
              </div>
              <div class="form-group">
                <label class="form-label">Модель *</label>
                <input v-model="form.model" class="form-input" placeholder="Camry" />
              </div>
              <div class="form-group">
                <label class="form-label">Год *</label>
                <input v-model.number="form.year" type="number" class="form-input" min="1990" :max="new Date().getFullYear() + 1" />
              </div>
              <div class="form-group">
                <label class="form-label">Цена/сутки (₽) *</label>
                <input v-model.number="form.pricePerDay" type="number" class="form-input" min="0" />
              </div>
              <div class="form-group">
                <label class="form-label">Категория *</label>
                <select v-model="form.category" class="form-input">
                  <option value="economy">Эконом</option>
                  <option value="comfort">Комфорт</option>
                  <option value="business">Бизнес</option>
                  <option value="premium">Премиум</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Гос. номер *</label>
                <input v-model="form.licensePlate" class="form-input" placeholder="А123БВ 77" />
              </div>
              <div class="form-group">
                <label class="form-label">Город *</label>
                <input v-model="form.city" class="form-input" placeholder="Москва" />
              </div>
              <div class="form-group">
                <label class="form-label">Цвет</label>
                <input v-model="form.color" class="form-input" placeholder="Белый" />
              </div>
              <div class="form-group">
                <label class="form-label">VIN</label>
                <input v-model="form.vin" class="form-input" placeholder="WBAHN83568D..." />
              </div>
              <div class="form-group">
                <label class="form-label">Пробег (км)</label>
                <input v-model.number="form.mileage" type="number" class="form-input" min="0" />
              </div>
              <div v-if="editingCar" class="form-group">
                <label class="form-label">Статус</label>
                <select v-model="form.status" class="form-input">
                  <option value="available">Доступен</option>
                  <option value="rented">В аренде</option>
                  <option value="reserved">Зарезервирован</option>
                  <option value="maintenance">Обслуживание</option>
                </select>
              </div>
              <div class="form-group form-group--full">
                <label class="form-label">URL изображения</label>
                <input v-model="form.imageUrl" class="form-input" placeholder="https://..." />
              </div>
              <div class="form-group form-group--full">
                <label class="form-label">Описание</label>
                <textarea v-model="form.description" class="form-textarea" rows="3" placeholder="Краткое описание автомобиля..." />
              </div>
            </div>
          </div>

          <div class="modal__footer">
            <button class="btn-secondary" @click="closeModal">Отмена</button>
            <button class="btn-primary" :disabled="modalLoading" @click="submitForm">
              {{ modalLoading ? 'Сохранение...' : (editingCar ? 'Сохранить' : 'Добавить') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="deleteConfirmId" class="modal-overlay" @click.self="deleteConfirmId = null">
        <div class="modal modal--sm">
          <div class="modal__header">
            <h2 class="modal__title">Удалить автомобиль?</h2>
          </div>
          <div class="modal__body">
            <p class="confirm-text">Это действие необратимо. Автомобиль будет удалён из системы.</p>
          </div>
          <div class="modal__footer">
            <button class="btn-secondary" @click="deleteConfirmId = null">Отмена</button>
            <button class="btn-danger" @click="confirmDelete">Удалить</button>
          </div>
        </div>
      </div>
    </Teleport>
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

.filters {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-input {
  flex: 1;
  min-width: 200px;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  outline: none;
  transition: border-color 0.15s;

  &:focus { border-color: #3b82f6; }
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  outline: none;
  cursor: pointer;

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
    padding: 11px 16px;
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
  }

  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #f8fafc; }
}

.car-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;

  strong { font-weight: 600; }
}

.car-plate {
  font-size: 12px;
  color: #94a3b8;
  font-family: monospace;
}

.price-cell {
  font-weight: 600;
  color: #1d4ed8;
}

.badge, .cat-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;

  &--green { background: #dcfce7; color: #166534; }
  &--blue { background: #dbeafe; color: #1d4ed8; }
  &--yellow { background: #fef9c3; color: #854d0e; }
  &--red { background: #fee2e2; color: #991b1b; }
  &--gray { background: #f1f5f9; color: #475569; }
}

.cat-badge {
  &.cat--economy { background: #f0fdf4; color: #166534; }
  &.cat--comfort { background: #eff6ff; color: #1d4ed8; }
  &.cat--business { background: #fdf4ff; color: #7e22ce; }
  &.cat--premium { background: #fffbeb; color: #92400e; }
}

.status-select {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid transparent;
  cursor: pointer;
  outline: none;

  &.badge--green { background: #dcfce7; color: #166534; }
  &.badge--blue { background: #dbeafe; color: #1d4ed8; }
  &.badge--yellow { background: #fef9c3; color: #854d0e; }
  &.badge--red { background: #fee2e2; color: #991b1b; }
}

.actions {
  display: flex;
  gap: 6px;
}

.action-btn {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;

  &--edit {
    background: #eff6ff;
    color: #2563eb;
    &:hover { background: #dbeafe; }
  }

  &--delete {
    background: #fff1f2;
    color: #e11d48;
    &:hover { background: #ffe4e6; }
  }
}

.state-msg {
  padding: 40px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  background: #1d4ed8;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: #1e40af; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}

.btn-secondary {
  padding: 9px 18px;
  background: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: #f9fafb; }
}

.btn-danger {
  padding: 9px 18px;
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: #b91c1c; }
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal {
  background: #fff;
  border-radius: 14px;
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);

  &--sm { max-width: 420px; }

  &__header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-size: 17px;
    font-weight: 600;
    color: #0f172a;
    margin: 0;
  }

  &__close {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;

    &:hover { color: #475569; background: #f1f5f9; }
  }

  &__body {
    padding: 20px 24px;
    overflow-y: auto;
    flex: 1;
  }

  &__footer {
    padding: 16px 24px;
    border-top: 1px solid #f1f5f9;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}

.form-error {
  background: #fee2e2;
  color: #991b1b;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 16px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;

  &--full { grid-column: 1 / -1; }
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.form-input, .form-textarea {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
  background: #fff;

  &:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.confirm-text {
  font-size: 14px;
  color: #475569;
  margin: 0;
  line-height: 1.5;
}
</style>
