"use client";

import type { ProjectItem } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { DeleteButton } from "./DeleteButton";
import { EditableField } from "./EditableField";
import { FileLinkButton } from "./FileLinkButton";
import { MediaLinkButton } from "./MediaLinkButton";

/**
 * Renders a flat list of project item cards sorted by date.
 * Each card shows the title in the header bar with status/delete,
 * and the due date + notes in the body.
 * When selectedDate matches an item's date, that card is highlighted in pale blue.
 * In selection mode, checkboxes appear for multi-select archiving.
 */
export function ProjectItemList({
  items,
  selectedDate,
  selectionMode,
  selectedIds,
  onToggleSelect,
}: {
  items: ProjectItem[];
  selectedDate?: string | null;
  selectionMode?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <p className="text-ink-muted mt-4 p-4">No project items yet. Add one above.</p>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item) => {
        const isHighlighted = selectedDate === item.date;
        const isSelected = selectionMode && selectedIds?.has(item.id);

        return (
          <section
            key={item.id}
            className={`bg-surface-card rounded-lg border shadow-sm ${
              isSelected ? "border-accent-border ring-2 ring-accent-ring" : "border-edge"
            }`}
            onClick={selectionMode ? () => onToggleSelect?.(item.id) : undefined}
            style={selectionMode ? { cursor: "pointer" } : undefined}
          >
            <div
              className={
                isHighlighted
                  ? "px-4 py-2 bg-highlight border-b border-edge flex items-center justify-between gap-4 rounded-t-lg"
                  : "px-4 py-2 bg-surface-elevated border-b border-edge flex items-center justify-between gap-4 rounded-t-lg"
              }
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {selectionMode && (
                  <input
                    type="checkbox"
                    checked={isSelected ?? false}
                    onChange={() => onToggleSelect?.(item.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded border-edge-strong text-accent focus:ring-accent shrink-0"
                  />
                )}
                <EditableField
                  itemId={item.id}
                  field="title"
                  value={item.title}
                  allowEmpty={false}
                  isHighlighted={isHighlighted}
                  className={isHighlighted ? "font-semibold text-highlight-text" : "font-semibold text-ink-secondary"}
                />
              </div>
              {!selectionMode && (
                <div className="flex items-center gap-1 shrink-0">
                  <StatusBadge itemId={item.id} currentStatus={item.status} />
                  <MediaLinkButton itemId={item.id} mediaUrl={item.mediaUrl ?? ""} />
                  <DeleteButton itemId={item.id} />
                </div>
              )}
            </div>
            <div
              className={
                isHighlighted
                  ? "px-4 py-3 flex items-center gap-4 bg-highlight-subtle transition-colors duration-200"
                  : "px-4 py-3 flex items-center gap-4 transition-colors duration-200"
              }
            >
              <span className={isHighlighted ? "text-sm text-highlight-text shrink-0" : "text-sm text-ink-muted shrink-0"}>
                Due: {item.date}
              </span>
              <EditableField
                itemId={item.id}
                field="notes"
                value={item.notes}
                allowEmpty={true}
                isHighlighted={isHighlighted}
                placeholder="Add notes..."
                className={isHighlighted ? "text-sm text-highlight-muted" : "text-sm text-ink-faint"}
                emptyClassName={isHighlighted ? "text-sm text-highlight-muted italic" : "text-sm text-ink-faint italic"}
              />
              <FileLinkButton itemId={item.id} fileUrl={item.fileUrl ?? ""} />
            </div>
          </section>
        );
      })}
    </div>
  );
}
