import { getPrisma } from '@/lib/prisma/client';
import { getLusakaParts, lusakaDateTimeToUtc } from './timezone';

export interface BusinessHoursData {
  openMinute: number;
  closeMinute: number;
  isClosed: boolean;
}

export interface BlockoutInterval {
  startAt: Date;
  endAt: Date;
  barberId: string | null;
}

async function getBusinessHoursForDay(dayOfWeek: number): Promise<BusinessHoursData | null> {
  const prisma = getPrisma();
  const bh = await prisma.businessHours.findUnique({
    where: { dayOfWeek },
  });
  if (!bh) return null;
  return {
    openMinute: bh.openMinute ?? 0,
    closeMinute: bh.closeMinute ?? 0,
    isClosed: bh.isClosed,
  };
}

async function getSpecialHoursForDate(date: Date): Promise<BusinessHoursData | null> {
  const prisma = getPrisma();
  const lusakaYmd = getLusakaParts(date).ymd;
  const specialDate = lusakaDateTimeToUtc(lusakaYmd);
  
  const sh = await prisma.specialHours.findUnique({
    where: { date: specialDate },
  });
  if (!sh) return null;
  return {
    openMinute: sh.openMinute ?? 0,
    closeMinute: sh.closeMinute ?? 0,
    isClosed: sh.isClosed,
  };
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export async function getEffectiveBusinessHours(date: Date): Promise<BusinessHoursData> {
  const specialHours = await getSpecialHoursForDate(date);
  if (specialHours) {
    return specialHours;
  }
  
  const { dayOfWeek } = getLusakaParts(date);
  // Convert from string day name to number (0=Sunday, 1=Monday, ..., 6=Saturday)
  const dayOfWeekNum = DAY_NAMES.indexOf(dayOfWeek);
  const businessHours = await getBusinessHoursForDay(dayOfWeekNum);
  if (!businessHours) {
    return { openMinute: 0, closeMinute: 0, isClosed: true };
  }
  return businessHours;
}

export async function getBlockoutsForDateRange(
  startDate: Date,
  endDate: Date,
  barberId?: string | null
): Promise<BlockoutInterval[]> {
  const prisma = getPrisma();
  
  const where: {
    startAt: { lt: Date };
    endAt: { gt: Date };
    barberId?: string | null;
  } = {
    startAt: { lt: endDate },
    endAt: { gt: startDate },
  };
  
  if (barberId !== undefined) {
    where.barberId = barberId;
  }
  
  const blockouts = await prisma.blockout.findMany({
    where,
    select: {
      startAt: true,
      endAt: true,
      barberId: true,
    },
  });
  
  return blockouts;
}

function doesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && aEnd > bStart;
}

export function filterSlotsByBlockouts(
  slots: { start: Date; end: Date; barberId: string }[],
  blockouts: BlockoutInterval[],
  targetBarberId: string
): { start: Date; end: Date; barberId: string }[] {
  return slots.filter((slot) => {
    // Check shop-wide blockouts
    const shopBlockoutConflict = blockouts.some((bo) => 
      bo.barberId === null && doesOverlap(slot.start, slot.end, bo.startAt, bo.endAt)
    );
    if (shopBlockoutConflict) return false;
    
    // Check barber-specific blockouts
    const barberBlockoutConflict = blockouts.some((bo) => 
      bo.barberId === targetBarberId && doesOverlap(slot.start, slot.end, bo.startAt, bo.endAt)
    );
    if (barberBlockoutConflict) return false;
    
    return true;
  });
}

