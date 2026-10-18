"use client";

import { useActionState, useState } from "react";
import {
  type EditableRecord,
  type FieldKind,
  type FieldValue,
  type KnowledgeBaseDraft,
  type KnowledgeBasePayload,
  oneToManyFields,
  oneToOneFields,
} from "@/lib/knowledge-base/fields";
import type { ActionState } from "./actions";
import { FormMessage, initialState, secondaryButtonClassName, SubmitButton } from "./form-controls";
import { formatLabel, ScrollBox, Section } from "./section";

type OneToOneTable = keyof typeof oneToOneFields;
type OneToManyTable = keyof typeof oneToManyFields;

const inputClassName =
  "field-sizing-content min-h-10 w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:ring-2 focus:ring-accent/40";

function FieldInput({
  kind,
  value,
  onChange,
}: {
  kind: FieldKind;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
}) {
  if (kind === "integer") {
    return (
      <input
        type="number"
        step={1}
        value={value ?? ""}
        placeholder="Unknown"
        onChange={(event) => onChange(event.target.value === "" ? null : Number(event.target.value))}
        className={inputClassName}
      />
    );
  }
  return (
    <textarea
      rows={1}
      value={Array.isArray(value) ? value.join("\n") : (value ?? "")}
      placeholder={kind === "list" ? "Unknown (one per line)" : "Unknown"}
      onChange={(event) => onChange(kind === "list" ? event.target.value.split("\n") : event.target.value)}
      className={inputClassName}
    />
  );
}

function FieldInputs({
  kinds,
  record,
  onChange,
}: {
  kinds: Record<string, FieldKind>;
  record: EditableRecord;
  onChange: (field: string, value: FieldValue) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {Object.entries(kinds).map(([field, kind]) => (
        <label key={field} className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium uppercase text-zinc-500">{formatLabel(field)}</span>
          <FieldInput kind={kind} value={record[field]} onChange={(value) => onChange(field, value)} />
        </label>
      ))}
    </div>
  );
}

export function KnowledgeEditor({
  payload,
  action,
}: {
  payload: KnowledgeBasePayload;
  action: (prevState: ActionState, draft: KnowledgeBaseDraft) => Promise<ActionState>;
}) {
  const [draft, setDraft] = useState<KnowledgeBaseDraft>(payload);
  const [state, save] = useActionState(action, initialState);

  // A new scrape replaces the draft; a failed re-scrape passes back the same payload, so edits survive.
  const [previousPayload, setPreviousPayload] = useState(payload);
  if (payload !== previousPayload) {
    setPreviousPayload(payload);
    setDraft(payload);
  }

  function updateField(table: OneToOneTable, field: string, value: FieldValue) {
    setDraft((current) => ({ ...current, [table]: { ...current[table], [field]: value } }));
  }

  function updateRows(table: OneToManyTable, update: (rows: EditableRecord[]) => EditableRecord[]) {
    setDraft((current) => ({ ...current, [table]: update(current[table]) }));
  }

  return (
    <form action={() => save(draft)} className="flex w-full flex-col gap-10 text-left">
      {(Object.keys(oneToOneFields) as OneToOneTable[]).map((table) => (
        <Section key={table} title={table}>
          <FieldInputs
            kinds={oneToOneFields[table]}
            record={draft[table]}
            onChange={(field, value) => updateField(table, field, value)}
          />
        </Section>
      ))}
      {(Object.keys(oneToManyFields) as OneToManyTable[]).map((table) => (
        <Section key={table} title={table}>
          {draft[table].length > 0 && (
            <ScrollBox>
              {draft[table].map((record, index) => (
                <div key={index} className="flex flex-col gap-4 py-4">
                  <FieldInputs
                    kinds={oneToManyFields[table]}
                    record={record}
                    onChange={(field, value) =>
                      updateRows(table, (rows) => rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => updateRows(table, (rows) => rows.filter((_, i) => i !== index))}
                    className={secondaryButtonClassName}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </ScrollBox>
          )}
          <button
            type="button"
            onClick={() => updateRows(table, (rows) => [...rows, {}])}
            className={secondaryButtonClassName}
          >
            Add {formatLabel(table)}
          </button>
        </Section>
      ))}
      <div className="flex flex-col items-center gap-5">
        <SubmitButton label="Save" pendingLabel="Saving" />
        <FormMessage state={state} />
      </div>
    </form>
  );
}
