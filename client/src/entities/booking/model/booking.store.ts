import { defineStore } from 'pinia';
import { ref } from 'vue';
import { bookingService } from '@/shared/api/booking/booking.service';
import type { Booking, CreateBookingDto } from '@/shared/types';

export const useBookingStore = defineStore('booking', () => {
  const bookings = ref<Booking[]>([]);
  const allBookings = ref<Booking[]>([]);
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

  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      allBookings.value = await bookingService.getAll();
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
      _replaceInAll(updated);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка отмены бронирования';
      throw e;
    }
  }

  async function confirm(id: string) {
    try {
      const updated = await bookingService.confirm(id);
      _replaceInAll(updated);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка подтверждения';
      throw e;
    }
  }

  async function start(id: string) {
    try {
      const updated = await bookingService.start(id);
      _replaceInAll(updated);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка запуска аренды';
      throw e;
    }
  }

  async function complete(id: string) {
    try {
      const updated = await bookingService.complete(id);
      _replaceInAll(updated);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка завершения аренды';
      throw e;
    }
  }

  function _replaceInAll(updated: Booking) {
    const idx = bookings.value.findIndex(b => b.id === updated.id);
    if (idx !== -1) bookings.value[idx] = updated;
    const allIdx = allBookings.value.findIndex(b => b.id === updated.id);
    if (allIdx !== -1) allBookings.value[allIdx] = updated;
    if (activeBooking.value?.id === updated.id) {
      activeBooking.value = updated.status === 'active' ? updated : null;
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    bookings, allBookings, activeBooking, loading, error,
    fetchMy, fetchAll, fetchMyActive, create, cancel, confirm, start, complete, clearError,
  };
});
