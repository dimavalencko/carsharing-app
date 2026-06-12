<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import AppPagination from '@/shared/ui/AppPagination.vue';
import { useAdminStore } from '@/entities/admin/model/admin.store';
import type { CreateAdminUserDto, UserRole } from '@/shared/types';

const store = useAdminStore();

onMounted(() => store.fetchUsers());

const searchQuery = ref('');
const filterRole = ref<UserRole | ''>('');

const currentPage = ref(1);
const pageSize = ref(20);

const filteredUsers = computed(() =>
  store.users.filter(u => {
    const q = searchQuery.value.toLowerCase();
    const matchesQ = !q
      || u.login.toLowerCase().includes(q)
      || (u.firstName + ' ' + (u.lastName || '')).toLowerCase().includes(q)
      || (u.email || '').toLowerCase().includes(q);
    const matchesRole = !filterRole.value || u.role === filterRole.value;
    return matchesQ && matchesRole;
  })
);

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredUsers.value.slice(start, start + pageSize.value);
});
watch(filteredUsers, () => { currentPage.value = 1; });

// Create modal
const showModal = ref(false);
const modalError = ref('');
const modalLoading = ref(false);

const form = ref<CreateAdminUserDto & { confirmPassword: string }>({
  login: '', password: '', confirmPassword: '', firstName: '', lastName: '', role: 'User',
});

