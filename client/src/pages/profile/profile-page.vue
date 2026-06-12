<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import AppLayout from '@/app/layouts/AppLayout.vue';
import { useProfileStore } from '@/entities/profile/model/profile.store';
import { useAuthStore } from '@/entities/auth/model/auth.store';
import type { AddDriverLicenseDto } from '@/shared/types';

const profileStore = useProfileStore();
const auth = useAuthStore();

type Tab = 'info' | 'license' | 'security';
const activeTab = ref<Tab>('info');

const form = ref({
  lastName: '',
  middleName: '',
  email: '',
  phoneNumber: '',
  city: '',
  birthDate: '',
});

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const licenseForm = ref<AddDriverLicenseDto>({
  firstName: '',
  lastName: '',
  middleName: '',
  birthDate: '',
  birthPlace: '',
  issueDate: '',
  expiryDate: '',
  issuedBy: '',
  licenseNumber: '',
});

const showLicenseModal = ref(false);
const licenseModalMode = ref<'add' | 'edit'>('add');
const showDeleteConfirm = ref(false);

const saveSuccess = ref(false);
const passwordSuccess = ref(false);
const licenseSuccess = ref(false);
const saveError = ref('');
const passwordError = ref('');
const licenseError = ref('');

const avatarInputRef = ref<HTMLInputElement | null>(null);
const avatarPreview = ref<string | null>(null);
const avatarSaving = ref(false);

const profile = computed(() => profileStore.profile);
const license = computed(() => profileStore.license);

const initials = computed(() => {
  const p = profile.value;
  if (!p) return auth.user?.username?.slice(0, 2).toUpperCase() ?? '?';
  const first = p.firstName?.[0] ?? '';
  const last = p.lastName?.[0] ?? '';
  return (first + last).toUpperCase() || p.username.slice(0, 2).toUpperCase();
});

const displayName = computed(() => {
  const p = profile.value;
  if (!p) return auth.user?.username ?? '';
  const parts = [p.firstName, p.lastName].filter(Boolean);
  return parts.length ? parts.join(' ') : p.username;
});

const memberSince = computed(() => {
  const date = profile.value?.createdAt;
  if (!date) return '';
  return new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
});

const avatarSrc = computed(() => avatarPreview.value ?? profile.value?.avatarUrl ?? null);

const avatarGradient = computed(() => {
  const code = (auth.user?.username ?? 'A').charCodeAt(0) % 5;
  const gradients = [
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #8b5cf6, #ec4899)',
    'linear-gradient(135deg, #06b6d4, #2563eb)',
    'linear-gradient(135deg, #10b981, #2563eb)',
    'linear-gradient(135deg, #f97316, #8b5cf6)',
  ];
  return gradients[code];
});

const roleLabel = computed(() => auth.isAdmin ? 'Администратор' : 'Пользователь');
const roleClass = computed(() => auth.isAdmin ? 'badge--admin' : 'badge--user');

const licenseStatusLabel = computed(() => {
  if (!license.value) return null;
  if (license.value.isExpired) return { text: 'Просрочено', cls: 'status--expired' };
  const exp = new Date(license.value.expiryDate);
  const monthsLeft = (exp.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30);
  if (monthsLeft < 3) return { text: 'Истекает скоро', cls: 'status--warning' };
  return { text: 'Действующее', cls: 'status--active' };
});

function formatDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return '—';
  const normalized = typeof dateStr === 'string'
    ? dateStr.replace(' ', 'T')
    : dateStr;
  const date = new Date(normalized);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function fillForm() {
  const p = profile.value;
  if (!p) return;
  form.value = {
    lastName: p.lastName ?? '',
    middleName: p.middleName ?? '',
    email: p.email ?? '',
    phoneNumber: p.phoneNumber ?? '',
    city: p.city ?? '',
    birthDate: p.birthDate ? p.birthDate.slice(0, 10) : '',
  };
}

function openAddLicense() {
  licenseModalMode.value = 'add';
  licenseForm.value = {
    firstName: profile.value?.firstName ?? '',
    lastName: profile.value?.lastName ?? '',
    middleName: profile.value?.middleName ?? '',
    birthDate: profile.value?.birthDate ? profile.value.birthDate.slice(0, 10) : '',
    birthPlace: '',
    issueDate: '',
    expiryDate: '',
    issuedBy: '',
    licenseNumber: '',
  };
  licenseError.value = '';
  showLicenseModal.value = true;
}

