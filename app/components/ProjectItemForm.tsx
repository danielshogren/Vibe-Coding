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
      className="flex flex-wrap items-end gap-4 p-4 bg-surface-card rounded-sm border border-edge shadow-sm"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium text-ink-secondary">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="Project or task name"
          className="px-3 py-2 border border-edge-strong rounded-sm bg-surface-input text-ink focus:ring-2 focus:ring-primary focus:border-primary min-w-[200px]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="status" className="text-sm font-medium text-ink-secondary">
          Status
        </label>
        <select
          id="status"
          name="status"
          className="px-3 py-2 border border-edge-strong rounded-sm bg-surface-input text-ink focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="backlog">Backlog</option>
          <option value="in_progress">In progress</option>
          <option value="stuck">Stuck</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="priority" className="text-sm font-medium text-ink-secondary">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          defaultValue="medium"
          className="px-3 py-2 border border-edge-strong rounded-sm bg-surface-input text-ink focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium text-ink-secondary">
          Notes
        </label>
        <input
          id="notes"
          name="notes"
          type="text"
          placeholder="Optional notes"
          className="px-3 py-2 border border-edge-strong rounded-sm bg-surface-input text-ink focus:ring-2 focus:ring-primary focus:border-primary min-w-[200px]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="date" className="text-sm font-medium text-ink-secondary">
          Due Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          className="px-3 py-2 border border-edge-strong rounded-sm bg-surface-input text-ink focus:ring-2 focus:ring-primary focus:border-primary"
          defaultValue={new Date().toISOString().slice(0, 10)}
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-primary text-white font-medium rounded-sm hover:bg-primary-hover focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Add item
      </button>
    </form>
  );
}
