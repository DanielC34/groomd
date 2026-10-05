-- Migration 4: Business Availability
-- Add BusinessHours, SpecialHours, Blockout tables

-- CreateTable
CREATE TABLE "BusinessHours" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "openMinute" INTEGER,
    "closeMinute" INTEGER,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialHours" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "openMinute" INTEGER,
    "closeMinute" INTEGER,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpecialHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blockout" (
    "id" TEXT NOT NULL,
    "barberId" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blockout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessHours_dayOfWeek_key" ON "BusinessHours"("dayOfWeek");

-- CreateIndex
CREATE INDEX "BusinessHours_dayOfWeek_idx" ON "BusinessHours"("dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "SpecialHours_date_key" ON "SpecialHours"("date");

-- CreateIndex
CREATE INDEX "SpecialHours_date_idx" ON "SpecialHours"("date");

-- CreateIndex
CREATE INDEX "Blockout_barberId_startAt_idx" ON "Blockout"("barberId", "startAt");

-- CreateIndex
CREATE INDEX "Blockout_startAt_idx" ON "Blockout"("startAt");

-- AddForeignKey
ALTER TABLE "Blockout" ADD CONSTRAINT "Blockout_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;