function openEditLicense() {
  if (!license.value) return;
  licenseModalMode.value = 'edit';
  licenseForm.value = {
    firstName: license.value.firstName,
    lastName: license.value.lastName,
    middleName: license.value.middleName ?? '',
    birthDate: license.value.birthDate.slice(0, 10),
    birthPlace: license.value.birthPlace,
    issueDate: license.value.issueDate.slice(0, 10),
    expiryDate: license.value.expiryDate.slice(0, 10),
    issuedBy: license.value.issuedBy,
    licenseNumber: license.value.licenseNumber,
  };
  licenseError.value = '';
  showLicenseModal.value = true;
}

async function saveLicense() {
  licenseError.value = '';
  try {
    if (licenseModalMode.value === 'add') {
      await profileStore.addLicense(licenseForm.value);
    } else {
      await profileStore.updateLicense({
        firstName: licenseForm.value.firstName,
        lastName: licenseForm.value.lastName,
        middleName: licenseForm.value.middleName || undefined,
        birthPlace: licenseForm.value.birthPlace,
        issuedBy: licenseForm.value.issuedBy,
      });
    }
    showLicenseModal.value = false;
    licenseSuccess.value = true;
    setTimeout(() => { licenseSuccess.value = false; }, 3000);
  } catch (e: any) {
    licenseError.value = e.response?.data?.message || profileStore.error || 'Ошибка сохранения';
  }
}

async function confirmDeleteLicense() {
  try {
    await profileStore.deleteLicense();
    showDeleteConfirm.value = false;
  } catch {
    showDeleteConfirm.value = false;
  }
}

async function saveProfile() {
  saveError.value = '';
  saveSuccess.value = false;
  try {
    await profileStore.updateProfile({
      lastName: form.value.lastName || undefined,
      middleName: form.value.middleName || undefined,
      email: form.value.email || undefined,
      phoneNumber: form.value.phoneNumber || undefined,
      city: form.value.city || undefined,
      birthDate: form.value.birthDate || undefined,
    });
    saveSuccess.value = true;
    setTimeout(() => { saveSuccess.value = false; }, 3000);
  } catch (e: any) {
    saveError.value = e.response?.data?.message || profileStore.error || 'Ошибка сохранения';
  }
}

async function savePassword() {
  passwordError.value = '';
  passwordSuccess.value = false;
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Пароли не совпадают';
    return;
  }
  if (passwordForm.value.newPassword.length < 6) {
    passwordError.value = 'Минимальная длина пароля — 6 символов';
    return;
  }
  try {
    await profileStore.changePassword({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword,
    });
    passwordSuccess.value = true;
    passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
    setTimeout(() => { passwordSuccess.value = false; }, 3000);
  } catch (e: any) {
    passwordError.value = e.response?.data?.message || profileStore.error || 'Ошибка смены пароля';
  }
}

function triggerAvatarUpload() {
  avatarInputRef.value?.click();
}

async function handleAvatarFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    saveError.value = 'Файл слишком большой. Максимум 2 МБ';
    return;
  }
  const reader = new FileReader();
  reader.onload = async (ev) => {
    const base64 = ev.target?.result as string;
    avatarPreview.value = base64;
    avatarSaving.value = true;
    try {
      await profileStore.updateProfile({ avatarUrl: base64 });
    } finally {
      avatarSaving.value = false;
    }
  };
  reader.readAsDataURL(file);
}

watch(profile, (newProfile) => {
  if (newProfile) fillForm();
}, { immediate: false });

onMounted(() => {
  profileStore.fetchProfile();
  profileStore.fetchLicense();
});
</script>

