-- Same access model as knowledge_base: no authentication yet, so every visitor can read all rows and add new ones, but not modify or delete them.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'company_foundation',
    'positioning',
    'market',
    'branding',
    'online_presence',
    'key_people',
    'offerings'
  ] loop
    execute format('create table public.%I (id uuid primary key default gen_random_uuid())', table_name);
    execute format('alter table public.%I enable row level security', table_name);
    execute format('grant select, insert on public.%I to anon, authenticated', table_name);
    execute format('create policy "Anyone can view rows" on public.%I for select to anon, authenticated using (true)', table_name);
    execute format('create policy "Anyone can add rows" on public.%I for insert to anon, authenticated with check (true)', table_name);
  end loop;
end
$$;
