import { defaultHttpClient } from '@/app/axios/defaultHttpClient';
import type { Booking, CreateBookingDto } from '@/shared/types';

export const bookingService = {
  async getAll(): Promise<Booking[]> {
    const { data } = await defaultHttpClient.get<Booking[]>('/booking');
    return data;
  },

  async getMy(): Promise<Booking[]> {
    const { data } = await defaultHttpClient.get<Booking[]>('/booking/my');
    return data;
  },

  async getMyActive(): Promise<Booking | null> {
    const { data } = await defaultHttpClient.get<Booking | null>('/booking/my/active');
    return data;
  },

  async getById(id: string): Promise<Booking> {
    const { data } = await defaultHttpClient.get<Booking>(`/booking/${id}`);
    return data;
  },

  async create(dto: CreateBookingDto): Promise<Booking> {
    const { data } = await defaultHttpClient.post<Booking>('/booking', dto);
    return data;
  },

  async cancel(id: string): Promise<Booking> {
    const { data } = await defaultHttpClient.patch<Booking>(`/booking/${id}/cancel`);
    return data;
  },

  async confirm(id: string): Promise<Booking> {
    const { data } = await defaultHttpClient.patch<Booking>(`/booking/${id}/confirm`);
    return data;
  },

  async start(id: string): Promise<Booking> {
    const { data } = await defaultHttpClient.patch<Booking>(`/booking/${id}/start`);
    return data;
  },

  async complete(id: string): Promise<Booking> {
    const { data } = await defaultHttpClient.patch<Booking>(`/booking/${id}/complete`);
    return data;
  },
};