<template>
  <AppLayout>
    <div class="profile-page">
      <div v-if="profileStore.loading" class="state-msg">Загрузка профиля...</div>

      <template v-else>
        <div class="profile-hero">
          <div class="profile-hero__bg" />
          <div class="profile-hero__content">
            <div class="avatar-wrap" @click="triggerAvatarUpload">
              <div class="profile-avatar" :style="!avatarSrc ? { background: avatarGradient } : {}">
                <img v-if="avatarSrc" :src="avatarSrc" class="avatar-img" />
                <span v-else>{{ initials }}</span>
              </div>
              <div class="avatar-overlay">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <span>{{ avatarSaving ? 'Сохранение...' : 'Изменить' }}</span>
              </div>
              <input
                ref="avatarInputRef"
                type="file"
                accept="image/*"
                class="avatar-file-input"
                @change="handleAvatarFile"
              />
            </div>

            <div class="profile-hero__info">
              <h1 class="profile-hero__name">{{ displayName }}</h1>
              <div class="profile-hero__meta">
                <span class="profile-hero__username">@{{ profile?.username ?? auth.user?.username }}</span>
                <!-- <span class="profile-badge" :class="roleClass">{{ roleLabel }}</span> -->
                <span v-if="profileStore.hasLicense" class="profile-badge profile-badge--license">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/>
                  </svg>
                  Права подтверждены
                </span>
              </div>
              <p v-if="memberSince" class="profile-hero__since">В системе с {{ memberSince }}</p>
            </div>
          </div>
        </div>

        <div class="profile-tabs">
          <button class="profile-tabs__btn" :class="{ active: activeTab === 'info' }" @click="activeTab = 'info'">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Личные данные
          </button>
          <button class="profile-tabs__btn" :class="{ active: activeTab === 'license' }" @click="activeTab = 'license'">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/>
            </svg>
            Водительские права
            <span v-if="!profileStore.hasLicense" class="tab-dot" />
          </button>
          <button class="profile-tabs__btn" :class="{ active: activeTab === 'security' }" @click="activeTab = 'security'">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Безопасность
          </button>
        </div>

        <div class="profile-content">
          <Transition name="fade" mode="out-in">

            <div v-if="activeTab === 'info'" key="info" class="profile-card">
              <div class="profile-card__header">
                <h2>Личная информация</h2>
                <p>Обновите свои персональные данные</p>
              </div>

              <div v-if="saveSuccess" class="alert alert--success">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Изменения успешно сохранены
              </div>
              <div v-if="saveError" class="alert alert--error">{{ saveError }}</div>

              <div class="info-readonly">
                <div class="info-readonly__item">
                  <span class="info-readonly__label">Логин</span>
                  <span class="info-readonly__value">{{ profile?.username }}</span>
                </div>
                <div class="info-readonly__item">
                  <span class="info-readonly__label">Имя</span>
                  <span class="info-readonly__value">{{ profile?.firstName || '—' }}</span>
                </div>
              </div>

              <div class="form-grid">
                <div class="form-field">
                  <label>Фамилия</label>
                  <input v-model="form.lastName" type="text" placeholder="Ваша фамилия" />
                </div>
                <div class="form-field">
                  <label>Отчество</label>
                  <input v-model="form.middleName" type="text" placeholder="Ваше отчество" />
                </div>
                <div class="form-field">
                  <label>Электронная почта</label>
                  <input v-model="form.email" type="email" placeholder="email@example.com" />
                </div>
                <div class="form-field">
                  <label>Номер телефона</label>
                  <input v-model="form.phoneNumber" type="tel" placeholder="+7 (900) 000-00-00" />
                </div>
                <div class="form-field">
                  <label>Город</label>
                  <input v-model="form.city" type="text" placeholder="Ваш город" />
                </div>
                <div class="form-field">
                  <label>Дата рождения</label>
                  <input v-model="form.birthDate" type="date" />
                </div>
              </div>

              <div class="form-footer">
                <button class="btn btn--primary" :disabled="profileStore.saving" @click="saveProfile">
                  <svg v-if="!profileStore.saving" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                  </svg>
                  <span v-else class="spinner" />
                  {{ profileStore.saving ? 'Сохранение...' : 'Сохранить изменения' }}
                </button>
              </div>
            </div>

            <div v-else-if="activeTab === 'license'" key="license">
              <div v-if="profileStore.licenseLoading" class="state-msg">Загрузка...</div>

              <template v-else>
                <div v-if="licenseSuccess" class="alert alert--success mb-12">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Водительские права успешно сохранены
                </div>

                <div v-if="!license" class="license-empty">
                  <div class="license-empty__icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/>
                      <circle cx="9" cy="16" r="2"/><path d="M13 16h4M13 14h2"/>
                    </svg>
                  </div>
                  <h3>Водительские права не добавлены</h3>
                  <p>Для аренды автомобиля необходимо добавить водительское удостоверение. Данные проверяются при оформлении брони.</p>
                  <button class="btn btn--primary btn--lg" @click="openAddLicense">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Добавить водительские права
                  </button>
                </div>

                <div v-else class="license-card">
                  <div class="license-card__header">
                    <div class="license-card__title-row">
                      <div class="license-card__icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/>
                        </svg>
                      </div>
                      <div>
                        <p class="license-card__label">ВОДИТЕЛЬСКОЕ УДОСТОВЕРЕНИЕ</p>
                        <p class="license-card__subtitle">Российская Федерация</p>
                      </div>
                    </div>
                    <span class="license-status" :class="licenseStatusLabel?.cls">
                      {{ licenseStatusLabel?.text }}
                    </span>
                  </div>

                  <div class="license-card__body">
                    <div class="license-card__main">
                      <div class="license-field license-field--name">
                        <span class="license-field__label">ФИО</span>
                        <span class="license-field__value license-field__value--lg">
                          {{ license.lastName }} {{ license.firstName }}
                          <template v-if="license.middleName"> {{ license.middleName }}</template>
                        </span>
                      </div>
                      <div class="license-row">
                        <div class="license-field">
                          <span class="license-field__label">Дата рождения</span>
                          <span class="license-field__value">{{ formatDate(license.birthDate) }}</span>
                        </div>
                        <div class="license-field">
                          <span class="license-field__label">Место рождения</span>
                          <span class="license-field__value">{{ license.birthPlace }}</span>
                        </div>
                      </div>
                      <div class="license-row">
                        <div class="license-field">
                          <span class="license-field__label">Серия и номер</span>
                          <span class="license-field__value license-field__value--mono">{{ license.licenseNumber }}</span>
                        </div>
                        <div class="license-field">
                          <span class="license-field__label">Кем выдано</span>
                          <span class="license-field__value">{{ license.issuedBy }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="license-card__dates">
                      <div class="license-date-item">
                        <span class="license-date-item__label">Дата выдачи</span>
                        <span class="license-date-item__value">{{ formatDate(license.issueDate) }}</span>
                      </div>
                      <div class="license-date-sep">→</div>
                      <div class="license-date-item">
                        <span class="license-date-item__label">Действует до</span>
                        <span class="license-date-item__value" :class="{ 'text-red': license.isExpired }">
                          {{ formatDate(license.expiryDate) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="license-card__footer">
                    <button class="btn btn--ghost btn--sm" @click="openEditLicense">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Редактировать
                    </button>
                    <button class="btn btn--danger-ghost btn--sm" @click="showDeleteConfirm = true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                        <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                      Удалить
                    </button>
                  </div>
                </div>
              </template>
            </div>

            <div v-else key="security" class="profile-card">
              <div class="profile-card__header">
                <h2>Изменение пароля</h2>
                <p>Для безопасности используйте надёжный уникальный пароль</p>
              </div>

              <div v-if="passwordSuccess" class="alert alert--success">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Пароль успешно изменён
              </div>
              <div v-if="passwordError" class="alert alert--error">{{ passwordError }}</div>

              <div class="form-grid form-grid--narrow">
                <div class="form-field form-field--full">
                  <label>Текущий пароль</label>
                  <div class="input-icon-wrap">
                    <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    <input v-model="passwordForm.oldPassword" type="password" placeholder="Введите текущий пароль" />
                  </div>
                </div>
                <div class="form-field">
                  <label>Новый пароль</label>
                  <div class="input-icon-wrap">
                    <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <input v-model="passwordForm.newPassword" type="password" placeholder="Минимум 6 символов" />
                  </div>
                </div>
                <div class="form-field">
                  <label>Подтверждение пароля</label>
                  <div class="input-icon-wrap">
                    <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <input v-model="passwordForm.confirmPassword" type="password" placeholder="Повторите пароль" />
                  </div>
                </div>
              </div>

              <div class="password-rules">
                <p class="password-rules__title">Требования:</p>
                <ul>
                  <li :class="{ met: passwordForm.newPassword.length >= 6 }">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Минимум 6 символов
                  </li>
                  <li :class="{ met: passwordForm.newPassword === passwordForm.confirmPassword && passwordForm.confirmPassword.length > 0 }">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Пароли совпадают
                  </li>
                </ul>
              </div>

              <div class="form-footer">
                <button class="btn btn--primary" :disabled="profileStore.saving || !passwordForm.oldPassword || !passwordForm.newPassword" @click="savePassword">
                  <svg v-if="!profileStore.saving" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  <span v-else class="spinner" />
                  {{ profileStore.saving ? 'Сохранение...' : 'Изменить пароль' }}
                </button>
              </div>
            </div>

          </Transition>
        </div>

        <Teleport to="body">
          <Transition name="modal">
            <div v-if="showLicenseModal" class="modal-overlay" @click.self="showLicenseModal = false">
              <div class="modal">
                <div class="modal__header">
                  <h3>{{ licenseModalMode === 'add' ? 'Добавить водительские права' : 'Редактировать права' }}</h3>
                  <button class="modal__close" @click="showLicenseModal = false">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>

                <div v-if="licenseError" class="alert alert--error mb-12">{{ licenseError }}</div>

                <div class="modal__body">
                  <div class="modal__section-title">Данные владельца</div>
                  <div class="form-grid">
                    <div class="form-field">
                      <label>Имя <span class="required">*</span></label>
                      <input v-model="licenseForm.firstName" type="text" placeholder="Как в правах" />
                    </div>
                    <div class="form-field">
                      <label>Фамилия <span class="required">*</span></label>
                      <input v-model="licenseForm.lastName" type="text" placeholder="Как в правах" />
                    </div>
                    <div class="form-field">
                      <label>Отчество</label>
                      <input v-model="licenseForm.middleName" type="text" placeholder="Если есть" />
                    </div>
                    <div class="form-field">
                      <label>Дата рождения <span class="required">*</span></label>
                      <input v-model="licenseForm.birthDate" type="date" :disabled="licenseModalMode === 'edit'" />
                    </div>
                    <div class="form-field form-field--full">
                      <label>Место рождения <span class="required">*</span></label>
                      <input v-model="licenseForm.birthPlace" type="text" placeholder="Город, регион" />
                    </div>
                  </div>

                  <div class="modal__section-title">Данные документа</div>
                  <div class="form-grid">
                    <div class="form-field form-field--full">
                      <label>Серия и номер <span class="required">*</span></label>
                      <input
                        v-model="licenseForm.licenseNumber"
                        type="text"
                        placeholder="Например: 99 00 123456"
                        :disabled="licenseModalMode === 'edit'"
                      />
                    </div>
                    <div class="form-field">
                      <label>Дата выдачи <span class="required">*</span></label>
                      <input v-model="licenseForm.issueDate" type="date" :disabled="licenseModalMode === 'edit'" />
                    </div>
                    <div class="form-field">
                      <label>Действует до <span class="required">*</span></label>
                      <input v-model="licenseForm.expiryDate" type="date" :disabled="licenseModalMode === 'edit'" />
                    </div>
                    <div class="form-field form-field--full">
                      <label>Кем выдано <span class="required">*</span></label>
                      <input v-model="licenseForm.issuedBy" type="text" placeholder="Наименование органа" />
                    </div>
                  </div>
                </div>

                <div class="modal__footer">
                  <button class="btn btn--ghost" @click="showLicenseModal = false">Отмена</button>
                  <button class="btn btn--primary" :disabled="profileStore.licenseLoading" @click="saveLicense">
                    <span v-if="profileStore.licenseLoading" class="spinner" />
                    {{ licenseModalMode === 'add' ? 'Добавить' : 'Сохранить' }}
                  </button>
                </div>
              </div>
            </div>
          </Transition>

          <Transition name="modal">
            <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
              <div class="modal modal--sm">
                <div class="modal__header">
                  <h3>Удалить водительские права?</h3>
                </div>
                <div class="modal__body">
                  <p class="modal__text">После удаления вы не сможете арендовать автомобили до повторного добавления удостоверения.</p>
                </div>
                <div class="modal__footer">
                  <button class="btn btn--ghost" @click="showDeleteConfirm = false">Отмена</button>
                  <button class="btn btn--danger" :disabled="profileStore.licenseLoading" @click="confirmDeleteLicense">
                    <span v-if="profileStore.licenseLoading" class="spinner" />
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </Teleport>

      </template>
    </div>
  </AppLayout>
</template>

<style scoped lang="scss">
.profile-page {
  max-width: 800px;
  margin: 0 auto;
}

.state-msg {
  text-align: center;
  padding: 64px;
  color: #6b7280;
  font-size: 15px;
}

.mb-12 { margin-bottom: 12px; }

.profile-hero {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 10px;

  &__bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #0f2460 0%, #1d4ed8 55%, #7c3aed 100%);
  }

  &__content {
    position: relative;
    display: flex;
    align-items: center;
    gap: 28px;
    padding: 36px 40px;
  }

  &__info { flex: 1; }

  &__name {
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 10px;
    text-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }

  &__meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
  }

  &__username {
    font-size: 14px;
    color: rgba(255,255,255,0.75);
    font-weight: 500;
  }

  &__since {
    font-size: 13px;
    color: rgba(255,255,255,0.6);
    margin: 0;
  }
}

.avatar-wrap {
  position: relative;
  cursor: pointer;
  flex-shrink: 0;

  &:hover .avatar-overlay { opacity: 1; }
}

.profile-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255,255,255,0.3);
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  overflow: hidden;

  span {
    font-size: 30px;
    font-weight: 700;
    color: #fff;
    text-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0,0,0,0.55);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;

  span {
    font-size: 10px;
    color: #fff;
    font-weight: 600;
    letter-spacing: 0.03em;
  }
}

