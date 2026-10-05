import { getPrisma } from "@/lib/prisma/client";
import { getLusakaParts, lusakaDateTimeToUtc, startOfLusakaDay, addDays } from "@/lib/booking/timezone";
import { BookingStatus } from "@prisma/client";

export interface AppointmentWithDetails {
  id: string;
  reference: string;
  startAt: Date;
  endAt: Date;
  status: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
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

export async function getTodaysAppointments(): Promise<AppointmentWithDetails[]> {
  const prisma = getPrisma();

  // Get today's date in Lusaka timezone
  const now = new Date();
  const { ymd: todayYmd } = getLusakaParts(now);

  // Calculate the UTC range for today in Lusaka time
  const startOfDayUtc = lusakaDateTimeToUtc(todayYmd, "00:00");
  const endOfDayUtc = lusakaDateTimeToUtc(todayYmd, "23:59");

  const bookings = await getPrisma().booking.findMany({
    where: {
      startAt: {
        gte: startOfDayUtc,
        lt: endOfDayUtc,
      },
      status: {
        in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED, BookingStatus.NO_SHOW],
      },
    },
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
      durationMinutes: booking.service.durationMinutes,
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
  appointments: Awaited<ReturnType<typeof getTodaysAppointments>>;
  date: string;
  dayOfWeek: string;
  formattedDate: string;
}

export async function getTodaysAppointmentsResult(): Promise<TodayAppointmentsResult> {
  const now = new Date();
  const { ymd, dayOfWeek } = getLusakaParts(new Date());

  const appointments = await getTodaysAppointments();

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