export async function getAvailableSlotsForBarber(
  serviceId: string,
  barberId: string,
  date: Date,
  existingBookings: { startAt: Date; endAt: Date; barberId: string }[],
  referenceTime: Date = new Date()
): Promise<{ start: string; end: string }[]> {
  const { getServiceById } = await import('@/lib/data/services');
  const { bookingConfig } = await import('@/lib/data/booking-config');
  const { getLusakaParts, lusakaDateTimeToUtc, startOfLusakaDay, addMinutes, formatLusakaTime, isSameLusakaDay } = await import('./timezone');
  
  const service = getServiceById(serviceId);
  if (!service) return [];
  
  const businessHours = await getEffectiveBusinessHours(date);
  if (businessHours.isClosed) return [];
  
  const { ymd: dateStr } = getLusakaParts(date);
  const isToday = isSameLusakaDay(date, referenceTime);
  
  const open = businessHours.openMinute;
  const close = businessHours.closeMinute;
  const latestStart = close - service.durationMinutes;
  
  if (latestStart < open) return [];
  
  const candidateSlots: string[] = [];
  for (let time = open; time <= latestStart; time += bookingConfig.slotIntervalMinutes) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    candidateSlots.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
  }
  
  const availableSlots: { start: string; end: string }[] = [];
  
  // Get blockouts for this barber and date range
  const startOfDay = startOfLusakaDay(date);
  const endOfDay = addMinutes(startOfDay, 24 * 60);
  const blockouts = await getBlockoutsForDateRange(startOfDay, endOfDay, barberId);
  
  for (const slotStart of candidateSlots) {
    if (isToday) {
      const nowMinutes = getLusakaParts(referenceTime).minutesOfDay;
      const slotMinutes = timeToMinutes(slotStart);
      if (slotMinutes < nowMinutes + bookingConfig.minNoticeMinutes) {
        continue;
      }
    }
    
    const slotStartDate = lusakaDateTimeToUtc(dateStr, slotStart);
    const slotEndDate = addMinutes(slotStartDate, service.durationMinutes);
    
    // Check existing bookings
    const hasBookingConflict = existingBookings.some((b) => 
      b.barberId === barberId && doesOverlap(b.startAt, b.endAt, slotStartDate, slotEndDate)
    );
    if (hasBookingConflict) continue;
    
    // Check blockouts
    const hasBlockoutConflict = blockouts.some((bo) => 
      (bo.barberId === null || bo.barberId === barberId) && 
      doesOverlap(slotStartDate, slotEndDate, bo.startAt, bo.endAt)
    );
    if (hasBlockoutConflict) continue;
    
    availableSlots.push({
      start: slotStart,
      end: formatLusakaTime(slotEndDate),
    });
  }
  
  return availableSlots;
}

export async function getAvailableSlotsForNoPreference(
  serviceId: string,
  date: Date,
  existingBookings: { startAt: Date; endAt: Date; barberId: string }[],
  referenceTime: Date = new Date()
): Promise<{ start: string; end: string; barberId: string }[]> {
  const { getServiceById } = await import('@/lib/data/services');
  const { getAllBarbers } = await import('@/lib/data/barbers');
  const { bookingConfig } = await import('@/lib/data/booking-config');
  const { getLusakaParts, lusakaDateTimeToUtc, startOfLusakaDay, addMinutes, formatLusakaTime, isSameLusakaDay } = await import('./timezone');
  
  const service = getServiceById(serviceId);
  if (!service) return [];
  
  const businessHours = await getEffectiveBusinessHours(date);
  if (businessHours.isClosed) return [];
  
  const { ymd: dateStr } = getLusakaParts(date);
  const isToday = isSameLusakaDay(date, referenceTime);
  
  const open = businessHours.openMinute;
  const close = businessHours.closeMinute;
  const latestStart = close - service.durationMinutes;
  
  if (latestStart < open) return [];
  
  const candidateSlots: string[] = [];
  for (let time = open; time <= latestStart; time += bookingConfig.slotIntervalMinutes) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    candidateSlots.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
  }
  
  const allBarbers = getAllBarbers().filter((b) => b.status === 'ACTIVE');
  if (allBarbers.length === 0) return [];
  
  // Get blockouts for all barbers and date range
  const startOfDay = startOfLusakaDay(date);
  const endOfDay = addMinutes(startOfDay, 24 * 60);
  const blockouts = await getBlockoutsForDateRange(startOfDay, endOfDay, null);
  
  const availableSlots: { start: string; end: string; barberId: string }[] = [];
  
  for (const slotStart of candidateSlots) {
    if (isToday) {
      const nowMinutes = getLusakaParts(referenceTime).minutesOfDay;
      const slotMinutes = timeToMinutes(slotStart);
      if (slotMinutes < nowMinutes + bookingConfig.minNoticeMinutes) {
        continue;
      }
    }
    
    const slotStartDate = lusakaDateTimeToUtc(dateStr, slotStart);
    const slotEndDate = addMinutes(slotStartDate, service.durationMinutes);
    
    const availableBarber = allBarbers.find((barber) => {
      // Check existing bookings for this barber
      const hasBookingConflict = existingBookings.some((b) => 
        b.barberId === barber.id && doesOverlap(b.startAt, b.endAt, slotStartDate, slotEndDate)
      );
      if (hasBookingConflict) return false;
      
      // Check blockouts for this barber
      const hasBlockoutConflict = blockouts.some((bo) => 
        (bo.barberId === null || bo.barberId === barber.id) && 
        doesOverlap(slotStartDate, slotEndDate, bo.startAt, bo.endAt)
      );
      if (hasBlockoutConflict) return false;
      
      return true;
    });
    
    if (availableBarber) {
      availableSlots.push({
        start: slotStart,
        end: formatLusakaTime(slotEndDate),
        barberId: availableBarber.id,
      });
    }
  }
  
  return availableSlots;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}