import { Suspense } from "react";
import { KnowledgeBaseList } from "./knowledge-base-list";
import { ScrapeForm } from "./scrape-form";

export default function Knowledge() {
  return (
    <div className="flex w-full flex-col items-center gap-14">
      <ScrapeForm />
      <Suspense>
        <KnowledgeBaseList />
      </Suspense>
    </div>
  );
}
