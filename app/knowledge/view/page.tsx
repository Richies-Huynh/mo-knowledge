import Link from "next/link";
import { Suspense } from "react";
import { fetchKnowledgeBase } from "@/lib/knowledge-base/queries";
import { KnowledgeBaseActions } from "../knowledge-base-actions";
import { linkClassName } from "../knowledge-base-list";
import { formatLabel, ScrollBox, Section } from "../section";

const hiddenFields = new Set(["id", "knowledge_base_id"]);

function formatValue(value: unknown): string {
  if (value == null || (Array.isArray(value) && value.length === 0)) return "—";
  return Array.isArray(value) ? value.join(", ") : String(value);
}

function FieldList({ record }: { record: Record<string, unknown> }) {
  return (
    <dl className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-x-6 gap-y-2 text-sm">
      {Object.entries(record)
        .filter(([field]) => !hiddenFields.has(field))
        .map(([field, value]) => (
          <div key={field} className="contents">
            <dt className="font-medium uppercase text-zinc-500">{formatLabel(field)}</dt>
            <dd className="break-words text-zinc-900">{formatValue(value)}</dd>
          </div>
        ))}
    </dl>
  );
}

async function KnowledgeBaseEntry({ searchParams }: Pick<PageProps<"/knowledge/view">, "searchParams">) {
  const { id } = await searchParams;
  const data = typeof id === "string" ? await fetchKnowledgeBase(id) : null;

  return (
    <div className="flex w-full flex-col gap-10 text-left">
      <div className="flex items-baseline justify-between gap-6">
        <Link href="/knowledge" className={`text-sm font-medium ${linkClassName}`}>
          ← All knowledge
        </Link>
        {data && typeof id === "string" && <KnowledgeBaseActions id={id} />}
      </div>
      {data ? (
        <>
          <h2 className="text-4xl font-semibold tracking-tight text-zinc-900">
            {data.company_foundation?.company_name ?? data.company_foundation?.website ?? "Untitled"}
          </h2>
          {Object.entries(data).map(([table, rows]) => {
            const records = [rows ?? []].flat();
            return (
              <Section key={table} title={table}>
                {records.length === 0 ? (
                  <p className="text-sm text-zinc-500">—</p>
                ) : Array.isArray(rows) ? (
                  <ScrollBox>
                    {records.map((record, index) => (
                      <div key={index} className="py-4">
                        <FieldList record={record} />
                      </div>
                    ))}
                  </ScrollBox>
                ) : (
                  records.map((record, index) => <FieldList key={index} record={record} />)
                )}
              </Section>
            );
          })}
        </>
      ) : (
        <p className="text-base text-zinc-500">Knowledge base not found.</p>
      )}
    </div>
  );
}

export default function KnowledgeView({ searchParams }: PageProps<"/knowledge/view">) {
  return (
    <Suspense>
      <KnowledgeBaseEntry searchParams={searchParams} />
    </Suspense>
  );
}
