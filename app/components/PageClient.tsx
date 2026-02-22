"use client";

import { useState } from "react";
import { ProjectItemForm } from "./ProjectItemForm";
import { ProjectCalendarView } from "./ProjectCalendarView";
import { EditableTitle } from "./EditableTitle";
import { SettingsButton } from "./SettingsButton";
import type { ProjectItem } from "@/lib/types";

interface PageClientProps {
  items: ProjectItem[];
  itemCountsByDate: Record<string, number>;
  archivedItems: ProjectItem[];
  completedItems: ProjectItem[];
}

export function PageClient({ items, itemCountsByDate, archivedItems, completedItems }: PageClientProps) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const [formDate, setFormDate] = useState(todayStr);

  return (
    <>
      <div className="sticky top-0 z-30 bg-surface pt-6 pb-6" data-header>
        <div className="bg-surface-card rounded-sm shadow-sm border border-edge p-6">
          <div className="flex items-center justify-between mb-4">
            <EditableTitle />
            <SettingsButton />
          </div>
          <div className="bg-surface rounded-sm p-4">
            <ProjectItemForm formDate={formDate} />
          </div>
        </div>
      </div>
      <div className="pb-6">
        <ProjectCalendarView
          items={items}
          itemCountsByDate={itemCountsByDate}
          archivedItems={archivedItems}
          completedItems={completedItems}
          onFutureDateSelect={setFormDate}
        />
      </div>
    </>
  );
}
