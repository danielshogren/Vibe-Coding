import type { ProjectItem } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { DeleteButton } from "./DeleteButton";
import { EditableField } from "./EditableField";

/**
 * Renders a flat list of project item cards sorted by date.
 * Each card shows the title in the header bar with status/delete,
 * and the due date + notes in the body.
 * When selectedDate matches an item's date, that card is highlighted in pale blue.
 */
export function ProjectItemList({
  items,
  selectedDate,
}: {
  items: ProjectItem[];
  selectedDate?: string | null;
}) {
  if (items.length === 0) {
    return (
      <p className="text-gray-500 mt-4 p-4">No project items yet. Add one above.</p>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item) => {
        const isHighlighted = selectedDate === item.date;

        return (
          <section key={item.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div
              className={
                isHighlighted
                  ? "px-4 py-2 bg-blue-100 border-b border-gray-200 flex items-center justify-between gap-4 rounded-t-lg"
                  : "px-4 py-2 bg-gray-100 border-b border-gray-200 flex items-center justify-between gap-4 rounded-t-lg"
              }
            >
              <EditableField
                itemId={item.id}
                field="title"
                value={item.title}
                allowEmpty={false}
                isHighlighted={isHighlighted}
                className={isHighlighted ? "font-semibold text-blue-900" : "font-semibold text-gray-700"}
              />
              <div className="flex items-center gap-1 shrink-0">
                <StatusBadge itemId={item.id} currentStatus={item.status} />
                <DeleteButton itemId={item.id} />
              </div>
            </div>
            <div
              className={
                isHighlighted
                  ? "px-4 py-3 flex items-center gap-4 bg-blue-50 transition-colors duration-200"
                  : "px-4 py-3 flex items-center gap-4 transition-colors duration-200"
              }
            >
              <span className={isHighlighted ? "text-sm text-blue-700 shrink-0" : "text-sm text-gray-500 shrink-0"}>
                Due: {item.date}
              </span>
              <EditableField
                itemId={item.id}
                field="notes"
                value={item.notes}
                allowEmpty={true}
                isHighlighted={isHighlighted}
                placeholder="Add notes..."
                className={isHighlighted ? "text-sm text-blue-400" : "text-sm text-gray-400"}
                emptyClassName={isHighlighted ? "text-sm text-blue-300 italic" : "text-sm text-gray-300 italic"}
              />
            </div>
          </section>
        );
      })}
    </div>
  );
}
