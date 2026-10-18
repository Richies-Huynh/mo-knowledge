/** Resolves a possibly relative link against the page it appeared on, or null when it isn't a valid http(s) URL. */
export function resolveUrl(link: string, base: string): URL | null {
  try {
    const url = new URL(link, base);
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}
