import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import { resolveUrl } from "./url";

export type Page = {
  url: string;
  $: CheerioAPI;
};

const subpagePattern = /about|team|leadership|company|our-story|pricing|services|products|contact/i;
const maxSubpages = 5;

async function fetchPage(url: string): Promise<Page> {
  let response: Response;
  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36",
      },
    });
  } catch {
    throw new Error(`Could not reach ${url}`);
  }
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return { url: response.url, $: cheerio.load(await response.text()) };
}

function findSubpages({ url, $ }: Page): string[] {
  const subpages = new Set<string>();
  $("a[href]").each((_, anchor) => {
    const link = resolveUrl($(anchor).attr("href")!, url);
    if (!link || link.origin !== new URL(url).origin || !subpagePattern.test(link.pathname)) return;
    link.hash = "";
    if (link.href !== url) subpages.add(link.href);
  });
  return [...subpages].slice(0, maxSubpages);
}

/** The given page first, followed by whichever key subpages loaded. */
export async function fetchSite(url: string): Promise<Page[]> {
  const home = await fetchPage(url);
  const subpages = await Promise.allSettled(findSubpages(home).map(fetchPage));
  return [
    home,
    ...subpages.flatMap((result) => (result.status === "fulfilled" ? [result.value] : [])),
  ];
}
