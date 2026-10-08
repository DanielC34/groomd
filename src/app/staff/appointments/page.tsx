import { Metadata } from "next";
import { useState } from "react";
import StaffLayout from "@/app/staff/layout";
import {
  getAppointments,
  AppointmentFilters,
  AppointmentWithDetails,
} from "@/lib/staff/dashboard";
import {
  formatLusakaTime,
  formatYmdDate,
  toLusakaYmd,
  addDays,
} from "@/lib/booking/timezone";
import { getAllBarbers } from "@/lib/data/barbers";
import { BookingStatus } from "@prisma/client";

export const metadata: Metadata = {
  title: "Appointments | Groomd Staff",
  description: "Staff appointments - View and filter appointments",
}

interface AppointmentRow {
  id: string;
  reference: string;
  startAt: Date;
  endAt: Date;
  status: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  serviceName: string;
  durationMinutes: number;
  price: number;
  barberName: string;
  barberRole: string;
}

const statusLabels: Record<string, string> = {
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  NO_SHOW: "No-show",
};

const statusClass: Record<string, string> = {
  CONFIRMED: "bg-[var(--color-success-tint)] text-[var(--color-success)]",
  CANCELLED: "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]",
  COMPLETED: "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]",
  NO_SHOW: "bg-[var(--color-error-tint)] text-[var(--color-error)]",
};

function statusLabel(status: string) {
  return statusLabels[status] || status;
}

function statusBadgeClass(status: string) {
  return statusClass[status] || statusClass.CONFIRMED;
}

export default async function StaffAppointmentsPage() {
  const [filters, setFilters] = useState<AppointmentFilters>({
    date: null,
    status: null,
    barberId: null,
  });

  const barbers = await getAllBarbers();
  const appointments: AppointmentWithDetails[] = await getAppointments(filters);

  return (
    <StaffLayout>
      <div className="p-4 bg-[var(--color-background-support)] border-b border-[var(--color-brand-secondary)]">
        <h1 className="font-display font-bold text-2xl text-[var(--color-text-primary)]">
          Appointments
        </h1>
      </div>

      <div className="p-4 bg-[var(--color-background)] border-b border-[var(--color-brand-secondary)]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {/* Date filter */}
          <div>
            <label className="text-sm font-body text-[var(--color-text-secondary)] mb-1">
              Date
            </label>
            <select
              value={filters.date ?? "today"}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  date: e.target.value === "" ? null : e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-[var(--radius-md)] text-[var(--color-text-on-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]"
            >
              <option value="">Today</option>
              {[...Array(31)].map((_, i) => {
                const d = addDays(new Date(), -i);
                const ymd = toLusakaYmd(d);
                return (
                  <option key={ymd} value={ymd}>
                    {formatYmdDate(ymd)}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="text-sm font-body text-[var(--color-text-secondary)] mb-1">
              Status
            </label>
            <select
              value={filters.status ?? "all"}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status:
                    e.target.value === "all" ? null : (e.target.value as BookingStatus),
                })
              }
              className="w-full px-3 py-2 border rounded-[var(--radius-md)] text-[var(--color-text-on-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]"
            >
              <option value="all">All</option>
              {[BookingStatus.CONFIRMED, BookingStatus.CANCELLED, BookingStatus.COMPLETED, BookingStatus.NO_SHOW].map(
                (status) => (
                  <option key={status} value={status}>
                    {statusLabels[status as keyof typeof statusLabels]}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Barber filter */}
          <div>
            <label className="text-sm font-body text-[var(--color-text-secondary)] mb-1">
              Barber
            </label>
            <select
              value={filters.barberId ?? "all"}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  barberId: e.target.value === "all" ? null : e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-[var(--radius-md)] text-[var(--color-text-on-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]"
            >
              <option value="all">All barbers</option>
              {barbers.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <main className="p-4">
        {appointments.length === 0 ? (
          <div className="text-center py-12 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)]">
            <svg
              className="mx-auto h-12 w-12 text-[var(--color-text-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-4 font-display font-semibold text-[var(--color-text-primary)]">
              No appointments found
            </h3>
            <p className="mt-1 text-[var(--color-text-secondary)] font-body">
              Try adjusting the filters above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment: AppointmentWithDetails) => (
              <div
                key={appointment.id}
                className={`p-4 rounded-[var(--radius-lg)] border ${statusBadgeClass(appointment.status)}`}
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-display font-semibold text-lg text-[var(--color-text-primary)]">
                        {formatLusakaTime(appointment.startAt)} &ndash; {formatLusakaTime(appointment.endAt)}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-xs)] text-xs font-body font-medium ${statusBadgeClass(appointment.status)}`}
                      >
                        {statusLabel(appointment.status)}
                      </span>
                    </div>
                    <p className="font-body text-sm text-[var(--color-text-secondary)] truncate">
                      {appointment.customerName} &middot; {appointment.service.name} ({appointment.service.durationMinutes} min)
                    </p>
                    <p className="font-body text-sm text-[var(--color-text-muted)]">
                      {appointment.barber.name} ({appointment.barber.role}) &middot; Ref: {appointment.reference}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/staff/appointments/${appointment.id}`}
                      className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-[var(--color-brand-primary)] border border-[var(--color-border-strong)] rounded-[var(--radius-md)] hover:bg-[var(--color-surface-muted)] transition-fast"
                      aria-label="View appointment details"
                    >
                      View details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Showing {appointments.length} appointment{"s" !== String(appointments.length) ? "" : "s"} matching filters
          </p>
        </div>
      </main>
    </StaffLayout>
  );
}