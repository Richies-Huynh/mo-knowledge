import Link from "next/link";
import { Suspense } from "react";
import { fetchKnowledgeBasePayload } from "@/lib/knowledge-base/queries";
import { updateKnowledgeBase } from "../actions";
import { linkClassName } from "../knowledge-base-list";
import { KnowledgeEditor } from "../knowledge-editor";

async function KnowledgeBaseEdit({ searchParams }: Pick<PageProps<"/knowledge/edit">, "searchParams">) {
  const { id } = await searchParams;
  const payload = typeof id === "string" ? await fetchKnowledgeBasePayload(id) : null;

  return (
    <div className="flex w-full flex-col gap-10 text-left">
      <Link
        href={payload ? `/knowledge/view?id=${id}` : "/knowledge"}
        className={`self-start text-sm font-medium ${linkClassName}`}
      >
        ← Back
      </Link>
      {payload && typeof id === "string" ? (
        <KnowledgeEditor payload={payload} action={updateKnowledgeBase.bind(null, id)} />
      ) : (
        <p className="text-base text-zinc-500">Knowledge base not found.</p>
      )}
    </div>
  );
}

export default function KnowledgeEdit({ searchParams }: PageProps<"/knowledge/edit">) {
  return (
    <Suspense>
      <KnowledgeBaseEdit searchParams={searchParams} />
    </Suspense>
  );
}
