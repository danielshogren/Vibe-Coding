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
    <div className="mt-8">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        Archived ({items.length})
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3">
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

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 opacity-75">
      <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 flex items-center justify-between gap-4 rounded-t-lg">
        <span className="font-semibold text-gray-500 truncate">{item.title}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-xs px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[item.status]}`}
          >
            {item.status.replace("_", " ")}
          </span>
          <button
            onClick={handleRestore}
            disabled={isPending}
            className="px-2 py-1 text-xs font-medium text-blue-600 bg-white border border-blue-200 rounded hover:bg-blue-50 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Restoring…" : "Restore"}
          </button>
        </div>
      </div>
      <div className="px-4 py-2 flex items-center gap-4">
        <span className="text-sm text-gray-400 shrink-0">Due: {item.date}</span>
        {item.notes && (
          <span className="text-sm text-gray-400 truncate">{item.notes}</span>
        )}
      </div>
    </div>
  );
}
