<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  total: number;
  currentPage: number;
  pageSize: number;
}>();

const emit = defineEmits<{
  'update:currentPage': [page: number];
  'update:pageSize': [size: number];
}>();

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));

const from = computed(() => Math.min((props.currentPage - 1) * props.pageSize + 1, props.total));
const to = computed(() => Math.min(props.currentPage * props.pageSize, props.total));

const visiblePages = computed(() => {
  const total = totalPages.value;
  const cur = props.currentPage;
  const pages: (number | '...')[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  pages.push(1);
  if (cur > 3) pages.push('...');
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
  if (cur < total - 2) pages.push('...');
  pages.push(total);

  return pages;
});

function go(page: number) {
  if (page >= 1 && page <= totalPages.value) emit('update:currentPage', page);
}

function changeSize(e: Event) {
  emit('update:pageSize', Number((e.target as HTMLSelectElement).value));
  emit('update:currentPage', 1);
}
</script>

<template>
  <div v-if="total > 0" class="pagination">
    <div class="pagination__info">
      Показано {{ from }}–{{ to }} из {{ total }}
    </div>

    <div class="pagination__controls">
      <button class="pg-btn" :disabled="currentPage === 1" @click="go(currentPage - 1)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <template v-for="p in visiblePages" :key="p">
        <span v-if="p === '...'" class="pg-dots">…</span>
        <button
          v-else
          class="pg-btn pg-btn--num"
          :class="{ 'pg-btn--active': p === currentPage }"
          @click="go(p as number)"
        >{{ p }}</button>
      </template>

      <button class="pg-btn" :disabled="currentPage === totalPages" @click="go(currentPage + 1)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>

    <div class="pagination__size">
      <select :value="pageSize" class="pg-size-select" @change="changeSize">
        <option :value="10">10 / стр.</option>
        <option :value="20">20 / стр.</option>
        <option :value="50">50 / стр.</option>
      </select>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-top: 1px solid #e2e8f0;
  gap: 12px;
  flex-wrap: wrap;

  &__info {
    font-size: 13px;
    color: #64748b;
    white-space: nowrap;
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__size {
    display: flex;
    align-items: center;
  }
}

.pg-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #374151;
  font-size: 13px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    border-color: #3b82f6;
    color: #1d4ed8;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &--active {
    background: #1d4ed8;
    border-color: #1d4ed8;
    color: #fff;

    &:hover:not(:disabled) { background: #1e40af; color: #fff; }
  }
}

.pg-dots {
  color: #94a3b8;
  font-size: 13px;
  padding: 0 4px;
  user-select: none;
}

.pg-size-select {
  padding: 5px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  background: #fff;
  color: #374151;
  outline: none;
  cursor: pointer;

  &:focus { border-color: #3b82f6; }
}
</style>
