-- Creates a knowledge_base row and all of its profile rows in one transaction, so a failed insert never leaves a partial entry.
-- Runs as the caller (security invoker), so the existing insert-only policies still apply.
create function public.create_knowledge_base(payload jsonb)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  kb_id uuid;
  table_name text;
begin
  insert into public.knowledge_base default values returning id into kb_id;

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

  return kb_id;
end
$$;

-- Same access model as the tables: no authentication yet, so every visitor can create entries.
grant execute on function public.create_knowledge_base(jsonb) to anon, authenticated;
