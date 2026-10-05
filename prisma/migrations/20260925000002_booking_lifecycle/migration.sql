-- Migration 2: Booking Lifecycle
-- Add lifecycle fields to Booking table

-- AddColumn
ALTER TABLE "Booking" ADD COLUMN "cancelledAt" TIMESTAMP(3);

-- AddColumn
ALTER TABLE "Booking" ADD COLUMN "cancellationReason" TEXT;

-- AddColumn
ALTER TABLE "Booking" ADD COLUMN "cancellationNote" TEXT;

-- AddColumn
ALTER TABLE "Booking" ADD COLUMN "outcomeAt" TIMESTAMP(3);