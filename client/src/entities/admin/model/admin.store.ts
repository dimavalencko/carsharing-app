import { defineStore } from 'pinia';
import { ref } from 'vue';
import { adminService } from '@/shared/api/admin/admin.service';
import type { AdminUserDto, CreateAdminUserDto } from '@/shared/types';

export const useAdminStore = defineStore('admin', () => {
  const users = ref<AdminUserDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchUsers() {
    loading.value = true;
    error.value = null;
    try {
      users.value = await adminService.getUsers();
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка загрузки пользователей';
    } finally {
      loading.value = false;
    }
  }

  async function createUser(dto: CreateAdminUserDto): Promise<AdminUserDto> {
    loading.value = true;
    error.value = null;
    try {
      const user = dto.role === 'Admin'
        ? await adminService.createAdminUser(dto)
        : await adminService.createUser(dto);
      users.value.unshift(user);
      return user;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка создания пользователя';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function deleteUser(id: string) {
    try {
      await adminService.deleteUser(id);
      users.value = users.value.filter(u => u.id !== id);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка удаления пользователя';
      throw e;
    }
  }

  function clearError() {
    error.value = null;
  }

  return { users, loading, error, fetchUsers, createUser, deleteUser, clearError };
});
