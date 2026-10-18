import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { KnowledgeBaseActions } from "./knowledge-base-actions";

export const linkClassName = "text-accent underline-offset-4 transition hover:underline";

export async function KnowledgeBaseList() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("knowledge_base")
    .select("id, created_at, company_foundation(website)")
    .order("created_at", { ascending: false });
  if (!data?.length) return <p className="text-base text-zinc-500">No knowledge bases yet.</p>;

  return (
    <ul className="flex w-full flex-col gap-3 text-left">
      {data.map(({ id, created_at, company_foundation }) => (
        <li key={id} className="flex items-center justify-between gap-6 border-t border-zinc-200 pt-3">
          <Link href={`/knowledge/view?id=${id}`} className={`break-all text-base font-medium ${linkClassName}`}>
            {company_foundation?.website ?? "Untitled"}
          </Link>
          <div className="flex shrink-0 items-baseline gap-4">
            <span className="text-sm text-zinc-500">{new Date(created_at).toLocaleDateString()}</span>
            <KnowledgeBaseActions id={id} />
          </div>
        </li>
      ))}
    </ul>
  );
}
