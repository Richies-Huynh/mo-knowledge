-- Deleting a knowledge_base row removes all of its profile rows. Still no authentication, so every visitor can delete.
-- The cascade runs as a referential action, so the profile tables need no delete grant or policy of their own.
grant delete on public.knowledge_base to anon, authenticated;

create policy "Anyone can delete knowledge base rows"
  on public.knowledge_base for delete
  to anon, authenticated
  using (true);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'branding',
    'company_foundation',
    'key_person',
    'market',
    'offering',
    'online_presence',
    'positioning'
  ] loop
    execute format('alter table public.%1$I drop constraint %1$I_knowledge_base_id_fkey', table_name);
    execute format('alter table public.%1$I add constraint %1$I_knowledge_base_id_fkey foreign key (knowledge_base_id) references public.knowledge_base (id) on delete cascade', table_name);
  end loop;
end
$$;
