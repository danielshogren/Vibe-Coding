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
export function addProjectItem(input: Omit<ProjectItem, "id" | "archived">): ProjectItem {
  const item: ProjectItem = {
    ...input,
    id: generateId(),
    archived: false,
  };
  items.push(item);
  return item;
}

/**
 * Return all project items, sorted by date ascending, then by title.
 * Used by the list view to group and display items.
 */
/**
 * Update the status of an existing project item.
 * Returns the updated item, or null if not found.
 */
export function updateProjectItemStatus(
  id: string,
  status: ProjectItem["status"]
): ProjectItem | null {
  const item = items.find((i) => i.id === id);
  if (!item) return null;
  item.status = status;
  return item;
}

/**
 * Update a single field (title or notes) of an existing project item.
 * Returns the updated item, or null if not found.
 */
export function updateProjectItemField(
  id: string,
  field: "title" | "notes",
  value: string
): ProjectItem | null {
  const item = items.find((i) => i.id === id);
  if (!item) return null;
  item[field] = value;
  return item;
}

/**
 * Delete a project item by ID.
 * Returns true if the item was found and removed, false otherwise.
 */
export function deleteProjectItem(id: string): boolean {
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return false;
  items.splice(index, 1);
  return true;
}

export function getAllProjectItems(): ProjectItem[] {
  return [...items].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.title.localeCompare(b.title, undefined, { numeric: true });
  });
}

/** Return only non-archived items, sorted by date then title. */
export function getActiveProjectItems(): ProjectItem[] {
  return items
    .filter((i) => !i.archived)
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.title.localeCompare(b.title, undefined, { numeric: true });
    });
}

/** Return only archived items, sorted by date then title. */
export function getArchivedProjectItems(): ProjectItem[] {
  return items
    .filter((i) => i.archived)
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.title.localeCompare(b.title, undefined, { numeric: true });
    });
}

/** Bulk archive items by setting archived = true. */
export function archiveProjectItems(ids: string[]): void {
  const idSet = new Set(ids);
  for (const item of items) {
    if (idSet.has(item.id)) {
      item.archived = true;
    }
  }
}

/** Restore a single archived item by setting archived = false. */
export function unarchiveProjectItem(id: string): void {
  const item = items.find((i) => i.id === id);
  if (item) {
    item.archived = false;
  }
}
