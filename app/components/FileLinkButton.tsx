"use client";

import { useState, useEffect, useTransition } from "react";
import { updateProjectItemField } from "@/app/actions";

export function FileLinkButton({
  itemId,
  fileUrl,
}: {
  itemId: string;
  fileUrl: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlValue, setUrlValue] = useState(fileUrl);
  const [isPending, startTransition] = useTransition();

  // Sync urlValue when fileUrl prop changes
  useEffect(() => {
    setUrlValue(fileUrl);
  }, [fileUrl]);

  // Close on Escape
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
      await updateProjectItemField(itemId, "fileUrl", trimmed);
      setIsModalOpen(false);
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await updateProjectItemField(itemId, "fileUrl", "");
      setIsModalOpen(false);
    });
  }

  const hasLink = fileUrl !== "";

  return (
    <>
      <div
        className="group flex items-center gap-1.5 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {hasLink ? (
          <>
            <button
              type="button"
              onClick={() => window.open(fileUrl, "_blank", "noopener,noreferrer")}
              className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 transition-colors duration-200"
              aria-label="Open file link"
            >
              {/* Heroicons outline: document-duplicate (stacked pages) */}
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
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m0 0a2.625 2.625 0 1 1 5.25 0m-5.25 0h5.25"
                />
              </svg>
              <span className="text-xs font-medium">FILES:</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setUrlValue(fileUrl);
                setIsModalOpen(true);
              }}
              className="p-0.5 rounded text-gray-300 opacity-0 group-hover:opacity-100 hover:text-blue-500 transition-all duration-200"
              aria-label="Edit file link"
            >
              {/* Heroicons outline: pencil-square */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              setUrlValue("");
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-gray-300 hover:text-gray-400 transition-colors duration-200"
            aria-label="Add file link"
          >
            {/* Heroicons outline: document-plus */}
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
            <span className="text-xs font-medium">FILES:</span>
          </button>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(false);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-blue-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364L4.343 8.53"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {hasLink ? "Edit File Link" : "Add File Link"}
              </h3>
              <input
                type="url"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                }}
                placeholder="https://example.com/file"
                autoFocus
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-6"
              />
              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                {hasLink && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={isPending}
                    className="flex-1 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors duration-200"
                  >
                    {isPending ? "Removing..." : "Remove"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isPending || !urlValue.trim()}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                >
                  {isPending ? "Saving..." : "OK"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
