"use server";

import { revalidatePath } from "next/cache";
import { addProjectItem, updateProjectItemStatus as storeUpdateStatus } from "@/lib/store";
import type { ProjectItemStatus } from "@/lib/types";

/**
 * Server action: creates a new project item from form data and revalidates the home page.
 * Called when the user submits the "Add project item" form.
 */
export async function createProjectItem(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const status = (formData.get("status") as ProjectItemStatus) ?? "backlog";
  const date = (formData.get("date") as string) ?? "";

  if (!title) return; // minimal validation: require title

  addProjectItem({
    title,
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
