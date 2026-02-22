import { getActiveProjectItems, getArchivedProjectItems, getCompletedProjectItems } from "@/lib/store";
import { PageClient } from "@/app/components/PageClient";

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
    <main className="h-screen overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6">
        <PageClient
          items={activeItems}
          itemCountsByDate={itemCountsByDate}
          archivedItems={archivedItems}
          completedItems={completedItems}
        />
      </div>
    </main>
  );
}
