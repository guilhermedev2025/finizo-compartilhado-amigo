-- Fix the infinite recursion in groups RLS policy
DROP POLICY IF EXISTS "Users can view groups they belong to" ON public.groups;

CREATE POLICY "Users can view groups they belong to" ON public.groups
FOR SELECT USING (
  (auth.uid() = owner_id) OR 
  (EXISTS (
    SELECT 1 FROM user_groups 
    WHERE user_groups.user_id = auth.uid() 
    AND user_groups.group_id = groups.id
  ))
);

-- Add foreign key constraints for better data integrity
ALTER TABLE public.credit_cards 
ADD CONSTRAINT fk_credit_cards_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.transactions 
ADD CONSTRAINT fk_transactions_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.transactions 
ADD CONSTRAINT fk_transactions_credit_card_id 
FOREIGN KEY (credit_card_id) REFERENCES public.credit_cards(id) ON DELETE SET NULL;

ALTER TABLE public.transactions 
ADD CONSTRAINT fk_transactions_group_id 
FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE SET NULL;

ALTER TABLE public.groups 
ADD CONSTRAINT fk_groups_owner_id 
FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_groups 
ADD CONSTRAINT fk_user_groups_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_groups 
ADD CONSTRAINT fk_user_groups_group_id 
FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;

ALTER TABLE public.notifications 
ADD CONSTRAINT fk_notifications_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_credit_cards_user_id ON public.credit_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_cards_active ON public.credit_cards(user_id, is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_group_id ON public.transactions(group_id) WHERE group_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_groups_owner_id ON public.groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_user_groups_user_id ON public.user_groups(user_id);
CREATE INDEX IF NOT EXISTS idx_user_groups_group_id ON public.user_groups(group_id);
CREATE INDEX IF NOT EXISTS idx_user_groups_user_group ON public.user_groups(user_id, group_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = false;