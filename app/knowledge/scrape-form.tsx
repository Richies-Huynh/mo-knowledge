"use client";

import { useActionState } from "react";
import { saveKnowledgeBase, scrapeUrl } from "./actions";
import { FormMessage, initialState, SubmitButton } from "./form-controls";
import { KnowledgeEditor } from "./knowledge-editor";

export function ScrapeForm() {
  const [state, formAction] = useActionState(scrapeUrl, initialState);

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <form action={formAction} className="flex w-full flex-col items-center gap-5">
        <label htmlFor="url" className="sr-only">
          URL
        </label>
        <div className="flex w-full items-center gap-2 rounded-full border border-white/60 bg-white/70 p-2 ring-1 ring-zinc-900/5 backdrop-blur-xl transition focus-within:ring-2 focus-within:ring-accent/40">
          <input
            id="url"
            name="url"
            type="url"
            required
            placeholder="https://example.com"
            className="min-w-0 flex-1 bg-transparent px-5 py-3 text-lg text-zinc-900 outline-none placeholder:text-zinc-400"
          />
          <SubmitButton label="Scrape" pendingLabel="Scraping" />
        </div>
        <FormMessage state={state} />
      </form>
      {state.payload && <KnowledgeEditor payload={state.payload} action={saveKnowledgeBase} />}
    </div>
  );
}
