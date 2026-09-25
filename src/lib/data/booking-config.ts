import type { BookingConfig } from '@/lib/types';

export const bookingConfig: BookingConfig = {
  maxBookingWindowDays: 30,
  minNoticeMinutes: 60,
  slotIntervalMinutes: 15,
  sundayClosed: true,
  paymentInStore: true,
  timezone: 'Africa/Lusaka',
  onlinePayment: false,
  publicCancellationRescheduling: false,
};