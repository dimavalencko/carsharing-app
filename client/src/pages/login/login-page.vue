<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/entities/auth/model/auth.store';

const auth = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');

async function submit() {
  await auth.login({ username: username.value, password: password.value });
  router.push(auth.isAdmin ? '/admin' : '/cars');
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-card__title">Вход</h1>
      <form class="auth-form" @submit.prevent="submit">
        <div v-if="auth.error" class="auth-form__error">{{ auth.error }}</div>
        <div class="form-field">
          <label for="username">Имя пользователя</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Введите имя пользователя"
            required
            autocomplete="username"
          />
        </div>
        <div class="form-field">
          <label for="password">Пароль</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Введите пароль"
            required
            autocomplete="current-password"
          />
        </div>
        <button class="btn btn--primary" type="submit" :disabled="auth.loading">
          {{ auth.loading ? 'Вход...' : 'Войти' }}
        </button>
      </form>
      <p class="auth-card__footer">
        Нет аккаунта?
        <RouterLink to="/register">Зарегистрироваться</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  padding: 24px;
}

.auth-card {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);

  &__title {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 24px;
    text-align: center;
  }

  &__footer {
    margin: 20px 0 0;
    text-align: center;
    font-size: 14px;
    color: #6b7280;

    a {
      color: #2563eb;
      font-weight: 500;
    }
  }
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__error {
    background: #fee2e2;
    color: #991b1b;
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 14px;
  }
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }

  input {
    padding: 10px 14px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    color: #111827;
    outline: none;
    transition: border-color 0.15s;

    &:focus { border-color: #2563eb; }
    &::placeholder { color: #9ca3af; }
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
</style>
