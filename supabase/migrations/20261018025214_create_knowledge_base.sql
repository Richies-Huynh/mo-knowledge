create table public.knowledge_base (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

alter table public.knowledge_base enable row level security;

grant select, insert on public.knowledge_base to anon, authenticated;

-- No authentication yet: every visitor can read all rows and add new ones, but not modify or delete them.
create policy "Anyone can view knowledge base rows"
  on public.knowledge_base for select
  to anon, authenticated
  using (true);

create policy "Anyone can add knowledge base rows"
  on public.knowledge_base for insert
  to anon, authenticated
  with check (true);
