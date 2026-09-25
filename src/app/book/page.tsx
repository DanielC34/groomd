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
} from "@/components/booking";
import { services } from "@/lib/data/services";

function BookingFlowContent() {
  const searchParams = useSearchParams();
  const paramServiceId = searchParams.get("service");
  
  const validParamId = paramServiceId && services.some((s) => s.id === paramServiceId)
    ? paramServiceId
    : undefined;

  const [overrideServiceId, setOverrideServiceId] = useState<string | undefined>(undefined);

  const selectedServiceId = overrideServiceId ?? validParamId ?? "signature-cut";

  const handleSelectService = (id: string) => {
    setOverrideServiceId(id);
  };

  const handleContinue = () => {
    // Step 1 continue handler (Step 2 will connect here in future tasks)
    console.log("Selected service for Step 1:", selectedServiceId);
  };

  return (
    <div className="container py-8 md:py-12">
      <BookingStepper currentStep={1} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Step Content: Step 1 Service Selection */}
        <div className="lg:col-span-8">
          <ServiceSelection
            selectedServiceId={selectedServiceId}
            onSelectService={handleSelectService}
            onContinue={handleContinue}
          />
        </div>

        {/* Sidebar: Summary & Quick Cut Notice */}
        <div className="lg:col-span-4 space-y-4">
          <BookingSummary selectedServiceId={selectedServiceId} />
          <QuickCutNotice />
        </div>
      </div>
    </div>
  );
}

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
