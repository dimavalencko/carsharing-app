import { defineStore } from 'pinia';
import { ref } from 'vue';
import { carsService, type CarsFilters } from '@/shared/api/cars/cars.service';
import type { Car } from '@/shared/types';

export const useCarStore = defineStore('cars', () => {
  const cars = ref<Car[]>([]);
  const currentCar = ref<Car | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchAll(filters?: CarsFilters) {
    loading.value = true;
    error.value = null;
    try {
      cars.value = await carsService.getAll(filters);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка загрузки автомобилей';
    } finally {
      loading.value = false;
    }
  }

  async function fetchAvailable(filters?: Omit<CarsFilters, 'status'>) {
    loading.value = true;
    error.value = null;
    try {
      cars.value = await carsService.getAvailable(filters);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка загрузки автомобилей';
    } finally {
      loading.value = false;
    }
  }

  async function fetchById(id: string) {
    loading.value = true;
    error.value = null;
    try {
      currentCar.value = await carsService.getById(id);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Автомобиль не найден';
    } finally {
      loading.value = false;
    }
  }

  return { cars, currentCar, loading, error, fetchAll, fetchAvailable, fetchById };
});
