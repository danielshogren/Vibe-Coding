import type { ProjectItem, FileAttachment } from "./types";

/**
 * In-memory store for project items.
 * Data persists only for the lifetime of the Node process (lost on server restart).
 * No persistence layer yet — this is intentional for the MVP.
 */
declare global {
  var __projectItems: ProjectItem[] | undefined;
}
const items: ProjectItem[] = globalThis.__projectItems ?? (globalThis.__projectItems = []);

/** Generate a simple unique id for new items. */
function generateId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Add a new project item to the store.
 * Returns the created item (with id set).
 */
export function addProjectItem(input: Omit<ProjectItem, "id" | "archived" | "files" | "mediaUrl" | "approved" | "completed">): ProjectItem {
  const item: ProjectItem = {
    ...input,
    id: generateId(),
    archived: false,
    files: [],
    mediaUrl: "",
    approved: false,
    completed: false,
  };
  items.push(item);
  return item;
}

/**
 * Update the priority of an existing project item.
 * Returns the updated item, or null if not found.
 */
export function updateProjectItemPriority(
  id: string,
  priority: ProjectItem["priority"]
): ProjectItem | null {
  const item = items.find((i) => i.id === id);
  if (!item) return null;
  item.priority = priority;
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
  field: "title" | "notes" | "mediaUrl",
  value: string
): ProjectItem | null {
  const item = items.find((i) => i.id === id);
  if (!item) return null;
  item[field] = value;
  return item;
}

/** Add a new file attachment to a project item. */
export function addFileAttachment(itemId: string, url: string): FileAttachment | null {
  const item = items.find((i) => i.id === itemId);
  if (!item) return null;
  const file: FileAttachment = {
    id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    url,
    notes: "",
  };
  item.files.push(file);
  return file;
}

/** Update a single field of a file attachment. */
export function updateFileAttachment(
  itemId: string,
  fileId: string,
  field: "url" | "notes",
  value: string
): FileAttachment | null {
  const item = items.find((i) => i.id === itemId);
  if (!item) return null;
  const file = item.files.find((f) => f.id === fileId);
  if (!file) return null;
  file[field] = value;
  return file;
}

/** Remove a file attachment from a project item. */
export function removeFileAttachment(itemId: string, fileId: string): boolean {
  const item = items.find((i) => i.id === itemId);
  if (!item) return false;
  const index = item.files.findIndex((f) => f.id === fileId);
  if (index === -1) return false;
  item.files.splice(index, 1);
  return true;
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

/** Return only non-archived, non-completed items, sorted by date then title. */
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

/** Bulk delete items by removing them from the store. */
export function deleteProjectItems(ids: string[]): void {
  const idSet = new Set(ids);
  for (let i = items.length - 1; i >= 0; i--) {
    if (idSet.has(items[i].id)) {
      items.splice(i, 1);
    }
  }
}

/** Toggle the approved state of a project item. */
export function toggleProjectItemApproved(id: string): void {
  const item = items.find((i) => i.id === id);
  if (item) {
    item.approved = !item.approved;
  }
}

/** Restore a single archived item by setting archived = false. */
export function unarchiveProjectItem(id: string): void {
  const item = items.find((i) => i.id === id);
  if (item) {
    item.archived = false;
  }
}

/** Toggle the completed state of a project item. */
export function toggleProjectItemCompleted(id: string): void {
  const item = items.find((i) => i.id === id);
  if (item) {
    item.completed = !item.completed;
  }
}

/** Restore a completed item by setting completed = false. */
export function uncompleteProjectItem(id: string): void {
  const item = items.find((i) => i.id === id);
  if (item) {
    item.completed = false;
  }
}

/** Return all completed items (including archived), sorted by date then title. */
export function getCompletedProjectItems(): ProjectItem[] {
  return items
    .filter((i) => i.completed)
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.title.localeCompare(b.title, undefined, { numeric: true });
    });
}
