"use client";

import { useRef, useState, useEffect, useTransition } from "react";
import { updateProjectItemStatus } from "@/app/actions";
import type { ProjectItemStatus } from "@/lib/types";

const STATUS_OPTIONS: { value: ProjectItemStatus; label: string }[] = [
  { value: "backlog", label: "Backlog" },
  { value: "in_progress", label: "In Progress" },
  { value: "stuck", label: "Stuck" },
  { value: "done", label: "Done" },
];

const STATUS_COLORS: Record<ProjectItemStatus, string> = {
  backlog: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  stuck: "bg-amber-100 text-amber-700",
  done: "bg-green-100 text-green-700",
};

export function StatusBadge({
  itemId,
  currentStatus,
}: {
  itemId: string;
  currentStatus: ProjectItemStatus;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  function handleSelect(status: ProjectItemStatus) {
    setIsOpen(false);
    if (status === currentStatus) return;
    startTransition(() => {
      updateProjectItemStatus(itemId, status);
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        disabled={isPending}
        className={`text-sm px-2 py-1 rounded-full capitalize cursor-pointer transition-colors duration-200 ${STATUS_COLORS[currentStatus]} ${isPending ? "opacity-50" : "hover:ring-2 hover:ring-offset-1 hover:ring-gray-300"}`}
      >
        {currentStatus.replace("_", " ")}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-50 w-36 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors duration-150 ${opt.value === currentStatus ? "font-semibold" : ""}`}
            >
              <span
                className={`inline-block w-2 h-2 rounded-full ${STATUS_COLORS[opt.value].split(" ")[0].replace("100", "400")}`}
              />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
