import type { CheerioAPI } from "cheerio";

export type JsonLdNode = Record<string, unknown>;

function isNode(value: unknown): value is JsonLdNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [value];
}

function flatten(value: unknown): JsonLdNode[] {
  if (Array.isArray(value)) return value.flatMap(flatten);
  if (!isNode(value)) return [];
  return value["@graph"] ? flatten(value["@graph"]) : [value];
}

/** Every top-level node from the page's JSON-LD scripts; invalid scripts are skipped. */
export function readJsonLd($: CheerioAPI): JsonLdNode[] {
  return $('script[type="application/ld+json"]')
    .toArray()
    .flatMap((script) => {
      try {
        return flatten(JSON.parse($(script).text()));
      } catch {
        return [];
      }
    });
}

export function nodesOfType(nodes: JsonLdNode[], types: string[]): JsonLdNode[] {
  return nodes.filter((node) => strings(node["@type"]).some((type) => types.includes(type)));
}

/** Nested nodes under a property; a bare string is treated as a node's name. */
export function childNodes(nodes: JsonLdNode[], key: string): JsonLdNode[] {
  return nodes.flatMap((node) =>
    toArray(node[key]).flatMap((child) =>
      typeof child === "string" ? [{ name: child }] : isNode(child) ? [child] : [],
    ),
  );
}

/** The non-empty strings in a value, reading `objectKey` from nested nodes (e.g. a Country's name, an ImageObject's url). */
export function strings(value: unknown, objectKey = "name"): string[] {
  return toArray(value).flatMap((item) => {
    const text = isNode(item) ? item[objectKey] : item;
    return typeof text === "string" && text.trim() ? [text.trim()] : [];
  });
}

export function stringsOf(nodes: JsonLdNode[], key: string, objectKey?: string): string[] {
  return nodes.flatMap((node) => strings(node[key], objectKey));
}
