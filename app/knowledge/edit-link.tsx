import Link from "next/link";
import { Icon, iconButtonClassName } from "./icon-button";

export function EditLink({ id }: { id: string }) {
  return (
    <Link
      href={`/knowledge/edit?id=${id}`}
      aria-label="Edit knowledge base"
      title="Edit"
      className={`${iconButtonClassName} hover:bg-accent/10 hover:text-accent`}
    >
      <Icon>
        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
        <path d="m15 5 4 4" />
      </Icon>
    </Link>
  );
}
