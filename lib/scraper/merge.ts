// Uncertainty rules shared by every extractor: a value is only kept when the sources don't contradict each other.

function present<T>(values: (T | null | undefined)[]): Set<T> {
  return new Set(values.filter((value): value is T => value != null));
}

/** The single value every source agrees on, or null when there is none or they conflict. */
export function agree<T>(values: (T | null | undefined)[]): T | null {
  const distinct = present(values);
  return distinct.size === 1 ? [...distinct][0] : null;
}

/** Every distinct value across sources, or null when there are none. */
export function union<T>(values: (T | null | undefined)[]): T[] | null {
  const distinct = present(values);
  return distinct.size > 0 ? [...distinct] : null;
}
