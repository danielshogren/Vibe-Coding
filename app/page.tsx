import { getActiveProjectItems, getArchivedProjectItems, getCompletedProjectItems } from "@/lib/store";
import { ProjectItemForm } from "@/app/components/ProjectItemForm";
import { ProjectCalendarView } from "@/app/components/ProjectCalendarView";
import { SettingsButton } from "@/app/components/SettingsButton";
import { EditableTitle } from "@/app/components/EditableTitle";

/**
 * Single-page MVP: form at top, list of project items grouped by date below,
 * and a monthly calendar that highlights matching items when a date is clicked.
 */
export default async function Home() {
  const activeItems = getActiveProjectItems();
  const archivedItems = getArchivedProjectItems();
  const completedItems = getCompletedProjectItems();

  // Build counts map for calendar dots (active items only)
  const itemCountsByDate: Record<string, number> = {};
  for (const item of activeItems) {
    itemCountsByDate[item.date] = (itemCountsByDate[item.date] ?? 0) + 1;
  }

  return (
    <main className="max-w-5xl mx-auto px-6 pt-6 h-screen flex flex-col overflow-hidden">
      {/* Header card — fixed, never scrolls */}
      <div className="bg-surface-card rounded-xl shadow-sm border border-edge p-6 mb-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <EditableTitle />
          <SettingsButton />
        </div>
        <div className="bg-surface rounded-lg p-4">
          <ProjectItemForm />
        </div>
      </div>

      {/* Content — fills remaining height */}
      <div className="flex-1 min-h-0 pb-6">
        <ProjectCalendarView items={activeItems} itemCountsByDate={itemCountsByDate} archivedItems={archivedItems} completedItems={completedItems} />
      </div>
    </main>
  );
}
