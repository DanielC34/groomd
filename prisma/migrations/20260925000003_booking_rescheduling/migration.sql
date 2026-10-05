-- Migration 3: Booking Rescheduling
-- Add self-referencing relation for reschedule chain

-- AddColumn
ALTER TABLE "Booking" ADD COLUMN "rescheduledFromBookingId" TEXT;

-- CreateIndex
CREATE INDEX "Booking_rescheduledFromBookingId_idx" ON "Booking"("rescheduledFromBookingId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_rescheduledFromBookingId_fkey" FOREIGN KEY ("rescheduledFromBookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;