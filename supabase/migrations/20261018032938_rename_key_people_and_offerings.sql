alter table public.key_people rename to key_person;
alter index public.key_people_pkey rename to key_person_pkey;

alter table public.offerings rename to offering;
alter index public.offerings_pkey rename to offering_pkey;
