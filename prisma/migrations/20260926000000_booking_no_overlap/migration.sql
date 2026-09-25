-- P1-7: database-level protection against double-booking.
--
-- The booking transaction checks availability before inserting, but under PostgreSQL's
-- default READ COMMITTED isolation two simultaneous requests can both pass that check.
-- This exclusion constraint makes PostgreSQL itself reject a second CONFIRMED booking for
-- the same barber whose [startAt, endAt) interval overlaps an existing one.
--
-- * Same barber + overlapping interval  -> rejected (SQLSTATE 23P01, exclusion_violation)
-- * Different barber, same time         -> allowed
-- * Adjacent (one ends when next starts) -> allowed, because the range is half-open '[)'
-- * Different dates                      -> allowed
--
-- btree_gist lets the GiST index compare the TEXT "barberId" with "=".
-- Prisma's schema language cannot express exclusion constraints, so it lives only here.
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Booking"
  ADD CONSTRAINT "Booking_barber_no_overlap"
  EXCLUDE USING gist (
    "barberId" WITH =,
    tsrange("startAt", "endAt", '[)') WITH &&
  )
  WHERE ("status" = 'confirmed');
