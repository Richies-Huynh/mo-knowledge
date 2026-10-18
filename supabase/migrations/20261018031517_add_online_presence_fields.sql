alter table public.online_presence
  add column linked_in text,
  add column facebook text,
  add column instagram text,
  add column twitter text,
  add column other text[];
