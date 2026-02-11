/**
 * Status enum for a project item.
 * Used in the UI as select options and for filtering/display.
 */
export type ProjectItemStatus = "backlog" | "in_progress" | "stuck" | "done";

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
  date: string;
  archived: boolean;
  fileUrl: string;
  mediaUrl: string;
}
