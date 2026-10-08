import { getPrisma } from "@/lib/prisma/client";
import { getLusakaParts, lusakaDateTimeToUtc, startOfLusakaDay, addDays, todayLusakaYmd } from "@/lib/booking/timezone";
import { BookingStatus } from "@prisma/client";

export interface AppointmentWithDetails {
  id: string;
  reference: string;
  startAt: Date;
  endAt: Date;
  status: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  service: {
    id: string;
    name: string;
    durationMinutes: number;
    price: number;
    category: string;
  };
  barber: {
    id: string;
    name: string;
    role: string;
  };
}

export interface AppointmentFilters {
  date: string | null; // YYYY-MM-DD in Lusaka, null means today
  status: BookingStatus | null;
  barberId: string | null;
}

export async function getAppointments(filters: AppointmentFilters): Promise<AppointmentWithDetails[]> {
  const prisma = getPrisma();

  // Determine the date range
  const date = filters.date ?? todayLusakaYmd();
  const { ymd: targetYmd } = getLusakaParts(
    filters.date ? new Date(Date.UTC(parseInt(date.slice(0, 4)), parseInt(date.slice(5, 7)) - 1, parseInt(date.slice(8, 10)))) : new Date()
  );

  // Calculate the UTC range for the target Lusaka date using a half-open interval:
  // startAt >= startOfDayUtc AND startAt < startOfNextDayUtc
  const startOfDayUtc = lusakaDateTimeToUtc(targetYmd, "00:00");
  const startOfNextDayUtc = addDays(startOfDayUtc, 1);

  const where: any = {
    startAt: {
      gte: startOfDayUtc,
      lt: startOfNextDayUtc,
    },
  };

  // Filter by status if provided
  if (filters.status !== null) {
    where.status = filters.status;
  } else {
    // Default: show all statuses (CONFIRMED, CANCELLED, COMPLETED, NO_SHOW)
    // Explicitly include all four
    where.status = {
      in: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED, BookingStatus.COMPLETED, BookingStatus.NO_SHOW],
    };
  }

  // Filter by barber if provided
  if (filters.barberId) {
    where.barberId = filters.barberId;
  }

  const bookings = await getPrisma().booking.findMany({
    where,
    include: {
      service: true,
      barber: true,
      customer: true,
    },
    orderBy: {
      startAt: "asc",
    },
  });

  return bookings.map((booking) => ({
    id: booking.id,
    reference: booking.reference,
    startAt: booking.startAt,
    endAt: booking.endAt,
    status: booking.status,
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    customerEmail: booking.customerEmail,
    service: {
      id: booking.service.id,
      name: booking.service.name,
      durationMinutes: (booking.service.duration as number) || 0,
      price: booking.service.price,
      category: booking.service.category,
    },
    barber: {
      id: booking.barber.id,
      name: booking.barber.name,
      role: booking.barber.role,
    },
  }));
}

export interface TodayAppointmentsResult {
  appointments: Awaited<ReturnType<typeof getAppointments>>;
  date: string;
  dayOfWeek: string;
  formattedDate: string;
}

export async function getTodaysAppointmentsResult(): Promise<TodayAppointmentsResult> {
  const now = new Date();
  const { ymd, dayOfWeek } = getLusakaParts(new Date());

  const appointments = await getAppointments({ date: null, status: null, barberId: null });

  return {
    appointments,
    date: ymd,
    dayOfWeek,
    formattedDate: new Date().toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).replace(",", ""),
  };
}