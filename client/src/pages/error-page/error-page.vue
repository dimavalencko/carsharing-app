<template>
  <div class="error-page">
    <h1>404</h1>
    <p>{{ $t('errors.pageNotFound') }}</p>
    <RouterLink to="/" class="btn-home">
      {{ $t('errors.goHome') }}
    </RouterLink>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
}

.error-page h1 {
  font-size: 6rem;
  margin: 0;
  color: #e74c3c;
}

.error-page p {
  font-size: 1.5rem;
  margin: 1rem 0 2rem;
  color: #666;
}

.btn-home {
  padding: 0.75rem 2rem;
  background: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.3s;
}

.btn-home:hover {
  background: #2980b9;
}
</style>
