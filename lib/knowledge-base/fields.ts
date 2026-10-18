import { union } from "@/lib/scraper/merge";
import type { Database, TablesInsert } from "@/lib/supabase/database.types";

type TableName = keyof Database["public"]["Tables"];
type OneToOneTable = "branding" | "company_foundation" | "market" | "online_presence" | "positioning";
type OneToManyTable = "key_person" | "offering";

/** A profile row as the create_knowledge_base function takes it; the function fills in the ids. */
export type Profile<T extends TableName> = Omit<TablesInsert<T>, "id" | "knowledge_base_id">;

export type KnowledgeBasePayload = { [T in OneToOneTable]: Profile<T> } & { [T in OneToManyTable]: Profile<T>[] };

/** A payload mid-edit: list fields may hold blank lines and text fields blank strings until cleanPayload runs. */
export type FieldValue = string | number | string[] | null | undefined;
export type EditableRecord = Record<string, FieldValue>;
export type KnowledgeBaseDraft = { [T in OneToOneTable]: EditableRecord } & { [T in OneToManyTable]: EditableRecord[] };

export type FieldKind = "text" | "list" | "integer";
type KindOf<V> = NonNullable<V> extends string[] ? "list" : NonNullable<V> extends number ? "integer" : "text";
type FieldKinds<T extends TableName> = { [K in keyof Profile<T>]-?: KindOf<Profile<T>[K]> };

// Checked against the generated database types, so a schema change that isn't reflected here fails to compile.
export const oneToOneFields = {
  company_foundation: {
    company_name: "text",
    overview: "text",
    website: "text",
    business_model: "text",
    company_role: "text",
    year_founded: "integer",
    legal_entity_type: "text",
    main_address: "text",
    service_locations: "list",
    alt_company_names: "list",
  },
  positioning: {
    pitch: "text",
    founding_story: "text",
  },
  market: {
    buyers: "text",
    customer_needs: "text",
    ideal_persona: "text",
    industry_groupings: "text",
    channel: "text",
    funnels: "list",
    suppliers: "list",
  },
  branding: {
    writing_style: "text",
    art_style: "text",
    fonts: "list",
    brand_colors: "list",
    logos: "list",
  },
  online_presence: {
    linked_in: "text",
    facebook: "text",
    instagram: "text",
    twitter: "text",
    other: "list",
  },
} satisfies { [T in OneToOneTable]: FieldKinds<T> };

export const oneToManyFields = {
  key_person: {
    name: "text",
    title: "text",
    role: "text",
    gender: "text",
    description: "text",
  },
  offering: {
    service: "text",
    type: "text",
    feature: "text",
    pricing: "text",
  },
} satisfies { [T in OneToManyTable]: FieldKinds<T> };

function cleanValue(kind: FieldKind, value: FieldValue): FieldValue {
  if (kind === "list") return Array.isArray(value) ? union(value.map((item) => item.trim() || null)) : null;
  if (kind === "integer") return Number.isInteger(value) ? value : null;
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function cleanRecord(kinds: Record<string, FieldKind>, record: EditableRecord | undefined): EditableRecord {
  return Object.fromEntries(Object.entries(kinds).map(([field, kind]) => [field, cleanValue(kind, record?.[field])]));
}

/** Keeps only known fields, blanks out empty values, and drops multi-row entries left entirely blank. */
export function cleanPayload(draft: KnowledgeBaseDraft): KnowledgeBasePayload {
  const oneToOne = Object.entries(oneToOneFields).map(([table, kinds]) => [
    table,
    cleanRecord(kinds, draft[table as OneToOneTable]),
  ]);
  const oneToMany = Object.entries(oneToManyFields).map(([table, kinds]) => [
    table,
    (Array.isArray(draft[table as OneToManyTable]) ? draft[table as OneToManyTable] : [])
      .map((record) => cleanRecord(kinds, record))
      .filter((record) => Object.values(record).some((value) => value !== null)),
  ]);
  return Object.fromEntries([...oneToOne, ...oneToMany]) as KnowledgeBasePayload;
}