function openCreate() {
  form.value = { login: '', password: '', confirmPassword: '', firstName: '', lastName: '', role: 'User' };
  modalError.value = '';
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function submitCreate() {
  if (!form.value.login || !form.value.password || !form.value.firstName) {
    modalError.value = 'Логин, имя и пароль обязательны';
    return;
  }
  if (form.value.password !== form.value.confirmPassword) {
    modalError.value = 'Пароли не совпадают';
    return;
  }
  if (form.value.password.length < 8) {
    modalError.value = 'Пароль минимум 8 символов';
    return;
  }
  modalLoading.value = true;
  modalError.value = '';
  try {
    const { confirmPassword: _, ...dto } = form.value;
    await store.createUser(dto);
    closeModal();
  } catch (e: any) {
    modalError.value = e.response?.data?.message || 'Ошибка создания пользователя';
  } finally {
    modalLoading.value = false;
  }
}

// Delete
const deleteConfirmId = ref<string | null>(null);
const deleteConfirmLogin = ref('');

function openDelete(id: string, login: string) {
  deleteConfirmId.value = id;
  deleteConfirmLogin.value = login;
}

async function confirmDelete() {
  if (!deleteConfirmId.value) return;
  try {
    await store.deleteUser(deleteConfirmId.value);
  } finally {
    deleteConfirmId.value = null;
    deleteConfirmLogin.value = '';
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function initials(u: { firstName: string; lastName?: string }) {
  return ((u.firstName?.[0] || '') + (u.lastName?.[0] || '')).toUpperCase() || '?';
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Пользователи</h1>
        <p class="page-subtitle">Управление аккаунтами</p>
      </div>
      <button class="btn-primary" @click="openCreate">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Добавить пользователя
      </button>
    </div>

    <div class="filters">
      <input
        v-model="searchQuery"
        class="filter-input"
        placeholder="Поиск по логину или имени..."
      />
      <select v-model="filterRole" class="filter-select">
        <option value="">Все роли</option>
        <option value="User">Пользователи</option>
        <option value="Admin">Администраторы</option>
      </select>
      <span class="filter-count">{{ filteredUsers.length }} из {{ store.users.length }}</span>
    </div>

    <div class="table-card">
      <div v-if="store.loading" class="state-msg">Загрузка...</div>
      <div v-else-if="filteredUsers.length === 0" class="state-msg">Пользователи не найдены</div>
      <template v-else>
        <table class="data-table">
          <thead>
            <tr>
              <th>Пользователь</th>
              <th>Логин</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Дата регистрации</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in paginatedUsers" :key="u.id">
            <td>
              <div class="user-cell">
                <div class="user-avatar" :class="u.role === 'Admin' ? 'user-avatar--admin' : ''">
                  {{ initials(u) }}
                </div>
                <div class="user-info">
                  <strong>{{ u.firstName }} {{ u.lastName || '' }}</strong>
                  <span v-if="u.city" class="user-city">{{ u.city }}</span>
                </div>
              </div>
            </td>
            <td class="login-cell">{{ u.login }}</td>
            <td class="secondary-cell">{{ u.email || '—' }}</td>
            <td>
              <span class="role-badge" :class="u.role === 'Admin' ? 'role-badge--admin' : 'role-badge--user'">
                {{ u.role === 'Admin' ? 'Администратор' : 'Пользователь' }}
              </span>
            </td>
            <td class="secondary-cell">{{ formatDate(u.createdAt) }}</td>
            <td>
              <button
                class="action-btn action-btn--delete"
                @click="openDelete(u.id, u.login)"
                title="Удалить"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/>
                  <path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
        <AppPagination
          :total="filteredUsers.length"
          :current-page="currentPage"
          :page-size="pageSize"
          @update:current-page="currentPage = $event"
          @update:page-size="pageSize = $event; currentPage = 1"
        />
      </template>
    </div>

    <!-- Create user modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal__header">
            <h2 class="modal__title">Добавить пользователя</h2>
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
                <label class="form-label">Логин *</label>
                <input v-model="form.login" class="form-input" placeholder="user123" autocomplete="off" />
              </div>
              <div class="form-group">
                <label class="form-label">Роль</label>
                <select v-model="form.role" class="form-input">
                  <option value="User">Пользователь</option>
                  <option value="Admin">Администратор</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Имя *</label>
                <input v-model="form.firstName" class="form-input" placeholder="Иван" />
              </div>
              <div class="form-group">
                <label class="form-label">Фамилия</label>
                <input v-model="form.lastName" class="form-input" placeholder="Иванов" />
              </div>
              <div class="form-group">
                <label class="form-label">Пароль * (мин. 8 символов)</label>
                <input v-model="form.password" type="password" class="form-input" autocomplete="new-password" />
              </div>
              <div class="form-group">
                <label class="form-label">Повторите пароль *</label>
                <input v-model="form.confirmPassword" type="password" class="form-input" autocomplete="new-password" />
              </div>
            </div>
          </div>
          <div class="modal__footer">
            <button class="btn-secondary" @click="closeModal">Отмена</button>
            <button class="btn-primary" :disabled="modalLoading" @click="submitCreate">
              {{ modalLoading ? 'Создание...' : 'Создать' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete confirm -->
    <Teleport to="body">
      <div v-if="deleteConfirmId" class="modal-overlay" @click.self="deleteConfirmId = null">
        <div class="modal modal--sm">
          <div class="modal__header">
            <h2 class="modal__title">Удалить пользователя?</h2>
          </div>
          <div class="modal__body">
            <p class="confirm-text">
              Пользователь <strong>{{ deleteConfirmLogin }}</strong> будет удалён из системы.
              Это действие необратимо.
            </p>
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

.filter-select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  outline: none;
  cursor: pointer;
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

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &--admin {
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
  }
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;

  strong { font-weight: 600; }
}

.user-city {
  font-size: 12px;
  color: #94a3b8;
}

.login-cell {
  font-family: monospace;
  font-size: 13px;
  color: #475569;
}

.secondary-cell {
  font-size: 13px;
  color: #94a3b8;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;

  &--user { background: #f1f5f9; color: #475569; }
  &--admin { background: #ede9fe; color: #6d28d9; }
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
  max-width: 520px;
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
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.form-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
  background: #fff;

  &:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
}

.confirm-text {
  font-size: 14px;
  color: #475569;
  margin: 0;
  line-height: 1.6;
}
</style>
