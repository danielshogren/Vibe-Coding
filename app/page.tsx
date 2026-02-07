import { getAllProjectItems } from "@/lib/store";
import { ProjectItemForm } from "@/app/components/ProjectItemForm";
import { ProjectCalendarView } from "@/app/components/ProjectCalendarView";

/**
 * Single-page MVP: form at top, list of project items grouped by date below,
 * and a monthly calendar that highlights matching items when a date is clicked.
 */
export default async function Home() {
  const allItems = getAllProjectItems();

  // Build counts map for calendar dots
  const itemCountsByDate: Record<string, number> = {};
  for (const item of allItems) {
    itemCountsByDate[item.date] = (itemCountsByDate[item.date] ?? 0) + 1;
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Project Tracker</h1>
      <ProjectItemForm />
      <ProjectCalendarView items={allItems} itemCountsByDate={itemCountsByDate} />
    </main>
  );
}
