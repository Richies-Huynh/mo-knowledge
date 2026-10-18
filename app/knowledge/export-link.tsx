import { Icon, iconButtonClassName } from "./icon-button";

export function ExportLink({ id }: { id: string }) {
  return (
    <a
      href={`/knowledge/export?id=${id}`}
      download
      aria-label="Export knowledge base as JSON"
      title="Export as JSON"
      className={`${iconButtonClassName} hover:bg-accent/10 hover:text-accent`}
    >
      <Icon>
        <path d="M12 15V3" />
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="m7 10 5 5 5-5" />
      </Icon>
    </a>
  );
}
