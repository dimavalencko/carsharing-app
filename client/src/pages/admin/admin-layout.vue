<script setup lang="ts">
import { useAuthStore } from '@/entities/auth/model/auth.store';
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const isDashboard = computed(() => route.path === '/admin');

async function handleLogout() {
  await auth.logout();
  router.push({ name: 'login' });
}
</script>

<template>
  <div class="admin-wrap">
    <aside class="sidebar">
      <div class="sidebar__brand">
        <span class="sidebar__brand-icon"></span>
        <div>
          <div class="sidebar__brand-name">CarSharing</div>
          <div class="sidebar__brand-sub">Панель администратора</div>
        </div>
      </div>

      <nav class="sidebar__nav">
        <RouterLink
          to="/admin"
          class="sidebar__link"
          :class="{ 'sidebar__link--active': isDashboard }"
        >
          <span class="sidebar__link-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </span>
          Дашборд
        </RouterLink>

        <RouterLink to="/admin/cars" class="sidebar__link" active-class="sidebar__link--active">
          <span class="sidebar__link-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v5"/><circle cx="16" cy="17" r="3"/>
              <circle cx="7" cy="17" r="3"/><path d="M9 17H13"/>
            </svg>
          </span>
          Автомобили
        </RouterLink>

        <RouterLink to="/admin/bookings" class="sidebar__link" active-class="sidebar__link--active">
          <span class="sidebar__link-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
          </span>
          Бронирования
        </RouterLink>

        <RouterLink to="/admin/users" class="sidebar__link" active-class="sidebar__link--active">
          <span class="sidebar__link-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </span>
          Пользователи
        </RouterLink>
      </nav>

      <div class="sidebar__footer">
        <div class="sidebar__version">v1.0.0</div>
        <button class="sidebar__logout" @click="handleLogout">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Выйти
        </button>
      </div>
    </aside>

    <div class="admin-body">
      <header class="admin-topbar">
        <div class="admin-topbar__user">
          <div class="admin-topbar__avatar">{{ auth.user?.username?.charAt(0).toUpperCase() }}</div>
          <span class="admin-topbar__name">{{ auth.user?.username }}</span>
          <span class="admin-topbar__role">Admin</span>
        </div>
      </header>
      <main class="admin-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.admin-wrap {
  display: flex;
  min-height: 100vh;
  background: #f0f4ff;
}

.sidebar {
  width: 248px;
  min-height: 100vh;
  background: linear-gradient(180deg, #0f2460 0%, #1d4ed8 100%);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;

  &__brand {
    padding: 22px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  &__brand-icon {
    display: inline-block;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    background-color: #dc2626;
    -webkit-mask: url('../../app/images/logo.png') no-repeat center / contain;
    mask: url('../../app/images/logo.png') no-repeat center / contain;
  }

  &__brand-name {
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
  }

  &__brand-sub {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.55);
    margin-top: 2px;
    letter-spacing: 0.02em;
  }

  &__nav {
    flex: 1;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.65);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.15s, color 0.15s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    &--active {
      background: rgba(255, 255, 255, 0.16);
      color: #fff;
      font-weight: 600;

      .sidebar__link-icon svg {
        stroke: #93c5fd;
      }
    }
  }

  &__link-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    flex-shrink: 0;
    opacity: 0.8;
  }

  &__footer {
    padding: 14px 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__version {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.3);
    padding: 0 14px;
  }

  &__logout {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 6px;
    background: transparent;
    color: rgba(255, 255, 255, 0.6);
    border: none;
    font-size: 13px;
    cursor: pointer;
    text-align: left;
    transition: color 0.15s, background 0.15s;
    width: 100%;

    &:hover {
      color: #fca5a5;
      background: rgba(239, 68, 68, 0.15);
    }
  }
}

.admin-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.admin-topbar {
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 28px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: sticky;
  top: 0;
  z-index: 10;

  &__user {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1d4ed8, #3b82f6);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__name {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
  }

  &__role {
    background: #dbeafe;
    color: #1d4ed8;
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
}

.admin-content {
  padding: 28px;
  flex: 1;
}
</style>
