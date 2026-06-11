<script setup lang="ts">
import { useAuthStore } from '@/entities/auth/model/auth.store';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

async function handleLogout() {
  await auth.logout();
  router.push({ name: 'login' });
}
</script>

<template>
  <div class="layout">
    <header class="navbar">
      <div class="navbar__inner">
        <RouterLink class="navbar__logo" to="/cars">🚗 CarSharing</RouterLink>
        <nav class="navbar__nav">
          <RouterLink to="/cars">Автомобили</RouterLink>
          <RouterLink v-if="auth.isAuthenticated" to="/bookings">Мои бронирования</RouterLink>
          <RouterLink v-if="auth.isAdmin" to="/admin" class="navbar__admin-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: -2px;">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
            Панель администратора
          </RouterLink>
        </nav>
        <div class="navbar__auth">
          <template v-if="auth.isAuthenticated">
            <span class="navbar__user">{{ auth.user?.username }}</span>
            <button class="btn btn--ghost" @click="handleLogout">Выйти</button>
          </template>
          <template v-else>
            <RouterLink class="btn btn--ghost" to="/login">Войти</RouterLink>
            <RouterLink class="btn btn--primary" to="/register">Регистрация</RouterLink>
          </template>
        </div>
      </div>
    </header>
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f9fafb;
}

.navbar {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;

  &__inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    height: 64px;
    display: flex;
    align-items: center;
    gap: 32px;
  }

  &__logo {
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
    text-decoration: none;
    white-space: nowrap;
  }

  &__nav {
    display: flex;
    gap: 24px;
    flex: 1;

    a {
      color: #6b7280;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: color 0.15s;

      &:hover, &.router-link-active {
        color: #2563eb;
      }
    }
  }

  &__admin-link {
    display: inline-flex !important;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    background: #eff6ff;
    border-radius: 6px;
    color: #1d4ed8 !important;
    font-weight: 600 !important;
    font-size: 13px !important;
    border: 1px solid #bfdbfe;
    transition: background 0.15s !important;

    &:hover, &.router-link-active {
      background: #dbeafe !important;
      color: #1e40af !important;
    }
  }

  &__auth {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__user {
    font-size: 14px;
    color: #374151;
    font-weight: 500;
  }
}

.main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  border: none;
  transition: background 0.15s, color 0.15s;

  &--primary {
    background: #2563eb;
    color: #fff;

    &:hover { background: #1d4ed8; }
  }

  &--ghost {
    background: transparent;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover { background: #f3f4f6; }
  }
}
</style>
