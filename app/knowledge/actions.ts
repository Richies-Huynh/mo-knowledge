"use server";

import { redirect } from "next/navigation";
import { cleanPayload, type KnowledgeBaseDraft, type KnowledgeBasePayload } from "@/lib/knowledge-base/fields";
import { scrapeSite } from "@/lib/scraper/scrape-site";
import { createClient } from "@/lib/supabase/server";

export type ActionState = {
  message: string;
  error: boolean;
};

export type ScrapeState = ActionState & {
  payload?: KnowledgeBasePayload;
};

export async function scrapeUrl(
  prevState: ScrapeState,
  formData: FormData,
): Promise<ScrapeState> {
  const url = String(formData.get("url"));

  try {
    return { message: "Review and edit the details below, then save.", error: false, payload: await scrapeSite(url) };
  } catch (error) {
    // Keep the previous preview so a failed re-scrape doesn't discard the user's edits.
    return {
      message: error instanceof Error ? error.message : `Could not reach ${url}`,
      error: true,
      payload: prevState.payload,
    };
  }
}

export async function saveKnowledgeBase(
  _prevState: ActionState,
  draft: KnowledgeBaseDraft,
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: id, error } = await supabase.rpc("create_knowledge_base", { payload: cleanPayload(draft) });
  if (error) {
    return { message: `Could not save knowledge base: ${error.message}`, error: true };
  }
  redirect(`/knowledge/view?id=${id}`);
}

export async function updateKnowledgeBase(
  id: string,
  _prevState: ActionState,
  draft: KnowledgeBaseDraft,
): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("update_knowledge_base", { kb_id: id, payload: cleanPayload(draft) });
  if (error) {
    return { message: `Could not save knowledge base: ${error.message}`, error: true };
  }
  redirect(`/knowledge/view?id=${id}`);
}

export async function deleteKnowledgeBase(_prevState: ActionState, id: string): Promise<ActionState> {
  const supabase = await createClient();
  // Row-level security filters out rows it won't delete instead of erroring, so check that one was removed.
  const { count, error } = await supabase.from("knowledge_base").delete({ count: "exact" }).eq("id", id);
  if (error || count === 0) {
    return { message: `Could not delete knowledge base${error ? `: ${error.message}` : ""}`, error: true };
  }
  redirect("/knowledge");
}
