import type { ProjectItem } from "./types";

/**
 * In-memory store for project items.
 * Data persists only for the lifetime of the Node process (lost on server restart).
 * No persistence layer yet — this is intentional for the MVP.
 */
const items: ProjectItem[] = [];

/** Generate a simple unique id for new items. */
function generateId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Add a new project item to the store.
 * Returns the created item (with id set).
 */
export function addProjectItem(input: Omit<ProjectItem, "id">): ProjectItem {
  const item: ProjectItem = {
    ...input,
    id: generateId(),
  };
  items.push(item);
  return item;
}

/**
 * Return all project items, sorted by date ascending, then by title.
 * Used by the list view to group and display items.
 */
export function getAllProjectItems(): ProjectItem[] {
  return [...items].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.title.localeCompare(b.title);
  });
}
