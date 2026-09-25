"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  BookingHeader,
  BookingStepper,
  ServiceSelection,
  BookingSummary,
  QuickCutNotice,
  BarberTimeSelection,
  CustomerDetailsForm,
  ReviewConfirm,
  BookingConfirmed,
} from "@/components/booking";
import type { CustomerDetails } from "@/components/booking";
import { services } from "@/lib/data/services";
import { getBarberById } from "@/lib/data/barbers";

/* ── Types ── */
interface Step2State {
  barberId: string | null;
  barberPreference: "specific" | "no-preference";
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}

interface ConfirmedState {
  reference: string;
  assignedBarberId: string | null;
  endTime: string;
}

/* ── Helpers ── */
function formatDateLabel(dateStr: string): string {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, mo - 1, d));
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function calcFinishTime(start: string, durationMinutes: number): string {
  const [h, m] = start.split(":").map(Number);
  const total = h * 60 + m + durationMinutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

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

  /* ── Derived display values for BookingSummary ── */
  const barberDisplayName = step2Data
    ? step2Data.barberPreference === "no-preference"
      ? "No preference"
      : getBarberById(step2Data.barberId ?? "")?.name ?? "Barber"
    : undefined;

  const dateDisplayText = step2Data ? formatDateLabel(step2Data.date) : undefined;

  const timeDisplayText =
    step2Data && selectedService
      ? `${step2Data.time} – ${calcFinishTime(step2Data.time, selectedService.durationMinutes)} (${selectedService.durationMinutes} min)`
      : undefined;

  /* ── Step handlers ── */
  const handleStep1Continue = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep2Continue = (data: Step2State) => {
    setStep2Data(data);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep3Continue = (data: CustomerDetails) => {
    setStep3Data(data);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep4Confirm = async () => {
    if (!step2Data || !step3Data) throw new Error("Missing booking data");

    const res = await fetch("/api/bookings", {
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

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        throw new Error(
          data.error ??
            "The selected time is no longer available. Please choose another time."
        );
      }
      throw new Error(data.error ?? "Something went wrong. Please try again.");
    }

    const data = await res.json();
    setConfirmedData({
      reference: data.reference,
      assignedBarberId: data.barber?.id ?? null,
      endTime: data.endTime,
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
          startTime={step2Data.time}
          endTime={confirmedData.endTime}
          customerName={step3Data.fullName}
        />
      </div>
    );
  }

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
        </div>

        {/* ── Sidebar ── */}
        <div className="lg:col-span-4 space-y-4">
          <BookingSummary
            currentStep={currentStep === 5 ? 4 : currentStep}
            selectedServiceId={selectedServiceId}
            barberName={barberDisplayName}
            selectedDateText={dateDisplayText}
            selectedTimeText={timeDisplayText}
            onEditService={() => handleEditStep(1)}
            onEditBarberTime={() => handleEditStep(2)}
          />
          {currentStep === 1 && <QuickCutNotice />}
        </div>
      </div>
    </div>
  );
}

/* ── Page shell ── */
export default function BookPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <Header />
      <main id="main-content" className="flex-1">
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
      </main>
      <Footer />
    </div>
  );
}
