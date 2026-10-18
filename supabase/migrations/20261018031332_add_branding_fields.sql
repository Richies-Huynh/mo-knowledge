alter table public.branding
  add column writing_style text,
  add column art_style text,
  add column fonts text[],
  add column brand_colors text[],
  add column logos text[];
