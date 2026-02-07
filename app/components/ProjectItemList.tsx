import type { ProjectItem } from "@/lib/types";

/**
 * Groups project items by date and renders a simple list.
 * Each group shows the date (YYYY-MM-DD) as a heading, then each item's title + status.
 * No calendar view — date-based list only, as per MVP scope.
 */
export function ProjectItemList({ items }: { items: ProjectItem[] }) {
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
      {dates.map((date) => (
        <section key={date} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <h2 className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
            {date}
          </h2>
          <ul className="divide-y divide-gray-100">
            {byDate[date].map((item) => (
              <li
                key={item.id}
                className="px-4 py-3 flex items-center justify-between gap-4"
              >
                <span className="font-medium text-gray-900">{item.title}</span>
                <span
                  className="text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-700 capitalize"
                  title={`Status: ${item.status}`}
                >
                  {item.status.replace("_", " ")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
