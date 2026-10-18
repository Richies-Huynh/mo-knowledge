import type { KnowledgeBasePayload, Profile } from "@/lib/knowledge-base/fields";
import type { Page } from "./fetch-site";
import { childNodes, type JsonLdNode, nodesOfType, readJsonLd, strings, stringsOf } from "./json-ld";
import { agree, union } from "./merge";
import { resolveUrl } from "./url";

// Every field comes from structured markup only (JSON-LD, meta/link tags, hrefs, CSS). Anything uncertain is left null.

type Site = {
  pages: Page[];
  nodes: JsonLdNode[];
  organizations: JsonLdNode[];
};

const organizationTypes = [
  "Organization",
  "Corporation",
  "LocalBusiness",
  "OnlineBusiness",
  "ProfessionalService",
  "NGO",
  "EducationalOrganization",
];
const legalEntityPattern = /\b(Inc|LLC|L\.L\.C|Ltd|Limited|Corp|Corporation|Co|GmbH|AG|PLC|LLP|LP|S\.A|SAS|B\.V|Pty Ltd|Pte Ltd)\.?$/i;
const addressFields = ["streetAddress", "addressLocality", "addressRegion", "postalCode", "addressCountry"];
const genericFonts = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "emoji",
  "math",
  "fangsong",
  "inherit",
  "initial",
  "unset",
  "revert",
  "-apple-system",
  "blinkmacsystemfont",
]);
const shareLinkPattern = /\/(share|sharer|sharing|intent|dialog|plugins)\b/i;
const otherSocialHosts = [
  "youtube.com",
  "tiktok.com",
  "github.com",
  "pinterest.com",
  "threads.net",
  "medium.com",
  "reddit.com",
  "discord.com",
  "discord.gg",
  "bsky.app",
  "vimeo.com",
  "crunchbase.com",
];
const schemaOrgPrefix = /^https?:\/\/schema\.org\//;

function metaContents(pages: Page[], selector: string): string[] {
  return pages.flatMap(({ $ }) =>
    $(selector)
      .toArray()
      .flatMap((meta) => strings($(meta).attr("content"))),
  );
}

function resolveAll(links: string[], base: string): URL[] {
  return links.flatMap((link) => resolveUrl(link, base) ?? []);
}

function groupByName(nodes: JsonLdNode[]): [string, JsonLdNode[]][] {
  const groups = new Map<string, JsonLdNode[]>();
  for (const node of nodes) {
    const name = agree(strings(node.name));
    if (name) groups.set(name, [...(groups.get(name) ?? []), node]);
  }
  return [...groups];
}

function formatAddress(address: JsonLdNode): string | null {
  return addressFields.flatMap((field) => strings(address[field])).join(", ") || agree(strings(address.name));
}

function formatPrice(offer: JsonLdNode): string | null {
  const price = offer.price;
  if (typeof price !== "number" && (typeof price !== "string" || !price.trim())) return null;
  return [String(price).trim(), ...strings(offer.priceCurrency)].join(" ");
}

