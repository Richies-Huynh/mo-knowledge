alter table public.company_foundation
  add column overview text,
  add column website text,
  add column business_model text,
  add column company_role text,
  add column year_founded integer,
  add column legal_entity_type text,
  add column main_address text,
  add column service_locations text[],
  add column alt_company_names text[];
