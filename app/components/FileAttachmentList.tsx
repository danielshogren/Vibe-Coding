"use client";

import { useState, useEffect, useTransition } from "react";
import type { FileAttachment } from "@/lib/types";
import { EditableField } from "./EditableField";
import {
  addFileToProjectItem,
  updateFileAttachment,
  removeFileAttachment,
} from "@/app/actions";

/** Compact trigger button that sits in the card body row. */
export function AddFileButton({
  itemId,
  fileCount,
}: {
  itemId: string;
  fileCount: number;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isModalOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsModalOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isModalOpen]);

  function handleSave() {
    const trimmed = urlValue.trim();
    if (!trimmed) return;
    startTransition(async () => {
      await addFileToProjectItem(itemId, trimmed);
      setUrlValue("");
      setIsModalOpen(false);
    });
  }

  return (
    <>
      <div
        className="group flex items-center gap-1.5 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => {
            setUrlValue("");
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 text-ink-faint hover:text-ink-muted transition-colors duration-200"
          aria-label="Add file"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
          <span className="text-xs font-medium">FILES</span>
          {fileCount > 0 && (
            <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-semibold leading-none bg-primary/15 text-primary rounded-sm">
              {fileCount}
            </span>
          )}
        </button>
      </div>

      {isModalOpen && (
        <FileUrlModal
          title="Add File Link"
          urlValue={urlValue}
          setUrlValue={setUrlValue}
          isPending={isPending}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

/** Renders the list of file attachments between body and footer rows. */
export function FileAttachmentList({
  itemId,
  files,
  isHighlighted,
  isCompleted,
  bodyBgClass,
}: {
  itemId: string;
  files: FileAttachment[];
  isHighlighted: boolean;
  isCompleted: boolean;
  bodyBgClass: string;
}) {
  if (files.length === 0) return null;

  return (
    <div className={`border-t border-edge ${bodyBgClass} transition-colors duration-200`}>
      {files.map((file) => (
        <FileAttachmentRow
          key={file.id}
          itemId={itemId}
          file={file}
          isHighlighted={isHighlighted}
          isCompleted={isCompleted}
        />
      ))}
    </div>
  );
}

function FileAttachmentRow({
  itemId,
  file,
  isHighlighted,
  isCompleted,
}: {
  itemId: string;
  file: FileAttachment;
  isHighlighted: boolean;
  isCompleted: boolean;
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUrlValue, setEditUrlValue] = useState(file.url);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setEditUrlValue(file.url);
  }, [file.url]);

  function handleEditSave() {
    const trimmed = editUrlValue.trim();
    if (!trimmed) return;
    startTransition(async () => {
      await updateFileAttachment(itemId, file.id, "url", trimmed);
      setIsEditModalOpen(false);
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await removeFileAttachment(itemId, file.id);
    });
  }

  function handleNotesSave(value: string) {
    startTransition(() => {
      updateFileAttachment(itemId, file.id, "notes", value);
    });
  }

  // Truncate URL for display
  let displayUrl = file.url;
  try {
    const u = new URL(file.url);
    displayUrl = u.hostname + (u.pathname.length > 20 ? u.pathname.slice(0, 20) + "..." : u.pathname);
  } catch {
    if (displayUrl.length > 40) displayUrl = displayUrl.slice(0, 40) + "...";
  }

  return (
    <div
      className="group/file px-4 py-2 border-b border-edge/50 last:border-b-0"
      onClick={(e) => e.stopPropagation()}
    >
      {/* URL row */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Doc icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-3.5 h-3.5 text-ink-faint shrink-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m0 0a2.625 2.625 0 1 1 5.25 0m-5.25 0h5.25"
          />
        </svg>

        {/* Truncated URL text */}
        <span className="text-xs text-ink-muted truncate min-w-0 flex-1">
          {displayUrl}
        </span>

        {/* Action buttons — visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover/file:opacity-100 transition-opacity duration-150 shrink-0">
          {/* Edit URL */}
          <button
            type="button"
            onClick={() => {
              setEditUrlValue(file.url);
              setIsEditModalOpen(true);
            }}
            className="p-0.5 rounded-sm text-ink-faint hover:text-primary transition-colors duration-200"
            aria-label="Edit file URL"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-3 h-3"
            >
              <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L3.22 10.306a1 1 0 0 0-.26.445l-.813 3.04a.5.5 0 0 0 .608.608l3.04-.813a1 1 0 0 0 .445-.26l7.793-7.793a1.75 1.75 0 0 0 0-2.475l-.544-.545ZM11.72 3.22a.25.25 0 0 1 .354 0l.544.545a.25.25 0 0 1 0 .354L5.126 11.61l-1.907.51.51-1.907L11.72 3.22Z" />
            </svg>
          </button>

          {/* Open in new tab */}
          <button
            type="button"
            onClick={() => window.open(file.url, "_blank", "noopener,noreferrer")}
            className="p-0.5 rounded-sm text-ink-faint hover:text-primary transition-colors duration-200"
            aria-label="Open file link"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3 h-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-4.5-6h6m0 0v6m0-6L10.5 13.5"
              />
            </svg>
          </button>

          {/* Remove */}
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="p-0.5 rounded-sm text-ink-faint hover:text-danger transition-colors duration-200 disabled:opacity-50"
            aria-label="Remove file"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3 h-3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Notes row */}
      <div className="ml-[22px] mt-0.5">
        <EditableField
          itemId={itemId}
          field="notes"
          value={file.notes}
          allowEmpty={true}
          isHighlighted={isHighlighted}
          placeholder="Add notes..."
          className={isHighlighted ? "text-xs text-highlight-muted" : "text-xs text-ink-faint"}
          emptyClassName={isHighlighted ? "text-xs text-highlight-muted italic" : "text-xs text-ink-faint italic"}
          onSave={handleNotesSave}
        />
      </div>

      {isEditModalOpen && (
        <FileUrlModal
          title="Edit File Link"
          urlValue={editUrlValue}
          setUrlValue={setEditUrlValue}
          isPending={isPending}
          onSave={handleEditSave}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}

/** Shared modal for adding/editing file URLs. */
function FileUrlModal({
  title,
  urlValue,
  setUrlValue,
  isPending,
  onSave,
  onClose,
}: {
  title: string;
  urlValue: string;
  setUrlValue: (v: string) => void;
  isPending: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="bg-surface-card rounded-sm shadow-2xl p-8 max-w-sm w-full mx-4 border border-edge"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-sm bg-primary-light flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m0 0a2.625 2.625 0 1 1 5.25 0m-5.25 0h5.25"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-ink mb-4">{title}</h3>
          <input
            type="url"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSave();
            }}
            placeholder="https://example.com/file"
            autoFocus
            className="w-full px-3 py-2 text-sm border border-edge-strong rounded-sm bg-surface-input text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary mb-6"
          />
          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-ink-secondary bg-surface-card border border-edge rounded-sm hover:bg-surface-hover transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isPending || !urlValue.trim()}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-sm hover:bg-primary-hover disabled:opacity-50 transition-colors duration-200"
            >
              {isPending ? "Saving..." : "OK"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
