"use client";

import { useState } from "react";
import type { ProjectItem } from "@/lib/types";
import { ProjectItemList } from "./ProjectItemList";
import { Calendar } from "./Calendar";

interface ProjectCalendarViewProps {
  items: ProjectItem[];
  itemCountsByDate: Record<string, number>;
}

export function ProjectCalendarView({ items, itemCountsByDate }: ProjectCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  function handleDateSelect(date: string) {
    setSelectedDate((prev) => (prev === date ? null : date));
  }

  return (
    <div className="flex flex-col lg:flex-row lg:gap-8">
      {/* Left column: list */}
      <div className="flex-1 min-w-0">
        <ProjectItemList items={items} selectedDate={selectedDate} />
      </div>

      {/* Right column: calendar */}
      <div className="lg:w-80 lg:flex-shrink-0 mt-8 lg:mt-0">
        <Calendar
          itemCountsByDate={itemCountsByDate}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </div>
    </div>
  );
}
