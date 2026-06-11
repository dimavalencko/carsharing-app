<script setup lang="ts">
import { useRouter } from 'vue-router';
import AppLayout from '@/app/layouts/AppLayout.vue';

const router = useRouter();
</script>

<template>
  <AppLayout>
    <div class="error-page">
      <span class="error-page__icon">🔍</span>
      <h1>404 — Страница не найдена</h1>
      <p>Запрошенная страница не существует</p>
      <button class="btn btn--primary" @click="router.push('/cars')">На главную</button>
    </div>
  </AppLayout>
</template>

<style scoped lang="scss">
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
  text-align: center;

  &__icon { font-size: 64px; }

  h1 { font-size: 28px; font-weight: 700; color: #111827; margin: 0; }
  p { color: #6b7280; margin: 0; }
}

.btn {
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;

  &--primary {
    background: #2563eb;
    color: #fff;
    &:hover { background: #1d4ed8; }
  }
}
</style>
