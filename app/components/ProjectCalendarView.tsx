"use client";

import { useState, useTransition } from "react";
import type { ProjectItem } from "@/lib/types";
import { ProjectItemList } from "./ProjectItemList";
import { Calendar } from "./Calendar";
import { archiveProjectItems } from "@/app/actions";

interface ProjectCalendarViewProps {
  items: ProjectItem[];
  itemCountsByDate: Record<string, number>;
}

export function ProjectCalendarView({ items, itemCountsByDate }: ProjectCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

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
              className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Select
            </button>
          ) : (
            <>
              <span className="text-sm text-gray-600">
                {selectedIds.size} selected
              </span>
              <button
                onClick={handleSelectAll}
                className="px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={handleDeselectAll}
                className="px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Deselect All
              </button>
              <button
                onClick={handleArchiveSelected}
                disabled={selectedIds.size === 0 || isPending}
                className="px-3 py-1 text-xs font-medium text-white bg-amber-600 rounded hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? "Archiving…" : "Archive Selected"}
              </button>
              <button
                onClick={handleCancel}
                className="px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
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

      {/* Right column: calendar */}
      <div className="lg:w-80 lg:flex-shrink-0 mt-8 lg:mt-0 lg:sticky lg:top-52 lg:self-start">
        <Calendar
          itemCountsByDate={itemCountsByDate}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </div>
    </div>
  );
}
