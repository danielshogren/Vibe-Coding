import Link from "next/link";
import { getAllProjectItems } from "@/lib/store";
import { ProjectItemForm } from "@/app/components/ProjectItemForm";
import { ProjectItemList } from "@/app/components/ProjectItemList";
import { Calendar } from "@/app/components/Calendar";

/**
 * Single-page MVP: form at top, list of project items grouped by date below,
 * and a monthly calendar at the bottom for date-based filtering via URL search params.
 */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: selectedDate } = await searchParams;

  const allItems = getAllProjectItems();

  // Build counts map for calendar dots
  const itemCountsByDate: Record<string, number> = {};
  for (const item of allItems) {
    itemCountsByDate[item.date] = (itemCountsByDate[item.date] ?? 0) + 1;
  }

  // Filter items when a date is selected
  const items = selectedDate
    ? allItems.filter((item) => item.date === selectedDate)
    : allItems;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Project Tracker</h1>
      <ProjectItemForm />

      {selectedDate && (
        <div className="mt-4 flex items-center gap-3 rounded-md bg-blue-50 border border-blue-200 px-4 py-2 text-sm text-blue-800">
          <span>
            Showing items for <strong>{selectedDate}</strong>
          </span>
          <Link href="/" className="text-blue-600 hover:underline">
            Show all
          </Link>
        </div>
      )}

      <ProjectItemList items={items} />
      <Calendar
        itemCountsByDate={itemCountsByDate}
        selectedDate={selectedDate ?? null}
      />
    </main>
  );
}
