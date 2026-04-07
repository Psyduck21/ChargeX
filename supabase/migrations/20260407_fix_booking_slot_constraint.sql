-- Fix booking slot constraint to allow multiple time-based bookings on same slot
-- This migration removes the incorrect unique constraint and adds a proper composite constraint

-- Drop the problematic unique constraint if it exists
ALTER TABLE IF EXISTS public.bookings 
DROP CONSTRAINT IF EXISTS bookings_slot_id_key;

-- Add composite unique constraint for (slot_id, start_time, end_time)
-- This allows multiple bookings on the same slot at different times
ALTER TABLE public.bookings
ADD CONSTRAINT bookings_slot_time_composite_key UNIQUE (slot, start_time, end_time);
