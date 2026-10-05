export type ServiceCategory = 'Haircuts' | 'Beard' | 'Packages' | 'Kids';

export type BarberRole = 'Head Barber' | 'Senior Barber' | 'Barber';

export type ServiceStatus = 'ACTIVE' | 'INACTIVE';
export type BarberStatus = 'ACTIVE' | 'INACTIVE';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface OpeningHours {
  day: DayOfWeek;
  open: string;
  close: string;
  closed: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: ServiceCategory;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface Barber {
  id: string;
  name: string;
  role: BarberRole;
  cardDescription: string;
  bio: string;
  specialities: string[];
  altText?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface Customer {
  id: string;
  name: string;
  canonicalPhone: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessInfo {
  name: string;
  descriptor: string;
  description: string;
  positioning: string;
  city: string;
  country: string;
  currency: string;
  timezone: string;
  address: {
    full: string;
    short: string;
    multiLine: string;
  };
  phone: {
    display: string;
    tel: string;
  };
  email: string;
  mapSearch: string;
}

export interface BookingConfig {
  maxBookingWindowDays: number;
  minNoticeMinutes: number;
  slotIntervalMinutes: number;
  sundayClosed: boolean;
  paymentInStore: boolean;
  timezone: string;
  onlinePayment: boolean;
  publicCancellationRescheduling: boolean;
}

export interface FirstVisitOffer {
  code: string;
  discountPercent: number;
  appliesTo: 'one-service';
  appliesToFirstVisit: boolean;
  mentionInStore: boolean;
  noOnlineDiscountedPrices: boolean;
  noCountdown: boolean;
}