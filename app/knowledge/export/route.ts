import type { NextRequest } from "next/server";
import { fetchKnowledgeBasePayload } from "@/lib/knowledge-base/queries";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const payload = id ? await fetchKnowledgeBasePayload(id) : null;
  if (!payload) return Response.json({ error: "Knowledge base not found." }, { status: 404 });

  // Exported without row ids, so the file can be imported again. Indented, since Response.json can't, so it reads well.
  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="knowledge-base-${id}.json"`,
    },
  });
}
