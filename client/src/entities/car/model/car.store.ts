import { defineStore } from 'pinia';
import { ref } from 'vue';
import { carsService, type CarsFilters } from '@/shared/api/cars/cars.service';
import type { Car, CarStatus, CreateCarDto, UpdateCarDto } from '@/shared/types';

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

  async function createCar(dto: CreateCarDto): Promise<Car> {
    loading.value = true;
    error.value = null;
    try {
      const car = await carsService.create(dto);
      cars.value.unshift(car);
      return car;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка создания автомобиля';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updateCar(id: string, dto: UpdateCarDto): Promise<Car> {
    loading.value = true;
    error.value = null;
    try {
      const updated = await carsService.update(id, dto);
      const idx = cars.value.findIndex(c => c.id === id);
      if (idx !== -1) cars.value[idx] = updated;
      if (currentCar.value?.id === id) currentCar.value = updated;
      return updated;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка обновления автомобиля';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updateCarStatus(id: string, status: CarStatus) {
    try {
      await carsService.updateStatus(id, status);
      const idx = cars.value.findIndex(c => c.id === id);
      if (idx !== -1) cars.value[idx] = { ...cars.value[idx], status };
      if (currentCar.value?.id === id) currentCar.value = { ...currentCar.value, status };
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка обновления статуса';
      throw e;
    }
  }

  async function deleteCar(id: string) {
    try {
      await carsService.delete(id);
      cars.value = cars.value.filter(c => c.id !== id);
      if (currentCar.value?.id === id) currentCar.value = null;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка удаления автомобиля';
      throw e;
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    cars, currentCar, loading, error,
    fetchAll, fetchAvailable, fetchById,
    createCar, updateCar, updateCarStatus, deleteCar, clearError,
  };
});
