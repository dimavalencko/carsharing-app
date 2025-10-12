export const ServiceNames = {
  IDENTITY: 'IDENTITY_SERVICE',
  CARS: 'CARS_SERVICE',
  BOOKING: 'BOOKING_SERVICE',
  NOTIFICATIONS: 'NOTIFICATIONS_SERVICE',
} as const;

export type ServiceName = keyof typeof ServiceNames;