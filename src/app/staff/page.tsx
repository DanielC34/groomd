import { Metadata } from "next";
import StaffLayout from "@/app/staff/layout";
import { getTodaysAppointmentsResult } from "@/lib/staff/dashboard";
import { formatLusakaTime } from "@/lib/booking/timezone";

export const metadata: Metadata = {
  title: "Dashboard | Groomd Staff",
  description: "Staff dashboard - Today's appointments",
};

interface Appointment {
  id: string;
  reference: string;
  startAt: Date;
  endAt: Date;
  status: string;
  customerName: string;
  service: {
    name: string;
    durationMinutes: number;
  };
  barber: {
    id: string;
    name: string;
    role: string;
  };
}

const statusStyles: Record<string, string> = {
  CONFIRMED: "bg-[var(--color-success-tint)] text-[var(--color-success)] border-[var(--color-success)]",
  COMPLETED: "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] border-[var(--color-border)]",
  NO_SHOW: "bg-[var(--color-error-tint)] text-[var(--color-error)] border-[var(--color-error)]",
  CANCELLED: "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] border-[var(--color-border)]",
};

const statusStyle = (status: string) => statusStyles[status] || statusStyles.CONFIRMED;

export default async function StaffDashboardPage() {
  const { appointments } = await getTodaysAppointmentsResult();

  const confirmedAppointments = appointments.filter((a) => a.status === "CONFIRMED");
  const completedAppointments = appointments.filter((a) => a.status === "COMPLETED");
  const noShowAppointments = appointments.filter((a) => a.status === "NO_SHOW");

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-[var(--color-text-primary)]">
          Dashboard
        </h1>
        <p className="mt-1 text-[var(--color-text-secondary)] font-body">
          Today's appointments &middot; {new Date().toLocaleDateString("en-GB", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          }).replace(",", "")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--color-brand-primary)] text-[var(--color-brand-light)]">
          <p className="text-sm font-body font-medium opacity-80">Confirmed</p>
          <p className="mt-1 font-display font-bold text-3xl">{confirmedAppointments.length}</p>
          <p className="text-sm opacity-80 mt-1">Appointments today</p>
        </div>
        <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)]">
          <p className="text-sm font-body font-medium text-[var(--color-text-secondary)]">Completed</p>
          <p className="mt-1 font-display font-bold text-3xl text-[var(--color-success)]">{completedAppointments.length}</p>
          <p className="text-sm opacity-60 mt-1">Completed today</p>
        </div>
        <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)]">
          <p className="text-sm font-body font-medium text-[var(--color-text-secondary)]">No-shows</p>
          <p className="mt-1 font-display font-bold text-3xl text-[var(--color-error)]">{noShowAppointments.length}</p>
          <p className="text-sm opacity-60 mt-1">Missed appointments</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-[var(--color-text-primary)] mb-4">
          Today's Appointments
        </h2>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)]">
          <svg className="mx-auto h-12 w-12 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-4 font-display font-semibold text-[var(--color-text-primary)]">No appointments today</h3>
          <p className="mt-1 text-[var(--color-text-secondary)] font-body">Enjoy your free time!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((booking) => (
            <div key={booking.id} className={`p-4 rounded-[var(--radius-lg)] border ${statusStyles[booking.status] || statusStyles.CONFIRMED}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-display font-semibold text-lg text-[var(--color-text-primary)]">
                      {formatLusakaTime(new Date(booking.startAt))} &ndash; {formatLusakaTime(new Date(booking.endAt))}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-xs)] text-xs font-body font-medium ${statusStyles[booking.status] || statusStyles.CONFIRMED}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="font-body text-sm text-[var(--color-text-secondary)] truncate">
                    {booking.customerName} &middot; {booking.service.name} ({booking.service.durationMinutes} min)
                  </p>
                  <p className="font-body text-sm text-[var(--color-text-muted)]">
                    {booking.barber.name} ({booking.barber.role}) &middot; Ref: {booking.reference}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:ml-4 mt-3 sm:mt-0">
                  <a
                    href={`/staff/appointments/${booking.id}`}
                    className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-[var(--color-brand-primary)] border border-[var(--color-border-strong)] rounded-[var(--radius-md)] hover:bg-[var(--color-surface-muted)] transition-fast"
                  >
                    View details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}