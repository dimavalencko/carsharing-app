<script setup lang="ts">
import { useAuthStore } from '@/entities/auth/model/auth.store';
import { useProfileStore } from '@/entities/profile/model/profile.store';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const auth = useAuthStore();
const profileStore = useProfileStore();
const router = useRouter();

onMounted(() => {
  if (auth.isAuthenticated && !profileStore.profile && !profileStore.loading) {
    profileStore.fetchProfile();
  }
});

async function handleLogout() {
  await auth.logout();
  router.push({ name: 'login' });
}
</script>

<template>
  <div class="layout">
    <header class="navbar">
      <div class="navbar__inner">
        <RouterLink class="navbar__logo" to="/cars">
          <span class="navbar__logo-icon"></span>
          CarSharing
        </RouterLink>
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
            <RouterLink to="/profile" class="navbar__profile-btn">
              <div class="navbar__avatar">
                <img v-if="profileStore.profile?.avatarUrl" :src="profileStore.profile.avatarUrl" alt="avatar" class="navbar__avatar-img" />
                <span v-else>{{ auth.user?.username?.slice(0, 2).toUpperCase() }}</span>
              </div>
              <span class="navbar__user">{{ auth.user?.username }}</span>
            </RouterLink>
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
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
    text-decoration: none;
    white-space: nowrap;
  }

  &__logo-icon {
    display: inline-block;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    background-color: #dc2626;
    -webkit-mask: url('../images/logo.png') no-repeat center / contain;
    mask: url('../images/logo.png') no-repeat center / contain;
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

  &__profile-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    padding: 4px 10px 4px 4px;
    border-radius: 9999px;
    border: 1.5px solid #e5e7eb;
    transition: border-color 0.15s, background 0.15s;

    &:hover {
      border-color: #2563eb;
      background: #eff6ff;
    }

    &.router-link-active {
      border-color: #2563eb;
      background: #eff6ff;
    }
  }

  &__avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1d4ed8, #7c3aed);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
    overflow: hidden;
  }

  &__avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__user {
    font-size: 13px;
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