.avatar-file-input {
  display: none;
}

.profile-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;

  &--user {
    background: rgba(255,255,255,0.2);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.3);
  }

  &--admin {
    background: rgba(251, 191, 36, 0.25);
    color: #fbbf24;
    border: 1px solid rgba(251, 191, 36, 0.4);
  }

  &--license {
    background: rgba(16, 185, 129, 0.2);
    color: #6ee7b7;
    border: 1px solid rgba(16, 185, 129, 0.35);
  }
}

.profile-tabs {
  display: flex;
  gap: 4px;
  padding: 6px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  margin-bottom: 12px;

  &__btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 10px 16px;
    border: none;
    background: transparent;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;

    svg { stroke: currentColor; flex-shrink: 0; }

    &:hover:not(.active) { background: #f3f4f6; color: #374151; }

    &.active {
      background: linear-gradient(135deg, #1d4ed8, #4f46e5);
      color: #fff;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
  }
}

.tab-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f59e0b;
  flex-shrink: 0;
}

.profile-content { position: relative; }

.profile-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 24px rgba(0,0,0,0.04);
  padding: 32px;

  &__header {
    margin-bottom: 24px;

    h2 { font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 4px; }
    p { font-size: 14px; color: #6b7280; margin: 0; }
  }
}

.info-readonly {
  display: flex;
  gap: 24px;
  padding: 14px 16px;
  background: #f8faff;
  border: 1px solid #e0e7ff;
  border-radius: 10px;
  margin-bottom: 20px;

  &__item { display: flex; flex-direction: column; gap: 2px; }
  &__label { font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
  &__value { font-size: 14px; font-weight: 500; color: #111827; }
}

.alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 14px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;

  svg { flex-shrink: 0; }
  &--success { background: #dcfce7; color: #166534; svg { stroke: #16a34a; } }
  &--error { background: #fee2e2; color: #991b1b; }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 600px) { grid-template-columns: 1fr; }
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 5px;

  &--full { grid-column: 1 / -1; }

  label {
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .required { color: #ef4444; }

  input {
    padding: 10px 13px;
    border: 1.5px solid #e5e7eb;
    border-radius: 9px;
    font-size: 14px;
    color: #111827;
    background: #fafafa;
    outline: none;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;

    &:focus { border-color: #2563eb; background: #fff; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
    &::placeholder { color: #9ca3af; }
    &:disabled { background: #f3f4f6; color: #6b7280; cursor: not-allowed; }
  }
}

.input-icon-wrap {
  position: relative;
  .input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); stroke: #9ca3af; pointer-events: none; }
  input { padding-left: 36px; }
}

.password-rules {
  background: #f8faff;
  border: 1px solid #e0e7ff;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 20px;

  &__title { font-size: 12px; font-weight: 600; color: #374151; margin: 0 0 8px; }

  ul { list-style: none; margin: 0; padding: 0; display: flex; gap: 16px; }

  li {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #9ca3af;
    transition: color 0.2s;
    svg { stroke: #d1d5db; transition: stroke 0.2s; flex-shrink: 0; }
    &.met { color: #16a34a; svg { stroke: #16a34a; } }
  }
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f3f4f6;
  padding-top: 20px;
}

.license-empty {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  padding: 56px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  &__icon {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    background: linear-gradient(135deg, #dbeafe, #ede9fe);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
    svg { stroke: #3b82f6; }
  }

  h3 { font-size: 18px; font-weight: 700; color: #111827; margin: 0; }

  p {
    font-size: 14px;
    color: #6b7280;
    max-width: 400px;
    line-height: 1.6;
    margin: 0;
  }
}

.license-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 24px rgba(0,0,0,0.04);
  overflow: hidden;

  &__header {
    background: linear-gradient(135deg, #1d4ed8, #3b82f6);
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title-row {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  &__icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    svg { stroke: #fff; }
  }

  &__label {
    font-size: 11px;
    font-weight: 700;
    color: rgba(255,255,255,0.7);
    letter-spacing: 0.08em;
    margin: 0;
  }

  &__subtitle {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin: 3px 0 0;
  }

  &__body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__dates {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: #f8faff;
    border: 1px solid #e0e7ff;
    border-radius: 10px;
  }

  &__footer {
    padding: 14px 24px;
    border-top: 1px solid #f3f4f6;
    display: flex;
    gap: 8px;
  }
}

.license-status {
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;

  &.status--active { background: rgba(16,185,129,0.2); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.3); }
  &.status--expired { background: rgba(239,68,68,0.2); color: #fca5a5; border: 1px solid rgba(239,68,68,0.3); }
  &.status--warning { background: rgba(245,158,11,0.2); color: #fcd34d; border: 1px solid rgba(245,158,11,0.3); }
}

.license-field {
  display: flex;
  flex-direction: column;
  gap: 3px;

  &__label {
    font-size: 11px;
    font-weight: 600;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__value {
    font-size: 14px;
    font-weight: 500;
    color: #111827;

    &--lg { font-size: 16px; font-weight: 600; }
    &--mono { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 15px; font-weight: 600; letter-spacing: 0.05em; color: #1d4ed8; }
  }
}

.license-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.license-date-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  &__label { font-size: 11px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
  &__value { font-size: 14px; font-weight: 600; color: #111827; }
}

.license-date-sep {
  font-size: 18px;
  color: #d1d5db;
  flex-shrink: 0;
}

.text-red { color: #ef4444 !important; }

.btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
  white-space: nowrap;

  svg { flex-shrink: 0; }

  &--lg { padding: 12px 28px; font-size: 15px; }
  &--sm { padding: 7px 14px; font-size: 13px; }

  &--primary {
    background: linear-gradient(135deg, #1d4ed8, #4f46e5);
    color: #fff;
    box-shadow: 0 4px 12px rgba(37,99,235,0.3);
    &:hover:not(:disabled) { box-shadow: 0 6px 16px rgba(37,99,235,0.45); transform: translateY(-1px); }
    &:disabled { opacity: 0.55; cursor: not-allowed; transform: none; box-shadow: none; }
  }

  &--ghost {
    background: transparent;
    color: #374151;
    border: 1.5px solid #e5e7eb;
    &:hover { background: #f3f4f6; }
  }

  &--danger-ghost {
    background: transparent;
    color: #dc2626;
    border: 1.5px solid #fecaca;
    &:hover { background: #fee2e2; }
  }

  &--danger {
    background: #dc2626;
    color: #fff;
    &:hover:not(:disabled) { background: #b91c1c; }
    &:disabled { opacity: 0.55; cursor: not-allowed; }
  }
}

.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &--sm { max-width: 380px; }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 0;
    h3 { font-size: 17px; font-weight: 700; color: #111827; margin: 0; }
  }

  &__close {
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
    padding: 4px;
    border-radius: 6px;
    &:hover { background: #f3f4f6; color: #111827; }
  }

  &__body {
    padding: 20px 24px;
    overflow-y: auto;
    flex: 1;
  }

  &__section-title {
    font-size: 11px;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 12px;
    margin-top: 4px;

    &:not(:first-child) { margin-top: 20px; }
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 16px 24px;
    border-top: 1px solid #f3f4f6;
  }

  &__text {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.6;
    margin: 0;
  }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.18s, transform 0.18s; }
.fade-enter-from { opacity: 0; transform: translateY(6px); }
.fade-leave-to { opacity: 0; transform: translateY(-4px); }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; .modal { transition: transform 0.2s; } }
.modal-enter-from { opacity: 0; .modal { transform: scale(0.96) translateY(8px); } }
.modal-leave-to { opacity: 0; .modal { transform: scale(0.96) translateY(8px); } }
</style>
