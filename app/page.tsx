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
    <main className="max-w-5xl mx-auto">
      {/* Sticky header: frosted glass + shadow */}
      <div className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md shadow-md px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <EditableTitle />
          <SettingsButton />
        </div>
        <ProjectItemForm />
      </div>

      {/* Scrollable content below */}
      <div className="px-6 pb-6 pt-6">
        <ProjectCalendarView items={activeItems} itemCountsByDate={itemCountsByDate} archivedItems={archivedItems} completedItems={completedItems} />
      </div>
    </main>
  );
}
