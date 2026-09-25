"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookingHeader,
  BookingStepper,
  ServiceSelection,
  BookingSummary,
  BarberTimeSelection,
  CustomerDetailsForm,
  ReviewConfirm,
  BookingConfirmed,
  MobileSummaryContext,
} from "@/components/booking";
import type { CustomerDetails } from "@/components/booking";
import { services } from "@/lib/data/services";
import { getBarberById } from "@/lib/data/barbers";
import { formatYmdDate, formatYmdShort, formatTimeRange } from "@/lib/booking/timezone";

/* ── Types ── */
interface Step2State {
  barberId: string | null;
  barberPreference: "specific" | "no-preference";
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  serviceId: string; // service the time was validated for
}

/** Why Step 2 must ask for a new time (drives the approved CONTENT §9.8 notice). */
type Step2Notice = { kind: "conflict" | "invalid"; time: string } | null;

interface ConfirmedState {
  reference: string;
  assignedBarberId: string | null;
  startTime: string; // HH:MM Lusaka, from server
  endTime: string; // HH:MM Lusaka, from server
  startAt: string; // absolute ISO instant
  endAt: string; // absolute ISO instant
}

/* ── Helpers ── */

/* ── Main booking flow content (needs useSearchParams → must be client) ── */
function BookingFlowContent() {
  const searchParams = useSearchParams();
  const paramServiceId = searchParams.get("service");
  const paramBarberId = searchParams.get("barber");

  const validParamId =
    paramServiceId && services.some((s) => s.id === paramServiceId)
      ? paramServiceId
      : undefined;

  const validParamBarberId =
    paramBarberId && getBarberById(paramBarberId)
      ? paramBarberId
      : undefined;

  /* ── State ── */
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [overrideServiceId, setOverrideServiceId] = useState<string | undefined>(undefined);
  const selectedServiceId = overrideServiceId ?? validParamId ?? "signature-cut";
  const selectedService = services.find((s) => s.id === selectedServiceId);

  const [step2Data, setStep2Data] = useState<Step2State | null>(null);
  const [step3Data, setStep3Data] = useState<CustomerDetails | null>(null);
  const [confirmedData, setConfirmedData] = useState<ConfirmedState | null>(null);
  const [step2Notice, setStep2Notice] = useState<Step2Notice>(null);

  // Step 2 data is only trusted for the service it was validated against.
  // After a service change the barber/date are kept, but the time must be re-checked in Step 2.
  const step2Valid = step2Data !== null && step2Data.serviceId === selectedServiceId;

  /* ── Derived display values for BookingSummary ── */
  const barberDisplayName = step2Data
    ? step2Data.barberPreference === "no-preference"
      ? "No preference"
      : getBarberById(step2Data.barberId ?? "")?.name ?? "Barber"
    : undefined;

  const dateDisplayText = step2Data ? formatYmdDate(step2Data.date) : undefined;

  const timeDisplayText =
    step2Data && step2Valid && selectedService
      ? `${formatTimeRange(step2Data.time, selectedService.durationMinutes)} (${selectedService.durationMinutes} min)`
      : undefined;

  // Collapsed mobile summary line, CONTENT: "{Service} · {Short date} · {HH:MM}" (e.g. "Skin Fade · Sat 10 Oct · 14:30").
  const shortDate = step2Data ? formatYmdShort(step2Data.date) : null;
  const summaryLine =
    [selectedService?.name, shortDate, step2Valid ? step2Data?.time : null].filter(Boolean).join(" · ") ||
    "Not selected yet";

  /* ── Step handlers ── */
  const handleStep1Continue = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep2Continue = (data: Omit<Step2State, "serviceId">) => {
    setStep2Data({ ...data, serviceId: selectedServiceId });
    setStep2Notice(null);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep3Continue = (data: CustomerDetails) => {
    setStep3Data(data);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** Send the user back to Step 2 with all details kept; Step 2 refetches availability. */
  const returnToStep2 = (notice: Step2Notice) => {
    setStep2Notice(notice);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const SERVER_ERROR_MESSAGE =
    "We couldn't reach the booking service. Your details are still here. Please try again.";

  const handleStep4Confirm = async () => {
    if (!step2Data || !step3Data) throw new Error("Missing booking data");
    if (!step2Valid) {
      // Service changed after the time was chosen: never submit an unchecked time.
      returnToStep2({ kind: "invalid", time: step2Data.time });
      return;
    }

    let res: Response;
    try {
      res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: selectedServiceId,
        barberPreference: step2Data.barberPreference,
        barberId: step2Data.barberId,
        date: step2Data.date,
        time: step2Data.time,
        customerName: step3Data.fullName,
        customerPhone: step3Data.phone,
        customerEmail: step3Data.email,
        notes: step3Data.notes,
        termsAccepted: true,
      }),
      });
    } catch {
      // Network failure: stay on Review, keep everything, offer retry.
      throw new Error(SERVER_ERROR_MESSAGE);
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        // Slot taken since availability was checked.
        returnToStep2({ kind: "conflict", time: step2Data.time });
        return;
      }
      if (res.status === 400 && data.error === "Booking time validation failed") {
        // e.g. the time has passed or is now inside the 1-hour notice window.
        returnToStep2({ kind: "invalid", time: step2Data.time });
        return;
      }
      throw new Error(SERVER_ERROR_MESSAGE);
    }

    const data = await res.json();
    setConfirmedData({
      reference: data.reference,
      assignedBarberId: data.barber?.id ?? null,
      startTime: data.startTime,
      endTime: data.endTime,
      startAt: data.startAt,
      endAt: data.endAt,
    });
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Edit from step 4 ── */
  const handleEditStep = (step: 1 | 2 | 3) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Step click from stepper (completed steps only) ── */
  const handleStepperClick = (step: number) => {
    if (step < currentStep && currentStep < 5) {
      setCurrentStep(step as 1 | 2 | 3 | 4 | 5);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /* ── Confirmation screen: no sidebar ── */
  if (currentStep === 5 && confirmedData && step2Data && step3Data) {
    return (
      <div className="container py-8 md:py-12">
        <BookingConfirmed
          reference={confirmedData.reference}
          serviceId={selectedServiceId}
          assignedBarberId={confirmedData.assignedBarberId}
          date={step2Data.date}
          startTime={confirmedData.startTime}
          endTime={confirmedData.endTime}
          startAt={confirmedData.startAt}
          endAt={confirmedData.endAt}
          customerName={step3Data.fullName}
          barberPreference={step2Data.barberPreference}
          onBookAnother={() => {
            setConfirmedData(null);
            setStep2Data(null);
            setStep3Data(null);
            setStep2Notice(null);
            setOverrideServiceId(undefined);
            setCurrentStep(1);
            window.scrollTo({ top: 0 });
          }}
        />
      </div>
    );
  }

  const summaryDetails = (
    <BookingSummary
      embedded
      currentStep={currentStep === 5 ? 4 : currentStep}
      selectedServiceId={selectedServiceId}
      barberName={barberDisplayName}
      selectedDateText={dateDisplayText}
      selectedTimeText={timeDisplayText}
      onEditService={() => handleEditStep(1)}
      onEditBarberTime={() => handleEditStep(2)}
    />
  );

  /* ── Steps 1–4: two-column layout ── */
  return (
    <div className="container py-8 md:py-12">
      <BookingStepper
        currentStep={currentStep === 5 ? 4 : currentStep}
        onStepClick={handleStepperClick}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Main content ── */}
        <div className="lg:col-span-8">
          <MobileSummaryContext.Provider value={{ line: summaryLine, details: summaryDetails }}>
          {currentStep === 1 && (
            <ServiceSelection
              selectedServiceId={selectedServiceId}
              onSelectService={(id) => setOverrideServiceId(id)}
              onContinue={handleStep1Continue}
            />
          )}

          {currentStep === 2 && (
            <BarberTimeSelection
              serviceId={selectedServiceId}
              initialBarberId={validParamBarberId}
              initialSelection={step2Data}
              notice={step2Notice}
              onContinue={handleStep2Continue}
              onBack={() => handleEditStep(1)}
            />
          )}

          {currentStep === 3 && (
            <CustomerDetailsForm
              defaultValues={step3Data ?? undefined}
              onContinue={handleStep3Continue}
              onBack={() => handleEditStep(2)}
            />
          )}

          {currentStep === 4 && step2Data && step3Data && (
            <ReviewConfirm
              serviceId={selectedServiceId}
              barberPreference={step2Data.barberPreference}
              barberId={step2Data.barberId}
              date={step2Data.date}
              time={step2Data.time}
              customerName={step3Data.fullName}
              customerPhone={step3Data.phone}
              customerEmail={step3Data.email}
              notes={step3Data.notes}
              onConfirm={handleStep4Confirm}
              onBack={() => handleEditStep(3)}
              onEditStep={handleEditStep}
            />
          )}
          </MobileSummaryContext.Provider>
        </div>

        {/* ── Sidebar ── */}
        <div className="lg:col-span-4 space-y-4">
          <div className="hidden lg:block">
            <BookingSummary
              currentStep={currentStep === 5 ? 4 : currentStep}
              selectedServiceId={selectedServiceId}
              barberName={barberDisplayName}
              selectedDateText={dateDisplayText}
              selectedTimeText={timeDisplayText}
              onEditService={() => handleEditStep(1)}
              onEditBarberTime={() => handleEditStep(2)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page shell ── */
export default function BookPage() {
  return (
    <>
        <BookingHeader />
        <Suspense
          fallback={
            <div className="container py-12 text-center font-body text-[var(--color-text-muted)]">
              Loading booking options…
            </div>
          }
        >
          <BookingFlowContent />
        </Suspense>
    </>
  );
}
