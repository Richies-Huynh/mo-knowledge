"use client";

import { useActionState } from "react";
import { deleteKnowledgeBase } from "./actions";
import { FormMessage, initialState } from "./form-controls";
import { Icon, iconButtonClassName } from "./icon-button";

export function DeleteButton({ id }: { id: string }) {
  const [state, remove, pending] = useActionState(deleteKnowledgeBase, initialState);

  return (
    <form
      action={() => remove(id)}
      onSubmit={(event) => {
        if (!confirm("Delete this knowledge base? This cannot be undone.")) event.preventDefault();
      }}
      className="flex items-center gap-2"
    >
      <FormMessage state={state} />
      <button
        type="submit"
        disabled={pending}
        aria-label="Delete knowledge base"
        title="Delete knowledge base"
        className={`${iconButtonClassName} hover:bg-red-50 hover:text-red-600`}
      >
        <Icon>
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </Icon>
      </button>
    </form>
  );
}
