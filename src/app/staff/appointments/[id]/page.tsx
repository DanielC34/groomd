import { Metadata } from "next";
import StaffLayout from "@/app/staff/layout";
import { getPrisma } from "@/lib/prisma/client";
import { getLusakaParts, formatLusakaTime } from "@/lib/booking/timezone";
import { BookingStatus } from "@prisma/client";

const statusLabels: Record<BookingStatus, string> = {
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  NO_SHOW: "No-show",
};

const statusBadgeClass: Record<BookingStatus, string> = {
  CONFIRMED: "bg-[var(--color-success-tint)] text-[var(--color-success)]",
  CANCELLED: "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]",
  COMPLETED: "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]",
  NO_SHOW: "bg-[var(--color-error-tint)] text-[var(--color-error)]",
};

export const metadata: Metadata = {
  title: "Appointment Details | Groomd Staff",
  description: "Staff appointment details - View appointment information",
};

interface AppointmentDetails {
  id: string;
  reference: string;
  startAt: Date;
  endAt: Date;
  status: string;
  createdAt: Date;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  service: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    category: string;
  };
  barber: {
    id: string;
    name: string;
    role: string;
    specialities: string[];
  };
}

export default async function StaffAppointmentDetailsPage(
  { params }: { params: { id: string } }
) {
  const prisma = getPrisma();
  const appointmentId = params.id;

  const booking = await getPrisma().booking.findUnique({
    where: { id: appointmentId },
    include: {
      service: true,
      barber: true,
      customer: true,
    },
  });

  if (!booking) {
    return (
      <StaffLayout>
        <div className="min-h-screen bg-[var(--color-background)]">
          <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-md text-center">
              <div className="mb-6">
                <svg
                  className="mx-auto mb-4 text-[var(--color-error)] w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L8.98 21H5c-1.667 0-2.5-1.667-1.732-3L2.73 8.94A4.5 4.5 0 0 1 6 6.25l.78-.87a4.5 4.5 0 0 1 6.472 0l.78.87A4.5 4.5 0 0 1 16.73 8.94c1.538 0 2.731 1.252 2.731 2.75c0 1.5.03 2.87.03 3zM5.33 3l2.058.833 1.804 1.403a5.506 5.506 0 0 0 1.105 3.139l-.625.518a5.508 5.508 0 0 1-.288 1.275l-.624-.518a5.506 5.506 0 0 0-1.105-3.139L5.33 3Z"
                  />
                </svg>
              </div>

              <h2 className="font-display font-bold text-2xl text-[var(--color-text-primary)] mb-2">
                Appointment not found
              </h2>
              <p className="text-[var(--color-text-secondary)] font-body mb-6">
                The appointment you requested could not be found.
              </p>
            </div>
          </div>
        </div>
      </StaffLayout>
    );
  }

  const { hhmm } = getLusakaParts(booking.startAt);

  const statusLabel = statusLabels[booking.status as BookingStatus];
  const statusClass = statusBadgeClass[booking.status as BookingStatus];

  return (
    <StaffLayout>
      <div className="p-4 bg-[var(--color-background-support)] border-b border-[var(--color-brand-secondary)]">
        <h1 className="font-display font-bold text-2xl text-[var(--color-text-primary)]">
          Appointment Details
        </h1>
      </div>

      <main className="p-4">
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <p className="text-sm font-body text-[var(--color-text-secondary)]">Reference</p>
            <p className="font-display font-bold text-lg text-[var(--color-text-primary)]">
              {booking.reference}
            </p>
          </div>
          <div>
            <p className="text-sm font-body text-[var(--color-text-secondary)]">Date</p>
            <p className="font-display font-bold text-lg text-[var(--color-text-primary)]">
              {formatLusakaTime(booking.startAt)} &ndash; {formatLusakaTime(booking.endAt)}
            </p>
          </div>
          <div>
            <p className="text-sm font-body text-[var(--color-text-secondary)]">Status</p>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-xs)] text-xs font-body font-medium ${statusClass}`}
            >
              {statusLabel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-body text-[var(--color-text-secondary)]">Customer</p>
            <p className="font-display font-bold text-lg text-[var(--color-text-primary)]">
              {booking.customerName}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">{booking.customerPhone}</p>
            {booking.customerEmail && (
              <p className="text-sm text-[var(--color-text-muted)]">
                {booking.customerEmail}
              </p>
            )}
          </div>
          <div>
            <p className="text-sm font-body text-[var(--color-text-secondary)]">Service</p>
            <p className="font-display font-bold text-lg text-[var(--color-text-primary)]">
              {booking.service.name}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              {booking.service.duration} min &bull; K{booking.service.price.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-body text-[var(--color-text-secondary)]">Barber</p>
            <p className="font-display font-bold text-lg text-[var(--color-text-primary)]">
              {booking.barber.name}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">{booking.barber.role}</p>
          </div>
          <div>
            <p className="text-sm font-body text-[var(--color-text-secondary)]">Duration</p>
            <p className="font-display font-bold text-lg text-[var(--color-text-primary)]">
              {booking.service.duration} minutes
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              Start: {formatLusakaTime(booking.startAt)} &bull; End: {formatLusakaTime(booking.endAt)}
            </p>
          </div>
        </div>

        {booking.service.description && (
          <div className="mt-6 p-4 rounded-[var(--radius-lg)] bg-[var(--color-background-support)] border border-[var(--color-border)]">
            <p className="text-sm font-body text-[var(--color-text-secondary)]">Description</p>
            <p className="font-body text-lg">{booking.service.description}</p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-secondary)]">Created</p>
          <p className="font-body">
            {new Date(booking.createdAt).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
              timeZone: "UTC",
            })}
          </p>
        </div>
      </main>
    </StaffLayout>
  );
}