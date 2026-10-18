"use client";

import { useFormStatus } from "react-dom";
import type { ActionState } from "./actions";

export const initialState: ActionState = { message: "", error: false };

export const secondaryButtonClassName =
  "self-start rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-600 transition hover:border-accent hover:text-accent";

export function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-w-32 items-center justify-center rounded-full bg-accent px-7 py-3 text-base font-semibold text-white transition hover:scale-[1.03] hover:bg-accent/90 active:scale-95 disabled:scale-100 disabled:opacity-80"
    >
      {pending ? (
        <span
          aria-label={pendingLabel}
          className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
        />
      ) : (
        label
      )}
    </button>
  );
}

export function FormMessage({ state }: { state: ActionState }) {
  return (
    <p
      aria-live="polite"
      className={`text-base ${state.error ? "text-red-600" : "text-zinc-500"}`}
    >
      {state.message}
    </p>
  );
}
