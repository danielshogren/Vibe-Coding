import type { ProjectItem } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

/**
 * Groups project items by due date and renders a simple list.
 * Each group shows the due date (YYYY-MM-DD) as a heading, then each item's title + status.
 * When selectedDate matches a group's date, that group is highlighted in pale blue.
 */
export function ProjectItemList({
  items,
  selectedDate,
}: {
  items: ProjectItem[];
  selectedDate?: string | null;
}) {
  // Group by date (items are already sorted by date from the store)
  const byDate = items.reduce<Record<string, ProjectItem[]>>((acc, item) => {
    const d = item.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(item);
    return acc;
  }, {});

  const dates = Object.keys(byDate).sort();

  if (dates.length === 0) {
    return (
      <p className="text-gray-500 mt-4 p-4">No project items yet. Add one above.</p>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      {dates.map((date) => {
        const isHighlighted = selectedDate === date;

        return (
          <section key={date} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <h2
              className={
                isHighlighted
                  ? "px-4 py-2 bg-blue-100 text-blue-900 font-semibold border-b border-gray-200"
                  : "px-4 py-2 bg-gray-100 text-gray-700 font-semibold border-b border-gray-200"
              }
            >
              {date}
            </h2>
            <ul className="divide-y divide-gray-100">
              {byDate[date].map((item) => (
                <li
                  key={item.id}
                  className={
                    isHighlighted
                      ? "px-4 py-3 flex items-center justify-between gap-4 bg-blue-50 transition-colors duration-200"
                      : "px-4 py-3 flex items-center justify-between gap-4 transition-colors duration-200"
                  }
                >
                  <span
                    className={
                      isHighlighted
                        ? "font-medium text-blue-900"
                        : "font-medium text-gray-900"
                    }
                  >
                    {item.title}
                  </span>
                  <StatusBadge itemId={item.id} currentStatus={item.status} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
