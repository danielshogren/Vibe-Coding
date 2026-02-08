"use client";

import { useState, useTransition } from "react";
import type { ProjectItem, ProjectItemStatus } from "@/lib/types";
import { unarchiveProjectItem } from "@/app/actions";

const STATUS_COLORS: Record<ProjectItemStatus, string> = {
  backlog: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  stuck: "bg-amber-100 text-amber-700",
  done: "bg-green-100 text-green-700",
};

export function ArchivedSection({ items }: { items: ProjectItem[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mt-4">
      {/* Collapsible header */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors rounded-lg"
      >
        <span className="flex items-center gap-2">
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          Archived
        </span>
        <span className="text-xs text-gray-400">{items.length}</span>
      </button>

      {isOpen && (
        <div className="px-3 pb-3 space-y-2">
          {items.map((item) => (
            <ArchivedCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function ArchivedCard({ item }: { item: ProjectItem }) {
  const [isPending, startTransition] = useTransition();

  function handleRestore() {
    startTransition(async () => {
      await unarchiveProjectItem(item.id);
    });
  }

  // Extract just the day number from the date
  const day = parseInt(item.date.split("-")[2], 10);

  return (
    <div className="bg-gray-50 rounded-md border border-gray-100 px-3 py-2">
      {/* Row 1: title + restore */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-gray-600 truncate">{item.title}</span>
        <button
          onClick={handleRestore}
          disabled={isPending}
          className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-white border border-blue-200 rounded hover:bg-blue-50 disabled:opacity-50 transition-colors shrink-0"
        >
          {isPending ? "Restoring…" : "Restore"}
        </button>
      </div>
      {/* Row 2: status badge + day number */}
      <div className="flex items-center gap-2 mt-1">
        <span
          className={`text-[11px] px-1.5 py-0.5 rounded-full capitalize ${STATUS_COLORS[item.status]}`}
        >
          {item.status.replace("_", " ")}
        </span>
        <span className="text-xs text-gray-400">Day {day}</span>
      </div>
    </div>
  );
}
