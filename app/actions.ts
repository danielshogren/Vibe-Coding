"use server";

import { revalidatePath } from "next/cache";
import { addProjectItem, updateProjectItemStatus as storeUpdateStatus, updateProjectItemField as storeUpdateField, deleteProjectItem as storeDeleteItem, deleteProjectItems as storeDeleteItems, archiveProjectItems as storeArchiveItems, unarchiveProjectItem as storeUnarchiveItem } from "@/lib/store";
import type { ProjectItemStatus } from "@/lib/types";

/**
 * Server action: creates a new project item from form data and revalidates the home page.
 * Called when the user submits the "Add project item" form.
 */
export async function createProjectItem(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const notes = (formData.get("notes") as string)?.trim() ?? "";
  const status = (formData.get("status") as ProjectItemStatus) ?? "backlog";
  const date = (formData.get("date") as string) ?? "";

  if (!title) return; // minimal validation: require title

  addProjectItem({
    title,
    notes,
    status,
    date: date || new Date().toISOString().slice(0, 10),
  });

  revalidatePath("/");
}

/**
 * Server action: updates the status of an existing project item.
 */
export async function updateProjectItemStatus(id: string, status: ProjectItemStatus) {
  storeUpdateStatus(id, status);
  revalidatePath("/");
}

/**
 * Server action: updates a single field (title or notes) of a project item.
 */
export async function updateProjectItemField(
  id: string,
  field: "title" | "notes" | "fileUrl" | "mediaUrl",
  value: string
) {
  storeUpdateField(id, field, value);
  revalidatePath("/");
}

/**
 * Server action: deletes an existing project item by ID.
 */
export async function deleteProjectItem(id: string) {
  storeDeleteItem(id);
  revalidatePath("/");
}

/**
 * Server action: permanently deletes multiple project items by their IDs.
 */
export async function deleteProjectItems(ids: string[]) {
  storeDeleteItems(ids);
  revalidatePath("/");
}

/**
 * Server action: archives multiple project items by their IDs.
 */
export async function archiveProjectItems(ids: string[]) {
  storeArchiveItems(ids);
  revalidatePath("/");
}

/**
 * Server action: restores a single archived project item.
 */
export async function unarchiveProjectItem(id: string) {
  storeUnarchiveItem(id);
  revalidatePath("/");
}