// Only the first family is the intended font; the rest are system fallbacks. Variable-based stacks are unresolvable here.
function primaryFontFamily(declaration: string): string[] {
  if (declaration.includes("var(")) return [];
  const family = declaration.replace(/!important/i, "").split(",")[0].trim().replace(/^["']|["']$/g, "").trim();
  return family && !genericFonts.has(family.toLowerCase()) ? [family] : [];
}

function pageFonts({ url, $ }: Page): string[] {
  const googleFonts = $('link[href*="fonts.googleapis.com"]')
    .toArray()
    .flatMap((link) => resolveAll(strings($(link).attr("href")), url))
    .flatMap((href) => href.searchParams.getAll("family").flatMap((families) => families.split("|")))
    .map((family) => family.split(":")[0].trim());
  const css = [$("style").text(), ...$("[style]").toArray().map((element) => $(element).attr("style"))].join(";");
  const declaredFonts = [...css.matchAll(/font-family\s*:\s*([^;}]+)/gi)].flatMap((match) => primaryFontFamily(match[1]));
  return [...googleFonts, ...declaredFonts];
}

function pageLogos({ url, $ }: Page): string[] {
  const logos = $("header img, nav img")
    .toArray()
    .filter((image) => /logo/i.test(["src", "alt", "class", "id"].map((attribute) => $(image).attr(attribute) ?? "").join(" ")));
  return resolveAll(logos.flatMap((image) => strings($(image).attr("src"))), url).map((logo) => logo.href);
}

// Normalised so the same profile linked different ways (www., trailing slash, twitter.com vs x.com) doesn't count as a conflict.
function profileHost(url: URL): string {
  return url.hostname.replace(/^www\./, "").replace(/^twitter\.com$/, "x.com");
}

function profileUrl(url: URL): string {
  return `https://${profileHost(url)}${url.pathname.replace(/\/$/, "")}`;
}

function extractCompanyFoundation({ pages: [home], organizations }: Site): Profile<"company_foundation"> {
  const name = agree(stringsOf(organizations, "name"));
  const legalName = agree(stringsOf(organizations, "legalName"));
  const foundingYear = agree(stringsOf(organizations, "foundingDate"))?.match(/^\d{4}/);
  return {
    company_name: name,
    website: new URL(home.url).origin,
    overview:
      agree(stringsOf(organizations, "description")) ??
      agree(metaContents([home], 'meta[name="description"]')) ??
      agree(metaContents([home], 'meta[property="og:description"]')),
    year_founded: foundingYear ? Number(foundingYear[0]) : null,
    legal_entity_type: legalName?.match(legalEntityPattern)?.[1] ?? null,
    main_address: agree(childNodes(organizations, "address").map(formatAddress)),
    service_locations: union(stringsOf(organizations, "areaServed")),
    alt_company_names: union(
      [
        ...stringsOf(organizations, "alternateName"),
        ...stringsOf(organizations, "legalName"),
        ...metaContents([home], 'meta[property="og:site_name"]'),
      ].filter((altName) => altName !== name),
    ),
  };
}

function extractPositioning({ organizations }: Site): Profile<"positioning"> {
  return { pitch: agree(stringsOf(organizations, "slogan")) };
}

function extractBranding({ pages, organizations }: Site): Profile<"branding"> {
  return {
    fonts: union(pages.flatMap(pageFonts)),
    brand_colors: union([
      ...metaContents(pages, 'meta[name="theme-color"]'),
      ...metaContents(pages, 'meta[name="msapplication-TileColor"]'),
    ]),
    logos: union([
      ...resolveAll(stringsOf(organizations, "logo", "url"), pages[0].url).map((logo) => logo.href),
      ...pages.flatMap(pageLogos),
    ]),
  };
}

// Homepage only: subpages like /team link to personal profiles that would conflict with the company's.
function extractOnlinePresence({ pages: [home], organizations }: Site): Profile<"online_presence"> {
  const links = [
    ...home.$("a[href]")
      .toArray()
      .flatMap((anchor) => strings(home.$(anchor).attr("href"))),
    ...stringsOf(organizations, "sameAs"),
  ];
  const profiles = resolveAll(links, home.url).filter(
    (url) => url.pathname.length > 1 && !shareLinkPattern.test(url.pathname),
  );
  const profilesOn = (hosts: string[]) =>
    profiles
      .filter((url) => hosts.some((host) => profileHost(url) === host || profileHost(url).endsWith(`.${host}`)))
      .map(profileUrl);
  return {
    linked_in: agree(profilesOn(["linkedin.com"])),
    facebook: agree(profilesOn(["facebook.com"])),
    instagram: agree(profilesOn(["instagram.com"])),
    twitter: agree(profilesOn(["x.com"])),
    other: union(profilesOn(otherSocialHosts)),
  };
}

function extractKeyPeople({ nodes, organizations }: Site): Profile<"key_person">[] {
  const people = [
    ...nodesOfType(nodes, ["Person"]),
    ...childNodes(organizations, "founder"),
    ...childNodes(organizations, "employee"),
  ];
  return groupByName(people).map(([name, person]) => ({
    name,
    title: agree(stringsOf(person, "jobTitle")),
    gender: agree(stringsOf(person, "gender").map((gender) => gender.replace(schemaOrgPrefix, ""))),
    description: agree(stringsOf(person, "description")),
  }));
}

function extractOfferings({ nodes }: Site): Profile<"offering">[] {
  return groupByName(nodesOfType(nodes, ["Product", "Service"])).map(([name, offering]) => ({
    service: name,
    type: agree(stringsOf(offering, "@type")),
    pricing: agree(childNodes(offering, "offers").map(formatPrice)),
  }));
}

/** Values parsed from structured markup; Claude receives them as high-confidence evidence. */
export function extractStructuredData(pages: Page[]): KnowledgeBasePayload {
  const nodes = pages.flatMap(({ $ }) => readJsonLd($));
  const site: Site = { pages, nodes, organizations: nodesOfType(nodes, organizationTypes) };
  return {
    branding: extractBranding(site),
    company_foundation: extractCompanyFoundation(site),
    market: {},
    online_presence: extractOnlinePresence(site),
    positioning: extractPositioning(site),
    key_person: extractKeyPeople(site),
    offering: extractOfferings(site),
  };
}
