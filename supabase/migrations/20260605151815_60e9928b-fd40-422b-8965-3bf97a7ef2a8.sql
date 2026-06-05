
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email_address text NOT NULL,
  phone_number text NOT NULL,
  company_name text NOT NULL,
  notes text NOT NULL DEFAULT '',
  recaptcha_score numeric,
  email_sent boolean NOT NULL DEFAULT false,
  email_error text,
  user_agent text,
  ip text
);

GRANT ALL ON public.contact_submissions TO service_role;

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
