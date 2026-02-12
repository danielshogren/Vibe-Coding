"use client";

import { useState, useRef } from "react";
import type { ProjectItem } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { DeleteButton } from "./DeleteButton";
import { EditableField } from "./EditableField";
import { FileLinkButton } from "./FileLinkButton";
import { MediaLinkButton } from "./MediaLinkButton";
import { toggleProjectItemApproved, toggleProjectItemCompleted } from "@/app/actions";
import { playCompleteSound } from "@/app/utils/completeSound";

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
      {items.map((item) => (
        <ProjectCard
          key={item.id}
          item={item}
          selectedDate={selectedDate}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
}

function ProjectCard({
  item,
  selectedDate,
  selectionMode,
  selectedIds,
  onToggleSelect,
}: {
  item: ProjectItem;
  selectedDate?: string | null;
  selectionMode?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
}) {
  const [pulsing, setPulsing] = useState(false);
  const [completePulsing, setCompletePulsing] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const isHighlighted = selectedDate === item.date;
  const isSelected = selectionMode && selectedIds?.has(item.id);
  const isApproved = item.approved;
  const isCompleted = item.completed;

  function handleToggleApproved() {
    if (!isApproved) {
      setPulsing(true);
    }
    toggleProjectItemApproved(item.id);
  }

  function handleToggleCompleted() {
    if (!isCompleted) {
      setCompletePulsing(true);
      playCompleteSound();
    }
    toggleProjectItemCompleted(item.id);
  }

  function handleAnimationEnd() {
    setPulsing(false);
    setCompletePulsing(false);
  }

  // Card border class
  let borderClass: string;
  if (isSelected) {
    borderClass = "border-accent-border ring-2 ring-accent-ring";
  } else if (isCompleted) {
    borderClass = "border-completed-border";
  } else if (isApproved) {
    borderClass = "border-approved-border";
  } else {
    borderClass = "border-edge";
  }

  // Header bg class
  let headerBgClass: string;
  if (isHighlighted) {
    headerBgClass = "bg-highlight";
  } else if (isCompleted) {
    headerBgClass = "bg-completed-elevated";
  } else if (isApproved) {
    headerBgClass = "bg-approved-elevated";
  } else {
    headerBgClass = "bg-surface-elevated";
  }

  // Body bg class
  let bodyBgClass: string;
  if (isHighlighted) {
    bodyBgClass = "bg-highlight-subtle";
  } else if (isCompleted) {
    bodyBgClass = "bg-completed";
  } else if (isApproved) {
    bodyBgClass = "bg-approved";
  } else {
    bodyBgClass = "";
  }

  // Bottom row bg class
  let bottomBgClass: string;
  if (isCompleted) {
    bottomBgClass = "bg-completed-elevated";
  } else if (isApproved) {
    bottomBgClass = "bg-approved-elevated";
  } else {
    bottomBgClass = "bg-surface-elevated";
  }

  // Card animation/glow classes
  let animationClass = "";
  if (completePulsing) {
    animationClass = "animate-complete-pulse";
  } else if (pulsing) {
    animationClass = "animate-approve-pulse";
  } else if (isCompleted) {
    animationClass = "completed-glow";
  }

  return (
    <section
      ref={cardRef}
      className={`bg-surface-card rounded-lg border shadow-sm ${borderClass} ${animationClass}`}
      onClick={selectionMode ? () => onToggleSelect?.(item.id) : undefined}
      style={selectionMode ? { cursor: "pointer" } : undefined}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Header row */}
      <div
        className={`px-4 py-2 ${headerBgClass} border-b border-edge flex items-center justify-between gap-4 rounded-t-lg`}
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
          {!selectionMode && (
            <PriorityBadge itemId={item.id} currentPriority={item.priority} />
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
            <DeleteButton itemId={item.id} />
          </div>
        )}
      </div>

      {/* Body row */}
      <div
        className={`px-4 py-3 flex items-center gap-4 ${bodyBgClass} transition-colors duration-200`}
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
        <MediaLinkButton itemId={item.id} mediaUrl={item.mediaUrl ?? ""} />
      </div>

      {/* Bottom row — complete + approve toggles */}
      <div
        className={`px-4 py-1.5 ${bottomBgClass} border-t border-edge flex items-center justify-between rounded-b-lg`}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleCompleted();
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
            isCompleted
              ? "bg-completed-text/15 text-completed-text scale-110"
              : "bg-surface-hover text-ink-muted hover:text-ink-secondary hover:scale-105 active:scale-95"
          }`}
        >
          {isCompleted ? (
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3.5 8.5 6.5 11.5 12.5 5" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="8" r="5.5" />
            </svg>
          )}
          COMPLETE
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleApproved();
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200 ${
            isApproved
              ? "bg-approved-text/15 text-approved-text"
              : "bg-surface-hover text-ink-muted hover:text-ink-secondary"
          }`}
        >
          {isApproved && (
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3.5 8.5 6.5 11.5 12.5 5" />
            </svg>
          )}
          APPROVED
        </button>
      </div>
    </section>
  );
}
