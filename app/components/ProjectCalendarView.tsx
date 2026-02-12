"use client";

import { useState, useEffect, useTransition } from "react";
import type { ProjectItem } from "@/lib/types";
import { ProjectItemList } from "./ProjectItemList";
import { Calendar } from "./Calendar";
import { ArchivedSection } from "./ArchivedSection";
import { CompletedSection } from "./CompletedSection";
import { archiveProjectItems, deleteProjectItems } from "@/app/actions";

interface ProjectCalendarViewProps {
  items: ProjectItem[];
  itemCountsByDate: Record<string, number>;
  archivedItems: ProjectItem[];
  completedItems: ProjectItem[];
}

export function ProjectCalendarView({ items, itemCountsByDate, archivedItems, completedItems }: ProjectCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  function handleMonthChange(year: number, month: number) {
    setViewYear(year);
    setViewMonth(month);
  }

  // Filter archived items to match the calendar's displayed month
  const filteredArchived = archivedItems.filter((item) => {
    const [y, m] = item.date.split("-").map(Number);
    return y === viewYear && m === viewMonth + 1;
  });

  // Filter completed items to match the calendar's displayed month
  const filteredCompleted = completedItems.filter((item) => {
    const [y, m] = item.date.split("-").map(Number);
    return y === viewYear && m === viewMonth + 1;
  });

  function handleDateSelect(date: string) {
    setSelectedDate((prev) => (prev === date ? null : date));
  }

  function handleToggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleSelectAll() {
    setSelectedIds(new Set(items.map((i) => i.id)));
  }

  function handleDeselectAll() {
    setSelectedIds(new Set());
  }

  function handleCancel() {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }

  // Close delete confirmation on Escape
  useEffect(() => {
    if (!showDeleteConfirm) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowDeleteConfirm(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [showDeleteConfirm]);

  function handleDeleteSelected() {
    if (selectedIds.size === 0) return;
    startTransition(async () => {
      await deleteProjectItems(Array.from(selectedIds));
      setSelectionMode(false);
      setSelectedIds(new Set());
      setShowDeleteConfirm(false);
    });
  }

  function handleArchiveSelected() {
    if (selectedIds.size === 0) return;
    startTransition(async () => {
      await archiveProjectItems(Array.from(selectedIds));
      setSelectionMode(false);
      setSelectedIds(new Set());
    });
  }

  return (
    <div className="flex flex-col lg:flex-row lg:gap-8">
      {/* Left column: list */}
      <div className="flex-1 min-w-0">
        {/* Selection toolbar */}
        <div className="flex items-center gap-2 mb-4">
          {!selectionMode ? (
            <button
              onClick={() => setSelectionMode(true)}
              className="px-3 py-1.5 text-sm font-medium text-ink-secondary bg-surface-card border border-edge rounded-md hover:bg-surface-hover transition-colors"
            >
              Select
            </button>
          ) : (
            <>
              <span className="text-sm text-ink-secondary">
                {selectedIds.size} selected
              </span>
              <button
                onClick={handleSelectAll}
                className="px-2 py-1 text-xs font-medium text-ink-secondary bg-surface-card border border-edge rounded hover:bg-surface-hover transition-colors"
              >
                Select All
              </button>
              <button
                onClick={handleDeselectAll}
                className="px-2 py-1 text-xs font-medium text-ink-secondary bg-surface-card border border-edge rounded hover:bg-surface-hover transition-colors"
              >
                Deselect All
              </button>
              <button
                onClick={handleArchiveSelected}
                disabled={selectedIds.size === 0 || isPending}
                className="px-3 py-1 text-xs font-medium text-white bg-accent rounded hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? "Archiving..." : "Archive Selected"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={selectedIds.size === 0 || isPending}
                className="px-3 py-1 text-xs font-medium text-white bg-danger rounded hover:bg-danger-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Delete Selected
              </button>
              <button
                onClick={handleCancel}
                className="px-2 py-1 text-xs font-medium text-ink-muted hover:text-ink-secondary transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>

        <ProjectItemList
          items={items}
          selectedDate={selectedDate}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
        />
      </div>

      {/* Right column: calendar + archived */}
      <div className="lg:w-80 lg:flex-shrink-0 mt-8 lg:mt-0 lg:sticky lg:top-52 lg:self-start lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto">
        <Calendar
          itemCountsByDate={itemCountsByDate}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          viewYear={viewYear}
          viewMonth={viewMonth}
          onMonthChange={handleMonthChange}
        />
        <CompletedSection items={filteredCompleted} />
        <ArchivedSection items={filteredArchived} />
      </div>
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-surface-card rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 border border-edge"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-danger"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-ink mb-2">
                Delete {selectedIds.size} Project {selectedIds.size === 1 ? "Item" : "Items"}
              </h3>
              <p className="text-sm text-ink-muted mb-6">
                Are you sure you want to delete{" "}
                <strong>{selectedIds.size} {selectedIds.size === 1 ? "item" : "items"}</strong>?
                This will permanently remove {selectedIds.size === 1 ? "it" : "them"} and{" "}
                <strong>cannot be undone</strong>.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-ink-secondary bg-surface-card border border-edge rounded-lg hover:bg-surface-hover transition-colors duration-200"
                >
                  No, Keep {selectedIds.size === 1 ? "It" : "Them"}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  disabled={isPending}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-danger rounded-lg hover:bg-danger-hover disabled:opacity-50 transition-colors duration-200"
                >
                  {isPending ? "Deleting..." : "Yes, Delete All"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
