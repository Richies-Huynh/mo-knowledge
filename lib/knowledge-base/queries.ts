import { cleanPayload, type KnowledgeBaseDraft, type KnowledgeBasePayload } from "@/lib/knowledge-base/fields";
import { createClient } from "@/lib/supabase/server";

export async function fetchKnowledgeBase(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("knowledge_base")
    .select(
      "company_foundation(*), positioning(*), market(*), branding(*), online_presence(*), key_person(*), offering(*)",
    )
    .eq("id", id)
    .maybeSingle();
  return data;
}

/** A knowledge base in the shape create_knowledge_base takes, without row ids, or null if it doesn't exist. */
export async function fetchKnowledgeBasePayload(id: string): Promise<KnowledgeBasePayload | null> {
  const data = await fetchKnowledgeBase(id);
  return data && cleanPayload(data as KnowledgeBaseDraft);
}
