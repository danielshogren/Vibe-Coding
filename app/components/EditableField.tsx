"use client";

import { useRef, useState, useTransition } from "react";
import { updateProjectItemField } from "@/app/actions";

export function EditableField({
  itemId,
  field,
  value,
  allowEmpty,
  isHighlighted,
  placeholder,
  className,
  emptyClassName,
}: {
  itemId: string;
  field: "title" | "notes";
  value: string;
  allowEmpty: boolean;
  isHighlighted: boolean;
  placeholder?: string;
  className: string;
  emptyClassName?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelledRef = useRef(false);

  function startEditing() {
    setEditValue(value);
    cancelledRef.current = false;
    setIsEditing(true);
    requestAnimationFrame(() => {
      inputRef.current?.select();
    });
  }

  function save() {
    if (cancelledRef.current) return;
    const trimmed = editValue.trim();
    if (!allowEmpty && !trimmed) {
      setEditValue(value);
      setIsEditing(false);
      return;
    }
    setIsEditing(false);
    if (trimmed === value) return;
    startTransition(() => {
      updateProjectItemField(itemId, field, trimmed);
    });
  }

  function cancel() {
    cancelledRef.current = true;
    setEditValue(value);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            save();
          } else if (e.key === "Escape") {
            e.preventDefault();
            cancel();
          }
        }}
        onBlur={save}
        className={`${className} bg-surface-input border border-primary rounded px-1.5 py-0.5 outline-none focus:ring-2 focus:ring-primary`}
        autoFocus
      />
    );
  }

  const isEmpty = !value;
  const displayText = isEmpty ? placeholder : value;
  const displayClass = isEmpty && emptyClassName ? emptyClassName : className;

  return (
    <span
      onClick={startEditing}
      className={`group inline-flex items-center gap-1 cursor-text rounded px-1.5 py-0.5 transition-colors duration-150 ${
        isHighlighted ? "hover:bg-highlight" : "hover:bg-surface-hover"
      } ${isPending ? "opacity-50" : ""}`}
    >
      <span className={displayClass}>{displayText}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-3 h-3 text-ink-faint opacity-0 group-hover:opacity-40 transition-opacity duration-150 flex-shrink-0"
      >
        <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L3.22 10.306a1 1 0 0 0-.26.445l-.813 3.04a.5.5 0 0 0 .608.608l3.04-.813a1 1 0 0 0 .445-.26l7.793-7.793a1.75 1.75 0 0 0 0-2.475l-.544-.545ZM11.72 3.22a.25.25 0 0 1 .354 0l.544.545a.25.25 0 0 1 0 .354L5.126 11.61l-1.907.51.51-1.907L11.72 3.22Z" />
      </svg>
    </span>
  );
}
