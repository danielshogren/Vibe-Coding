"use client";

import { useRef, useState, useEffect, useTransition } from "react";
import { updateProjectItemPriority } from "@/app/actions";
import type { ProjectItemPriority } from "@/lib/types";

const PRIORITY_OPTIONS: { value: ProjectItemPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const PRIORITY_COLORS: Record<ProjectItemPriority, string> = {
  low: "bg-priority-low text-priority-low-text",
  medium: "bg-priority-medium text-priority-medium-text",
  high: "bg-priority-high text-priority-high-text",
  urgent: "bg-priority-urgent text-priority-urgent-text",
};

const PRIORITY_DOT_COLORS: Record<ProjectItemPriority, string> = {
  low: "bg-priority-low-dot",
  medium: "bg-priority-medium-dot",
  high: "bg-priority-high-dot",
  urgent: "bg-priority-urgent-dot",
};

function FireIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

export function PriorityBadge({
  itemId,
  currentPriority,
}: {
  itemId: string;
  currentPriority: ProjectItemPriority;
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

  function handleSelect(priority: ProjectItemPriority) {
    setIsOpen(false);
    if (priority === currentPriority) return;
    startTransition(() => {
      updateProjectItemPriority(itemId, priority);
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        disabled={isPending}
        className={`text-sm px-2 py-1 rounded capitalize cursor-pointer transition-colors duration-200 flex items-center gap-1 ${PRIORITY_COLORS[currentPriority]} ${isPending ? "opacity-50" : "hover:ring-2 hover:ring-offset-1 hover:ring-edge-strong"}`}
      >
        {currentPriority === "urgent" && <FireIcon className="shrink-0" />}
        {currentPriority}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 z-50 w-36 bg-surface-card rounded-sm border border-edge shadow-lg overflow-hidden">
          {PRIORITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-surface-hover transition-colors duration-150 ${opt.value === currentPriority ? "font-semibold" : ""}`}
            >
              {opt.value === "urgent" ? (
                <FireIcon className="shrink-0 text-priority-urgent-dot" />
              ) : (
                <span
                  className={`inline-block w-2 h-2 rounded-full ${PRIORITY_DOT_COLORS[opt.value]}`}
                />
              )}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
