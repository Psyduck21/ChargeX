-- SQL Migration: Update booking status constraint to include "rejected"
-- Run this in your Supabase SQL Editor to allow "rejected" status

-- First, drop the existing constraint
ALTER TABLE public.bookings
DROP CONSTRAINT IF EXISTS bookings_status_check;

-- Then, add the updated constraint with "rejected" included
ALTER TABLE public.bookings
ADD CONSTRAINT bookings_status_check
CHECK (status IN ('pending', 'accepted', 'active', 'completed', 'cancelled', 'rejected'));

-- Optional: Update any existing cancelled bookings to rejected if needed
-- UPDATE public.bookings SET status = 'rejected' WHERE status = 'cancelled';
