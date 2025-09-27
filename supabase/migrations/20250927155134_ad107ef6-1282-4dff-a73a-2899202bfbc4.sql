-- Remove RLS policies that depend on group-related columns
DROP POLICY IF EXISTS "Group members can view shared transactions" ON public.transactions;

-- Add responsible_person column to transactions table
ALTER TABLE public.transactions 
ADD COLUMN responsible_person TEXT;

-- Now we can safely remove the unused columns
ALTER TABLE public.transactions 
DROP COLUMN IF EXISTS is_shared,
DROP COLUMN IF EXISTS group_id;