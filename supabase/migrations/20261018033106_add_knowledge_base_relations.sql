-- Each profile table points back to its knowledge_base row. A unique foreign key makes the relation one-to-one; without it, one-to-many.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'branding',
    'company_foundation',
    'market',
    'online_presence',
    'positioning'
  ] loop
    execute format('alter table public.%I add column knowledge_base_id uuid not null unique references public.knowledge_base (id)', table_name);
  end loop;

  foreach table_name in array array[
    'key_person',
    'offering'
  ] loop
    execute format('alter table public.%I add column knowledge_base_id uuid not null references public.knowledge_base (id)', table_name);
  end loop;
end
$$;
