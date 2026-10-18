import type { KnowledgeBasePayload } from "@/lib/knowledge-base/fields";
import { extractWithClaude } from "./ai-extract";
import { extractStructuredData } from "./extract";
import { fetchSite } from "./fetch-site";

/** Crawls the site at `url` and extracts its knowledge base with Claude. */
export async function scrapeSite(url: string): Promise<KnowledgeBasePayload> {
  const pages = await fetchSite(url);
  return extractWithClaude(pages, extractStructuredData(pages));
}
