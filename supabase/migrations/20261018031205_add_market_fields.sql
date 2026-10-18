alter table public.market
  add column buyers text,
  add column customer_needs text,
  add column ideal_persona text,
  add column industry_groupings text,
  add column channel text,
  add column funnels text[],
  add column suppliers text[];
