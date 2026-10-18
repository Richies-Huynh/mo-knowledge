import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import {
  cleanPayload,
  type FieldKind,
  type KnowledgeBasePayload,
  oneToManyFields,
  oneToOneFields,
} from "@/lib/knowledge-base/fields";
import type { Page } from "./fetch-site";

const kindSchemas = {
  text: z.string().nullable(),
  list: z.array(z.string()).nullable(),
  integer: z.number().int().nullable(),
} satisfies Record<FieldKind, z.ZodType>;

function recordSchema(kinds: Record<string, FieldKind>) {
  return z.object(Object.fromEntries(Object.entries(kinds).map(([field, kind]) => [field, kindSchemas[kind]])));
}

// Built from the same field list as the editor, so the output always matches the database columns.
const payloadSchema = z.object({
  ...Object.fromEntries(Object.entries(oneToOneFields).map(([table, kinds]) => [table, recordSchema(kinds)])),
  ...Object.fromEntries(Object.entries(oneToManyFields).map(([table, kinds]) => [table, z.array(recordSchema(kinds))])),
});

const systemPrompt = `You build a company knowledge base from the content of the company's own website.

Rules:
- Record only what the website states or what is directly evident from it. Never guess, and never fill a field from general knowledge about the company.
- If the content doesn't support a field, or you are unsure, use null. Use null rather than an empty list. If no people or offerings are described, return empty arrays for key_person and offering.
- The structured data was parsed from the site's HTML (JSON-LD, meta tags, links, CSS). Treat it as reliable: keep those values unless the page content clearly contradicts them. Only output URLs (website, social profiles, logos) that appear in the structured data or the page content.
- Write descriptive fields in a concise, neutral voice, 1-3 sentences.

Field guide:
company_foundation
- company_name: the name the company goes by.
- overview: what the company does.
- business_model: how it makes money (e.g. SaaS subscription, marketplace commission, retail sales).
- company_role: its position in its value chain (e.g. manufacturer, retailer, agency, platform).
- legal_entity_type: e.g. Inc, LLC, Ltd.
- main_address: headquarters or primary address.
- service_locations: countries, regions or cities it serves.
- alt_company_names: other names, legal names or former names.
positioning
- pitch: its one-line value proposition.
- founding_story: how and why it was founded.
market
- buyers: who purchases its offerings.
- customer_needs: the problems customers come to it to solve.
- ideal_persona: its ideal customer profile.
- industry_groupings: industries or verticals it serves.
- channel: how it reaches and sells to customers (e.g. direct sales, self-serve online, resellers).
- funnels: acquisition or conversion paths visible on the site (e.g. free trial, demo request, newsletter signup).
- suppliers: named suppliers or partners it depends on to deliver its offerings.
branding
- writing_style: the tone and voice of the site's copy; you may characterize this from the copy itself.
- art_style: visual style, only if the content describes it (you cannot see the visuals).
- fonts, brand_colors, logos: take these from the structured data.
online_presence
- linked_in, facebook, instagram, twitter: the company's own profile URLs.
- other: the company's other social or profile URLs.
key_person (one entry per person named on the site)
- name, title: as stated.
- role: their function, e.g. founder, leadership, advisor.
- gender: only if the site makes it explicit, such as pronouns in their bio. Never infer it from a name or photo.
- description: a short bio.
offering (one entry per product, service or plan)
- service: its name.
- type: e.g. product, service, plan.
- feature: its key features.
- pricing: as stated on the site.`;

const blockElements = "address, article, aside, blockquote, br, dd, div, dl, dt, footer, form, h1, h2, h3, h4, h5, h6, header, hr, li, main, nav, ol, p, section, table, tr, ul";

/** The page's readable text, without scripts, styles or markup. */
function pageText({ url, $ }: Page): string {
  const body = $("body").clone();
  body.find("script, style, noscript, svg, template, iframe").remove();
  // .text() joins sibling elements with no separator, so give blocks a line break and everything else a space.
  body.find(blockElements).after("\n");
  body.find(`*:not(${blockElements})`).after(" ");
  const text = body
    .text()
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
  return `<page url="${url}">\n${text}\n</page>`;
}

/** Fills every knowledge base field from the site's content, using the parsed structured data as evidence. */
export async function extractWithClaude(
  pages: Page[],
  structuredData: KnowledgeBasePayload,
): Promise<KnowledgeBasePayload> {
  const client = new Anthropic();
  const response = await client.beta.messages.parse({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    output_config: { effort: "medium", format: betaZodOutputFormat(payloadSchema) },
    // If the model declines for policy reasons, the API retries on its default fallback model.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: [
          `Website: ${pages[0].url}`,
          `<structured_data>\n${JSON.stringify(structuredData, null, 2)}\n</structured_data>`,
          ...pages.map(pageText),
          "Extract the knowledge base for this company.",
        ].join("\n\n"),
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("Claude declined to extract this site.");
  }
  if (!response.parsed_output) {
    throw new Error(`AI extraction returned no usable result (stop reason: ${response.stop_reason}).`);
  }
  return cleanPayload(response.parsed_output as KnowledgeBasePayload);
}
