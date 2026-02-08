import { createProjectItem } from "@/app/actions";

/**
 * Form to create a new project item.
 * Uses a server action for submit; no client-side JS required for basic submit.
 * Fields: title (text), status (select), date (date picker).
 */
export function ProjectItemForm() {
  return (
    <form
      action={createProjectItem}
      className="flex flex-wrap items-end gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="Project or task name"
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="status" className="text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="backlog">Backlog</option>
          <option value="in_progress">In progress</option>
          <option value="stuck">Stuck</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium text-gray-700">
          Notes
        </label>
        <input
          id="notes"
          name="notes"
          type="text"
          placeholder="Optional notes"
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="date" className="text-sm font-medium text-gray-700">
          Due Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          defaultValue={new Date().toISOString().slice(0, 10)}
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add item
      </button>
    </form>
  );
}
