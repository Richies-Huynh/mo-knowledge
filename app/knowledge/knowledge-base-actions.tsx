import { DeleteButton } from "./delete-button";
import { EditLink } from "./edit-link";
import { ExportLink } from "./export-link";

export function KnowledgeBaseActions({ id }: { id: string }) {
  return (
    <div className="flex items-center gap-1">
      <EditLink id={id} />
      <ExportLink id={id} />
      <DeleteButton id={id} />
    </div>
  );
}
