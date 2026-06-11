import { defineStore } from 'pinia';
import { ref } from 'vue';
import { bookingService } from '@/shared/api/booking/booking.service';
import type { Booking, CreateBookingDto } from '@/shared/types';

export const useBookingStore = defineStore('booking', () => {
  const bookings = ref<Booking[]>([]);
  const activeBooking = ref<Booking | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchMy() {
    loading.value = true;
    error.value = null;
    try {
      bookings.value = await bookingService.getMy();
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка загрузки бронирований';
    } finally {
      loading.value = false;
    }
  }

  async function fetchMyActive() {
    try {
      activeBooking.value = await bookingService.getMyActive();
    } catch {
      activeBooking.value = null;
    }
  }

  async function create(dto: CreateBookingDto): Promise<Booking> {
    loading.value = true;
    error.value = null;
    try {
      const booking = await bookingService.create(dto);
      bookings.value.unshift(booking);
      return booking;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка создания бронирования';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function cancel(id: string) {
    try {
      const updated = await bookingService.cancel(id);
      const idx = bookings.value.findIndex(b => b.id === id);
      if (idx !== -1) bookings.value[idx] = updated;
      if (activeBooking.value?.id === id) activeBooking.value = null;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка отмены бронирования';
      throw e;
    }
  }

  function clearError() {
    error.value = null;
  }

  return { bookings, activeBooking, loading, error, fetchMy, fetchMyActive, create, cancel, clearError };
});
