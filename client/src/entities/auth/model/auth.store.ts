import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/shared/api/auth/auth.service';
import type { AuthUser, LoginDto, RegisterDto } from '@/shared/types';

const AUTH_KEY = 'carsharing_user';

export const useAuthStore = defineStore('auth', () => {
  const stored = localStorage.getItem(AUTH_KEY);
  const user = ref<AuthUser | null>(stored ? (JSON.parse(stored) as AuthUser) : null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === 'Admin');

  async function register(dto: RegisterDto) {
    loading.value = true;
    error.value = null;
    try {
      user.value = await authService.register(dto);
      localStorage.setItem(AUTH_KEY, JSON.stringify(user.value));
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка регистрации';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function login(dto: LoginDto) {
    loading.value = true;
    error.value = null;
    try {
      user.value = await authService.login(dto);
      localStorage.setItem(AUTH_KEY, JSON.stringify(user.value));
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Неверный логин или пароль';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    try {
      await authService.logout();
    } finally {
      user.value = null;
      localStorage.removeItem(AUTH_KEY);
    }
  }

  function clearError() {
    error.value = null;
  }

  return { user, loading, error, isAuthenticated, isAdmin, register, login, logout, clearError };
});
