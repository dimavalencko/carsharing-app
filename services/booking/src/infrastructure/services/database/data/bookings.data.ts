import { SEED_USER_IDS, SEED_CAR_ID } from '@carsharing/common';

const d = (daysOffset: number): Date =>
  new Date(Date.now() + daysOffset * 86400_000);

const price = (pricePerDay: number, start: Date, end: Date): number => {
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400_000));
  return pricePerDay * days;
};

const CAR_PPD: Record<number, number> = {
  1: 1800, 2: 1600, 5: 2300, 7: 2200, 10: 2000,
  12: 2100, 15: 3500, 20: 3300, 25: 3600, 30: 5800,
  35: 6200, 36: 5800, 40: 5000,
  43: 8500, 44: 9000, 45: 12000,
  46: 9000, 47: 9500, 48: 12500,
};

interface BookingSeed {
  id: string; userId: string; carId: string;
  startDate: Date; endDate: Date; status: string; totalPrice: number;
}

function booking(
  n: number, userId: string, carN: number,
  startOffset: number, endOffset: number, statusOverride?: string,
): BookingSeed {
  const start = d(startOffset);
  const end = d(endOffset);
  const ppd = CAR_PPD[carN] ?? 2000;
  const auto = startOffset < 0 && endOffset < 0
    ? 'completed'
    : startOffset < 0 && endOffset > 0
      ? 'active'
      : 'pending';
  return {
    id: `30000000-0000-0000-0000-${String(n).padStart(12, '0')}`,
    userId,
    carId: SEED_CAR_ID(carN),
    startDate: start,
    endDate: end,
    status: statusOverride ?? auto,
    totalPrice: price(ppd, start, end),
  };
}

export const BOOKINGS_SEED_DATA: BookingSeed[] = [
  booking(1, SEED_USER_IDS.USER_1, 43, -3, 4, 'active'),
  booking(2, SEED_USER_IDS.USER_2, 44, -2, 5, 'active'),
  booking(3, SEED_USER_IDS.USER_3, 45, -1, 3, 'active'),
  booking(4, SEED_USER_IDS.USER_1, 46, 1, 5, 'confirmed'),
  booking(5, SEED_USER_IDS.USER_4, 47, 2, 7, 'confirmed'),
  booking(6, SEED_USER_IDS.USER_2, 48, 3, 8, 'confirmed'),
  booking(7, SEED_USER_IDS.USER_1, 1, -14, -11),
  booking(8, SEED_USER_IDS.USER_2, 5, -20, -15),
  booking(9, SEED_USER_IDS.USER_3, 10, -30, -25),
  booking(10, SEED_USER_IDS.USER_4, 15, -10, -7),
  booking(11, SEED_USER_IDS.USER_5, 20, -25, -20),
  booking(12, SEED_USER_IDS.USER_1, 25, -45, -40),
  booking(13, SEED_USER_IDS.USER_3, 30, -60, -55),
  booking(18, SEED_USER_IDS.USER_3, 12, -8, -5),
  booking(14, SEED_USER_IDS.USER_4, 2, -5, -2, 'cancelled'),
  booking(15, SEED_USER_IDS.USER_5, 7, -15, -12, 'cancelled'),
  booking(16, SEED_USER_IDS.USER_2, 35, 7, 10, 'pending'),
  booking(17, SEED_USER_IDS.USER_5, 40, 4, 6, 'pending'),
];
