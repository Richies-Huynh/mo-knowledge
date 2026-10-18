-- Editing replaces a knowledge base's profile rows, so visitors can now delete them. Still no authentication, so anyone can.
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
    execute format('grant delete on public.%I to anon, authenticated', table_name);
    execute format('create policy "Anyone can delete rows" on public.%I for delete to anon, authenticated using (true)', table_name);
  end loop;
end
$$;

-- Inserts a knowledge base's profile rows from a payload; shared by create_knowledge_base and update_knowledge_base.
create function public.insert_knowledge_base_profiles(kb_id uuid, payload jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
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
    execute format(
      'insert into public.%1$I select (jsonb_populate_record(null::public.%1$I, coalesce($2 -> %2$L, ''{}'') || jsonb_build_object(''id'', gen_random_uuid(), ''knowledge_base_id'', $1))).*',
      table_name,
      table_name
    ) using kb_id, payload;
  end loop;

  foreach table_name in array array[
    'key_person',
    'offering'
  ] loop
    execute format(
      'insert into public.%1$I select (jsonb_populate_record(null::public.%1$I, item || jsonb_build_object(''id'', gen_random_uuid(), ''knowledge_base_id'', $1))).* from jsonb_array_elements(coalesce($2 -> %2$L, ''[]'')) as item',
      table_name,
      table_name
    ) using kb_id, payload;
  end loop;
end
$$;

create or replace function public.create_knowledge_base(payload jsonb)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  kb_id uuid;
begin
  insert into public.knowledge_base default values returning id into kb_id;
  perform public.insert_knowledge_base_profiles(kb_id, payload);
  return kb_id;
end
$$;

-- Replaces all of a knowledge base's profile rows in one transaction, so a failed save never leaves a partial entry.
create function public.update_knowledge_base(kb_id uuid, payload jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  table_name text;
begin
  if not exists (select 1 from public.knowledge_base where id = kb_id) then
    raise exception 'Knowledge base % not found', kb_id using errcode = 'no_data_found';
  end if;

  foreach table_name in array array[
    'branding',
    'company_foundation',
    'key_person',
    'market',
    'offering',
    'online_presence',
    'positioning'
  ] loop
    execute format('delete from public.%I where knowledge_base_id = $1', table_name) using kb_id;
  end loop;

  perform public.insert_knowledge_base_profiles(kb_id, payload);
end
$$;

grant execute on function public.insert_knowledge_base_profiles(uuid, jsonb) to anon, authenticated;
grant execute on function public.update_knowledge_base(uuid, jsonb) to anon, authenticated;
