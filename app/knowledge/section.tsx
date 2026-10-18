export function formatLabel(field: string): string {
  return field.replaceAll("_", " ");
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-zinc-200 pt-6">
      <h2 className="text-xl font-semibold uppercase tracking-tight text-accent">{formatLabel(title)}</h2>
      {children}
    </section>
  );
}

/** Multi-row tables can grow long, so their rows scroll within a fixed height. Each row brings its own vertical padding. */
export function ScrollBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-h-96 flex-col divide-y divide-zinc-200 overflow-y-auto rounded-2xl border border-zinc-200 px-4">
      {children}
    </div>
  );
}
