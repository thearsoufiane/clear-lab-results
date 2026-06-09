-- Adds the one-time-unlock flag used by the paywall.
-- Run this in the Supabase SQL editor (Dashboard → SQL) against the project.
ALTER TABLE reports ADD COLUMN is_paid boolean NOT NULL DEFAULT false;
