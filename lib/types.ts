/**
 * Status enum for a project item.
 * Used in the UI as select options and for filtering/display.
 */
export type ProjectItemStatus = "backlog" | "in_progress" | "stuck" | "done";

/**
 * Priority level for a project item.
 */
export type ProjectItemPriority = "low" | "medium" | "high" | "urgent";

/**
 * A single file attachment on a project item.
 */
export interface FileAttachment {
  id: string;
  url: string;
  notes: string;
}

/**
 * Single project item in our data model.
 * id: unique identifier (generated when created)
 * title: user-facing name
 * status: current workflow state
 * date: YYYY-MM-DD due date string for grouping and display
 */
export interface ProjectItem {
  id: string;
  title: string;
  notes: string;
  status: ProjectItemStatus;
  priority: ProjectItemPriority;
  date: string;
  archived: boolean;
  files: FileAttachment[];
  mediaUrl: string;
  approved: boolean;
  completed: boolean;
}
